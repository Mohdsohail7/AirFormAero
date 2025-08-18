const express = require("express");
const router = express.Router();
const formViewerController = require("../controllers/formViewerController");

// Fetch form to fill
router.get("/:formId", formViewerController.getFormForViewer);

module.exports = router;
