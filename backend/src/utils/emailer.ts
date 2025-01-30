import nodemailer from "nodemailer";

export const emailer = async (
  userEmail: string,
  qrStrings: string[]
): Promise<void> => {
  try {
    const html = `
    <h1 style="font-size: 2em; font-weight: bold;">Hi ${userEmail}</h1>
    <p style="font-size: 1.5em; font-weight: bold;">Your tickets are ready!</p>
    <p style="font-size: 1.2em;">Please find your tickets attached to this email.</p>
    `;

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: `${process.env.GMAIL}`,
        pass: `${process.env.GMAIL_PASSWORD}`,
      },
    });

    const processedQRStrings = qrStrings.map((qrString) => {
      return qrString.replace(/^data:image\/png;base64,/, "");
    });

    await transporter.sendMail({
      from: `${process.env.GMAIL}`,
      to: userEmail,
      subject: "Your tickets from Ticketer are ready!",
      html: html,
      attachments: processedQRStrings.map((qrString, index) => ({
        filename: `ticket-${index + 1}.png`,
        content: qrString,
        encoding: "base64",
        contentType: "image/png",
      })),
    });
  } catch (error) {
    throw new Error("Something went wrong");
  }
};
