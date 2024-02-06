const express = require("express");
const Program = require("../models/program.js");
const error = require("../utils/error.js");

const router = express.Router();

router
  .route("/programs/?")
  .get(async (req, res, next) => {
    try {
      const active = req.query.active;
      let query = {};

      if (active !== undefined) {
        query.active = active;
      }

      res.json({ programs: await Program.find(query).limit(1000) });
    } catch (err) {
      next(err);
    }
  })
  .post(async (req, res, next) => {
    try {
      const { name, active } = req.body;

      if (!name) {
        throw error(400, "Insufficient data");
      }

      const existingProgram = await Program.findOne({ name });

      if (existingProgram) {
        throw error(409, "Program already exists");
      }

      const result = await Program.create({ name, active });
      res.status(201).json({ program: result });
    } catch (err) {
      next(err);
    }
  });

// router.delete("/programs/:programId/?", (req, res, next) => {
//   const programIndex = programs.findIndex(
//     (program) => program.id == req.params.programId
//   );

//   if (programIndex != -1) {
//     programs.splice(programIndex, 1);
//     res.status(204).end();
//   } else {
//     next(error(404, "Program not found"));
//   }
// });

// router
//   .route("/shifts/?")
//   .get((req, res, next) => {
//     res.json({ shifts: shifts });
//   })
//   .post((req, res, next) => {
//     const name = req.body.name;
//     const program = req.body.program;
//     const startTime = req.body.startTime;
//     const endTime = req.body.endTime;
//     const location = req.body.location;
//     const volunteerLimit = req.body.volunteerLimit;

//     if (name && program && startTime && endTime && volunteerLimit) {
//       if (
//         shifts.find(
//           (shift) =>
//             shift.name == name &&
//             shift.program == program &&
//             shift.startTime == startTime &&
//             shift.endTime == endTime &&
//             shift.location == location
//         )
//       ) {
//         next(error(409, "Shift already exists"));
//       }

//       const shift = {
//         name: name,
//         program: program,
//         startTime: startTime,
//         endTime: endTime,
//         location: location,
//         volunteerLimit: volunteerLimit,
//       };

//       shifts.push(shift);
//       res.json({ shift: shift });
//     } else {
//       next(error(400, "Insufficient data"));
//     }
//   });

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

// module.exports = router;
