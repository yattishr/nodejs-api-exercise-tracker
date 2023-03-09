const mongoose = require("mongoose");
require('dotenv').config()
const uri = process.env['MONGO_URI'];

// connect to MongoDb
async function connectMongo() {
    try {
      await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Successfully connected to MongoDB!");
      return true;
    } catch (error) {
      console.log(`Error connecting to MongoDB: ${error}`);
      return false;
    }
}

module.exports = connectMongo;