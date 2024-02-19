const express = require("express");
const router = express.Router();

const {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryDetails,
} = require("../controllers/categoryController");

const {
  isAuthenticatedUser,
  authorizePermissions,
} = require("../middleware/auth");


router.route("/categories").get(getAllCategories);

router
  .route("/admin/category")
  .post(
    isAuthenticatedUser,
    authorizePermissions("createCategory"),
    createCategory
  );
router
  .route("/admin/category/:id")
  .put(
    isAuthenticatedUser,
    authorizePermissions("updateCategory"),
    updateCategory
  )
  .delete(
    isAuthenticatedUser,
    authorizePermissions("deleteCategory"),
    deleteCategory
  );

router.route("/category/:id").get(getCategoryDetails);

module.exports = router;
