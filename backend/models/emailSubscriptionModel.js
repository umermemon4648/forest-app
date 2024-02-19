const mongoose = require("mongoose");

const emailSubscriptionSchema = mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please Enter Email"],
    trim: true,
    unique: true,
  },
  // You can add more fields related to subscriptions if needed
});

module.exports = mongoose.model("EmailSubscription", emailSubscriptionSchema);
