import { Request, Response, NextFunction } from "express";
import { Admin } from "@/models/userModel";

export const adminCheck = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.params.id;

    const user = await Admin.findById(userId);

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
