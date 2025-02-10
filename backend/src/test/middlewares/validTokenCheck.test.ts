import { describe, expect, it } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import app from "@/app";

process.env.JWT_SECRET = "test";

const secret = process.env.JWT_SECRET;

describe("validTokenCheck", async () => {
  describe("POST /users/logout", async () => {
    it("should return 400 if no token provided", async () => {
      const res = await request(app).post("/users/logout");

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("No token provided.");
    });

    it("should return 400 for invalid token", async () => {
      const res = await request(app)
        .post("/users/logout")
        .set("Authorization", `Bearer invalidToken `);

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid token.");
    });

    it("should allow access with a valid token", async () => {
      const token = await jwt.sign({ email: "user@gmail.com" }, secret, {
        expiresIn: "1h",
      });

      console.log(token);

      const res = await request(app)
        .post("/users/logout")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Logout successfull.");
    });
  });
});
