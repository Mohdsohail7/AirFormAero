const express = require("express");
const router = express.Router();
const formController = require("../controllers/formController");

// Create a new form
router.post("/", formController.createForm);

// Get all forms of a user
router.get("/user/:userId", formController.getFormsByUser);

// Get a single form by ID
router.get("/:formId", formController.getFormById);

// Update a form
router.put("/:formId", formController.updateForm);

module.exports = router;