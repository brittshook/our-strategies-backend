const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;

const Shift = model(
  "Shift",
  new Schema(
    {
      name: String,
      program: {
        type: Schema.Types.ObjectId,
        ref: "Program",
      },
      startTime: Date,
      endTime: Date,
      location: {
        type: { type: String, default: "Point" },
        coordinates: [Number],
      },
      volunteerLimit: Number,
    },
    { timestamps: true }
  )
);

module.exports = Shift;
