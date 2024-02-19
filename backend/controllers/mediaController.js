const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Media = require("../models/mediaModel");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const fullPath = path.join(__dirname, "../media/uploads");
    fs.mkdirSync(fullPath, { recursive: true });
    cb(null, fullPath);
  },
  filename: (req, file, cb) => {
    // Replace spaces with underscores in the original filename
    const sanitizedFilename = file.originalname.replace(/\s+/g, '_');
    cb(null, `${Date.now()}-${sanitizedFilename}`);
  },
});

const upload = multer({ storage: storage });
const uploadMedia = upload.single("image");

const handleMediaUpload = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No media file provided" });
    }

    const relativePath = `/media/uploads/${req.file.filename}`;
    const media = new Media({
      filename: req.file.originalname,
      path: relativePath,
    });

    await media.save();

    res.status(200).json({ success: true, message: "Media uploaded successfully", media });
  } catch (err) {
    next(err);
  }
};

// Middleware to get all media
const getAllMedia = async (req, res, next) => {
  try {
    const media = await Media.find();
    res.status(200).json({ success: true, media });
  } catch (error) {
    next(error);
  }
};

// Controller to delete media by ID
const deleteMedia = async (req, res, next) => {
  try {
    const mediaId = req.params.id;
    const media = await Media.findById(mediaId);

    if (!media) {
      return res.status(404).json({ success: false, message: "Media not found" });
    }

    // Delete the media file from the folder
    const filePath = path.join(__dirname, `../${media.path}`);
    fs.unlinkSync(filePath);

    // Delete the media from the database
    await Media.findByIdAndRemove(mediaId);

    res.status(200).json({ success: true, message: "Media deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadMedia,
  handleMediaUpload,
  getAllMedia,
  deleteMedia,
};
