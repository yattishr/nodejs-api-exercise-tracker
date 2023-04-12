const asyncHandler = require("express-async-handler");
const connectMongo = require("../db/dbUtility");
const moment = require("moment");
// Requiring ObjectId from mongoose npm package
const { mongoose } = require("mongoose");
const ObjectId = require("mongoose").Types.ObjectId;

// import model and schema
const Exercise = require("../model/exerciseModel");
const User = require("../model/userModel");

// route POST /api/users/:_id/exercises
const createExercise = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  console.log(`logging input paramter: ${req.params.id}`);
  try {
    // get the user from the UserId.
    const user = await User.findById({ _id: userId });

    // check if date input is valid.
    const date = req.body.date ? moment(req.body.date) : moment();
    const formattedDate = date.format("ddd MMM DD YYYY");
    console.log(`logging formatted date: ${formattedDate}`);

    // add the exercise to the user object
    if (user !== null && user !== undefined) {
      console.log(`found ${user.username} by ${userId}`);
      user.exercises.push({
        description: req.body.description,
        duration: req.body.duration,
        date: formattedDate,
      });
      await user.save();

      // OLD Code.
      // res.status(200).json({
      //   _id: user._id,
      //   username: user.username,
      //   exercises: user.exercises.map((exercise) => ({
      //     username: user.username,
      //     description: exercise.description,
      //     duration: exercise.duration,
      //     date: moment(exercise.date, "ddd MMM DD YYYY").format(
      //       "ddd MMM DD YYYY"
      //     ),
      //     _id: exercise._id,
      //   })),
      // });

      // NEW Code 10 Apr 2023.
      return res.status(200).json({
        _id: user._id,
        username: user.username,
        exercise: req.body.description,
        duration: parseInt(req.body.duration),
        date: formattedDate,
      });
      console.log(`Successfully updated User record: ${user}`);
    } else {
      return res.status(400).send("Username cannot be found");
      console.log("Username cannot be found");
    }
  } catch (error) {
    res.status(500).send(error.message, " : Unable to complete request.");
    return;
  }
});

// get All Exercises By User
const getExercisesByUser = asyncHandler(async (req, res) => {
  const exercise = await Exercise.find({ username: req.params.username });
  if (exercise !== null && exercise !== undefined) {
    res.status(200).json(exercise);
    console.log(`Found user exercises: ${exercise}`);
  } else {
    res.status(401);
    console.log("Could not find any exercises with that user.");
  }
});

module.exports = {
  createExercise,
  getExercisesByUser,
};

/**
 * TO DO:
 * 1. Fix date formatting. When saving & sending the dates from Exercises the date MUST be formatted as: "Mon Jan 01 1990" - DONE 23 Mar 2023
 * 2. Fix the Logs API endpoint to send back the data as requested from the USERS collection
 * 3. Logs API endpoint should include limit, from & to query parameters
 * 4. Add additional Test cases to the Exercises Jest - DONE 24 Mar 2023
 * 5. When sending User/Exercise object back; include the _id field in the response object - DONE 24 Mar 2023.
 */
