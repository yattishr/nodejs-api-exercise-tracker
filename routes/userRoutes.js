const express = require('express');
const app = express();
const { createUser, getUserById, getAllUsers, getServerMessage } = require('../controllers/userController');
const { createExercise, getExercisesByUser } = require('../controllers/exerciseController');
const { getLogsForUser, getLogsByUser } = require('../controllers/logController');

const router = express.Router();

// POST "/" createUSer
router.post("/", createUser);

// GET getUserById
router.get("/:id", getUserById);

// GET getAllUsers
router.get("/", getAllUsers);

// POST createExercise '/api/users/:id/exercises'
router.post('/:id/exercises', createExercise)

// GET getExercisesByUser '/:username/exercises'
router.get('/:username/exercises', getExercisesByUser);

// GET getLogsForUser '/:id/logs'
router.get('/:id/logs', getLogsByUser);

router.get('/hello', getServerMessage);

module.exports = router

/**
 * TO DO:
 * 1. Validate for invalid user-ids on Exercise form. 
 * 2. Ensure that user-id field CANNOT be blank or a string . It must ONLY be a valid object-id.
 */