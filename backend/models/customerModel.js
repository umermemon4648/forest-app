const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // Ensures uniqueness of email
  },
  shippingInfo: {
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    pinCode: {
      type: Number,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
      required: true,
    },
    phoneNo: {
      type: Number,
    },
    company: {
      type: String,
    },
    apartment: {
      type: String, // Corrected the field name to match the schema
    },
  },
  stripeCustomerId: {
    type: String,
  },
});


module.exports = mongoose.model('Customer', customerSchema);
