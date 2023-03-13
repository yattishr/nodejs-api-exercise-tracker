const express = require("express");
const router = express.Router();
const app = express();
const cors = require("cors");
const moment = require("moment");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
const connectMongo = require("./db/dbUtility");
const dotenv = require("dotenv").config;
const userRoutes = require("./routes/userRoutes");

// configure dotenv path
require("dotenv").config({ path: path.resolve(__dirname, "./env") });

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// retrieve the connection status to Mongo
const connectionStatus = connectMongo();

// Users API endpoint.
app.use("/api/users", userRoutes);

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

module.exports = app;