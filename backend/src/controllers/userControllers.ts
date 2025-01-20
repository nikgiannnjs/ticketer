import { Request, Response } from "express";
import Venue from "@/models/venueModel";
import { checkRequiredFields } from "@/utils/checkRequiredFields";
import { dateTimeFormatCheck } from "@/utils/dateTimeformatCheck";
import { uploadImageToR2 } from "@/utils/uploadImageToCloud";
import { localTimeZone } from "@/utils/localTimeZone";
import { decoder } from "@/utils/decodeImage";
import { formatter } from "@/utils/formatter";
import { Admin } from "@/models/userModel";
import dotenv from "dotenv";
dotenv.config();

export const createNewVenue = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const requiredFields = [
      "email",
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

    const email = req.body.email;
    const title = await formatter(req.body.title);
    const description = await formatter(req.body.description);
    const country = await formatter(req.body.country);
    const city = await formatter(req.body.city);
    const address = req.body.address;
    const dateTime = new Date(req.body.dateTime);
    const price = req.body.price;
    const capacity = req.body.capacity;
    const image = req.body.image;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      res.status(404).json({
        message: "User not found.",
      });

      return;
    }

    const bufferImg: Buffer = await decoder(image);
    const fileName = `venue_image_${Date.now()}.png`;
    const imageUrl = await uploadImageToR2(bufferImg, fileName);

    const data = new Venue({
      title: title,
      description: description,
      country: country,
      city: city,
      address: address,
      datetime: dateTime,
      price: price,
      capacity: capacity,
      image: imageUrl,
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
