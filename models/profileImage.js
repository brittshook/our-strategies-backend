const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;

const ProfileImage = model(
  "Profile_Image",
  new Schema(
    {
      data: Buffer,
      contentType: String,
    },
    { timestamps: true }
  )
);

module.exports = ProfileImage;
