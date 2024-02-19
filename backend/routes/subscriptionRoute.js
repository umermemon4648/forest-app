const express = require("express");
const router = express.Router();
const {
  getSubSubsList,
  createSubSubscription,
  cancelSubSubscription,
  updateSubSubscription,
  session,
} = require("../controllers/subscriptionController.js");


// Subscriptions
router.route("/getSubSubsList/:id").get(getSubSubsList);
router.route("/createSubSubscription").post(createSubSubscription);
router.route("/cancelSubSubscription").post(cancelSubSubscription);
router.route("/updateSubSubscription").put(updateSubSubscription);



module.exports = router;
