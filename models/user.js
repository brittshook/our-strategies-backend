const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;

const userSchema = new Schema(
  {
    first: { type: String, required: true },
    last: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    profileImageId: {
      type: Schema.Types.ObjectId,
      ref: "ProfileImage",
      default: "65d78482702ea028467109eb",
    },
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
);

userSchema.index({ email: 1 });

const User = model("User", userSchema);

module.exports = User;
