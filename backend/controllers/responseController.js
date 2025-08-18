const axios = require("axios");
const Form = require("../models/Form");
const User = require("../models/User");


// Submit form response and save to Airtable
exports.submitFormResponse = async (req, res) => {
    const { formId } = req.params;
    const { response } = req.body;

    try {
        // Get form
        const form = await Form.findById(formId);
        if (!form) {
            return res.status(404).json({ message: "Form not found." });
        }
        // Get user to fetch Airtable token
        const user = await User.findById(form.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Prepare Airtable record
        const record = {};
        form.questions.forEach((question) => {
            if (question.conditionalLogic) {
                const dependsValue = response[question.conditionalLogic.dependsOnFieldId];
                const operator = question.conditionalLogic.operator;
                const value = question.conditionalLogic.value;

                let showQuestion = false;
                if (operator === "equals" && dependsValue === value) showQuestion = true;
                else if (operator === "not_equals" && dependsValue !== value) showQuestion = true;

                if (!showQuestion) return;

            }
            // Only save if the question is answered
            if (response[question.fieldId] !== undefined) {
                record[question.label || question.fieldId] = response[question.fieldId];
            }
        });

        // Send to Airtable
        const airtableResponse = await axios.post(
            `https://api.airtable.com/v0/${form.baseId}/${form.tableId}`,
            { fields: record },
            { headers: { Authorization: `Bearer ${user.accessToken}` } }
        );
        res.status(201).json({ message: "Form submitted", airtableResponse: airtableResponse.data });
    } catch (error) {
        console.error(error.response ? error.response.data : error);
        res.status(500).json({ message: "Failed to submit form." });
    }
}