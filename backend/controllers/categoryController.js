const Category = require("../models/categoryModel");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// Create Category
exports.createCategory = catchAsyncErrors(async (req, res) => {
  const { name, description, productCount, image } = req.body;

  // Create the category with the provided image
  const newCategory = await Category.create({
    name,
    description,
    productCount,
    image, // Set the image field with the provided image
  });

  res.status(201).json({ success: true, category: newCategory });
});

// Get All Categories
exports.getAllCategories = catchAsyncErrors(async (req, res) => {
  const categories = await Category.find();
  res.status(200).json({ success: true, categories });
});

// Get Category Details
exports.getCategoryDetails = catchAsyncErrors(async (req, res, next) => {
  const categoryId = req.params.id;

  try {
    // Find the category by ID
    const category = await Category.findById(categoryId);

    if (!category) {
      return next(new Error("Category not found"));
    }

    res.status(200).json({ success: true, category });
  } catch (error) {
    next(error);
  }
});

// Update Category
exports.updateCategory = catchAsyncErrors(async (req, res) => {
  const categoryId = req.params.id;
  const { name, description, image } = req.body;
  const updatedCategory = await Category.findByIdAndUpdate(
    categoryId,
    { name, description, image }, // Update the image field
    { new: true }
  );
  res.status(200).json({ success: true, category: updatedCategory });
});

// Delete Category
exports.deleteCategory = catchAsyncErrors(async (req, res) => {
  const categoryId = req.params.id;
  const category = await Category.findById(categoryId);

  if (!category) {
    return res.status(404).json({ success: false, message: "Category not found" });
  }

  if (category.productCount > 0) {
    return res.status(400).json({ success: false, message: "Cannot delete category with products" });
  }

  const deletedCategory = await Category.findOneAndRemove({ _id: categoryId });

  if (!deletedCategory) {
    return res.status(404).json({ success: false, message: "Category not found" });
  }

  res.status(200).json({ success: true, message: "Category deleted" });
});
