const axios = require("axios");
const crypto = require("crypto");
const User = require("../models/User");

const {
  AIRTABLE_CLIENT_ID: CLIENT_ID,
  AIRTABLE_CLIENT_SECRET: CLIENT_SECRET,
  BACKEND_URL,
  FRONTEND_URL
} = process.env;

const OAUTH_AUTHORIZE = "https://airtable.com/oauth2/v1/authorize";
const OAUTH_TOKEN = "https://airtable.com/oauth2/v1/token";

function b64url(buf) {
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/,"");
}
function generateCodeVerifier() {
  return b64url(crypto.randomBytes(32));
}
function generateCodeChallenge(verifier) {
  const hash = crypto.createHash("sha256").update(verifier).digest();
  return b64url(hash);
}

exports.redirectToAirtable = (req, res) => {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);
  req.session.codeVerifier = codeVerifier;

  // (optional) real random state + store it to verify later
  const state = b64url(crypto.randomBytes(16));
  req.session.oauthState = state;

  const scopes = [
    "data.records:read",
    "data.records:write",
    "schema.bases:read",
    "user.email:read"
  ].join(" ");

  const url = new URL(OAUTH_AUTHORIZE);
  url.searchParams.set("client_id", CLIENT_ID);
  url.searchParams.set("redirect_uri", `${BACKEND_URL}/auth/airtable/callback`);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("code_challenge", codeChallenge);
  url.searchParams.set("code_challenge_method", "S256");
  url.searchParams.set("state", state);
  url.searchParams.set("scope", scopes);

  return res.redirect(url.toString());
};

exports.handleAirtableCallback = async (req, res) => {
  try {
    const { code, state } = req.query;
    const codeVerifier = req.session.codeVerifier;

    if (!code) return res.status(400).send("Missing authorization code");
    if (!codeVerifier) return res.status(400).send("Session expired: no code_verifier");
    if (!state || state !== req.session.oauthState) {
      return res.status(400).send("Invalid OAuth state");
    }

    // --- Exchange code for tokens (use Basic Auth for client credentials) ---
    const body = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: `${BACKEND_URL}/auth/airtable/callback`,
      code_verifier: codeVerifier
    });

    const tokenRes = await axios.post(OAUTH_TOKEN, body.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization":
          "Basic " + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64")
      },
      timeout: 10000
    });

    const { access_token, refresh_token, expires_in, token_type } = tokenRes.data;
    if (!access_token || token_type?.toLowerCase() !== "bearer") {
      return res.status(500).send("Token exchange failed");
    }

    // --- Me endpoint ---
    const meRes = await axios.get("https://api.airtable.com/v0/meta/whoami", {
    headers: { Authorization: `Bearer ${access_token}` },
    timeout: 10000
    });

    const profile = meRes.data; // { id, name, email, ... }

    // --- Upsert user ---
    const tokenExpiresAt = new Date(Date.now() + (expires_in ?? 3600) * 1000);
    const update = {
      name: profile.name,
      email: profile.email,
      accessToken: access_token,
      refreshToken: refresh_token,
      tokenExpiresAt
    };
    const user = await User.findOneAndUpdate(
      { airtableId: profile.id },
      update,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    // clean up PKCE items
    delete req.session.codeVerifier;
    delete req.session.oauthState;

    // hand off to frontend
    return res.redirect(`${FRONTEND_URL}/dashboard?userId=${user._id}`);
  } catch (err) {
    console.error("OAuth error:", err?.response?.data ?? err.message);
    return res.status(500).send("OAuth login failed");
  }
};
