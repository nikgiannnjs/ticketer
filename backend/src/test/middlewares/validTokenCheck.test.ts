import { beforeEach, describe, expect, it, vi } from "vitest";

import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { validTokenCheck } from "@/middleware/validTokenCheck";

process.env.JWT_SECRET = "test";
const secret = process.env.JWT_SECRET;

describe("validTokenCheck middleware", () => {
  // Setup mock request, response, and next function
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNextFunction: NextFunction;

  // before each test mock the request to something with empty headers and mock the response to return something as the status and something as the json
  // mock the next function to be a function
  // the next function is the next middleware or the controller in the call chain of the route
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


  it("should call next() with valid token", () => {
    const token = jwt.sign({ userId: 1 }, secret as string);
    mockReq.headers = {
      authorization: `Bearer ${token}`,
    };

    validTokenCheck(mockReq as Request, mockRes as Response, mockNextFunction);

    expect(mockNextFunction).toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled();
    expect(mockRes.json).not.toHaveBeenCalled();
  });

  it("should return 400 with invalid token", () => {
    mockReq.headers = {
      authorization: "Bearer invalid.token.here",
    };

    validTokenCheck(mockReq as Request, mockRes as Response, mockNextFunction);

    expect(mockNextFunction).not.toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Invalid token.",
    });
  });

  it("should return 400 when no token is provided", () => {
    validTokenCheck(mockReq as Request, mockRes as Response, mockNextFunction);

    expect(mockNextFunction).not.toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "No token provided.",
    });
  });
});

