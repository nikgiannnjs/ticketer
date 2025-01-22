import { Request, Response, NextFunction } from "express";
import { Admin } from "@/models/userModel";
import jwt, { JwtPayload } from "jsonwebtoken";

export const adminCheck = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const bearerToken = req.headers.authorization;

    const splitToken = bearerToken?.split(" ")[1] ?? "";

    const token = jwt.verify(
      splitToken,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    const email = token.email;

    const user = await Admin.findOne({ email });

    if (!user) {
      res.status(404).json({
        message: "User not found.",
      });

      return;
    }

    if (user.status !== "active") {
      res.status(400).json({ message: "Access denied." });

      return;
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
    console.log(error);
  }
};
