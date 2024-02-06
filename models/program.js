const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;

const Program = model(
  "Program",
  new Schema(
    {
      name: String,
      active: { type: Boolean, default: true },
    },
    { timestamps: true }
  )
);

module.exports = Program;
