const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    airtableId: { type: String, index: true },
    name: String,
    email: String,
    accessToken: String,
    refreshToken: String,
    tokenExpiresAt: Date
},
{
    timestamps: true
}
);

module.exports = mongoose.model("User", userSchema);

