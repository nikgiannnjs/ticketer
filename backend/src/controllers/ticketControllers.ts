import { Request, Response } from "express";
import { randomBytes } from "crypto";
import Ticket from "@/models/ticketModel";
import Venue from "@/models/venueModel";
import { checkRequiredFields } from "@/utils/checkRequiredFields";
import { qrCodeGenerator } from "@/utils/qrGenerator";
import { Types } from "mongoose";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export const holdTicket = async (
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
    const totalPrice = venue.price * ticketAmount;

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

    const stripeObj = {
      price_data: {
        currency: "eur",
        product_data: {
          name: String(tickets[0].venue),
        },
        unit_amount: tickets[0].price * 100,
      },
      quantity: tickets.length,
    };

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [stripeObj],
      mode: "payment",
      success_url: "http://127.0.0.1:3000", //redirect payment url
      cancel_url: "http://127.0.0.1:3000",
    });

    res.status(201).json({
      message: "Booking was successfull.",
      stripeSessionId: stripeSession.id,
    });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
    console.log(error);
  }
};

export const webHookPayment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const signature = req.headers["stripe-signature"] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SIGNING_SECRET as string;

    const event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      webhookSecret
    );

    if (event.type !== "payment_intent.succeeded") {
      res.status(400).json({ message: "Payment failed." });

      return;
    }

    const paymentIntent = event.data.object;
    const paymentAmount = paymentIntent.amount_received;
    const paymentId = paymentIntent.id;
    const paymentIntentDetails = await stripe.paymentIntents.retrieve(
      paymentId
    );

    // twra update tickets & stelnw mail

    res.status(200).json({
      message: "Payment made succesfully.",
      paymentAmount: paymentAmount,
    });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
    console.log(error);
  }
};
