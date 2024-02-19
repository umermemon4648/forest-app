const Country = require("../models/countryModel");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// Create Country
exports.createCountry = catchAsyncErrors(async (req, res) => {
  const { name, description, productCount, image } = req.body;
  const newCountry = await Country.create({ name, description, productCount, image });
  res.status(201).json({ success: true, country: newCountry });
});

// Get All Countries
exports.getAllCountries = catchAsyncErrors(async (req, res) => {
  const countries = await Country.find();
  res.status(200).json({ success: true, countries });
});

// Get Country Details
exports.getCountryDetails = catchAsyncErrors(async (req, res, next) => {
  const countryId = req.params.id;
  const country = await Country.findById(countryId);
  if (!country) {
    return next(new Error("Country not found"));
  }
  res.status(200).json({ success: true, country });
});

// Update Country
exports.updateCountry = catchAsyncErrors(async (req, res) => {
  const countryId = req.params.id;
  const { name, description, image } = req.body;
  const updatedCountry = await Country.findByIdAndUpdate(
    countryId,
    { name, description, image }, // Update the fields as needed
    { new: true }
  );
  res.status(200).json({ success: true, country: updatedCountry });
});

// Delete Country
exports.deleteCountry = catchAsyncErrors(async (req, res) => {
  const countryId = req.params.id;
  const country = await Country.findById(countryId);

  if (!country) {
    return res.status(404).json({ success: false, message: "Country not found" });
  }

  // Check if there are any related products or any other conditions before allowing deletion
  if (country.productCount > 0) {
    return res.status(400).json({ success: false, message: "Cannot delete country with products" });
  }

  // Remove the country
  const deletedCountry = await Country.findByIdAndRemove({ _id: countryId });

  if (!deletedCountry) {
    return res.status(404).json({ success: false, message: "Country not found" });
  }

  res.status(200).json({ success: true, message: "Country deleted" });
});
