const axios = require("axios");
const User = require("../models/User");

const CLIENT_ID = process.env.AIRTABLE_CLIENT_ID;
const CLIENT_SECRET = process.env.AIRTABLE_CLIENT_SECRET;
const BACKEND_URL = process.env.BACKEND_URL;
const FRONTEND_URL = process.env.FRONTEND_URL;

// Redirect user to Airtable OAuth
exports.redirectToAirtable = (req, res) => {
    const redirectUri = `https://airtable.com/oauth2/v1/authorize?client_id=${CLIENT_ID}&redirect_uri=${BACKEND_URL}/auth/airtable/callback&response_type=code`;
    res.redirect(redirectUri);
};

// Handle OAuth callback
exports.handleAirtableCallback = async (req, res) => {
    const code = req.query.code;
    try {
        // Exchange code for access token
        const tokenResponse = await axios.post("https://airtable.com/oauth2/v1/token", {
            grant_type: "authorization_code",
            code,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            redirect_uri: `${BACKEND_URL}/auth/airtable/callback`
        });
        const accessToken = tokenResponse.data.access_token;

        // Get basic profile info from Airtable
        const profileResponse = await axios.get("https://api.airtable.com/v0/meta/me", {
            headers: { Authorization: `Bearer ${accessToken}`}
        });

        const profile = profileResponse.data;

        // Save or update user in DB
        let user = await User.findOne({ airtableId: profile.id });
        if (!user) {
            user = new User({
                airtableId: profile.id,
                name: profile.name,
                email:profile.email,
                accessToken
            });
            await user.save();
        } else {
            user.accessToken = accessToken;
            await user.save();
        }

        // Redirect to frontend
        res.redirect(`${FRONTEND_URL}/dashboard?userId=${user._id}`);

    } catch (err) {
        console.error(err);
        res.status(500).send("OAuth login failed")
    }
}