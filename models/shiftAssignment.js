const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;

const ShiftAssignment = model(
  "ShiftAssignment",
  new Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      shiftId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shift",
      },
    },
    { timestamps: true }
  )
);

module.exports = ShiftAssignment;
