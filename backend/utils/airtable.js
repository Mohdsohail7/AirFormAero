const axios = require("axios");

// --- Endpoints (OAuth & API) ---
const OAUTH_AUTHORIZE = "https://airtable.com/oauth2/v1/authorize";
const OAUTH_TOKEN = "https://airtable.com/oauth2/v1/token";
const API = "https://api.airtable.com/v0";

exports.endpoints = { OAUTH_AUTHORIZE, OAUTH_TOKEN, API };

// Normalize Airtable field types to a known small set
const SUPPORTED = new Set([
  "singleLineText",
  "multilineText",
  "singleSelect",
  "multipleSelects",
  "multipleAttachments",
]);

exports.isSupportedField = (t) => SUPPORTED.has(t);

// Map supported types to question kind (front-end can use same)
exports.kindFromType = (t) => {
  switch (t) {
    case "singleLineText": return "short_text";
    case "multilineText": return "long_text";
    case "singleSelect": return "single_select";
    case "multipleSelects": return "multi_select";
    case "multipleAttachments": return "attachment";
    default: return null;
  }
};

// OAuth token exchange (PKCE + Basic client auth)
exports.exchangeCodeForToken = async ({
  clientId,
  clientSecret,
  code,
  redirectUri,
  codeVerifier,
}) => {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
    code_verifier: codeVerifier,
  });

  const res = await axios.post(OAUTH_TOKEN, body.toString(), {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
    },
    timeout: 10000,
  });

  return res.data; // { access_token, refresh_token, expires_in, token_type }
};

exports.getWhoAmI = async (accessToken) => {
  const res = await axios.get(`${API}/meta/whoami`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    timeout: 10000,
  });
  return res.data; // { id, email, name, ... }
};

exports.listBases = async (accessToken) => {
  const res = await axios.get(`${API}/meta/bases`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    timeout: 15000,
  });
  return res.data?.bases || [];
};

exports.listTables = async (accessToken, baseId) => {
  const res = await axios.get(`${API}/meta/bases/${baseId}/tables`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    timeout: 20000,
  });
  return res.data?.tables || [];
};

exports.createRecord = async ({ accessToken, baseId, tableIdOrName, fields }) => {
  const url = `${API}/${baseId}/${tableIdOrName}`;
  const res = await axios.post(
    url,
    { records: [{ fields }] },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      timeout: 20000,
    }
  );
  return res.data;
};
