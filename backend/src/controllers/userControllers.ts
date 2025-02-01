import { Request, Response } from "express";
import { randomBytes } from "crypto";
import jwt, { JwtPayload } from "jsonwebtoken";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import Venue from "@/models/venueModel";
import { checkRequiredFields } from "@/utils/checkRequiredFields";
import { dateTimeFormatCheck } from "@/utils/dateTimeformatCheck";
import { localTimeZone } from "@/utils/localTimeZone";
import { formatter } from "@/utils/formatter";
import { Admin } from "@/models/userModel";
import { s3Client } from "@/db/s3Client";
import dotenv from "dotenv";
dotenv.config();

export const createNewVenue = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const requiredFields = [
      "title",
      "description",
      "country",
      "city",
      "address",
      "dateTime",
      "price",
      "capacity",
      "image",
    ];

    const missingFields = await checkRequiredFields(req.body, requiredFields);
    if (missingFields.length) {
      res.status(400).json({
        message: `Request body fields missing: ${missingFields.join(", ")}`,
      });

      return;
    }

    const dateTimeCheck = await dateTimeFormatCheck(req.body.dateTime);
    if (!dateTimeCheck) {
      res.status(400).json({
        message: "Invalid datetime.",
      });

      return;
    }

    const title = await formatter(req.body.title);
    const description = await formatter(req.body.description);
    const country = await formatter(req.body.country);
    const city = await formatter(req.body.city);
    const address = req.body.address;
    const dateTime = new Date(req.body.dateTime);
    const price = req.body.price;
    const capacity = req.body.capacity;
    const ticketsBooked = 0;
    const image = req.body.image;
    const bearerToken = req.headers.authorization;

    const splitToken = bearerToken?.split(" ")[1] ?? "";

    const token = jwt.verify(
      splitToken,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    const email = token.email;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      res.status(404).json({
        message: "User not found.",
      });

      return;
    }

    const data = new Venue({
      title: title,
      description: description,
      country: country,
      city: city,
      address: address,
      datetime: dateTime,
      price: price,
      capacity: capacity,
      ticketsBooked: ticketsBooked,
      image: image,
      admin: admin._id,
    });

    const newVenue = await data.save();

    res.status(201).json({
      message: "Venue created successfully.",
    });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
    console.log(error);
  }
};

export const signedUrls = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    dotenv.config();

    const BUCKET_PUBLIC_URL = `${process.env.CLOUDFLARE_R2_PUBLIC_URL}`;
    const BUCKET_NAME = `${process.env.CLOUDFLARE_R2_BUCKET_NAME}`;
    const FIVE_MB = 5 * 1024 * 1024;

    const imageSize = req.body.imageSize;

    if (imageSize > FIVE_MB) {
      res.status(400).json({ error: "File size too large" });

      return;
    }

    const bucketKey = `events/${randomBytes(16).toString("hex")}`;

    const signedUrl = await getSignedUrl(
      s3Client,
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: bucketKey,
        ContentLength: imageSize,
      }),
      { expiresIn: 30 }
    );

    const publicUrl = `${BUCKET_PUBLIC_URL}/${bucketKey}`;

    res.status(200).json({ signedUrl, publicUrl });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
    console.log(error);
  }
};

export const allVenues = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Number(req.query.page) ?? 1;
    const limit = Number(req.query.limit) ?? 10;

    const offset = (page - 1) * limit;

    const allVenues = await Venue.find()
      .sort({ createdAt: 1 })
      .skip(offset)
      .limit(limit)
      .exec();

    const totalVenuesNumber = await Venue.countDocuments();

    const totalPages = Math.ceil(totalVenuesNumber / limit);

    res.status(200).json({
      venues: allVenues,
      totalPages: totalPages,
    });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
    console.log(error);
  }
};

export const getVenue = async (req: Request, res: Response): Promise<void> => {
  try{
    const { id } = req.params;
    const venue = await Venue.findById(id);
    res.status(200).json({ venue });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
    console.log(error);
  }
};
