const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db/conn.js");

const users = require("./routes/users.js");
const admin = require("./routes/admin.js");
const shifts = require("./routes/shifts.js");
const programs = require("./routes/programs.js");

const error = require("./utils/error");

const app = express();
const port = 3000;

app.use(cors());

app.use(bodyParser.json({ extended: true }));

app.use("/api/users", users);
app.use("/api/admin", admin);
app.use("/api/shifts", shifts);
app.use("/api/programs", programs);

app.use((req, res, next) => {
  next(error(404, "Resource not found"));
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ error: err.message });
});

app.listen(port, () => console.log(`Server is listening on port: ${port}`));
