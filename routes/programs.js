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

router.delete("/programs/:id/?", async (req, res, next) => {
  try {
    const programId = req.params.id;

    if (!programId) {
      throw error(400, "Insufficient data");
    }

    const result = await Program.findByIdAndDelete(programId);

    if (result) {
      res.status(204);
    } else {
      throw error(404, "Program not found");
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
