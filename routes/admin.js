const express = require("express");
const User = require("../models/user.js");
const error = require("../utils/error.js");

const router = express.Router();

router.patch("/approve/:id/?", async (req, res, next) => {
  try {
    const userId = req.params.id;
    const isApproved = req.body.approved;

    if (!userId || isApproved === undefined) {
      next(error(400, "Insufficient data"));
    }

    const status = isApproved ? "approved" : "denied";
    const result = await User.findByIdAndUpdate(userId, { $set: { status } });

    if (result) {
      res.json({ user: result });
    } else {
      next(error(404, "User not found"));
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
