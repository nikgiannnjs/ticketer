import nodemailer from "nodemailer";

export const emailer = async (
  userEmail: string,
  qrStrings: string[]
): Promise<void> => {
  try {
    const html = "<h1>Hi </h1>";

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.GMAIL,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.GMAIL,
      to: userEmail,
      subject: "Ticketer: Thank you for booking with us.",
      html: html,
    });

    return;
  } catch (error) {
    throw new Error("Something went wrong");
  }
};
