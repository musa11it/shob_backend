"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContact = void 0;
const Contact_1 = __importDefault(require("../models/Contact"));
const sendEmail_1 = __importDefault(require("../utils/sendEmail"));
// controllers/contactController.ts
const createContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, subject, message } = req.body;
        // Save in DB
        const newContact = yield Contact_1.default.create({ name, email, subject, message });
        // Send emails ...
        yield (0, sendEmail_1.default)(email, "We received your message", `<p>Hi ${name},</p><p>Thank you for reaching out. We have received your message:</p>
      <blockquote>${message}</blockquote><p>We'll get back to you soon!</p>`);
        yield (0, sendEmail_1.default)(process.env.ADMIN_EMAIL, `New Contact from ${name}`, `<p>You received a new message:</p>
       <ul>
         <li><b>Name:</b> ${name}</li>
         <li><b>Email:</b> ${email}</li>
         <li><b>Subject:</b> ${subject}</li>
         <li><b>Message:</b> ${message}</li>
       </ul>`);
        // ✅ Use it in response
        return res.status(201).json({
            message: "Message sent successfully",
            data: newContact,
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error. Try again later." });
    }
});
exports.createContact = createContact;
