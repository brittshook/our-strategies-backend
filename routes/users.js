const express = require("express");
const User = require("../models/user.js");
const Shift = require("../models/shift.js");
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
      const { firstName, lastName, email, address, role } = req.body;

      if (!firstName || !lastName || !email || !address) {
        throw error(400, "Insufficient data");
      }

      if (role && !["admin", "user", "owner"].includes(role)) {
        throw error(400, "Invalid role");
      }

      const result = await User.create({
        firstName,
        lastName,
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
        throw error(400, "Insufficient data");
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
      const body = req.body;

      if (!userId || !body) {
        throw error(400, "Insufficient data");
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
        throw error(400, "Insufficient data");
      }

      const result = await User.findByIdAndDelete(userId);

      if (result) {
        res.status(204);
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

      if (!userId) {
        throw error(400, "Insufficient data");
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
        throw error(400, "User not found");
      }
    } catch (err) {
      next(err);
    }
  })
  .post(async (req, res, next) => {
    try {
      const userId = req.params.id;
      const shiftId = req.body.shiftId;

      if (!userId || !shiftId) {
        throw error(400, "Insufficient data");
      }

      const result = await ShiftAssignment.create({ userId, shiftId });

      if (result) {
        res.status(201).json({ shiftAssignment: result });
      } else {
        throw error(404, "Shift not found");
      }
    } catch (err) {
      next(err);
    }
  });

router.delete("/:id/shifts/:shiftId/?", async (req, res, next) => {
  try {
    const userId = req.params.id;
    const shiftId = req.params.shiftId;

    if (!userId || !shiftId) {
      throw error(400, "Insufficient data");
    }

    const result = await ShiftAssignment.findOneAndDelete({ userId, shiftId });

    if (result) {
      res.status(204);
    } else {
      throw error(404, "Shift not found");
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
