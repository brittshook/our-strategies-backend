const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;

const shiftSchema = new Schema(
  {
    name: { type: String, required: true },
    programId: {
      type: Schema.Types.ObjectId,
      ref: "Program",
      required: true,
    },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    location: {
      type: { type: String, default: "Point" },
      coordinates: {
        type: [Number],
        required: true,
        validate: {
          validator: function validateCoordinates(value) {
            if (value[0] < -90 || value[0] > 90) {
              return false;
            }

            if (value[1] < -180 || value[1] > 180) {
              return false;
            }

            return true;
          },
          message: "Invalid coordinates",
        },
      },
    },
    volunteerLimit: {
      type: Number,
      default: 20,
      min: [1, "Volunteer limit must be greater than 0"],
    },
  },
  { timestamps: true }
);

shiftSchema.index({ location: "2dsphere" });

const Shift = model("Shift", shiftSchema);

module.exports = Shift;
