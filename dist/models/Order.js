"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const orderSchema = new mongoose_1.Schema({
    clientInfo: {
        fullName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String },
        address: { type: String, required: true },
    },
    cartItems: [
        {
            id: { type: String, required: true },
            title: { type: String, required: true },
            price: { type: Number, required: true },
            quantity: { type: Number, required: true },
            image: { type: String },
        },
    ],
    paymentMethod: {
        type: String,
        enum: ["credit_card", "paypal", "cash_on_delivery"],
        required: true,
    },
    totalAmount: { type: Number, required: true },
    status: {
        type: String,
        enum: ["pending", "paid", "shipped", "delivered"],
        default: "pending",
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Order", orderSchema);
