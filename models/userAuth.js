const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;

const UserAuth = model(
  "User_Auth",
  new Schema(
    {
      userId: { type: Schema.Types.ObjectId, ref: "User" },
      hashedPassword: { type: String, required: true },
    },
    { timestamps: true }
  )
);

module.exports = UserAuth;
