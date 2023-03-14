// users.test.js
const express = require("express");
const request = require('supertest');
const http = require("http");
const app = require("../index");
const mongoose = require('mongoose');
const User = require('../model/userModel');
const connectMongo = require("../db/dbUtility");

// retrieve the connection status to Mongo
const connectionStatus = connectMongo();

let server;

describe("POST /users", () => {
  beforeAll(async () => {
    await User.deleteOne({ username: "testuser" });
  });
  
  afterAll(async () => {
    await User.deleteOne({ username: "testuser" });
  });

   // Make a POST request to '/api/users' with empty username.
   it("should create a new user with empty username. Return 400 when username is empty", async () => {
    const newUser = { username: "" };
    const res = await request(app).post("/api/users").send(newUser);
    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual('Username cannot be blank');
  });
  
  
  // Make a POST request to '/api/users'.
  it("should create a new user and return a JSON object with the username and id properties", async () => {
    const newUser = { username: "testuser" };
    const res = await request(app).post("/api/users").send(newUser);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("username", newUser.username);
    expect(res.body).toHaveProperty("_id");
  });
});

// GET all users from Db.
describe('GET /users', () => {
  beforeAll(async () => {
    // create a test user in the database
    const newUser = { username: "testuser" };
    await User.create(newUser);
  });

  afterAll(async () => {
    // delete the test user from the database
    await User.deleteOne({ username: "testuser" });
  });

  it('should return an Array of users', async () => {
    const res = await request(app).get("/api/users");
    console.log(`logging res status code: ${res.status}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body[0]).toHaveProperty('username');
  });
});

// GET User By Id from Db.
describe('GET /api/users/:id', () => {
    it('should return a user', async () => {
      const res = await request(app).get("/api/users/6400b4f16a486dc94cea6b67");
      console.log(`Found User...logging response: ${JSON.stringify(res.body)}`);
      console.log(`logging res status code: ${res.status}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("username");
      expect(res.body.username).toEqual("beatmaster");
      expect(res.body).toHaveProperty("_id");
      expect(res.body._id).toEqual("6400b4f16a486dc94cea6b67");
    });
  
    it('should return 400 if user is not found.', async () => {
      const res = await request(app).get("/api/users/6400b4f16a486dc94cea6b68");
      expect(res.statusCode).toEqual(400);
      expect(res.text).toEqual("Username cannot be found");
    });  
  });