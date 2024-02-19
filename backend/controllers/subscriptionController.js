const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Order = require("../models/orderModel");

const Subscription = require("../models/subscriptionModel");

console.log("stripe_key: ", process.env.STRIPE_SECRET_KEY);

exports.createSubSubscription = catchAsyncErrors(async (req, res) => {
  const { priceId, customerId, coupon } = req.body;
  // console.log(req.body);
  try {
    // Create a new subscription in Stripe
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      coupon: coupon ? coupon : null,
      payment_behavior: "default_incomplete",
      payment_settings: {
        payment_method_types: ["card"],
        save_default_payment_method: "on_subscription",
      },
      expand: ["latest_invoice.payment_intent"],
    });

    // Check if the subscription is incomplete and requires confirmation
    if (subscription.status === "incomplete") {
      // Extract the Payment Intent from the latest invoice
      const latestInvoice = subscription.latest_invoice.id;
      // if (latestInvoice.payment_intent) {
      //   // Confirm the Payment Intent to complete the subscription setup
      //   const paymentIntent = latestInvoice.payment_intent;
      //   await stripe.paymentIntents.confirm(paymentIntent.id);
      // }

      const invoice = await stripe.invoices.retrieve(latestInvoice, {
        expand: ["payment_intent"],
      });

      // Save the subscription to MongoDB
      const newSubscription = new Subscription({
        customer: customerId, // Assuming customerId is the MongoDB ObjectId
        priceId: priceId,
      });
      await newSubscription.save();

      // Respond with success and indicate that the subscription setup is pending confirmation
      res.status(200).json({
        success: true,
        subscriptionStatus: "pending_confirmation",
        subscription: subscription,
        message:
          "Subscription setup is pending confirmation. Please confirm payment.",
        invoice: invoice,
      });
    } else {
      // Respond with success as the subscription setup is complete
      res.status(200).json({
        success: true,
        subscriptionStatus: "complete",
        subscription: subscription,
        message: "Subscription setup is complete. Payment confirmed.",
      });
    }
  } catch (error) {
    // Handle any errors from the Stripe API
    console.error("Stripe subscription creation error:", error);

    // Send a more informative error message in the response
    res.status(500).json({
      success: false,
      message: "Error creating subscription",
      error: error.message,
    });
  }
});

exports.updateSubSubscription = catchAsyncErrors(async (req, res) => {
  const { subscriptionId, priceId } = req.body;

  try {
    // Retrieve the existing subscription from Stripe
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    // Update the subscription in Stripe
    const update = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false,
      proration_behavior: "always_invoice",
      items: [{ id: subscription.items.data[0].id, price: priceId }],
    });

    // Update the subscription in MongoDB
    await Subscription.findByIdAndUpdate(subscriptionId, { priceId: priceId });

    // Respond with the updated subscription information
    res.status(200).json(update);
  } catch (error) {
    // Handle any errors from the Stripe API
    console.error("Stripe subscription update error:", error);

    // Send a more informative error message in the response
    res.status(500).json({
      success: false,
      message: "Error updating subscription",
      error: error.message,
    });
  }
});

exports.cancelSubSubscription = catchAsyncErrors(async (req, res) => {
  const { subscriptionId, orderId } = req.body;
  await stripe.subscriptions.del(subscriptionId);
  await Order.findOneAndUpdate(
    { _id: orderId },
    { $set: { subscriptionStatus: "cancel" } }
  );
  res.status(200).json({ message: "Subscription canceled successfully" });
});

// Subscription operations
exports.getSubSubsList = catchAsyncErrors(async (req, res) => {
  const customerId = req.params.id;
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: "all",
    expand: ["data.default_payment_method"],
  });
  res.status(200).json(subscriptions);
});

// exports.session = catchAsyncErrors(async (req, res) => {
//   const { stripe_customerId, priceId } = req.body;
//   const session = await stripe.checkout.sessions.create({
//     mode: 'subscription',
//     payment_method_types: ['card'],
//     line_items: [
//       {
//         price: priceId,
//         quantity: 1,
//       },
//     ],
//     // discounts: [
//     //   {
//     //     coupon: 'your_coupon_code', // Replace with your actual coupon code
//     //   },
//     // ],
//     customer: stripe_customerId,
//     success_url: 'http://localhost:3000/PaymentSuccess',
//     cancel_url: 'http://localhost:3000/PaymentError',
//   });
//   res.status(200).json(session);
// });
