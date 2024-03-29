const express = require("express");
const mongoose = require("mongoose");
const Shift = require("../models/shift.js");
const ShiftAssignment = require("../models/shiftAssignment.js");
const error = require("../utils/error.js");

const router = express.Router();

router
  .route("/?")
  .get(async (req, res, next) => {
    try {
      const { startTime, endTime, programId } = req.query;
      const query = {};

      if (startTime) {
        query.startTime = { $gte: startTime };
      }

      if (endTime) {
        query.endTime = { $lte: endTime };
      }

      if (programId) {
        if (!mongoose.Types.ObjectId.isValid(programId)) {
          throw error(400, "Invalid program ID");
        }

        query.programId = programId;
      }

      res.json({ shifts: await Shift.find(query).limit(1000) });
    } catch (err) {
      next(err);
    }
  })
  .post(async (req, res, next) => {
    try {
      let { name, programId, startTime, endTime, location, volunteerLimit } =
        req.body;

      if (!mongoose.Types.ObjectId.isValid(programId)) {
        throw error(400, "Invalid program ID");
      }

      if (!location.hasOwnProperty("type")) {
        location.type = "Point";
      }

      if (!name || !programId || !startTime || !endTime || !location) {
        throw error(400, "Insufficient data");
      }

      startTime = Date(startTime);
      endTime = Date(endTime);

      const existingShift = await Shift.findOne({
        name,
        programId,
        startTime,
        endTime,
        location,
        volunteerLimit,
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

router
  .route("/:id/?")
  .get(async (req, res, next) => {
    try {
      const shiftId = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(shiftId)) {
        throw error(400, "Invalid shift ID");
      }

      const result = await Shift.findById(shiftId);

      if (result) {
        res.json({ shift: result });
      } else {
        throw error(404, "Shift not found");
      }
    } catch (err) {
      next(err);
    }
  })
  .patch(async (req, res, next) => {
    try {
      const shiftId = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(shiftId)) {
        throw error(400, "Invalid shift ID");
      }

      const body = req.body;

      if (!body || !Object.keys(body).length) {
        throw error(400, "Insufficient data");
      }

      const shift = await Shift.findById(shiftId);
      if (!shift) {
        throw error(404, "Shift not found");
      }

      for (const key in body) {
        await Shift.findByIdAndUpdate(shiftId, {
          $set: { [key]: body[key] },
        });
      }

      res.json({ shift: await Shift.findById(shiftId) });
    } catch (err) {
      next(err);
    }
  })
  .delete(async (req, res, next) => {
    try {
      const shiftId = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(shiftId)) {
        throw error(400, "Invalid shift ID");
      }

      const result = await Shift.findByIdAndDelete(shiftId);

      if (result) {
        res.status(204).json();
      } else {
        throw error(404, "Shift not found");
      }
    } catch (err) {
      next(err);
    }
  });

router
  .route("/:id/users/?")
  .get(async (req, res, next) => {
    try {
      const shiftId = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(shiftId)) {
        throw error(400, "Invalid shift ID");
      }

      const role = req.query.role;

      if (role && role.some((role) => !allowedRoles.includes(role))) {
        throw error(400, "Invalid role");
      }

      let query = { shiftId };

      if (role) {
        query.role = role;
      }

      const result = await ShiftAssignment.find(query)
        .populate("userId")
        .limit(1000);

      if (result) {
        res.json({ shiftAssignment: result });
      } else {
        throw error(404, "Shift not found");
      }
    } catch (err) {
      next(err);
    }
  })
  .post(async (req, res, next) => {
    try {
      const shiftId = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(shiftId)) {
        throw error(400, "Invalid shift ID");
      }

      const userId = req.body.userId;

      if (!userId) {
        throw error(400, "Insufficient data");
      } else if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw error(400, "Invalid user ID");
      }

      const existingShift = await ShiftAssignment.findOne({ userId, shiftId });
      if (existingShift) {
        throw error(409, "Shift assignment already exists");
      }

      const result = await ShiftAssignment.create({ userId, shiftId });

      if (result) {
        res.status(201).json({
          shiftAssignment: await ShiftAssignment.find({
            userId,
            shiftId,
          }).populate("userId"),
        });
      } else {
        throw error(404, "Shift or user not found");
      }
    } catch (err) {
      next(err);
    }
  });

router.delete("/:id/users/:userId/?", async (req, res, next) => {
  try {
    const shiftId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(shiftId)) {
      throw error(400, "Invalid shift ID");
    }

    const userId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw error(400, "Invalid user ID");
    }

    const result = await ShiftAssignment.findOneAndDelete({ userId, shiftId });

    if (result) {
      res.status(204).json();
    } else {
      throw error(404, "Shift assignment not found");
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
