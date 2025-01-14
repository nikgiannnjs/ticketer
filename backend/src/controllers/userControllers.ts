import { Request, Response } from "express";
import Venue from "@/models/venueModel";
import { checkRequiredFields } from "@/utils/checkRequiredFields";
import { formatter } from "@/utils/formatter";
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
      "date",
      "time",
      "price",
      "capacity",
      "image",
      "admin",
    ];
    const missingFields = await checkRequiredFields(req.body, requiredFields);
    if (missingFields.length) {
      res.status(400).json({
        message: `Request body fields missing: ${missingFields.join(", ")}`,
      });

      return;
    }

    const title = formatter(req.body.title);
    const description = formatter(req.body.description);
    const country = formatter(req.body.country);
    const city = formatter(req.body.city);
    const address = req.body.address;
    const date = req.body.date;
    const time = req.body.time;
    const price = req.body.price;
    const capacity = req.body.capacity;
    const image = req.body.image;
    const admin = req.body.admin;
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
    console.log(error);
  }
};
