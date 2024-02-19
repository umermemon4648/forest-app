const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const Country = require("../models/countryModel");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");
const ErrorHandler = require("../utils/errorhandler");
const mongoose = require("mongoose");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// Helper function to create a price
async function createPrice(productId, amount, interval) {
  const priceData = {
    product: productId,
    unit_amount: amount * 100,
    currency: "usd",
    recurring: { interval },
  };
  return await stripe.prices.create(priceData);
}

exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  const {
    name,
    description,
    noOfItems,
    ratings,
    images,
    categories = [],
    countries = [],
    numOfReviews,
    reviews,
    user,
    createdAt,
    productType,
    simple,
    variants,
    subscriptions,
    moreinfo,
  } = req.body;

  // Validate product type and associated properties
  if (productType === "simple" && variants && variants.length > 0) {
    return next(
      new ErrorHandler("Variants cannot be added to a simple product", 400)
    );
  }

  if (productType === "simple" && subscriptions) {
    return next(
      new ErrorHandler(
        "Subscription details cannot be added to a simple product",
        400
      )
    );
  }

  if (productType === "variant" && (!variants || variants.length === 0)) {
    return next(
      new ErrorHandler(
        "Variants must be provided for a product with type 'variant'",
        400
      )
    );
  }

  if (productType === "subscription" && !subscriptions) {
    return next(
      new ErrorHandler(
        "Subscription details are required for a product with type 'subscription'",
        400
      )
    );
  }

  // Create subscription product in Stripe
  let stripeProduct, monthlyPriceObj, yearlyPriceObj;

  if (productType === "subscription") {
    stripeProduct = await stripe.products.create({ name, description });
    [monthlyPriceObj, yearlyPriceObj] = await Promise.all([
      createPrice(stripeProduct.id, subscriptions.monthlyPrice, "month"),
      createPrice(stripeProduct.id, subscriptions.yearlyPrice, "year"),
    ]);
    console.log(stripeProduct);

    stripeProduct.monthly_price = monthlyPriceObj;
    stripeProduct.yearly_price = yearlyPriceObj;
  }

  // Set default category if not provided
  if (!categories.length) {
    const defaultCategory = await Category.findOne({ name: "uncategorized" });
    const categoryId =
      defaultCategory?._id ||
      (
        await Category.create({
          name: "uncategorized",
          description: "Default category for uncategorized products",
        })
      )._id;
    categories.push(categoryId);
  }

  // Set default country if not provided
  if (!countries.length) {
    const defaultCountry = await Country.findOne({ name: "Our Forest" });
    const countryId =
      defaultCountry?._id ||
      (
        await Country.create({
          name: "Our Forest",
          description: "Default country for Our Forest locations",
        })
      )._id;
    countries.push(countryId);
  }

  // Create new product in MongoDB
  const newProduct = await Product.create({
    name,
    description,
    noOfItems,
    ratings,
    images,
    categories,
    countries,
    numOfReviews,
    reviews,
    user,
    createdAt,
    productType,
    simple: productType === "simple" ? simple : null,
    variants: productType === "variant" ? variants : null,
    subscriptions:
      productType === "subscription"
        ? {
            stripeProductId: stripeProduct ? stripeProduct.id : null,
            monthlyPriceId: monthlyPriceObj ? monthlyPriceObj.id : null,
            monthlyPrice: subscriptions.monthlyPrice || null,
            yearlyPriceId: yearlyPriceObj ? yearlyPriceObj.id : null,
            yearlyPrice: subscriptions.yearlyPrice || null,
          }
        : null,
    moreinfo,
  });

  // Update the product count for each category in MongoDB
  await Category.updateMany(
    { _id: { $in: categories } },
    { $inc: { productCount: 1 } }
  );

  // Update the product count for each country in MongoDB
  await Country.updateMany(
    { _id: { $in: countries } },
    { $inc: { productCount: 1 } }
  );

  // Return success response with both Stripe and MongoDB data
  return res.status(201).json({
    success: true,
    product: newProduct,
    stripeProduct: stripeProduct || null,
  });
});

