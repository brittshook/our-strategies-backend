const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;

const ShiftAssignment = model(
  "Shift_Assignment",
  new Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      shiftId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shift",
        required: true,
      },
    },
    { timestamps: true }
  )
);

module.exports = ShiftAssignment;
