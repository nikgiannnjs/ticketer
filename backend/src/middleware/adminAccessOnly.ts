import { Request, Response, NextFunction } from "express";
import { Admin } from "@/models/userModel";
import { checkRequiredFields } from "@/utils/checkRequiredFields";

export const adminCheck = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const requiredFields = ["email"];
    const missingFields = await checkRequiredFields(req.body, requiredFields);

    if (missingFields.length) {
      res.status(400).json({
        message: `Request body fields missing: ${missingFields.join(", ")}`,
      });

      return;
    }

    const email = req.body.email;

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
