const express = require("express");
const router = express.Router();
const {
  getSubSubsList,
  createSubSubscription,
  cancelSubSubscription,
  updateSubSubscription,
  session,
  updateCardDetail,
} = require("../controllers/subscriptionController.js");

// Subscriptions
router.route("/getSubSubsList/:id").get(getSubSubsList);
router.route("/createSubSubscription").post(createSubSubscription);
router.route("/cancelSubSubscription").post(cancelSubSubscription);
router.route("/updateSubSubscription").put(updateSubSubscription);
router.route("/updateCardDetail").put(updateCardDetail);

module.exports = router;
