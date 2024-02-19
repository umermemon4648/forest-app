const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  createProductReview,
  getProductReviews,
  deleteReview,
  getAdminProducts,
} = require("../controllers/productController");
const { isAuthenticatedUser, authorizePermissions } = require("../middleware/auth");

const router = express.Router();

router.route("/products").get(getAllProducts);

router
  .route("/admin/products")
  .get(
    isAuthenticatedUser,
    authorizePermissions("getAdminProducts"),
    getAdminProducts
  );

router
  .route("/admin/product/new")
  .post(
    isAuthenticatedUser,
    authorizePermissions("createProduct"),
    createProduct
  );

router
  .route("/admin/product/:id")
  .put(
    isAuthenticatedUser,
    authorizePermissions("updateProduct"),
    updateProduct
  )
  .delete(
    isAuthenticatedUser,
    authorizePermissions("deleteProduct"),
    deleteProduct
  );

router.route("/product/:id").get(getProductDetails);

// // Add routes for product reviews
// router
//   .route("/product/:id/review")
//   .put(
//     isAuthenticatedUser,
//     authorizePermissions("createProductReview"),
//     createProductReview
//   );

// router
//   .route("/product/:id/reviews")
//   .get(getProductReviews);

// router
//   .route("/product/:id/reviews/:reviewId")
//   .delete(
//     isAuthenticatedUser,
//     authorizePermissions("deleteReview"),
//     deleteReview
//   );

module.exports = router;
