// exercises.test.js
const express = require("express");
const request = require("supertest");
const http = require("http");
const app = require("../index");
const mongoose = require("mongoose");
const User = require("../model/userModel");
const connectMongo = require("../db/dbUtility");

// retrieve the connection status to Mongo
const connectionStatus = connectMongo();

describe("POST /api/users/:id/exercises", () => {
  afterAll(async () => {
    await User.deleteOne({ username: "testuser11" });
    await User.deleteOne({ username: "testuser12" });
    await User.deleteOne({ username: "testuser13" });    
  });

  // Make a POST request to '/api/users'.
  it("should create a new user and add some exercises.", async () => {
    const newUser = { username: "testuser11" };
    const res = await request(app).post("/api/users").send(newUser);
    const userid = res.body._id;
    console.log(`logging new user id: ${userid}`);

    // add exercises to the user with id userid
    const exercises = {
      description: "Exercise test 1",
      duration: 15,
      date: "2023-03-18",
    };

    // log exsercise object to console
    console.log(`logging exercise object: ${JSON.stringify(exercises)}`);

    // call POST endpoint to save Exercise
    const response = await request(app)
      .post(`/api/users/${userid}/exercises`)
      .send(exercises);
    console.log(
      `logging body data: ${JSON.stringify(response.body.exercises)}`
    );
    expect(response.statusCode).toEqual(200);
    expect(response.body).toHaveProperty("_id");
    expect(response.body.exercises).toHaveLength(1);
    expect(response.body.exercises).toBeInstanceOf(Array);
    expect(response.body.exercises[0]).toHaveProperty("_id");
    expect(response.body.exercises[0]).toHaveProperty("description");
  });

  // test for blank description input.
  it("should add some exercises with empty exercise description.", async () => {
    const newUser = { username: "testuser12" };
    const res = await request(app).post("/api/users").send(newUser);
    const userid = res.body._id;
    console.log(`logging new user id: ${userid}`);

    const exercises = {
      description: "",
      duration: 15,
      date: "2023-03-27",
    };

    const response = await request(app)
      .post(`/api/users/${userid}/exercises`)
      .send(exercises);
    expect(response.statusCode).toEqual(500);
  });

  // test for alphanumeric duration value.
  it("should add some exercises with an alphanumeric duration value.", async () => {
    const newUser = { username: "testuser13" };
    const res = await request(app).post("/api/users").send(newUser);
    const userid = res.body._id;
    console.log(`logging new user id: ${userid}`);

    const exercises = {
      description: "test exercise 13",
      duration: "ABC",
      date: "2023-03-27",
    };

    const response = await request(app)
      .post(`/api/users/${userid}/exercises`)
      .send(exercises);
    expect(response.statusCode).toEqual(500);
  });

  it("should return a 400 message when a user is not found.", async () => {
    const exercises = {
      description: "test exercise 13",
      duration: 30,
      date: "2023-03-27",
    };

    const response = await request(app)
      .post(`/api/users/641c47785a9e23e0fe17111f/exercises`)
      .send(exercises);
    expect(response.statusCode).toEqual(400);
    expect(response.text).toEqual("Username cannot be found");
  });
});
