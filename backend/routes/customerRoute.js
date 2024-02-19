const express = require("express");

const {
  createCustomer,
  getCustomerByEmail,
  updateCustomerByEmail,
  deleteCustomerByEmail,
} = require("../controllers/customerController");
const router = express.Router();
const { isAuthenticatedUser, authorizePermissions } = require("../middleware/auth");

// Create a new customer
router.route("/customer")
  .post(
    isAuthenticatedUser,
    authorizePermissions("createCustomer"), // Replace with the appropriate permission name
    createCustomer
  );

// Get customer by email
router.route("/customer/email/:email").get( isAuthenticatedUser,
  authorizePermissions("getCustomerByEmail"), getCustomerByEmail);

// Update customer by email
router.route("/customer/email/:email")
  .put(
    isAuthenticatedUser,
    authorizePermissions("updateCustomer"), // Replace with the appropriate permission name
    updateCustomerByEmail
  );

// Delete customer by email
router.route("/customer/email/:email")
  .delete(
    isAuthenticatedUser,
    authorizePermissions("deleteCustomer"), // Replace with the appropriate permission name
    deleteCustomerByEmail
  );

module.exports = router;
