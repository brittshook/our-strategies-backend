const express = require("express");
const mongoose = require("mongoose");
const Program = require("../models/program.js");
const error = require("../utils/error.js");

const router = express.Router();

router
  .route("/?")
  .get(async (req, res, next) => {
    try {
      let active = req.query.active;
      let query = {};

      if (active !== undefined) {
        active = Boolean(active);
        query.active = active;
      }

      res.json({ programs: await Program.find(query).limit(1000) });
    } catch (err) {
      next(err);
    }
  })
  .post(async (req, res, next) => {
    try {
      let { name, active } = req.body;

      if (active !== undefined) {
        active = Boolean(active);
      }

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

router
  .route("/:id/?")
  .get(async (req, res, next) => {
    try {
      const programId = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(programId)) {
        throw error(400, "Invalid program ID");
      }

      const result = await Program.findById(programId);

      if (result) {
        res.json({ program: result });
      } else {
        throw error(404, "Program not found");
      }
    } catch (err) {
      next(err);
    }
  })
  .patch(async (req, res, next) => {
    try {
      const programId = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(programId)) {
        throw error(400, "Invalid program ID");
      }

      const body = req.body;

      if (!body || !Object.keys(body).length) {
        throw error(400, "Insufficient data");
      }

      const program = await Program.findById(programId);
      if (!program) {
        throw error(404, "Program not found");
      }

      for (const key in body) {
        result = await Program.findByIdAndUpdate(programId, {
          $set: { [key]: body[key] },
        });
      }

      res.json({ program: await Program.findById(programId) });
    } catch (err) {
      next(err);
    }
  })
  .delete(async (req, res, next) => {
    try {
      const programId = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(programId)) {
        throw error(400, "Invalid program ID");
      }

      const result = await Program.findByIdAndDelete(programId);

      if (result) {
        res.status(204).json();
      } else {
        throw error(404, "Program not found");
      }
    } catch (err) {
      next(err);
    }
  });

module.exports = router;
