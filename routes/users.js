const express = require("express");
const User = require("../models/user.js");
const Shift = require("../models/shift.js");
const error = require("../utils/error.js");

const router = express.Router();

router
  .route("/")
  .get(async (req, res, next) => {
    try {
      const status = req.query.status;
      const role = req.query.role;
      let query = {};

      if (status) {
        query.status = status;
      }

      if (role) {
        query.role = role;
      }

      res.json({ users: await User.find(query).limit(1000) });
    } catch (err) {
      next(err);
    }
  })
  .post(async (req, res, next) => {
    try {
      const { first, last, email, address, role } = req.body;

      if (!first || !last || !email || !address) {
        next(error(400, "Insufficient data"));
      }

      if (role && !["admin", "user", "owner"].includes(role)) {
        next(error(400, "Invalid role"));
      }

      const result = await User.create({
        firstName: first,
        lastName: last,
        email,
        address,
        role,
      });

      res.status(201).json({ user: result });
    } catch (err) {
      next(err);
    }
  });

router
  .route("/:id/?")
  .get(async (req, res, next) => {
    try {
      const userId = req.params.id;

      if (!userId) {
        next(error(400, "Insufficient data"));
      }

      const result = await User.findById(userId);

      if (result) {
        res.json({ user: result });
      } else {
        next(error(404, "User not found"));
      }
    } catch (err) {
      next(err);
    }
  })
  .patch(async (req, res, next) => {
    try {
      const userId = req.params.id;
      const body = req.body;

      if (!userId || !body) {
        next(error(400, "Insufficient data"));
      }

      const user = await User.findById(userId);
      if (!user) {
        throw error(404, "User not found");
      }

      let result;
      for (const key in body) {
        result = await User.findByIdAndUpdate(userId, {
          $set: { [key]: body[key] },
        });
      }

      res.json({ user: result });
    } catch (err) {
      next(err);
    }
  })
  .delete(async (req, res, next) => {
    try {
      const userId = req.params.id;

      if (!userId) {
        next(error(400, "Insufficient data"));
      }

      const result = await User.findByIdAndDelete(userId);

      if (result) {
        res.status(204).json();
      } else {
        next(error(404, "User not found"));
      }
    } catch (err) {
      next(err);
    }
  });

// router
//   .route("/:userId/shifts/?")
//   .get((req, res, next) => {
//     const userId = req.params.userId;
//     const startTime = req.query.startTime;
//     const endTime = req.query.endTime;
//     const user = users.find((user) => user.id == userId);

//     if (user) {
//       if (user.shifts) {
//         if (startTime && endTime) {
//           const filteredShifts = user.shifts.filter((shift) => {
//             return shift.startTime >= startTime && shift.endTime <= endTime;
//           });
//           res.json({ shifts: filteredShifts });
//         } else if (startTime || endTime) {
//           next(
//             error(
//               400,
//               "To filter by time range, both start time and end time must be provided"
//             )
//           );
//         } else {
//           res.json({ shifts: user.shifts });
//         }
//       } else {
//         next(error(404, "No shifts found"));
//       }
//     } else {
//       next();
//     }
//   })
//   .post((req, res, next) => {
//     const userId = req.params.userId;
//     const user = users.find((user) => user.id == userId);

//     if (user) {
//       const shiftId = req.body.shiftId;
//       const shift = shifts.find((shift) => shift.id == shiftId);

//       if (shift) {
//         if (!user.hasOwnProperty("shifts")) {
//           user.shifts = [];
//         }
//         user.shifts.push(shift);
//         res.json({ shifts: user.shifts });
//       } else {
//         next(error(404, "Shift not found"));
//       }
//     } else {
//       next(error(404, "User not found"));
//     }
//   });

// router.delete("/:userId/shifts/:shiftId/?", (req, res, next) => {
//   const userId = req.params.userId;
//   const user = users.find((user) => user.id == userId);

//   if (user) {
//     const shiftIndex = user.shifts.findIndex(
//       (shift) => shift.id == req.params.shiftId
//     );

//     if (shiftIndex != -1) {
//       user.shifts.splice(shiftIndex, 1);
//       res.status(204).end();
//     } else {
//       next(error(404, "Shift not found"));
//     }
//   }
// });

// module.exports = router;
