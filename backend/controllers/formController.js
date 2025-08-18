const Form = require("../models/Form");



// Create a new form
exports.createForm = async (req, res) => {
    const {userId, baseId, tableId, tableName, questions } = req.body;

    try {
        const form = new Form({
            userId,
            baseId,
            tableId,
            tableName,
            questions
        });
        await form.save();
        res.status(201).json(form);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create form." });
    }
};

// Get all forms for a user
exports.getFormsByUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const forms = await Form.find({ userId });
        res.json(forms);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch forms." });
    }
};

// Get a single form by ID
exports.getFormById = async (req, res) =>{
    const { formId } = req.params;

    try {
        const form = await Form.findById(formId);
        if (!form) {
            return res.status(404).json({ message: "Form not found." });
        }
        res.json(form);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch form." });
    }
};

// Update a form 
exports.updateForm = async (req, res) => {
    const { formId } = req.params;
    const { questions } = req.body;

    try {
        const form = await Form.findById(formId);
        if (!form) {
            return res.status(404).json({ message: "Form not found." });
        }
        form.questions = questions;
        await form.save();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update form." });
    }
}