// Get All Products
exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
  const resultPerPage = 88;

  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);

  const products = await apiFeature.query;

  // Group products by category and count them
  const categoryCounts = await Product.aggregate([
    {
      $match: { categories: mongoose.Types.ObjectId(req.query.categories) },
    },
    {
      $unwind: "$categories",
    },
    {
      $group: {
        _id: "$categories",
        count: { $sum: 1 },
      },
    },
  ]);

  // Group products by country and count them
  const countryCounts = await Product.aggregate([
    {
      $match: { countries: mongoose.Types.ObjectId(req.query.categories) },
    },
    {
      $unwind: "$countries",
    },
    {
      $group: {
        _id: "$countries",
        count: { $sum: 1 },
      },
    },
  ]);

  const productsCount = await Product.countDocuments();

  res.status(200).json({
    success: true,
    products,
    productsCount,
    resultPerPage,
    filteredProductsCount: products.length,
    categoryCounts,
    countryCounts,
  });
});

// Get All Products (Admin)
exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    success: true,
    products,
  });
});

// Get Product Details
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

// Update Product -- Admin
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  const productId = req.params.id;
  let product = await Product.findById(productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  // Check if the product type is subscription
  if (product.productType === "subscription") {
    return next(new ErrorHandler("Cannot update a subscription product", 400));
  }

  const {
    name,
    description,
    noOfItems,
    ratings,
    images,
    categories,
    countries,
    numOfReviews,
    reviews,
    user,
    createdAt,
    productType,
    simple,
    variants,
    moreinfo,
  } = req.body;

  // Ensure that productType is "simple" before allowing variants
  if (productType === "simple" && variants && variants.length > 0) {
    return next(
      new ErrorHandler("Variants cannot be added to a simple product", 400)
    );
  }

  // Update product information
  product.name = name;
  product.noOfItems = noOfItems;
  product.description = description;
  product.ratings = ratings;
  product.images = images;
  product.categories = categories;
  product.countries = countries;
  product.numOfReviews = numOfReviews;
  product.reviews = reviews;
  product.user = user;
  product.createdAt = createdAt;
  product.productType = productType;
  product.simple = productType === "simple" ? simple : null;
  product.variants = productType === "variant" ? variants : null;
  product.moreinfo = moreinfo;

  // Save the updated product
  product = await product.save();

  // Update category product counts
  await updateCategoryProductCounts(product.categories);

  // Update country product counts
  await updateCountryProductCounts(product.countries);

  res.status(200).json({
    success: true,
    updatedProduct: product,
  });
});

// Helper function to update category product counts
async function updateCategoryProductCounts(categoryIds) {
  const categoryUpdatePromises = categoryIds.map(async (categoryId) => {
    await Category.findByIdAndUpdate(categoryId, {
      $inc: { productCount: 1 },
    });
  });

  await Promise.all(categoryUpdatePromises);
}

// Helper function to update country product counts
async function updateCountryProductCounts(countryIds) {
  const countryUpdatePromises = countryIds.map(async (countryId) => {
    await Country.findByIdAndUpdate(countryId, {
      $inc: { productCount: 1 },
    });
  });

  await Promise.all(countryUpdatePromises);
}

// Delete Product
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  // Update category product counts
  await Category.updateMany(
    { _id: { $in: product.categories } },
    { $inc: { productCount: -1 } }
  );

  // Update country product counts
  await Country.updateMany(
    { _id: { $in: product.countries } },
    { $inc: { productCount: -1 } }
  );

  // Delete from Stripe if it's a subscription product
  if (
    product.productType === "subscription" &&
    product.subscriptions.stripeProductId
  ) {
    await stripe.products.update(product.subscriptions.stripeProductId, {
      active: false,
    });
  }

  await product.remove();

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

// Create or Update Product Review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  const existingReview = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (existingReview) {
    existingReview.rating = rating;
    existingReview.comment = comment;
  } else {
    product.reviews.push(review);
  }

  let totalRating = 0;

  product.reviews.forEach((rev) => {
    totalRating += rev.rating;
  });

  product.ratings = totalRating / product.reviews.length;
  product.numOfReviews = product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

// Get All Reviews of a Product
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// Delete Review
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  product.reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let totalRating = 0;

  product.reviews.forEach((rev) => {
    totalRating += rev.rating;
  });

  product.ratings =
    product.reviews.length === 0 ? 0 : totalRating / product.reviews.length;

  product.numOfReviews = product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});
