// mediaModel.js

const mongoose = require("mongoose");

const mediaSchema = mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
    unique: true, // Make the path field unique

  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Media", mediaSchema);
