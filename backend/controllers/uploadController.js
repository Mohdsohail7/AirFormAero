const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

// Setup multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

exports.uploadMiddleware = upload.single("file");

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "airform_uploads", resource_type: "auto" },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };

    const result = await streamUpload(req.file.buffer);
    res.json({ url: result.secure_url });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "UPLOAD_FAILED" });
  }
};
