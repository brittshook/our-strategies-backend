const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;

const User = model(
  "User",
  new Schema(
    {
      first: String,
      last: String,
      email: String,
      address: String,
      role: {
        type: [
          {
            type: String,
            enum: ["owner", "admin", "volunteer"],
          },
        ],
        default: ["volunteer"],
      },
      status: {
        type: String,
        enum: ["pending", "approved", "denied"],
        default: "pending",
      },
    },
    { timestamps: true }
  )
);

module.exports = User;
