const asyncHandler = require("express-async-handler");
const connectMongo = require("../db/dbUtility");
const moment = require("moment");
const { mongoose } = require("mongoose");
const ObjectId = require("mongoose").Types.ObjectId;

// import model and schema
const Exercise = require("../model/exerciseModel");
const User = require("../model/userModel");

// get Logs By User - Old Code.
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

// get Logs For User (updated) 03 Apr 2023
const getLogsForUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  let fromDate = req.query.from ? new Date(req.query.from) : null;
  let toDate = req.query.to ? new Date(req.query.to) : null;
  let limitNum = req.query.limit ? req.query.limit : 0;

  // find the username from the userId return status 400 if user was not found.
  const user = await User.findById({ _id: userId });
  if (user == null || user == undefined) {
    res.status(400).send("User was not found.");
    return;
  }

  try {
    const exerciseCount = user.exercises.length;

    // Array to store user exercise data.
    const exerciseArr = user.exercises;
    console.log(`logging user exercise Array: ${exerciseArr}`);

    // Counter for user exercises.
    console.log(`found ${exerciseCount} exercises for that user.`);

    // filter the exerciseArr based on from and to Date query params.
    if (fromDate && toDate) {
      filteredExercises = exerciseArr.filter((exercise) => {
        const exerciseDate = new Date(exercise.date);
        return exerciseDate >= fromDate && exerciseDate <= toDate;
      });
    } else if (fromDate) {
      filteredExercises = exerciseArr.filter((exercise) => {
        const exerciseDate = new Date(exercise.date);
        return exerciseDate >= fromDate;
      });
    } else if (toDate) {
      filteredExercises = exerciseArr.filter((exercise) => {
        const exerciseDate = new Date(exercise.date);
        return exerciseDate <= toDate;
      });
    } else {
      // return the original array if no from & to dates are specified.
      filteredExercises = [...exerciseArr];
    }

    console.log(`logging filteredExercises: ${filteredExercises}`);

    // check if a limit value is specified in the query string
    if (limitNum > 0) {
      limitedArray = filteredExercises.slice(0, limitNum);
    } else {
      // we copy the filteredExercises array to limitedArray
      limitedArray = [...filteredExercises];
    }

    // send back the results in JSON
    res.status(200).json({
      username: user.username,
      count: exerciseCount,
      _id: user._id,
      log: limitedArray.map((exercise) => ({
        description: exercise.description,
        duration: exercise.duration,
        date: moment(exercise.date, "ddd MMM DD YYYY").format(
          "ddd MMM DD YYYY"
        ),
      })),
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});

module.exports = {
  getLogsForUser,
  getLogsByUser,
};

/**
 * TO DO:
 * 1. Fix date formatting. When saving & sending the dates from Exercises the date MUST be formatted as: "Mon Jan 01 1990" - DONE 23 Mar 2023
 * 2. Fix the Logs API endpoint to send back the data as requested from the USERS collection - DONE 27 mar 2023
 * 3. Logs API endpoint should include limit, from & to query parameters
 * 4. Add additional Test cases to the Exercises Jest - DONE 27 Mar 2023
 * 5. When searching through the User Logs Filter through Exercises Array to search for:
 *    From date - DONE 03 Apr 2023
 *    To Date - DONE 03 Apr 2023
 *    Limit number - DONE 03 Apr 2023
 * 6. Make sure to convert the Dates from YYYY-MM-DD back to ddd MMM DD YYYY when performing the Filter - DONE 03 Apr 2023.
 */
