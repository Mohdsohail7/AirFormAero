const User = require("../models/User");
const { listBases, listTables, isSupportedField, kindFromType } = require("../utils/airtable");


// Helper: load user + token
async function getUserWithToken(userId) {
  const user = await User.findById(userId);
  if (!user) throw new Error("USER_NOT_FOUND");
  if (!user.accessToken) throw new Error("NO_TOKEN");
  return user;
}

// GET /api/airtable/bases/:userId
exports.getBases = async (req, res) => {
  try {
    const user = await getUserWithToken(req.params.userId);
    const bases = await listBases(user.accessToken);
    res.json(bases.map(b => ({ id: b.id, name: b.name })));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "FAILED_TO_FETCH_BASES" });
  }
};

// GET /api/airtable/tables/:userId/:baseId
exports.getTables = async (req, res) => {
  try {
    const user = await getUserWithToken(req.params.userId);
    const tables = await listTables(user.accessToken, req.params.baseId);
    res.json(tables.map(t => ({ id: t.id, name: t.name })));
  } catch (e) {
    console.error(e?.response?.data || e);
    res.status(500).json({ error: "FAILED_TO_FETCH_TABLES" });
  }
};

// GET /api/airtable/fields/:userId/:baseId/:tableId
// returns only supported field types
exports.getFields = async (req, res) => {
  try {
    const { userId, baseId, tableId } = req.params;
    const user = await getUserWithToken(userId);
    const tables = await listTables(user.accessToken, baseId);
    const table = tables.find(t => t.id === tableId);
    if (!table) return res.status(404).json({ error: "TABLE_NOT_FOUND" });

    const fields = (table.fields || [])
      .filter(f => isSupportedField(f.type))
      .map(f => ({
        id: f.id,
        name: f.name,
        type: f.type,
        kind: kindFromType(f.type),
        options: (f?.options?.choices || f?.options?.choicesById
          ? (f.options.choices || [])
          : []
        ).map(c => ({ id: c.id, name: c.name })),
      }));

    res.json({ table: { id: table.id, name: table.name }, fields });
  } catch (e) {
    console.error(e?.response?.data || e);
    res.status(500).json({ error: "FAILED_TO_FETCH_FIELDS" });
  }
};