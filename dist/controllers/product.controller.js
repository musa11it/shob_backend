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
exports.deleteProduct = exports.updateProduct = exports.getProduct = exports.getProducts = exports.createProduct = void 0;
const product_model_1 = __importDefault(require("../models/product.model"));
// Create product with image
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const product = new product_model_1.default({
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            inStock: (_a = req.body.inStock) !== null && _a !== void 0 ? _a : true,
            image: req.file
                ? {
                    data: req.file.buffer,
                    contentType: req.file.mimetype,
                }
                : undefined,
        });
        yield product.save();
        res.status(201).json(Object.assign(Object.assign({}, product.toObject()), { image: ((_b = product.image) === null || _b === void 0 ? void 0 : _b.data)
                ? `data:${product.image.contentType};base64,${product.image.data.toString("base64")}`
                : null }));
    }
    catch (error) {
        res.status(400).json({ error: "Failed to create product", details: error });
    }
});
exports.createProduct = createProduct;
// Get all products
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield product_model_1.default.find();
        const formatted = products.map((p) => {
            var _a;
            return ({
                _id: p._id,
                name: p.name,
                price: p.price,
                description: p.description,
                inStock: p.inStock,
                createdAt: p.createdAt,
                updatedAt: p.updatedAt,
                image: ((_a = p.image) === null || _a === void 0 ? void 0 : _a.data)
                    ? `data:${p.image.contentType};base64,${p.image.data.toString("base64")}`
                    : null,
            });
        });
        res.json(formatted);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch products", details: error });
    }
});
exports.getProducts = getProducts;
// Get single product
const getProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const product = yield product_model_1.default.findById(req.params.id);
        if (!product)
            return res.status(404).json({ message: "Product not found" });
        const formatted = {
            _id: product._id,
            name: product.name,
            price: product.price,
            description: product.description,
            inStock: product.inStock,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
            image: ((_a = product.image) === null || _a === void 0 ? void 0 : _a.data)
                ? `data:${product.image.contentType};base64,${product.image.data.toString("base64")}`
                : null,
        };
        res.json(formatted);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch product", details: error });
    }
});
exports.getProduct = getProduct;
// Update product (with optional new image)
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const updateData = {
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            inStock: req.body.inStock,
        };
        if (req.file) {
            updateData.image = {
                data: req.file.buffer,
                contentType: req.file.mimetype,
            };
        }
        const product = yield product_model_1.default.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
        });
        if (!product)
            return res.status(404).json({ message: "Product not found" });
        res.json(Object.assign(Object.assign({}, product.toObject()), { image: ((_a = product.image) === null || _a === void 0 ? void 0 : _a.data)
                ? `data:${product.image.contentType};base64,${product.image.data.toString("base64")}`
                : null }));
    }
    catch (error) {
        res.status(400).json({ error: "Failed to update product", details: error });
    }
});
exports.updateProduct = updateProduct;
// Delete product
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield product_model_1.default.findByIdAndDelete(req.params.id);
        if (!product)
            return res.status(404).json({ message: "Product not found" });
        res.json({ message: "Product deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to delete product", details: error });
    }
});
exports.deleteProduct = deleteProduct;
