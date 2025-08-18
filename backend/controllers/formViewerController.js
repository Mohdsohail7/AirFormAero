const axios = require("axios");
const Form = require("../models/Form");

// Fetch a form by ID with all questions
exports.getFormForViewer = async (req, res) => {
    const { formId } = req.params;

    try {
        const form = await Form.findById(formId);
        if (!form) return res.status(404).json({ message: "Form not found" });

        // Send only necessary info to frontend
        res.json({
            formId: form._id,
            baseId: form.baseId,
            tableId: form.tableId,
            tableName: form.tableName,
            questions: form.questions
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch form" });
    }
};

