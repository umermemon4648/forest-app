const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Coupon = require("../models/couponModel");

exports.createCoupon = catchAsyncErrors(async (req, res) => {
  try {
    const { duration, id, percent_off } = req.body;

    // Check if the coupon with the given stripeCouponId already exists
    const existingCoupon = await Coupon.findOne({ stripeCouponId: id });

    if (existingCoupon) {
      // Coupon already exists
      return res.status(400).json({
        success: false,
        message: "Coupon with the same stripeCouponId already exists.",
      });
    }

    // // Create a new coupon in MongoDB
    // const newCoupon = new Coupon({
    //   duration: duration,
    //   stripeCouponId: id,
    //   percent_off: percent_off,
    // });
    // await newCoupon.save();
    const newCoupon = await Coupon.findOneAndUpdate(
      {},
      {
        duration: duration,
        stripeCouponId: id,
        percent_off: percent_off,
      },
      {
        new: true,
        upsert: true,
      }
    );

    // Create a new coupon in Stripe
    const stripeCoupon = await stripe.coupons.create({
      duration: duration,
      id: id,
      percent_off: percent_off,
    });

    // Respond with success and the created coupons
    res.status(200).json({
      success: true,
      coupon: newCoupon,
      stripeCoupon: stripeCoupon,
      message: "Coupons created successfully.",
    });
  } catch (error) {
    console.error("Error creating coupons:", error);

    // Send a more informative error message in the response
    res.status(500).json({
      success: false,
      message: "Error creating coupons",
      error: error.message,
    });
  }
});

// Get all coupons from MongoDB
exports.getAllCoupons = catchAsyncErrors(async (req, res) => {
  try {
    const coupons = await Coupon.find();

    // Respond with the list of coupons
    res.status(200).json({
      success: true,
      coupons: coupons,
      message: "Fetched all coupons successfully.",
    });
  } catch (error) {
    console.error("Error fetching coupons:", error);

    // Send a more informative error message in the response
    res.status(500).json({
      success: false,
      message: "Error fetching coupons",
      error: error.message,
    });
  }
});

exports.deleteCoupon = catchAsyncErrors(async (req, res) => {
  try {
    const { couponId } = req.params;

    // Find the coupon by ID in MongoDB and get the Stripe coupon ID
    const coupon = await Coupon.findById(couponId);
    const stripeCouponId = coupon.stripeCouponId;

    // Delete the coupon in Stripe
    await stripe.coupons.del(stripeCouponId);

    // Delete the coupon in MongoDB
    await Coupon.findByIdAndDelete(couponId);

    // Respond with success
    res.status(200).json({
      success: true,
      message: "Coupon deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting coupon:", error);

    // Send a more informative error message in the response
    res.status(500).json({
      success: false,
      message: "Error deleting coupon",
      error: error.message,
    });
  }
});
