const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateProfile,
  getAllUser,
  getSingleUser,
  updateUserRole,
  deleteUser,
  confirmEmail,
  resendConfirmationEmail,
  getSingleOrder,
  myOrders,
} = require("../controllers/userController");
const { isAuthenticatedUser, authorizePermissions } = require("../middleware/auth");
const {
  getAllRoles,
  createRole,
  updateRole,
  deleteRole,
} = require("../controllers/userRoleController"); // Import the user role controller

// User registration
router.post("/register", registerUser);

// Email confirmation routes
router.get("/confirm/:token", confirmEmail);
router.post("/resendConfirmation", resendConfirmationEmail);

// User login
router.post("/login", loginUser);

// Password reset routes
router.post("/password/forgot", forgotPassword);
router.put("/password/reset/:token", resetPassword);

// User logout
router.get("/logout", logout);

// User profile and password update
router.get("/me", isAuthenticatedUser, getUserDetails);
router.put("/password/update", isAuthenticatedUser, updatePassword);
router.put("/me/update", isAuthenticatedUser, updateProfile);

// Admin routes
router.get(
  "/admin/users",
  isAuthenticatedUser,
  authorizePermissions("getAllUsers"), // Replace with custom permission
  getAllUser
);
router.get(
  "/admin/user/:id",
  isAuthenticatedUser,
  authorizePermissions("getSingleUser"), // Replace with custom permission
  getSingleUser
);
router.put(
  "/admin/user/:id",
  isAuthenticatedUser,
  authorizePermissions("updateUserRole"), // Replace with custom permission
  updateUserRole
);
router.delete(
  "/admin/user/:id",
  isAuthenticatedUser,
  authorizePermissions("deleteUser"), // Replace with custom permission
  deleteUser
);

// User role routes
router.get(
  "/admin/roles",
  isAuthenticatedUser,
  authorizePermissions("getAllRoles"), // Replace with custom permission
  getAllRoles
);
router.post(
  "/admin/role",
  isAuthenticatedUser,
  authorizePermissions("createRole"), // Replace with custom permission
  createRole
);
router.put(
  "/admin/role/:id",
  isAuthenticatedUser,
  authorizePermissions("updateRole"), // Replace with custom permission
  updateRole
);
router.delete(
  "/admin/role/:id",
  isAuthenticatedUser,
  authorizePermissions("deleteRole"), // Replace with custom permission
  deleteRole
);

module.exports = router;
