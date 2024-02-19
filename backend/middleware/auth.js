const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Role = require("../models/roleModel"); // Import your Role model

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;
  const bearerHeader = req.headers["authorization"];

  // Check if the Authorization header contains a token
  if (bearerHeader && bearerHeader.startsWith("Bearer ")) {
    // Extract the token from the "Bearer " prefix
    const headerToken = bearerHeader.split(" ")[1];

    if (!headerToken) {
      return next(new ErrorHandler("Please provide a valid token", 401));
    }

    try {
      const decodedDataFromHeader = jwt.verify(
        headerToken,
        process.env.JWT_SECRET
      );
      req.user = await User.findById(decodedDataFromHeader.id);
      next();
    } catch (error) {
      return next(new ErrorHandler("Invalid token in header", 401));
    }
  } else if (!token) {
    return next(new ErrorHandler("Please Login to access this resource", 401));
  } else {
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decodedData.id);
    next();
  }
});


exports.authorizePermissions = (...requiredPermissions) => {
  return async (req, res, next) => {
    try {
      // Populate the user's role field
      await req.user.populate('role').execPopulate();
      
      const userRole = req.user.role; // Now, userRole contains the populated role object

      if (!userRole) {
        return next(
          new ErrorHandler(`Role not found for user`, 403)
        );
      }

      // Check if the role has at least one of the required permissions
      const hasPermission = requiredPermissions.some(
        (permission) => userRole.permissions[permission]
      );

      if (!hasPermission) {
        return next(
          new ErrorHandler(
            `Insufficient permissions to access this resource`,
            403
          )
        );
      }

      next();
    } catch (error) {
      return next(
        new ErrorHandler(
          `Error while checking permissions: ${error.message}`,
          500
        )
      );
    }
  };
};


exports.authorizeRoles = (...roles) => {
  return async (req, res, next) => {
    next();
    // const userId = req.user._id;

    // try {
    //   // Find the user and populate the role
    //   const user = await User.findById(userId).populate("role");

    //   if (!user) {
    //     return next(new ErrorHandler("User not found", 404));
    //   }

    //   const userRole = user.role;

    //   // Check if the user's role matches any of the allowed roles
    //   if (!roles.some((allowedRole) => userRole.name === allowedRole)) {
    //     return next(
    //       new ErrorHandler(
    //         `Role: ${userRole.name} is not allowed to access this resource`,
    //         403
    //       )
    //     );
    //   }

    //   next();
    // } catch (error) {
    //   return next(new ErrorHandler("Error fetching user role", 500));
    // }
  };
};
