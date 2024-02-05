const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const { DB_USER, DB_PASSWORD, DB_HOST, DB_DATABASE } = process.env;
const mongoURI = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_DATABASE}`;

const db = mongoose.connection;

mongoose.connect(mongoURI);

db.on("error", (err) => console.log(err.message, "is mongod not running?"));
db.on("open", () => console.log("mongod connected"));
db.on("close", () => console.log("mongod disconnected"));

module.exports = db;
