import { describe, it, expect } from "vitest";
import app from "@/app";
import request from "supertest";
import jwt from "jsonwebtoken";
import { Admin } from "@/models/userModel";

process.env.JWT_SECRET = "test";
const secret = process.env.JWT_SECRET;

describe("superAdminCheck", async () => {
  describe("POST /test-auth", async () => {
    it("should return 400 access denied if isSuperAdmin false", async () => {
      const admin = new Admin({
        email: "admin@test.com",
        status: "active",
      });
      await admin.save();

      const token = await jwt.sign({ email: "admin@test.com" }, secret, {
        expiresIn: "1h",
      });

      const res = await request(app)
        .post("/users/test-admin")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Access denied.");
    });

    it("should return 200 if isSuperAdmin true", async () => {
      const admin = new Admin({
        email: "admin@test.com",
        status: "super-admin",
      });
      await admin.save();

      const token = await jwt.sign(
        { email: "admin@test.com", isSuperAdmin: true },
        secret,
        {
          expiresIn: "1h",
        }
      );

      const res = await request(app)
        .post("/users/test-admin")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Middleware passed.");
    });
  });
});
