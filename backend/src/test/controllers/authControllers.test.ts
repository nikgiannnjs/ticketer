import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "@/app";
import { Admin } from "@/models/userModel";
import bcrypt from "bcrypt";

describe("Auth Controllers", () => {
  describe("POST /users/login", () => {
    beforeEach(async () => {
      const admin = new Admin({
        email: "admin@test.com",
        passwordHash: await bcrypt.hash("Password123!", 10),
        status: "active",
      });
      await admin.save();
    });

    it("should login successfully with correct credentials", async () => {
      const res = await request(app).post("/users/login").send({
        email: "admin@test.com",
        password: "Password123!",
      });
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Login successfull.");
      expect(res.body.accessToken).toBeDefined();
      expect(res.body.resetToken).toBeDefined();
    });

    it("should return 400 for incorrect password", async () => {
      const res = await request(app).post("/users/login").send({
        email: "admin@test.com",
        password: "wrongpassword",
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Password or email is incorrect.");
    });
  });

  describe("POST /users/adminRegister", () => {
    it("should register the user with correct email", async () => {
      const admin = new Admin({
        email: "admin@test.com",
        status: "active",
      });

      await admin.save();

      const res = await request(app).post("/users/adminRegister").send({
        firstName: "First",
        lastName: "Last",
        email: "admin@test.com",
        password: "123456Qw!",
        passwordConfirm: "123456Qw!",
      });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe("New Admin registered successfully.");
      expect(res.body.accessToken).toBeDefined();
      expect(res.body.resetToken).toBeDefined();
    });

    it("should deny acess to the user for not accepted access request", async () => {
      const admin2 = new Admin({
        email: "admin2@test.com",
        status: "requested",
      });

      await admin2.save();

      const res = await request(app).post("/users/adminRegister").send({
        firstName: "First",
        lastName: "Last",
        email: "admin2@test.com",
        password: "123456Qw!",
        passwordConfirm: "123456Qw!",
      });

      expect(res.status).toBe(403);
      expect(res.body.message).toBe("Access denied.");
    });

    it("should deny access for not made access request", async () => {
      const res = await request(app).post("/users/adminRegister").send({
        firstName: "First",
        lastName: "Last",
        email: "anuthorizedUser@test.com",
        password: "123456",
        passwordConfirm: "123456",
      });

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("User not found.");
    });

    it("should deny acess to the user for not accepted access request", async () => {
      const admin3 = new Admin({
        email: "admin2@test.com",
        status: "active",
      });

      await admin3.save();

      const res = await request(app).post("/users/adminRegister").send({
        firstName: "First",
        lastName: "Last",
        email: "admin2@test.com",
        password: "123456Qw!",
        passwordConfirm: "123456Qw",
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe(
        "Password and password confirmation are not the same."
      );
    });
  });
});
