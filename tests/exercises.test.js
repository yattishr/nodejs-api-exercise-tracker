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
  beforeAll(async () => {
    await User.deleteOne({ username: "testuser11" });
  });

  afterAll(async () => {
    await User.deleteOne({ username: "testuser11" });
  });

  // Make a POST request to '/api/users'.
  it("should create a new user and add some exercises.", async () => {
    const exerciseArr = [];
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
    console.log(`body object is of type: ${typeof response.body.exercises}`);
    expect(response.statusCode).toEqual(200);
    expect(response.body).toHaveProperty("_id");
    expect(response.body.exercises).toHaveLength(1);
    expect(response.body.exercises).toBeInstanceOf(Array);
    expect(response.body.exercises[0]).toHaveProperty("_id");
    expect(response.body.exercises[0]).toHaveProperty("description");
  });
});