import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const validTokenCheck = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const bearerToken = req.headers.authorization;

    if (!bearerToken) {
      res.status(400).json({
        message:
          "No token provided. Please provide a bearer authorization token.",
      });

      return;
    }

    const token = bearerToken.split(" ")[1];

    try {
      const tokenCheck = jwt.verify(token, process.env.JWT_SECRET as string);
      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        res.status(400).json({
          message: "Invalid token.",
        });

        return;
      }
    }
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
    console.log(error);
  }
};
