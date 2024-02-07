const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/user.js");
const ShiftAssignment = require("../models/shiftAssignment.js");
const error = require("../utils/error.js");

const router = express.Router();

router
  .route("/?")
  .get(async (req, res, next) => {
    try {
      const { status, role } = req.query;
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
        throw error(400, "Insufficient data");
      }

      const allowedRoles = ["owner", "admin", "volunteer"];

      if (role && role.some((role) => !allowedRoles.includes(role))) {
        throw error(400, "Invalid role");
      }

      const result = await User.create({
        first,
        last,
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

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw error(400, "Invalid user ID");
      }

      const result = await User.findById(userId);

      if (result) {
        res.json({ user: result });
      } else {
        throw error(404, "User not found");
      }
    } catch (err) {
      next(err);
    }
  })
  .patch(async (req, res, next) => {
    try {
      const userId = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw error(400, "Invalid user ID");
      }

      const body = req.body;

      if (!body || !Object.keys(body).length) {
        throw error(400, "Insufficient data");
      }

      const user = await User.findById(userId);
      if (!user) {
        throw error(404, "User not found");
      }

      for (const key in body) {
        await User.findByIdAndUpdate(userId, {
          $set: { [key]: body[key] },
        });
      }

      res.json({ user: await User.findById(userId) });
    } catch (err) {
      next(err);
    }
  })
  .delete(async (req, res, next) => {
    try {
      const userId = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw error(400, "Invalid user ID");
      }

      const result = await User.findByIdAndDelete(userId);

      if (result) {
        res.status(204).json();
      } else {
        throw error(404, "User not found");
      }
    } catch (err) {
      next(err);
    }
  });

router
  .route("/:id/shifts/?")
  .get(async (req, res, next) => {
    try {
      const userId = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw error(400, "Invalid user ID");
      }

      const { startTime, endTime } = req.query;
      const query = { userId };

      if (startTime) {
        query.startTime = { $gte: startTime };
      }

      if (endTime) {
        query.endTime = { $lte: endTime };
      }

      const result = await ShiftAssignment.find(query)
        .populate("shiftId")
        .limit(1000);

      if (result) {
        res.json({ shifts: result });
      } else {
        throw error(404, "User not found");
      }
    } catch (err) {
      next(err);
    }
  })
  .post(async (req, res, next) => {
    try {
      const userId = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw error(400, "Invalid user ID");
      }

      const shiftId = req.body.shiftId;

      if (!shiftId) {
        throw error(400, "Insufficient data");
      } else if (!mongoose.Types.ObjectId.isValid(shiftId)) {
        throw error(400, "Invalid shift ID");
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
          }).populate("shiftId"),
        });
      } else {
        throw error(404, "User or shift not found");
      }
    } catch (err) {
      next(err);
    }
  });

router.delete("/:id/shifts/:shiftId/?", async (req, res, next) => {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw error(400, "Invalid user ID");
    }

    const shiftId = req.params.shiftId;

    if (!mongoose.Types.ObjectId.isValid(shiftId)) {
      throw error(400, "Invalid shift ID");
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
