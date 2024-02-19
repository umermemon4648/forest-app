const express = require("express");
const router = express.Router();
const mediaController = require("../controllers/mediaController");
const { isAuthenticatedUser, authorizePermissions } = require("../middleware/auth");

router.post(
  "/upload",
  isAuthenticatedUser,
  mediaController.uploadMedia,
  mediaController.handleMediaUpload
);
router.get(
  "/getAllMedia",
  isAuthenticatedUser,
  mediaController.getAllMedia
);
router.delete(
  "/deleteMedia/:id",
  isAuthenticatedUser,
  mediaController.deleteMedia
);

module.exports = router;
