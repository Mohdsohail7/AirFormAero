const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    airtableId: String,
    name: String,
    email: String,
    accessToken: String
},
{
    timestamps: true
}
);

module.exports = mongoose.model("User", userSchema);

