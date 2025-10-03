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
exports.removeFromCart = exports.getCart = exports.updateCartItem = exports.addToCart = void 0;
const cart_model_1 = __importDefault(require("../models/cart.model"));
const product_model_1 = __importDefault(require("../models/product.model"));
// Add product to cart (or increase quantity)
const addToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { productId, quantity = 1 } = req.body;
        if (!productId)
            return res.status(400).json({ message: "Product ID is required" });
        const product = yield product_model_1.default.findById(productId);
        if (!product)
            return res.status(404).json({ message: "Product not found" });
        let cart = yield cart_model_1.default.findOne({ user: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId });
        if (!cart) {
            cart = yield cart_model_1.default.create({
                user: (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId,
                items: [{ product: productId, quantity }],
            });
        }
        else {
            const existingItem = cart.items.find((i) => i.product.toString() === productId);
            if (existingItem) {
                existingItem.quantity += quantity;
            }
            else {
                cart.items.push({ product: productId, quantity });
            }
            yield cart.save();
        }
        const populatedCart = yield cart.populate("items.product");
        return res.json(populatedCart);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
});
exports.addToCart = addToCart;
// Update product quantity in cart
const updateCartItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { productId, quantity } = req.body;
        if (!productId || quantity < 1)
            return res.status(400).json({ message: "Invalid input" });
        const cart = yield cart_model_1.default.findOne({ user: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId });
        if (!cart)
            return res.status(404).json({ message: "Cart not found" });
        const item = cart.items.find((i) => i.product.toString() === productId);
        if (!item)
            return res.status(404).json({ message: "Product not in cart" });
        item.quantity = quantity;
        yield cart.save();
        const populatedCart = yield cart.populate("items.product");
        return res.json(populatedCart);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
});
exports.updateCartItem = updateCartItem;
// Get user cart
const getCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const cart = yield cart_model_1.default.findOne({ user: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId }).populate("items.product");
        if (!cart)
            return res.json({ items: [] });
        return res.json(cart);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
});
exports.getCart = getCart;
// Remove product from cart
const removeFromCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { productId } = req.body;
        if (!productId)
            return res.status(400).json({ message: "Product ID required" });
        const cart = yield cart_model_1.default.findOne({ user: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId });
        if (!cart)
            return res.status(404).json({ message: "Cart not found" });
        cart.items = cart.items.filter((i) => i.product.toString() !== productId);
        yield cart.save();
        const populatedCart = yield cart.populate("items.product");
        return res.json(populatedCart);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
});
exports.removeFromCart = removeFromCart;
