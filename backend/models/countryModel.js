const mongoose = require("mongoose");

const countrySchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Country Name"],
    trim: true,
    unique: true,
  },
  description: {
    type: String,
    required: [true, "Please Enter Country Description"],
  },
  image: {
    type: String, // Reference the image path directly
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  productCount: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Country", countrySchema);
