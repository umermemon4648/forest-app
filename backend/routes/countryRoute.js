const express = require("express");
const router = express.Router();
const {
  getAllCountries,
  createCountry,
  updateCountry,
  deleteCountry,
  getCountryDetails,
} = require("../controllers/countryController");

const { isAuthenticatedUser, authorizePermissions } = require("../middleware/auth");

// Public routes
router.route("/countries").get(getAllCountries);

// Admin routes (if needed, depending on your application)
router.route("/admin/country").post(isAuthenticatedUser, authorizePermissions("createCountry"), createCountry);
router.route("/admin/country/:id").put(isAuthenticatedUser, authorizePermissions("updateCountry"), updateCountry).delete(isAuthenticatedUser, authorizePermissions("deleteCountry"), deleteCountry);

router.route("/country/:id").get(getCountryDetails);

module.exports = router;
