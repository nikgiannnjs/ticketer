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
    ];
    const missingFields = await checkRequiredFields(req.body, requiredFields);
    if (missingFields.length) {
      res.status(400).json({
        message: `Request body fields missing: ${missingFields.join(", ")}`,
      });

      return;
    }

    const title = await formatter(req.body.title);
    const description = await formatter(req.body.description);
    const country = await formatter(req.body.country);
    const city = await formatter(req.body.city);
    const address = req.body.address;
    const date = req.body.date;
    const time = req.body.time;
    const price = req.body.price;
    const capacity = req.body.capacity;
    const image = req.body.image;
    const admin = req.params.id;

    const data = new Venue({
      title: title,
      description: description,
      country: country,
      city: city,
      address: address,
      date: date,
      time: time,
      price: price,
      capacity: capacity,
      image: image,
      admin: admin,
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
