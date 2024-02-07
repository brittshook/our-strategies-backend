const express = require("express");
const Shift = require("../models/shift.js");
const ShiftAssignment = require("../models/shiftAssignment.js");
const error = require("../utils/error.js");

const router = express.Router();

router
  .route("/?")
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

router
  .route("/:id/?")
  .get(async (req, res, next) => {
    try {
      const shiftId = req.params.id;
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
      const body = req.body;

      if (!body) {
        throw error(400, "Insufficient data");
      }

      const shift = await Shift.findById(shiftId);
      if (!shift) {
        throw error(404, "Shift not found");
      }

      let result;
      for (const key in body) {
        result = await Shift.findByIdAndUpdate(shiftId, {
          $set: { [key]: body[key] },
        });
      }

      res.json({ shift: result });
    } catch (err) {
      next(err);
    }
  })
  .delete(async (req, res, next) => {
    try {
      const shiftId = req.params.id;
      const result = await Shift.findByIdAndDelete(shiftId);

      if (result) {
        res.status(204);
      } else {
        throw error(404, "Shift not found");
      }
    } catch (err) {
      next(err);
    }
  });

router
  .get("/:id/users/?", async (req, res, next) => {
    try {
      const shiftId = req.params.id;
      const { startTime, endTime } = req.query;
      const query = { shiftId };

      if (startTime) {
        query.startTime = { $gte: startTime };
      }

      if (endTime) {
        query.endTime = { $lte: endTime };
      }

      const result = await ShiftAssignment.find(query)
        .populate("userId")
        .limit(1000);

      if (result) {
        res.json({ shifts: result });
      } else {
        throw error(400, "Shift not found");
      }
    } catch (err) {
      next(err);
    }
  })
  .post(async (req, res, next) => {
    try {
      const shiftId = req.params.id;
      const userId = req.body.userId;

      if (!userId) {
        throw error(400, "Insufficient data");
      }

      const result = await ShiftAssignment.create({ userId, shiftId });

      if (result) {
        res.status(201).json({ shiftAssignment: result });
      } else {
        throw error(404, "User not found");
      }
    } catch (err) {
      next(err);
    }
  });

router.delete("/:id/users/:userId/?", async (req, res, next) => {
  try {
    const shiftId = req.params.id;
    const userId = req.params.shiftId;

    if (!userId) {
      throw error(400, "Insufficient data");
    }

    const result = await ShiftAssignment.findOneAndDelete({ userId, shiftId });

    if (result) {
      res.status(204);
    } else {
      throw error(404, "User not found");
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
