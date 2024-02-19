const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
  name: {
    type: String,
 
  },
  description: {
    type: String,
  },
  image: {
    type: String, // Reference the media path directly
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


module.exports = mongoose.model("Category", categorySchema);
