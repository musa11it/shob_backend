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
exports.deleteSubscriber = exports.getSubscribers = exports.subscribe = void 0;
const Subscriber_1 = __importDefault(require("../models/Subscriber"));
const subscribe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const newSubscriber = yield Subscriber_1.default.create({ email });
        res.status(201).json(newSubscriber);
    }
    catch (err) {
        res.status(500).json({ error: "Server error", details: err instanceof Error ? err.message : err });
    }
});
exports.subscribe = subscribe;
const getSubscribers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subscribers = yield Subscriber_1.default.find().sort({ createdAt: -1 });
        res.json(subscribers);
    }
    catch (err) {
        res.status(500).json({ error: "Server error", details: err instanceof Error ? err.message : err });
    }
});
exports.getSubscribers = getSubscribers;
const deleteSubscriber = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const subscriber = yield Subscriber_1.default.findByIdAndDelete(id);
        if (!subscriber) {
            return res.status(404).json({ error: "Subscriber not found" });
        }
        res.json({ success: true, message: "Subscriber deleted successfully" });
    }
    catch (err) {
        res.status(500).json({ error: "Server error", details: err instanceof Error ? err.message : err });
    }
});
exports.deleteSubscriber = deleteSubscriber;
