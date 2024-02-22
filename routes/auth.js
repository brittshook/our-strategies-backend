const express = require("express");
const UserAuth = require("../models/userAuth");
const User = require("../models/user");
const { hashPassword, comparePassword } = require("../utils/auth");
const error = require("../utils/error");

const router = express.Router();

router.post("/register", async (req, res, next) => {
  try {
    const { userId, password } = req.body;

    const hashedPassword = await hashPassword(password);

    const userAuth = await UserAuth.create({ userId, hashedPassword });

    res.status(201).json({ userAuth: userAuth });
  } catch (err) {
    next(err);
  }
});

router.get("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    const userId = user._id;

    if (!user) {
      throw error(404, "User not found");
    }

    const userAuth = await UserAuth.findOne({ userId });

    const isPasswordMatch = await comparePassword(password, userAuth.hashedPassword);

    if (!isPasswordMatch) {
      throw error(401, "Invalid password");
    }

    res.json({ user: user });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
