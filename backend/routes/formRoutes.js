const express = require("express");
const router = express.Router();
const { createForm, updateForm, getForm, listForms, submitForm, deleteForm } = require("../controllers/formController");

// Create a new form
router.post("/", createForm);

router.get("/", listForms);

// Get form by ID
router.get("/:formId", getForm);

// Update a form
router.put("/:formId", updateForm);

// submit form
router.post("/:formId/submit", submitForm);

// delete route
router.delete("/:id", deleteForm);

module.exports = router;