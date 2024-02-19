// models/Coupon.js
const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema({
  duration: {
    type: String,
    required: true,
  },
  //make it unique
  stripeCouponId: {
    type: String,
    unique: true,
    required: true,
  },
  percent_off: {
    type: Number,
    required: true,
  },
});
module.exports = mongoose.model('Coupon', CouponSchema);

