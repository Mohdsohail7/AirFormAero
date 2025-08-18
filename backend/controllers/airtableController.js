const axios = require("axios");
const User = require("../models/User");

// fetch all bases for a user
exports.getBases = async (req, res) => {
    const userId = req.params.userId;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        const response = await axios.get("https://api.airtable.com/v0/meta/bases", {
            headers: { Authorization: `Bearer ${user.accessToken}` }
        });

        res.json(response.data.bases);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch bases." });
    }
};

// fetch tables from a selected base
exports.getTables = async (req, res) => {
    const { userId, baseId } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found."});
        }
        const response = await axios.get(`https://api.airtable.com/v0/meta/bases/${baseId}/tables`, {
            headers: { Authorization: `Bearer ${user.accessToken}` }
        });

        res.json(response.data.tables);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch tables."});
    }
};

// fetch fields from a selected table 
exports.getFileds = async (req, res) => {
    const { userId, baseId, tableId } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        const response = await axios.get(`https://api.airtable.com/v0/meta/bases/${baseId}/tables/${tableId}/fields`, {
            headers: { Authorization: `Bearer ${user.accessToken}` }
        });

        res.json(response.data.fields);
    } catch (error) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch fields." });
    }
}