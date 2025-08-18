const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    fieldId: String,
    label: String,
    type: String,
    conditionalLogic: {
        dependsOnFieldId: String,
        operator: String,
        value: mongoose.Schema.Types.Mixed
    }
});

const formSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, ref: "User"
    },
    baseId: String,
    tableId: String,
    tableName: String,
    questions: [questionSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Form", formSchema);