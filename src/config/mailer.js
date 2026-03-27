import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,   // Gmail address
    pass: process.env.EMAIL_PASS    // Gmail APP PASSWORD
  }
});