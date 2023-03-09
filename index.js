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

// Respond not found to all the wrong routes
// app.use(function (req, res, next) {
//   res.status(404);
//   res.type("txt").send("We are sorry, but that URL was Not found.");
// });

// Error Middleware
app.use(function (err, req, res, next) {
  if (err) {
    res
      .status(err.status || 500)
      .type("txt")
      .send(err.message || "SERVER ERROR");
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

module.exports = app;