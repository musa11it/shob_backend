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
exports.resetPassword = exports.forgotPassword = exports.verifyOtp = exports.login = exports.register = void 0;
const crypto_1 = __importDefault(require("crypto"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const sendEmail_1 = __importDefault(require("../utils/sendEmail"));
// --------------------
// Generate JWT Token
// --------------------
const generateToken = (id) => {
    const secret = process.env.JWT_SECRET;
    if (!secret)
        throw new Error("JWT_SECRET is not defined in your .env file");
    // NOTE: sign { userId } so middleware that reads decoded.userId works
    return jsonwebtoken_1.default.sign({ userId: id }, secret, { expiresIn: "30d" });
};
// =============================
// Register
// =============================
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        const existingUser = yield User_1.default.findOne({ $or: [{ email }, { username }] });
        if (existingUser)
            return res.status(400).json({ message: "User already exists" });
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const user = yield User_1.default.create({ username, email, password: hashedPassword });
        res.status(201).json({
            id: user._id.toString(),
            username: user.username,
            email: user.email,
            role: user.role || "user",
            token: generateToken(user._id.toString()),
        });
    }
    catch (err) {
        console.error("Register error:", err);
        res.status(500).json({ message: "Server error" });
    }
});
exports.register = register;
// =============================
// Login (Step 1: send OTP)
// =============================
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield User_1.default.findOne({ email });
        if (!user)
            return res.status(400).json({ message: "Invalid credentials" });
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ message: "Invalid credentials" });
        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiry
        yield user.save();
        const message = `
      <p>Your login OTP is:</p>
      <h2>${otp}</h2>
      <p>This OTP will expire in 10 minutes.</p>
    `;
        yield (0, sendEmail_1.default)(user.email, "Your Login OTP", message);
        // Only indicate OTP sent — verification is next step
        res.json({ message: "OTP sent to your email. Please verify." });
    }
    catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Server error" });
    }
});
exports.login = login;
// =============================
// Verify OTP (Step 2: complete login)
// =============================
const verifyOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp } = req.body;
        const user = yield User_1.default.findOne({
            email,
            otp,
            otpExpires: { $gt: new Date() },
        });
        if (!user)
            return res.status(400).json({ message: "Invalid or expired OTP" });
        // Clear OTP once used
        user.otp = undefined;
        user.otpExpires = undefined;
        yield user.save();
        res.json({
            id: user._id.toString(),
            username: user.username,
            email: user.email,
            role: user.role || "user",
            token: generateToken(user._id.toString()),
        });
    }
    catch (err) {
        console.error("Verify OTP error:", err);
        res.status(500).json({ message: "Server error" });
    }
});
exports.verifyOtp = verifyOtp;
// =============================
// Forgot Password
// =============================
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield User_1.default.findOne({ email });
        if (!user)
            return res.status(404).json({ message: "User not found" });
        const resetToken = crypto_1.default.randomBytes(20).toString("hex");
        const hashedToken = crypto_1.default.createHash("sha256").update(resetToken).digest("hex");
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000); // 15 min
        yield user.save();
        const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password/${resetToken}`;
        const message = `
      <p>You requested a password reset.</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
    `;
        yield (0, sendEmail_1.default)(user.email, "Password Reset Request", message);
        res.json({ message: "Reset link sent to email" });
    }
    catch (err) {
        console.error("Forgot password error:", err);
        res.status(500).json({ message: "Server error" });
    }
});
exports.forgotPassword = forgotPassword;
// =============================
// Reset Password
// =============================
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        const { password } = req.body;
        const hashedToken = crypto_1.default.createHash("sha256").update(token).digest("hex");
        const user = yield User_1.default.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: new Date() },
        });
        if (!user)
            return res.status(400).json({ message: "Invalid or expired token" });
        user.password = yield bcryptjs_1.default.hash(password, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        yield user.save();
        res.json({ message: "Password reset successful" });
    }
    catch (err) {
        console.error("Reset password error:", err);
        res.status(500).json({ message: "Server error" });
    }
});
exports.resetPassword = resetPassword;
