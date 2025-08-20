const express = require("express");
const { uploadMiddleware, uploadFile } = require("../controllers/uploadController");

const router = express.Router();

// POST /api/upload
router.post("/", uploadMiddleware, uploadFile);

module.exports = router;
