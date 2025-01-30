import { Request, Response } from "express";
import { randomBytes } from "crypto";
import Ticket from "@/models/ticketModel";
import Venue from "@/models/venueModel";
import { checkRequiredFields } from "@/utils/checkRequiredFields";
import { qrCodeGenerator } from "@/utils/qrGenerator";
import { Types } from "mongoose";

export const bookTicket = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const requiredFields = ["userName", "email", "ticketAmount"];
    const missingFields = await checkRequiredFields(req.body, requiredFields);

    if (missingFields.length) {
      res.status(400).json({
        message: `Request body fields missing: ${missingFields.join(", ")}`,
      });

      return;
    }

    const id = req.params.id;
    const userName = req.body.userName;
    const email = req.body.email;
    const ticketAmount = req.body.ticketAmount;

    const venue = await Venue.findById(id);

    if (!venue) {
      res.status(400).json({
        message: "Venue not found.",
      });

      return;
    }

    const capacity = venue.capacity;
    const totalTickets = venue.ticketsBooked;

    if (totalTickets + ticketAmount > capacity) {
      res.status(400).json({
        message: `Not enough tickets available. Only ${
          capacity - totalTickets
        } left.`,
      });

      return;
    }

    const tickets: {
      venue: Types.ObjectId;
      status: string;
      qrImage: string;
      price: number;
      purchaseDate: Date;
      user: string;
      email: string;
    }[] = [];

    for (let i = 0; i < ticketAmount; i++) {
      const ticketId = randomBytes(16).toString("hex");

      const qrData = {
        name: userName,
        venue: venue.title,
        ticketId: ticketId,
      };

      const stringQrData = JSON.stringify(qrData);

      const qrString = await qrCodeGenerator(stringQrData);

      tickets.push({
        venue: venue._id as Types.ObjectId,
        status: "on hold",
        qrImage: qrString,
        price: venue.price,
        purchaseDate: new Date(),
        user: userName,
        email: email,
      });
    }

    await Ticket.insertMany(tickets);

    const incValue = ticketAmount;

    await Venue.findByIdAndUpdate(
      id,
      { $inc: { ticketsBooked: incValue } },
      { new: true }
    );

    res.status(201).json({
      message: "Booking was successfull.",
    });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
    console.log(error);
  }
};
