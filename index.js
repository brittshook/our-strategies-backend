const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db/conn.js");

const users = require("./routes/users.js");
const admin = require("./routes/admin.js");
const shifts = require("./routes/shifts.js");
const programs = require("./routes/programs.js");
const map = require("./routes/map.js");
const profileImage = require("./routes/profileImage.js");

const error = require("./utils/error");

const app = express();
const port = 3000;

app.use(cors());

app.use(bodyParser.json({ extended: true }));

app.use("/api/users", users);
app.use("/api/admin", admin);
app.use("/api/shifts", shifts);
app.use("/api/programs", programs);
app.use("/api/map", map);
app.use("/api/profileImage", profileImage);

app.use((req, res, next) => {
  next(error(404, "Resource not found"));
});

app.use((err, req, res, next) => {
  if (!err.statusCode) {
    err.statusCode = 500;
  }
  if (err.statusCode >= 500) {
    console.log(err);
    err.message = "Internal server error";
  }
  res.status(err.statusCode).json({ error: err.message });
});

app.listen(port, () => console.log(`Server is listening on port: ${port}`));
