const express = require("express");
const Shift = require("../models/shift.js");
const ShiftAssignment = require("../models/shiftAssignment.js");
const error = require("../utils/error.js");

const router = express.Router();

router
  .route("/shifts/?")
  .get(async (req, res, next) => {
    try {
      const { startTime, endTime } = req.query;
      const query = {};

      if (startTime) {
        query.startTime = { $gte: startTime };
      }

      if (endTime) {
        query.endTime = { $lte: endTime };
      }

      res.json({ shifts: await Shift.find(query).limit(1000) });
    } catch (err) {
      next(err);
    }
  })
  .post(async (req, res, next) => {
    try {
      const { name, programId, startTime, endTime, location, volunteerLimit } =
        req.body;

      if (
        !name ||
        !programId ||
        !startTime ||
        !endTime ||
        !location ||
        !volunteerLimit
      ) {
        throw error(400, "Insufficient data");
      }

      const existingShift = await Shift.findOne({
        name,
        programId,
        startTime,
        endTime,
        location,
      });

      if (existingShift) {
        throw error(409, "Shift already exists");
      }

      const result = await Shift.create({
        name,
        programId,
        startTime,
        endTime,
        location,
        volunteerLimit,
      });
      res.status(201).json({ shift: result });
    } catch (err) {
      next(err);
    }
  });

// router
//   .route("/shifts/:shiftId/?")
//   .get((req, res, next) => {
//     const shiftId = req.params.shiftId;
//     const shift = shifts.find((shift) => shift.id == shiftId);

//     if (shift) {
//       res.json({ shift: shift });
//     } else next(error(404, "Shift not found"));
//   })
//   .put((req, res, next) => {
//     const shiftId = req.params.shiftId;
//     const existingShift = shifts.find((shift) => shift.id == shiftId);

//     if (existingShift) {
//       const name = req.body.name;
//       const program = req.body.program;
//       const startTime = req.body.startTime;
//       const endTime = req.body.endTime;
//       const location = req.body.location;
//       const volunteerLimit = req.body.volunteerLimit;

//       if (
//         name &&
//         program &&
//         startTime &&
//         endTime &&
//         location &&
//         volunteerLimit
//       ) {
//         const shift = {
//           name: name,
//           program: program,
//           startTime: startTime,
//           endTime: endTime,
//           location: location,
//           volunteerLimit: volunteerLimit,
//         };

//         shifts.shiftId = shift;

//         res.json({ shift: shift });
//       } else {
//         next(error(400, "Insufficient data"));
//       }
//     } else {
//       next(error(404, "Shift not found"));
//     }
//   })
//   .delete((req, res, next) => {
//     const id =

//     if () {

//     } else {
//       next(error(404, "Shift not found"));
//     }
//   });
