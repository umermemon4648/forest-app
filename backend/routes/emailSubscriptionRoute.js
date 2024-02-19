const express = require("express");
const router = express.Router();
const {
  createEmailSubscription,
  getAllEmailSubscriptions,
  deleteEmailSubscription,
} = require("../controllers/emailSubscriptionController");
const {
  isAuthenticatedUser,
  authorizePermissions,
} = require("../middleware/auth");

// Public route for retrieving all email subscriptions
router
  .route("/admin/emailsubscriptions")
  .get(
    isAuthenticatedUser,
    authorizePermissions("getAllEmailSubscriptions"),
    getAllEmailSubscriptions
  );

router.route("/emailsubscription").post(createEmailSubscription);

router.route("/admin/emailsubscription/:id").delete(
  isAuthenticatedUser,
  authorizePermissions("deleteEmailSubscription"),
  deleteEmailSubscription
);

module.exports = router;
