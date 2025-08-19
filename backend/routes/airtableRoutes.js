const express = require("express");
const router = express.Router();
const airtableController = require("../controllers/airtableController");

// Get all bases for a user
router.get("/bases/:userId", airtableController.getBases);

// Get all tables for a base
router.get("/tables/:userId/:baseId", airtableController.getTables);

// Get all fields for a table
router.get("/fields/:userId/:baseId/:tableId", airtableController.getFields);

module.exports = router;