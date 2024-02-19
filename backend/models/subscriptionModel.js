// import the mongoose library
const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  priceId: {
    type: String,
    required: true,
  },
  customer: {
    type: String,
    required: true,
  },
});


// Export the subscription customer schema
module.exports = mongoose.model('Subscription', SubscriptionSchema);
