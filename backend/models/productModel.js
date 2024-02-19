const mongoose = require("mongoose");
const simpleSchema = new mongoose.Schema({
  price: {
    type: Number,
    required: [true, "Please Enter product Price"],
    maxLength: [8, "Price cannot exceed 8 characters"],
  },
  salePrice: {
    type: Number,
    maxLength: [8, "Price cannot exceed 8 characters"],
  },
  stock: {
    type: Number,
    required: [true, "Please Enter product Stock"],
    maxLength: [4, "Stock cannot exceed 4 characters"],
  },
});
const moreInfoSchema = new mongoose.Schema({
  LOCAL: [
    {
      img: String,
      heading: String,
      text: String,
    },
  ],
  CO2: {
    img: String,
    value: String,
    unit: {
      type: String,
      enum: ["mg", "kg", "g"],
    },
    distance: String,
    period: String,
    averageAnnual: String,
  },
  BENEFITS: [
    {
      img: String,
      heading: String,
      ratio: {
        type: String,
        min: 0,
        max: 10,
      },
    },
  ],
});

const variantSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  options: [
    {
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      stock: {
        type: Number,
        required: true,
      },
    },
  ],
});

const subscriptionSchema = new mongoose.Schema({
  stripeProductId: {
    type: String,
  },
  monthlyPriceId: {
    type: String,
  },
  
  monthlyPrice: {
    type: Number,
    required: true,
  },
  yearlyPriceId: {
    type: String,
  },

  yearlyPrice: {
    type: Number,
    required: true,
  }, 
});
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter product Name"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please Enter product Description"],
  },
  noOfItems: {
    type: Number,
    required: [true, "Please Enter product NoOfItems"],
    maxLength: [8, "NoOfItems cannot exceed 8 characters"],
  },

  ratings: {
    type: Number,
    default: 0,
  },
  images: [
    {
      type: String, // Reference the media path directly
    },
  ],
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  ],
  countries: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
      required: true,
    },
  ], 
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  productType: {
    type: String,
    enum: ["simple", "variant", "subscription"],
    default: "simple",
  },
  simple:simpleSchema,
  variants: [variantSchema],
  subscriptions: subscriptionSchema,
  moreinfo: moreInfoSchema,


});
module.exports = mongoose.model("SubscriptionProduct", subscriptionSchema);
module.exports = mongoose.model("Product", productSchema);
