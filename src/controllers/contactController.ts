import { Request, Response } from "express";
import Contact from "../models/Contact";
import sendEmail from "../utils/sendEmail";

// controllers/contactController.ts
export const createContact = async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body;

    // Save in DB
    const newContact = await Contact.create({ name, email, subject, message });

    // Send emails ...
    await sendEmail(
      email,
      "We received your message",
      `<p>Hi ${name},</p><p>Thank you for reaching out. We have received your message:</p>
      <blockquote>${message}</blockquote><p>We'll get back to you soon!</p>`
    );

    await sendEmail(
      process.env.ADMIN_EMAIL!,
      `New Contact from ${name}`,
      `<p>You received a new message:</p>
       <ul>
         <li><b>Name:</b> ${name}</li>
         <li><b>Email:</b> ${email}</li>
         <li><b>Subject:</b> ${subject}</li>
         <li><b>Message:</b> ${message}</li>
       </ul>`
    );

    // ✅ Use it in response
    return res.status(201).json({
      message: "Message sent successfully",
      data: newContact,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error. Try again later." });
  }
};
