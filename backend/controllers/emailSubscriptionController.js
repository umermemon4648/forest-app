const EmailSubscription = require("../models/emailSubscriptionModel");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// Create Email Subscription
exports.createEmailSubscription = catchAsyncErrors(async (req, res) => {
  const { email } = req.body;
  const newSubscription = await EmailSubscription.create({ email });
  res.status(201).json({ success: true, subscription: newSubscription });
});

// Get All Email Subscriptions
exports.getAllEmailSubscriptions = catchAsyncErrors(async (req, res) => {
  const subscriptions = await EmailSubscription.find();
  res.status(200).json({ success: true, subscriptions });
});

// Delete Email Subscription
// Delete Email Subscription
exports.deleteEmailSubscription = catchAsyncErrors(async (req, res) => {
  const subscriptionId = req.params.id;
  const deletedSubscription = await EmailSubscription.findByIdAndRemove(
    subscriptionId
  );

  if (!deletedSubscription) {
    return res
      .status(404)
      .json({ success: false, message: "Email subscription not found" });
  }

  res
    .status(200)
    .json({
      success: true,
      message: "Email subscription deleted successfully",
    });
});
