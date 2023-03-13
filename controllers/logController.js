const asyncHandler = require("express-async-handler");
const connectMongo = require("../db/dbUtility");
const moment = require("moment");
const { mongoose } = require("mongoose");
const ObjectId = require("mongoose").Types.ObjectId;

// import model and schema
const Exercise = require("../model/exerciseModel");
const User = require("../model/userModel");

// get Logs By User
const getLogsForUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  let fromDate = req.query.fromDate ? new Date(req.query.fromDate) : null;
  let toDate = req.query.toDate ? new Date(req.query.toDate) : null;
  let limitNum = req.query.limit ? req.query.limit : 0;

  // check if userId field is a valid Mongo ObjectId.
  if (!mongoose.Types.ObjectId.isValid(userId) || !userId) {
    res.status(400).type("text").send("User Id field cannot be a String or empty");
  }

  const username = await User.findById({ _id: userId });

  // build up the query string
  let query = { username: username.username };
  if (fromDate && toDate) {
    query.date = { $gte: fromDate, $lte: toDate };
  } else if (fromDate) {
    query.date = { $gte: fromDate };
  } else if (toDate) {
    query.date = { $lte: toDate };
  }

  if (username) {
    console.log(`logging username...${username.username}`);
    const exercises = await Exercise.find(query)
      .limit(limitNum)
      .then((exercises) => {
        const exerciseCount = exercises.length;
        console.log(`found ${exerciseCount} exercises for that user.`);
        const exerciseData = {
          username: username.username,
          count: exerciseCount,
          _id: userId,
          log: exercises.map((exercise) => ({
            description: exercise.description,
            duration: exercise.duration,
            date: moment(exercise.date, "ddd MMM DD YYYY").format(
              "ddd MMM DD YYYY"
            ),
          })),
        };
        console.log(`Found user exercises: ${exerciseData}`);
        res.status(200).json(exerciseData);
      })
      .catch((err) => {
        res.status(401);
        console.log("Could not find any exercises with that user.", err);
      });
  } else {
    res.status(404).type("txt").send("User Not Found");
    console.log("Could not find any users with that username.");
  }
});

module.exports = {
  getLogsForUser,
};

/**
 * TO DO:
 * 1. Query MongoDb for records between fromDte and toDte
 * 2. Limit the number of records based on the Limit query value.
 * 3. Filter exercise Log records between From Date & To Date.
 */
