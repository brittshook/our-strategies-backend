const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;

const ProfileImage = model(
  "ProfileImage",
  new Schema(
    {
      data: Buffer,
      contentType: String,
    },
    { timestamps: true }
  )
);

module.exports = ProfileImage;
