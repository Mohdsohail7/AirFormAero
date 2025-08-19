const crypto = require("crypto");
const User = require("../models/User");
const { endpoints, exchangeCodeForToken, getWhoAmI } = require("../utils/airtable");

const {
  AIRTABLE_CLIENT_ID: CLIENT_ID,
  AIRTABLE_CLIENT_SECRET: CLIENT_SECRET,
  BACKEND_URL,
  FRONTEND_URL,
} = process.env;

function b64url(buf) {
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function genVerifier() { return b64url(crypto.randomBytes(32)); }
function challenge(verifier) {
  return b64url(crypto.createHash("sha256").update(verifier).digest());
}

// Step 1: redirect to Airtable OAuth
exports.redirectToAirtable = (req, res) => {
  const codeVerifier = genVerifier();
  const codeChallenge = challenge(codeVerifier);
  const state = b64url(crypto.randomBytes(16));

  req.session.codeVerifier = codeVerifier;
  req.session.oauthState = state;

  const scopes = [
    "data.records:read",
    "data.records:write",
    "schema.bases:read",
    "user.email:read",
  ].join(" ");

  const url = new URL(endpoints.OAUTH_AUTHORIZE);
  url.searchParams.set("client_id", CLIENT_ID);
  url.searchParams.set("redirect_uri", `${BACKEND_URL}/auth/airtable/callback`);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("code_challenge", codeChallenge);
  url.searchParams.set("code_challenge_method", "S256");
  url.searchParams.set("state", state);
  url.searchParams.set("scope", scopes);

  res.redirect(url.toString());
};

// Step 2: callback → exchange code, save user, redirect to FE
exports.handleAirtableCallback = async (req, res) => {
  try {
    const { code, state } = req.query;
    if (!code) return res.status(400).send("Missing authorization code");
    if (state !== req.session.oauthState) return res.status(400).send("Invalid OAuth state");
    if (!req.session.codeVerifier) return res.status(400).send("No PKCE code_verifier");

    const tokens = await exchangeCodeForToken({
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      code,
      redirectUri: `${BACKEND_URL}/auth/airtable/callback`,
      codeVerifier: req.session.codeVerifier,
    });

    if (!tokens?.access_token) return res.status(500).send("Token exchange failed");

    const me = await getWhoAmI(tokens.access_token);

    const user = await User.findOneAndUpdate(
      { airtableId: me.id },
      {
        name: me.name,
        email: me.email,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        tokenExpiresAt: new Date(Date.now() + (tokens.expires_in ?? 3600) * 1000),
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    delete req.session.codeVerifier;
    delete req.session.oauthState;

    res.redirect(`${process.env.FRONTEND_URL}/dashboard?userId=${user._id}`);
  } catch (err) {
    console.error("OAuth error:", err?.response?.data || err.message);
    res.status(500).send("OAuth login failed");
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).send("Missing userId");
    }

    const user = await User.findById(userId).lean();
    if (!user) {
      return res.status(404).send("User not found");
    }

    res.json(user);
  } catch (err) {
    console.error("Get user error:", err.message);
    res.status(500).send("Failed to fetch user");
  }
};
