const express = require('express');
const app = express();
const { createUser, getUserById, getAllUsers, getServerMessage } = require('../controllers/userController');
const { createExercise, getExercisesByUser } = require('../controllers/exerciseController');
const { getLogsForUser } = require('../controllers/logController');

const router = express.Router();

//* /api/users/ POST Endpoint
router.post('/', (req, res, next) => {
    console.log(`logging username field userRoutes: ${req.body.username}`);
    if(!req.body.username) {
        res.status(400).send('Username cannot be blank.');
        return;
    } next();
}, createUser)


// old Get users By ID code.
// router.get('/:id', getUserById);

// updated Get users by ID code.
router.get('/:id', (req, res, next) => {
    if (!req.params.id) {
        res.status(400).send('Invalid user ID');
        return;
    }
    next();
}, getUserById);

router.get('/', getAllUsers);

//* /api/users/:id/exercises Endpoint.
router.post('/:id/exercises', (req, res, next) => {
    console.log(`logging input paramter: ${req.params.id}`)
    if (!req.params.id) {
        res.status(400).send('Invalid user ID');
        return;
    }
    next();
}, createExercise);

router.get('/:username/exercises', getExercisesByUser);

router.get('/:id/logs', getLogsForUser);

router.get('/hello', getServerMessage);

module.exports = router

/**
 * TO DO:
 * 1. Validate for invalid user-ids on Exercise form. 
 * 2. Ensure that user-id field CANNOT be blank or a string . It must ONLY be a valid object-id.
 */