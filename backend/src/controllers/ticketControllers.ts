import { Request, Response } from "express";
import Ticket from "@/models/ticketModel";
import Venue from "@/models/venueModel";

export const bookTicket = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id;

    const venue = await Venue.findByIdAndUpdate(
      id,
      { $inc: { ticketsBooked: 1 } },
      { new: true }
    );

    if (!venue) {
      res.status(400).json({
        message: "Venue not found.",
      });

      return;
    }

    res.status(201).json({
      message: "Ticket booked successfully.",
    });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
    console.log(error);
  }
};
