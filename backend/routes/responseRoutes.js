const express = require("express");
const router = express.Router();
const responseController = require("../controllers/responseController");

// Submit a filled form
router.post("/submit/:formId", responseController.submitFormResponse);

module.exports = router;