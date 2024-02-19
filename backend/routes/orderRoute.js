const express = require("express");
const {
  newOrder,
  getOrdersByEmail,
  updateOrderStatusByEmail,
  deleteOrderByEmail,
  getSingleOrder,
  updateOrder,
  deleteOrder,
  getAllOrders,
  getCombinedOrders,
  getOrderItemsByEmail,
} = require("../controllers/orderController");
const router = express.Router();

const {
  isAuthenticatedUser,
  authorizePermissions,
} = require("../middleware/auth");

// Create new Order
router.route("/order/new").post(newOrder);

// Get Orders by Email
router
  .route("/orders/email/:email")
  .get(
    isAuthenticatedUser,
    authorizePermissions("getOrdersByEmail"),
    getOrdersByEmail
  );

router
  .route("/orders-items/email/:email")
  .get(isAuthenticatedUser, getOrderItemsByEmail);

// Update Order Status by Email
router
  .route("/order/email/:email/:id")
  .put(
    isAuthenticatedUser,
    authorizePermissions("updateOrderStatusByEmail"),
    updateOrderStatusByEmail
  );

// Delete Order by Email
router
  .route("/order/email/:email/:id")
  .delete(
    isAuthenticatedUser,
    authorizePermissions("deleteOrderByEmail"),
    deleteOrderByEmail
  );

// Get Single Order
router.route("/order/:id").get(
  // isAuthenticatedUser,
  // authorizePermissions("getSingleOrder"),
  isAuthenticatedUser,
  getSingleOrder
);

// Admin routes
router
  .route("/admin/orders")
  .get(isAuthenticatedUser, authorizePermissions("getAllOrders"), getAllOrders);

router.route("/orders/combined").get(getCombinedOrders);

// Update Order Status -- Admin
router
  .route("/admin/order/:id")
  .put(isAuthenticatedUser, authorizePermissions("updateOrder"), updateOrder);

// Delete Order -- Admin
router.route("/admin/order/:id").delete(isAuthenticatedUser, deleteOrder);

module.exports = router;
