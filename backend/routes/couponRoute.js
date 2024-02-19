const express = require("express");
const router = express.Router();

const {
  getAllCoupons,
  createCoupon,
  deleteCoupon,
} = require("../controllers/couponController");
const {
  isAuthenticatedUser,
  authorizePermissions,
} = require("../middleware/auth");
// Coupons
router.route("/getCouponList").get(
  // authorizePermissions("getCouponList"),
  getAllCoupons
);
router.route("/createCoupon").post(createCoupon);
router.route("/deleteCoupon/:couponId").delete(deleteCoupon);

module.exports = router;
