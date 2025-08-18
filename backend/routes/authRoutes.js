const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController")

// Redirect to Airtable OAuth
router.get("/", authController.redirectToAirtable );

// OAuth callback
router.get("/callback", authController.handleAirtableCallback);

module.exports = router;