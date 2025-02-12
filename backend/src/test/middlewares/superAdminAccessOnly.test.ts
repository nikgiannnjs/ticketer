import { describe, it, expect, beforeEach, vi } from "vitest";
import { Request, Response, NextFunction } from "express";
import { superAdminCheck } from "@/middleware/superAdminAccessOnly";
import jwt from "jsonwebtoken";
import { Admin } from "@/models/userModel";

process.env.JWT_SECRET = "test";
const secret = process.env.JWT_SECRET;

vi.mock("@/models/userModel", () => ({
  Admin: {
    findOne: vi.fn(),
  },
}));

describe("superAdmincheck middleware", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNextFunction: NextFunction;

  beforeEach(() => {
    mockReq = {
      headers: {},
    };
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    mockNextFunction = vi.fn() as unknown as NextFunction;
  });

  describe("active", () => {
    it("should return 400 access denied if isSuperAdmin false", async () => {
      vi.mocked(Admin.findOne).mockResolvedValue({
        email: "admin@test.com",
        status: "active",
      });

      const token = jwt.sign(
        { isSuperAdmin: false, email: "admin@test.com" },
        secret
      );

      mockReq.headers = {
        authorization: `Bearer ${token}`,
      };

      await superAdminCheck(
        mockReq as Request,
        mockRes as Response,
        mockNextFunction
      );

      expect(mockNextFunction).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Access denied.",
      });
    });

    describe("not found", () => {
      it("should return 404 if user not found", async () => {
        vi.mocked(Admin.findOne).mockResolvedValue(null);

        const token = jwt.sign(
          { isSuperAdmin: false, email: "wrongUser@test.com" },
          secret
        );

        mockReq.headers = {
          authorization: `Bearer ${token}`,
        };

        await superAdminCheck(
          mockReq as Request,
          mockRes as Response,
          mockNextFunction
        );

        expect(mockNextFunction).not.toHaveBeenCalled();
        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({
          message: "User not found.",
        });
      });
    });

    describe("next", () => {
      it("should call next if isSuperAdmin true", async () => {
        vi.mocked(Admin.findOne).mockResolvedValue({
          email: "admin@test.com",
          status: "super-admin",
        });

        const token = jwt.sign(
          { isSuperAdmin: true, email: "admin@test.com" },
          secret
        );

        mockReq.headers = {
          authorization: `Bearer ${token}`,
        };

        await superAdminCheck(
          mockReq as Request,
          mockRes as Response,
          mockNextFunction
        );

        expect(mockNextFunction).toHaveBeenCalled();
        expect(mockRes.status).not.toHaveBeenCalledWith(404);
        expect(mockRes.json).not.toHaveBeenCalledWith();
      });
    });
  });
});
