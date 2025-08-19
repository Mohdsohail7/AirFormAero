const mongoose = require("mongoose");

const ConditionRuleSchema = new mongoose.Schema(
  {
    // Show this question if (all) rules pass
    whenFieldId: String,             // Airtable field id to check
    operator: { type: String, enum: ["equals", "includes"] }, // includes for multi-select
    value: mongoose.Schema.Types.Mixed,
  },
  { _id: false }
);

const QuestionSchema = new mongoose.Schema(
  {
    fieldId: String,                 
    fieldType: String,               
    label: String,                   
    required: { type: Boolean, default: false },
    options: [                       
      new mongoose.Schema({ id: String, name: String }, { _id: false })
    ],
    showIf: [ConditionRuleSchema],   
  },
  { _id: false }
);

const FormSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true, required: true },

    baseId: { type: String, index: true, required: true },
    baseName: String,

    tableId: { type: String, index: true, required: true },
    tableName: String,

    title: { type: String, default: "Untitled Form" },
    description: String,

    questions: [QuestionSchema],     
  },
  { timestamps: true }
);

module.exports = mongoose.model("Form", FormSchema);
