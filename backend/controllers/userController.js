const User = require("../models/userModel");
const Role = require("../models/roleModel");
const SendJWTToken = require("../utils/jwtToken");
const SendEmail = require("../utils/sendEmail");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const crypto = require("crypto");

const generateToken = () => crypto.randomBytes(20).toString("hex");

const sendConfirmationEmail = async (user) => {
  const confirmationToken = generateToken();
  user.confirmationToken = confirmationToken;
  user.isConfirmed = false;

  await user.save({ validateBeforeSave: false });

  const confirmationUrl = `${process.env.HOST}/api/v1/confirm/${confirmationToken}`;

  const message = `Please confirm your email address by clicking this link: ${confirmationUrl}`;
  await SendEmail({
    email: user.email,
    subject: "Confirm Your Email",
    message,
  });
};

const sendResetPasswordEmail = async (user) => {
  // Generate a new reset token
  const resetToken = user.getResetPasswordToken(); // Use the user method to get the hashed token

  try {
    // Hash the reset token before storing it in the database
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpire = Date.now() + 3600000; // Set an expiration time (e.g., 1 hour)

    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${process.env.CLIENT}/password/reset/${resetToken}`;

    const message = `To reset your password, click this link: ${resetPasswordUrl}`;
    await SendEmail({
      email: user.email,
      subject: "Reset Your Password",
      message,
    });
  } catch (error) {
    // Handle any potential errors
    console.error("Error generating and sending reset password email:", error);
  }
};

exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, password, role } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return next(new ErrorHandler("Email address already in use", 400));
  }

  // Check if a role is provided in the request body
  let userRole;

  if (role) {
    // Use the provided role
    userRole = await Role.findById(role);

    if (!userRole) {
      return next(new ErrorHandler("Invalid role ID", 400));
    }
  } else {
    // If no role is provided, create the "user" role
    userRole = await Role.findOne({ name: "user" });

    if (!userRole) {
      userRole = await Role.create({
        name: "user",
        permissions: {
          // User profile permissions
          getMyProfile: true,
          updateProfile: true,
          updatePassword: true,
          getOrdersByEmail: true,

          // customer permissions
          createCustomer: true,
          updateCustomer: true,
          getCustomerByEmail: true,
        },
      });
    }
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    role: userRole._id, // Assign the role here
  });

  await sendConfirmationEmail(user);

  res.status(201).json({
    success: true,
    message: "User registered. Confirmation email sent.",
  });
});

exports.confirmEmail = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({ confirmationToken: token });

    if (!user) {
      return res.redirect(`${process.env.CLIENT}/confirm/failure`);
    }

    user.isConfirmed = true;
    user.confirmationToken = undefined;

    await user.save();

    return res.redirect(`${process.env.CLIENT}/confirm/success`);
  } catch (error) {
    console.error("Confirmation error:", error);
    return res.redirect(`${process.env.CLIENT}/confirm/failure`);
  }
});

exports.resendConfirmationEmail = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  if (user.isConfirmed) {
    return next(new ErrorHandler("Email is already confirmed", 400));
  }

  await sendConfirmationEmail(user);

  res.status(200).json({
    success: true,
    message: "Confirmation email sent.",
  });
});

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email & Password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  // if (!user.isConfirmed) {
  //   return next(
  //     new ErrorHandler("Please confirm your email address first", 401)
  //   );
  // }

  // Verify the provided password
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const token = user.getJWTToken();

  res.status(200).json({
    success: true,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: token,
    },
  });
});

exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  await sendResetPasswordEmail(user);

  res.status(200).json({
    success: true,
    message: `Email sent to ${user.email} for password reset.`,
  });
});
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // Get the reset token from the URL
  const resetToken = req.params.token;

  try {
    // Hash the reset token to match it with the stored token
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Find the user with the matching token and within the expiration time
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      // Token is invalid or expired
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token.",
      });
    }

    // Check if the new password is provided in the request body
    if (!req.body.newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide a new password.",
      });
    }

    // Set the new password from the request body
    user.password = req.body.newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    // Return a success response
    return res.status(200).json({
      success: true,
      message: "Password reset successful.",
    });
  } catch (error) {
    // Handle any potential errors (e.g., database errors)
    console.error("Password reset error:", error);

    // Provide a detailed error response
    return res.status(500).json({
      success: false,
      message: "An error occurred during password reset.",
      error: error.message, // Log the error message
    });
  }
});

exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("Passwords do not match", 400));
  }

  user.password = req.body.newPassword;
  await user.save();
  res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
});
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    avatar: req.body.avatar,
  };

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    message: "User Updated Successfully",
  });
});

exports.getAllUser = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with Id: ${req.params.id}`)
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});

exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    role: req.body.role,
  };

  await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 400)
    );
  }
  await user.remove();

  res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});
