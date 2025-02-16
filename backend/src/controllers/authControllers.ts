import { Request, Response } from "express";
import { Guest, Admin } from "@/models/userModel";
import BlackList from "@/models/tokenBlackListModel";
import { emailValidation } from "@/utils/emailValidation";
import { checkRequiredFields } from "@/utils/checkRequiredFields";
import { nameFormatter } from "@/utils/nameFormatter";
import { validPasswordCheck } from "@/utils/validPasswordCheck";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const guestUserRegister = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const email: string = req.body.email;

    if (!email) {
      res.status(400).json({
        message: "Email is undefined.",
      });

      return;
    }

    const validEmail: boolean = await emailValidation(email);

    if (!validEmail) {
      res.status(400).json({
        message:
          "Invalid email format. Email has to be in the format of test@gmail.com",
      });

      return;
    }

    const existingGuest = await Guest.findOne({ email });

    if (existingGuest) {
      res.status(400).json({
        message: "Email already registered.",
      });

      return;
    }

    const data = new Guest({
      email: email,
    });

    const newGuest = await data.save();

    res
      .status(201)
      .json({ message: "New guest user registered successfully." });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
    console.log(error);
  }
};

export const adminUserRegister = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "password",
      "passwordConfirm",
    ];
    const missingFields = await checkRequiredFields(req.body, requiredFields);

    if (missingFields.length) {
      res.status(400).json({
        message: `Request body fields missing: ${missingFields.join(", ")}`,
      });

      return;
    }

    const userName: string = await nameFormatter(
      req.body.firstName,
      req.body.lastName
    );

    const name: string = userName;
    const email: string = req.body.email;
    const password: string = req.body.password;
    const passwordConfirm: string = req.body.passwordConfirm;

    const user = await Admin.findOne({ email });

    if (!user) {
      res.status(404).json({
        message: "User not found.",
      });

      return;
    }

    if (user.status !== "active") {
      res.status(403).json({
        message: "Access denied.",
      });

      return;
    }

    const status: string = user.status;

    const validPassword = await validPasswordCheck(password);

    if (!validPassword) {
      res.status(400).json({
        message:
          "Password must be at least 8 characters, contain one upper case letter, one lower case letter and one special character.",
      });

      return;
    }

    if (password != passwordConfirm) {
      res.status(400).json({
        message: "Password and password confirmation are not the same.",
      });

      return;
    }

    const passwordEncryption = await bcrypt.hash(password, 10);

    await Admin.updateOne(
      { email: email },
      {
        $set: {
          name: name,
          email: email,
          passwordHash: passwordEncryption,
          status: status,
        },
      }
    );

    const accessToken = jwt.sign(
      { email, isSuperAdmin: status === "super-admin" },
      process.env.JWT_SECRET as string,
      {
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN as string,
      }
    );
    const refreshToken = jwt.sign({ email }, process.env.JWT_SECRET as string, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN as string,
    });

    res.status(201).json({
      message: "New Admin registered successfully.",
      accessToken: accessToken,
      resetToken: refreshToken,
    });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
    console.log(error);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const requiredFields = ["email", "password"];
    const missingFields = await checkRequiredFields(req.body, requiredFields);

    if (missingFields.length) {
      res.status(400).json({
        message: `Request body fields missing: ${missingFields.join(", ")}`,
      });

      return;
    }

    const email: string = req.body.email;
    const password: string = req.body.password;

    const user = await Admin.findOne({ email }).select("+passwordHash");

    if (!user) {
      res.status(400).json({
        message: "Password or email is incorrect.",
        code: "A152",
      });

      return;
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);

    if (!validPassword) {
      res.status(400).json({
        message: "Password or email is incorrect.",
        code: "A154",
      });

      return;
    }

    const accessToken = jwt.sign(
      { email, isSuperAdmin: user.status === "super-admin" },
      process.env.JWT_SECRET as string,
      {
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN as string,
      }
    );
    const refreshToken = jwt.sign({ email }, process.env.JWT_SECRET as string, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN as string,
    });

    res.status(200).json({
      message: "Login successfull.",
      accessToken: accessToken,
      resetToken: refreshToken,
    });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
    console.log(error);
  }
};

export const requestAccess = async (
  req: Request,
  res: Response
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

    const email: string = req.body.email;

    const existingEmail = await Admin.findOne({ email });

    if (existingEmail) {
      res.status(400).json({
        message: "Access already requested with this email.",
      });

      return;
    }

    const validEmail = emailValidation(email);

    if (!validEmail) {
      res.status(400).json({
        message: "Invalid email format.",
      });

      return;
    }

    const data = new Admin({
      email: email,
      status: "requested",
    });

    await data.save();

    res.status(201).json({
      message: "Request made successfully.",
    });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
    console.log(error);
  }
};

export const getAccessRequests = async (
  _req: Request,
  res: Response
): Promise<void> => {
  const accessRequests = (await Admin.find({ status: "requested" })) ?? [];
  res.status(200).json({ accessRequests });
};

export const rejectRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  const email = req.body.email;
  await Admin.deleteOne({ email: email });
  res.status(200).json({ message: "Request rejected successfully." });
};

export const acceptRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const email = req.body.email;

    if (!email) {
      res.status(400).json({
        message: "Email required.",
      });

      return;
    }

    const user = await Admin.findOne({ email });

    if (!user) {
      res.status(404).json({
        message: "User not found.",
      });

      return;
    }

    if (user.status === "requested") {
      await Admin.updateOne({ email: email }, { $set: { status: "active" } });

      res.status(201).json({ message: "Status updated successfully." });

      return;
    }
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
    console.log(error);
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const bearerToken = req.headers.authorization;

    if (!bearerToken) {
      res.status(400).json({
        message: "No token provided.",
      });

      return;
    }

    const token = bearerToken.split(" ")[1];

    const newBlackListedToken = new BlackList({ token });
    await newBlackListedToken.save();

    res.status(200).json({
      message: "Logout successfull.",
    });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
    console.log(error);
  }
};
