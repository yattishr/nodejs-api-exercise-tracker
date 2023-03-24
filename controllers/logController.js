const asyncHandler = require("express-async-handler");
const connectMongo = require("../db/dbUtility");
const moment = require("moment");
const { mongoose } = require("mongoose");
const ObjectId = require("mongoose").Types.ObjectId;

// import model and schema
const Exercise = require("../model/exerciseModel");
const User = require("../model/userModel");

// get Logs By User
const getLogsByUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  let fromDate = req.query.fromDate ? new Date(req.query.fromDate) : null;
  let toDate = req.query.toDate ? new Date(req.query.toDate) : null;
  let limitNum = req.query.limit ? req.query.limit : 0;

  try {
    const logs = await User.find({ _id: userId })
      .limit(limitNum)
      .then((logs) => {
        const exerciseCount = logs.length;
        console.log(
          `found ${exerciseCount} exercises for that user ${logs.username}.`
        );
        const exerciseData = {
          username: username,
          count: exerciseCount,
          _id: userId,
          log: logs.map((log) => ({
            description: log.description,
            duration: log.duration,
            date: moment(log.date, "ddd MMM DD YYYY").format("ddd MMM DD YYYY"),
          })),
        };
        console.log(`Found user exercises: ${exerciseData}`);
        res.status(200).json(exerciseData);
      });
  } catch (error) {
    res.status(500).send("Could not compete request");
    console.log("Could not compete request ", error.message);
  }
});

// get Logs By User (updated)
const getLogsForUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  let fromDate = req.query.from ? new Date(req.query.from) : null;
  let toDate = req.query.to ? new Date(req.query.to) : null;
  let limitNum = req.query.limit ? req.query.limit : 0;

  // find the username from the userId.
  const user = await User.findById({ _id: userId });

  try {
    const exerciseCount = user.exercises.length;
    console.log(`found ${exerciseCount} exercises for that user.`);
    console.log(`logging user data: ${user.exercises}`);

    // build up the query string
    let query = { username: user.username };
    if (fromDate && toDate) {
      query.date = { $gte: fromDate, $lte: toDate };
    } else if (fromDate) {
      query.date = { $gte: fromDate };
    } else if (toDate) {
      query.date = { $lte: toDate };
    }
    console.log(`logging query data: ${JSON.stringify(query)}`);
    console.log(`logging username...${user.username}`);    
    res.status(200).json({
      _id: user._id,
      username: user.username,
      exercises: user.exercises.map((exercise) => ({
        description: exercise.description,
        duration: exercise.duration,
        date: moment(exercise.date, "ddd MMM DD YYYY").format(
          "ddd MMM DD YYYY"
        ),
      })),
    });
  } catch (error) {
    res
      .status(404)
      .type("txt")
      .send("Could not find any users with that User Id");
  }
});

module.exports = {
  getLogsForUser,
  getLogsByUser,
};

/**
 * TO DO:
 * 1. Fix date formatting. When saving & sending the dates from Exercises the date MUST be formatted as: "Mon Jan 01 1990" - DONE 23 Mar 2023
 * 2. Fix the Logs API endpoint to send back the data as requested from the USERS collection
 * 3. Logs API endpoint should include limit, from & to query parameters
 * 4. Add additional Test cases to the Exercises Jest
 */