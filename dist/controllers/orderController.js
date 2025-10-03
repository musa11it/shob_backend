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
exports.deleteOrder = exports.updateOrder = exports.getOrderById = exports.getOrders = exports.createOrder = void 0;
const Order_1 = __importDefault(require("../models/Order"));
const getErrorMessage = (error) => {
    if (error instanceof Error)
        return error.message;
    return String(error);
};
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = new Order_1.default(req.body);
        yield order.save();
        res.status(201).json({ message: "Order placed successfully", order });
    }
    catch (error) {
        res.status(500).json({ error: getErrorMessage(error) });
    }
});
exports.createOrder = createOrder;
const getOrders = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield Order_1.default.find().sort({ createdAt: -1 });
        res.json(orders);
    }
    catch (error) {
        res.status(500).json({ error: getErrorMessage(error) });
    }
});
exports.getOrders = getOrders;
const getOrderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield Order_1.default.findById(req.params.id);
        if (!order) {
            res.status(404).json({ error: "Order not found" });
            return;
        }
        res.json(order);
    }
    catch (error) {
        res.status(500).json({ error: getErrorMessage(error) });
    }
});
exports.getOrderById = getOrderById;
const updateOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield Order_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!order) {
            res.status(404).json({ error: "Order not found" });
            return;
        }
        res.json(order);
    }
    catch (error) {
        res.status(500).json({ error: getErrorMessage(error) });
    }
});
exports.updateOrder = updateOrder;
const deleteOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield Order_1.default.findByIdAndDelete(req.params.id);
        if (!order) {
            res.status(404).json({ error: "Order not found" });
            return;
        }
        res.json({ message: "Order deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: getErrorMessage(error) });
    }
});
exports.deleteOrder = deleteOrder;
