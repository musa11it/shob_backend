"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const product_controller_1 = require("../controllers/product.controller");
const router = (0, express_1.Router)();
// Memory storage for image files
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management endpoints
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "64f321abc987def6540"
 *         name:
 *           type: string
 *           example: "Sample Product"
 *         price:
 *           type: number
 *           example: 49.99
 *         description:
 *           type: string
 *           example: "This is a sample product description."
 *         image:
 *           type: object
 *           properties:
 *             data:
 *               type: string
 *               format: binary
 *             contentType:
 *               type: string
 *               example: "image/png"
 *         inStock:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     ProductRequest:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - description
 *       properties:
 *         name:
 *           type: string
 *           example: "Sample Product"
 *         price:
 *           type: number
 *           example: 49.99
 *         description:
 *           type: string
 *           example: "This is a sample product description."
 *         inStock:
 *           type: boolean
 *           example: true
 *         image:
 *           type: string
 *           format: binary
 */
/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/ProductRequest'
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validation error
 */
router.post("/", upload.single("image"), product_controller_1.createProduct);
/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get("/", product_controller_1.getProducts);
/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */
router.get("/:id", product_controller_1.getProduct);
/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/ProductRequest'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Product not found
 */
router.put("/:id", upload.single("image"), product_controller_1.updateProduct);
/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */
router.delete("/:id", product_controller_1.deleteProduct);
exports.default = router;
