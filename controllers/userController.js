const asyncHandler = require('express-async-handler');
const connectMongo = require("../db/dbUtility");
const { mongoose } = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;

// import model and schema
const User = require('../model/userModel');

// route get server message. "hello API"
const getServerMessage = asyncHandler(async (req, res) => {
    res.json({ greeting: "hello API" });
})

// route POST /api/user
const createUser = asyncHandler(async (req, res) => {
    // console.log(`logging DB connection status ${connectionStatus}`);
    const username = req.body.username;
    console.log(`logging username: ${username}`);
    if(!username) {
        res.status(400).type("text").send('Username cannot be blank')
    }

    // check if user already exists
    const userExists = await User.findOne({ username })
    if(userExists) {
        res.status(400).type("text").send(`${username} already exists`)
    }

    const user = await User.create({
        username
    })
    console.log(`logging new user...${user}`);

    if(user) {
        res.status(200).json({
            username: username,
            id: user._id
        })
    } else {
        res.status(400).type("text").send('Username data is not valid.');
    }
})

// route GET /api/user/:id
const getUserById = asyncHandler(async (req, res) => {
    const userId = req.params.id

    // check if userId field is a valid Mongo ObjectId.
    if(!mongoose.Types.ObjectId.isValid(userId) || !userId) {
        res.status(400).type("text").send("Invalid User Id field. User Id field cannot be a String or empty");        
    }

    // find User with id
    const user = await User.findById({_id: userId});
    if(user !== null && user !== undefined) {
        res.status(200).json(user);
    } else {
        res.status(400).type("text").send("Username cannot be found");
    }
})

const getAllUsers = asyncHandler(async(req, res) => {
    const users = await User.find();
    if(users) {
        res.status(200).json(users);
    } else {
        res.status(400);
    }
})

module.exports = {
    getServerMessage,
    createUser,
    getUserById,
    getAllUsers,
}