// logs.test.js
const express = require("express");
const request = require("supertest");
const http = require("http");
const app = require("../index");
const mongoose = require("mongoose");
const User = require("../model/userModel");
const connectMongo = require("../db/dbUtility");

// retrieve the connection status to Mongo
const connectionStatus = connectMongo();

describe("GET /api/users/:id/logs", () => {
    // GET logs data from an invalid User id.
    it("should return 400 when the user id is not found", async() => {
        const response = await request(app).get("/api/users/6421bee3031f3b0033fc99ec/logs");
        expect(response.statusCode).toEqual(400);
        expect(response.text).toEqual("User was not found");
    });

    // GET logs data where Exercise Date >= from date.
    it("should return logs where Exercise Date >= from date", async() => {
        const response = await request(app).get("/api/users/6421bee3031f3b0033fc44ec/logs?from='2023-03-01'");
        console.log(`logging response object: ${JSON.stringify(response.body.exercises)}`);
        expect(response.statusCode).toEqual(200);
        expect(response.body).toHaveProperty("_id")
        expect(response.body._id).toEqual("6421bee3031f3b0033fc44ec");            
        expect(response.body.username).toEqual("testuser11");
        expect(response.body).toHaveProperty("count");
        expect(response.body.count).toEqual(8);
        expect(response.body.log).toHaveLength(2);
    });


    // GET logs data where Exercise Date >= from date.
    it("should return logs where Exercise Date <= to date", async() => {
        const response = await request(app).get("/api/users/6421bee3031f3b0033fc44ec/logs?to='2023-03-06'");
        console.log(`logging response object: ${JSON.stringify(response.body.exercises)}`);
        expect(response.statusCode).toEqual(200);
        expect(response.body).toHaveProperty("_id")
        expect(response.body._id).toEqual("6421bee3031f3b0033fc44ec");            
        expect(response.body.username).toEqual("testuser11");
        expect(response.body).toHaveProperty("count");
        expect(response.body.count).toEqual(8);
        expect(response.body.log).toHaveLength(7);
    });


     // GET logs data where Exercise Date >= from date && <= to date.
     it("should return logs where Exercise Date >= from date && <= to date", async() => {
        const response = await request(app).get("/api/users/6421bee3031f3b0033fc44ec/logs?from='2023-02-01'&to='2023-02-21'");
        console.log(`logging response object: ${JSON.stringify(response.body.exercises)}`);
        expect(response.statusCode).toEqual(200);
        expect(response.body).toHaveProperty("_id")
        expect(response.body._id).toEqual("6421bee3031f3b0033fc44ec");            
        expect(response.body.username).toEqual("testuser11");
        expect(response.body).toHaveProperty("count");
        expect(response.body.count).toEqual(8);
        expect(response.body.log).toHaveLength(6);
    });

      // GET logs data where Exercise Date >= from date && <= to date.
      it("should return logs where limit = 3", async() => {
        const response = await request(app).get("/api/users/6421bee3031f3b0033fc44ec/logs?limit=3");
        console.log(`logging response object: ${JSON.stringify(response.body.exercises)}`);
        expect(response.statusCode).toEqual(200);
        expect(response.body).toHaveProperty("_id")
        expect(response.body._id).toEqual("6421bee3031f3b0033fc44ec");            
        expect(response.body.username).toEqual("testuser11");
        expect(response.body).toHaveProperty("count");
        expect(response.body.count).toEqual(8);
        expect(response.body.log).toHaveLength(3);
    });

});