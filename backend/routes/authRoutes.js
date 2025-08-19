const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController")

// Redirect to Airtable OAuth
router.get("/airtable", authController.redirectToAirtable );

// OAuth callback
router.get("/airtable/callback", authController.handleAirtableCallback);

module.exports = router;