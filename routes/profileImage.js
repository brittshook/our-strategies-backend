const express = require("express");
const mongoose = require("mongoose");
const ProfileImage = require("../models/profileImage.js");
const error = require("../utils/error.js");
const multer = require("multer");

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const profileImg = req.file;

    if (!profileImg) {
      throw error(400, "No file uploaded");
    }

    const result = await ProfileImage.create({
      data: req.file.buffer,
      contentType: req.file.mimetype,
    });

    return res.status(201).json({ profileImage: result });
  } catch (err) {
    next(err);
  }
});

router.get("/:id/?", async (req, res, next) => {
  try {
    const profileImageId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(profileImageId)) {
      throw error(400, "Invalid profile image ID");
    }

    const result = await ProfileImage.findById(profileImageId);

    if (result) {
      res.json({ profileImage: result });
    } else {
      throw error(404, "Profile image not found");
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
