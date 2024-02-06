import express from "express";
import User from "../models/user.js";
import error from "../utils/error.js";

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

    if (!result || result.acknowledged === false) {
      next(error(404, "User not found"));
    }

    const user = await User.findById(userId);
    res.json({ user });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
