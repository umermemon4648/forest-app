const Customer = require("../models/customerModel"); // Import the Customer model
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Create a new customer in MongoDB and Stripe
exports.createCustomer = catchAsyncErrors(async (req, res, next) => {
  try {
    const { email, shippingInfo } = req.body;
    console.log("Create Customer: ", req.body);

    // Check if the customer already exists in MongoDB
    let customer = await Customer.findOne({ email });

    if (customer) {
      return res
        .status(400)
        .json({ success: false, message: "Customer already exists" });
    }

    // Create a new customer in MongoDB
    customer = await Customer.create({ email, shippingInfo });
    console.log("Create Customer: ", customer);

    // Create a new customer in Stripe
    const stripeCustomer = await stripe.customers.create({
      email: email,
      name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
      // You can add more details from shippingInfo if needed
    });
    console.log("Customer: ", stripeCustomer);

    // Save the Stripe customer ID in MongoDB
    customer.stripeCustomerId = stripeCustomer.id;
    await customer.save();

    res.status(201).json({ success: true, customer, stripeCustomer });
  } catch (error) {
    next(error);
  }
});

// Get customer by email
exports.getCustomerByEmail = catchAsyncErrors(async (req, res, next) => {
  try {
    const { email } = req.params;

    // Find the customer by email
    const customer = await Customer.findOne({ email });

    if (!customer) {
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });
    }

    res.status(200).json({ success: true, customer });
  } catch (error) {
    next(error);
  }
});

// Update customer by email, including Stripe update
exports.updateCustomerByEmail = catchAsyncErrors(async (req, res, next) => {
  try {
    const { email } = req.params;
    const updates = req.body;

    // Find the customer in MongoDB
    let customer = await Customer.findOne({ email });

    if (!customer) {
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });
    }

    // Update the customer in MongoDB
    customer = await Customer.findOneAndUpdate({ email }, updates, {
      new: true,
    });

    // Get the Stripe customer ID from the MongoDB customer
    const stripeCustomerId = customer.stripeCustomerId;

    res.status(200).json({ success: true, customer });

    // Update the customer in Stripe separately
    const stripeUpdates = {
      name: `${customer.shippingInfo.firstName} ${customer.shippingInfo.lastName}`,
      email: customer.email,
      // Map other fields as needed
    };

    const stripeCustomer = await stripe.customers.update(
      stripeCustomerId,
      stripeUpdates
    );
  } catch (error) {
    next(error);
  }
});

// Delete customer by email, including Stripe delete
exports.deleteCustomerByEmail = catchAsyncErrors(async (req, res, next) => {
  try {
    const { email } = req.params;

    // Find the customer in MongoDB
    const customer = await Customer.findOne({ email });

    if (!customer) {
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });
    }

    // Delete the customer in MongoDB
    await Customer.findOneAndDelete({ email });

    // Get the Stripe customer ID from the MongoDB customer
    const stripeCustomerId = customer.stripeCustomerId;

    // Delete the customer in Stripe
    const deletion = await stripe.customers.del(stripeCustomerId);

    if (deletion.deleted) {
      res
        .status(200)
        .json({ success: true, message: "Customer deleted successfully" });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to delete customer in Stripe",
      });
    }
  } catch (error) {
    next(error);
  }
});
