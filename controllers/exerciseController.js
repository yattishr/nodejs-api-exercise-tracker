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

  // check if userId field is a valid Mongo ObjectId.
  // if(!mongoose.Types.ObjectId.isValid(userId) || !userId) {
  //     res.status(400).type("text").send('User Id field cannot be a String or empty');
  // }

  try {
    // get the username from the UserId.
    const username = await User.findById({ _id: userId });

    // check if date input is valid.
    const date = req.body.date ? moment(req.body.date) : moment();
    const formattedDate = date.format("ddd MMM DD YYYY");
    console.log(`logging formatted date: ${formattedDate}`);

    // create the exercise record
    if (username !== null && username !== undefined) {
      console.log(`found ${username} by ${userId}`);
      const exercise = await Exercise.create({
        username: username.username,
        description: req.body.description,
        duration: req.body.duration,
        date: formattedDate,
      });

      const exerciseData = {
        username: exercise.username,
        description: exercise.description,
        duration: exercise.duration,
        date: moment(exercise.date, "ddd MMM DD YYYY").format(
          "ddd MMM DD YYYY"
        ),
        id: exercise.id,
      };
      res.status(200).json(exerciseData);
      console.log(`Successfully created Exercise record: ${exercise}`);
    } else {
      res.status(401);
      console.log("Could not find that user.");
    }
  } catch (error) {
    res.status(500).send("Unable to complete request.");
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
