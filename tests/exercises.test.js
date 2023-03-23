// users.test.js
const express = require("express");
const request = require("supertest");
const http = require("http");
const app = require("../index");
const mongoose = require("mongoose");
const User = require("../model/userModel");
const connectMongo = require("../db/dbUtility");

// retrieve the connection status to Mongo
const connectionStatus = connectMongo();

let server;

describe("POST /api/users/:id/exercises", () => {
  // beforeAll(async () => {
  //   await User.deleteOne({ username: "testuser" });
  // });

  // afterAll(async () => {
  //   await User.deleteOne({ username: "testuser" });
  // });

  // Make a POST request to '/api/users'.
  it("should create a new user and add some exercises.", async () => {
    const exerciseArr = [];
    const newUser = { username: "testuser" };
    const res = await request(app).post("/api/users").send(newUser);
    const userid = res.body._id;
    console.log(`logging new user id: ${userid}`);

    // add exercises to the user with id userid
    const exercises = {
      description: "Exercise test 1",
      duration: 15,
      date: "2023-03-18"
    };

    // log exsercise object to console
    console.log(`logging exercise object: ${JSON.stringify(exercises)}`);

    // call POST endpoint to save Exercise
    const exerciseRes = await request(app)
      .post(`/api/users/${userid}/exercises`)
      .send(exercises);
      console.log(`logging body data: ${JSON.stringify(res.body)}`);
    expect(res.statusCode).toEqual(200);
    // expect(res.body[0]).toBeInstanceOf(Array);
  });
});

// GET User By Id from Db.
// describe('GET /api/users/:id', () => {
//     it('should return a user', async () => {
//       const res = await request(app).get("/api/users/6400b4f16a486dc94cea6b67");
//       console.log(`Found User...logging response: ${JSON.stringify(res.body)}`);
//       console.log(`logging res status code: ${res.status}`);
//       expect(res.statusCode).toEqual(200);
//       expect(res.body).toHaveProperty("username");
//       expect(res.body.username).toEqual("beatmaster");
//       expect(res.body).toHaveProperty("_id");
//       expect(res.body._id).toEqual("6400b4f16a486dc94cea6b67");
//     });

//     it('should return 400 if user is not found.', async () => {
//       const res = await request(app).get("/api/users/6400b4f16a486dc94cea6b68");
//       expect(res.statusCode).toEqual(400);
//       expect(res.text).toEqual("Username cannot be found");
//     });
//   });
