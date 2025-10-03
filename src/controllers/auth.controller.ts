import { Request, Response } from "express";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import sendEmail from "../utils/sendEmail";

// --------------------
// Generate JWT Token
// --------------------
const generateToken = (id: string) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not defined in your .env file");
  // NOTE: sign { userId } so middleware that reads decoded.userId works
  return jwt.sign({ userId: id }, secret, { expiresIn: "30d" });
};

// =============================
// Register
// =============================
export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body as {
      username: string;
      email: string;
      password: string;
    };

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword });

    res.status(201).json({
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role || "user",
      token: generateToken(user._id.toString()),
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// =============================
// Login (Step 1: send OTP)
// =============================
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as { email: string; password: string };

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiry
    await user.save();

    const message = `
      <p>Your login OTP is:</p>
      <h2>${otp}</h2>
      <p>This OTP will expire in 10 minutes.</p>
    `;
    await sendEmail(user.email, "Your Login OTP", message);

    // Only indicate OTP sent — verification is next step
    res.json({ message: "OTP sent to your email. Please verify." });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// =============================
// Verify OTP (Step 2: complete login)
// =============================
export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body as { email: string; otp: string };

    const user = await User.findOne({
      email,
      otp,
      otpExpires: { $gt: new Date() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired OTP" });

    // Clear OTP once used
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role || "user",
      token: generateToken(user._id.toString()),
    });
  } catch (err) {
    console.error("Verify OTP error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// =============================
// Forgot Password
// =============================
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body as { email: string };
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(20).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000); // 15 min
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password/${resetToken}`;
    const message = `
      <p>You requested a password reset.</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
    `;
    await sendEmail(user.email, "Password Reset Request", message);

    res.json({ message: "Reset link sent to email" });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// =============================
// Reset Password
// =============================
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { password } = req.body as { password: string };

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: new Date() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
