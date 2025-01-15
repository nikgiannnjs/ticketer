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
        message: "No token provided.",
      });

      return;
    }

    const token = bearerToken.split(" ")[1];

<<<<<<< HEAD
    try {
      const tokenCheck = jwt.verify(token, process.env.JWT_SECRET as string);
      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        res.status(400).json({
          message: "Invalid token.",
        });
=======
    if (!tokenCheck) {
      res.status(400).json({
        message: "User not authorized.",
      });
>>>>>>> logout-endpoint

        return;
      }
    }
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
    console.log(error);
  }
};
