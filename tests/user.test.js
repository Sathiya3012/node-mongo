import request from "supertest";
import app from "../index.js";
import User from "../model/userModel.js";
import mongoose from "mongoose";

jest.mock("../model/userModel.js");

jest.mock("mongoose", () => {
  const actualMongoose = jest.requireActual("mongoose");
  return {
    ...actualMongoose,
    connect: jest.fn().mockResolvedValue(true),
    disconnect: jest.fn().mockResolvedValue(true),
    connection: { readyState: 1 },
  };
});


describe("User API Tests with Mock Data", () => {
  
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/user/create", () => {
    it("should create a new user", async () => {
      User.findOne.mockResolvedValue(null);
      User.prototype.save = jest.fn().mockResolvedValue({
        _id: "mockedId123",
        name: "John Doe",
        email: "john@example.com",
      });

      const userData = { name: "John Doe", email: "john@example.com" };
      const res = await request(app).post("/api/user/create").send(userData);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("_id", "mockedId123");
      expect(res.body).toHaveProperty("name", "John Doe");
      expect(res.body).toHaveProperty("email", "john@example.com");
    });
  });

  describe("GET /api/user/getallusers", () => {
    it("should fetch all users", async () => {
      User.find.mockResolvedValue([
        { _id: "mockedId1", name: "John Doe", email: "john@example.com" },
        { _id: "mockedId2", name: "Jane Doe", email: "jane@example.com" },
      ]);

      const res = await request(app).get("/api/user/getallusers");

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body[0]).toHaveProperty("name", "John Doe");
      expect(res.body[1]).toHaveProperty("name", "Jane Doe");
    });
  });

  describe("PUT /api/user/update/:id", () => {
    it("should update an existing user", async () => {
      const userId = "mockedId123";
      const updatedData = { name: "John Updated", email: "john.updated@example.com" };

      User.findOne.mockResolvedValue({ _id: userId, name: "John Doe", email: "john@example.com" });
      User.findByIdAndUpdate.mockResolvedValue({ _id: userId, ...updatedData });

      const res = await request(app).put(`/api/user/update/${userId}`).send(updatedData);

      expect(res.status).toBe(201); 
      expect(res.body).toHaveProperty("name", "John Updated");
      expect(res.body).toHaveProperty("email", "john.updated@example.com");
    });

    it("should return 404 if user not found", async () => {
      const userId = "nonExistentId";
      const updatedData = { name: "John Updated", email: "john.updated@example.com" };

      User.findOne.mockResolvedValue(null);

      const res = await request(app).put(`/api/user/update/${userId}`).send(updatedData);

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("User not found.");
    });
  });

  describe("DELETE /api/user/delete/:id", () => {
    it("should delete an existing user", async () => {
      const userId = "mockedId123";

      User.findOne.mockResolvedValue({ _id: userId, name: "John Doe", email: "john@example.com" });
      User.findByIdAndDelete.mockResolvedValue(true);

      const res = await request(app).delete(`/api/user/delete/${userId}`);

      expect(res.status).toBe(201); 
      expect(res.body.message).toBe(" User deleted Successfully.");
    });

    it("should return 404 if user not found", async () => {
      const userId = "nonExistentId";

      User.findOne.mockResolvedValue(null);

      const res = await request(app).delete(`/api/user/delete/${userId}`);

      expect(res.status).toBe(404);
      expect(res.body.message).toBe(" User Not Found. ");
    });
  });
});
