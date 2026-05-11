import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.USER_EMAIL ,
    pass: process.env.USER_PASSWORD,
  },
});

const sendMail = async(to, otp) =>{
    await transporter.sendMail({
    from: process.env.USER_EMAIL, // sender address
    to: to, // list of recipients
    subject: "Reset Your Password", // subject line
    html: `<p>Your OTP for Password Rest is <b>${otp}</b> It expires in 5 minutes. </p>`, // HTML body
  });
}

export default sendMail;

