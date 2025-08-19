const Form = require("../models/Form");
const User = require("../models/User");



// Create a new form
exports.createForm = async (req, res) => {
    try {
    const { ownerId } = req.body;
    const owner = await User.findById(ownerId);
    if (!owner) return res.status(400).json({ error: "OWNER_NOT_FOUND" });

    const form = await Form.create(req.body);
    res.status(201).json(form);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "CREATE_FORM_FAILED" });
  }
};

// Update form
// PUT /api/forms/:formId
exports.updateForm = async (req, res) => {
  try {
    const form = await Form.findByIdAndUpdate(req.params.formId, req.body, { new: true });
    if (!form) return res.status(404).json({ error: "FORM_NOT_FOUND" });
    res.json(form);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "UPDATE_FORM_FAILED" });
  }
};

// Get form
// GET /api/forms/:formId
exports.getForm = async (req, res) => {
  try {
    const form = await Form.findById(req.params.formId);
    if (!form) return res.status(404).json({ error: "FORM_NOT_FOUND" });
    res.json(form);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "GET_FORM_FAILED" });
  }
};

// List forms for a user
// GET /api/forms?ownerId=...
exports.listForms = async (req, res) => {
  try {
    const forms = await Form.find({ owner: req.query.ownerId }).sort({ updatedAt: -1 });
    res.json(forms);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "LIST_FORMS_FAILED" });
  }
};

// Submit a response
// POST /api/forms/:formId/submit?userId=...
// body: { answers: { [fieldId]: value } }
// We just forward to Airtable as a new record.
exports.submitForm = async (req, res) => {
  try {
    const form = await Form.findById(req.params.formId);
    if (!form) return res.status(404).json({ error: "FORM_NOT_FOUND" });

    const user = await User.findById(req.query.userId);
    if (!user || !user.accessToken) return res.status(400).json({ error: "USER_TOKEN_MISSING" });

    const fields = {};
    for (const q of form.questions) {
      if (req.body.answers.hasOwnProperty(q.fieldId)) {
        fields[q.fieldId] = req.body.answers[q.fieldId];
      }
    }

    const result = await createRecord({
      accessToken: user.accessToken,
      baseId: form.baseId,
      tableIdOrName: form.tableId, // using tableId
      fields,
    });

    res.status(201).json({ message: "FORM SUBMITTED", airtable: result });
  } catch (e) {
    console.error(e?.response?.data || e);
    res.status(500).json({ error: "SUBMISSION_FAILED" });
  }
};
