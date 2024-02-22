const express = require("express");
const error = require("../utils/error.js");
const {
  lookupNameAndAddressFromCoordinates,
  lookupCoordinatesAndNameFromAddress,
  lookupCoordinatesAndAddressFromName,
} = require("../utils/mapboxAPI.js");
const dotenv = require("dotenv");

dotenv.config();
const { MAPBOX_API_KEY } = process.env;

const router = express.Router();

router.get("/token/?", (req, res, next) => {
  try {
    res.json({ token: MAPBOX_API_KEY });
  } catch (err) {
    next(err);
  }
});

router.get("/lookup/reverse/?", async (req, res, next) => {
  try {
    const latitude = parseFloat(req.query.latitude);
    const longitude = parseFloat(req.query.longitude);

    if (
      isNaN(latitude) ||
      isNaN(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      throw error(400, "Invalid coordinates");
    }
    
    if (!latitude || !longitude) {
      throw error(400, "Insufficient data");
    }

    const result = await lookupNameAndAddressFromCoordinates(
        latitude,
        longitude,
        MAPBOX_API_KEY
      );

    if (result) {
      res.json({ location: result });
    } else {
      throw error(404, "Location not found");
    }
  } catch (err) {
    next(err);
  }
});

router.get("/lookup/forward/?", async (req, res, next) => {
  try {
    const name = req.query.name;
    const streetAddress = req.query.streetAddress;

    if (!name && !streetAddress) {
      throw error(400, "Insufficient data");
    }

    let result;

    if (streetAddress) {
      result = await lookupCoordinatesAndNameFromAddress(
        streetAddress,
        MAPBOX_API_KEY
      );
    } else if (name) {
      result = await lookupCoordinatesAndAddressFromName(name, MAPBOX_API_KEY);
    }

    if (result) {
      res.json({ location: result });
    } else {
      throw error(404, "Location not found");
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
