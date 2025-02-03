import { Request, Response } from "express";
import { randomBytes } from "crypto";
import Ticket from "@/models/ticketModel";
import Venue from "@/models/venueModel";
import { checkRequiredFields } from "@/utils/checkRequiredFields";
import { qrCodeGenerator } from "@/utils/qrGenerator";
import { Types } from "mongoose";
import Stripe from "stripe";
import { emailer } from "@/utils/emailer";

const stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`);

export const holdTicket = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const requiredFields = ["email", "ticketAmount"];
    const missingFields = await checkRequiredFields(req.body, requiredFields);

    if (missingFields.length) {
      res.status(400).json({
        message: `Request body fields missing: ${missingFields.join(", ")}`,
      });

      return;
    }

    const id = req.params.id;
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
      email: string;
    }[] = [];

    for (let i = 0; i < ticketAmount; i++) {
      const ticketId = randomBytes(16).toString("hex");

      const qrData = {
        name: email,
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
      success_url: `${process.env.FRONTEND_URL}/payment-success`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-fail`,
      customer_email: email,
      expires_at: Math.floor(Date.now() / 1000) + 1800,

      metadata: {
        venueId: id,
        userEmail: email,
        amount: ticketAmount,
      },
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
    const webhookSecret = `${process.env.STRIPE_WEBHOOK_SIGNING_SECRET}`;

    const event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      webhookSecret
    );

    const session = event.data.object as Stripe.Checkout.Session;

    const userEmail = session.metadata?.userEmail;
    const venueId = session.metadata?.venueId;

    if (!userEmail || !venueId) {
      res.status(404).json({
        message: "User email or venue id metadata not found.",
      });
      return;
    }

    if (event.type === "checkout.session.expired") {
      await Ticket.deleteMany({ email: userEmail, status: "on hold" });

      res.status(408).json({
        message: "Session expired.",
      });

      return;
    }

    if (event.type === "payment_intent.payment_failed") {
      await Ticket.deleteMany({ email: userEmail, status: "on hold" });

      res.status(402).json({ message: "Payment failed." });

      return;
    }

    if (event.type === "checkout.session.completed") {
      const updatedTickets = await Ticket.updateMany(
        { email: userEmail, status: "on hold", venue: venueId },
        { status: "bought" }
      );

      if (!updatedTickets) {
        res.status(404).json({
          message: "Failed to update tickets.",
        });

        return;
      }

      const tickets = await Ticket.find({
        email: userEmail,
        venue: venueId,
        status: "bought",
      });

      if (!tickets) {
        res.status(404).json({
          message: "Failed to find tickets.",
        });

        return;
      }

      const qrStrings: string[] = [];

      for (let i = 0; i < tickets.length; i++) {
        const ticket = tickets[i];

        qrStrings.push(ticket.qrImage);
      }

      await emailer(userEmail, qrStrings);

      res.status(200).json({
        message: "Payment made succesfully.",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
    console.log(error);
  }
};
