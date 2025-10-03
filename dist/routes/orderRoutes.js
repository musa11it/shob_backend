"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderController_1 = require("../controllers/orderController");
const validateOrder_1 = require("../middleware/validateOrder");
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management endpoints
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     CartItem:
 *       type: object
 *       required:
 *         - id
 *         - title
 *         - price
 *         - quantity
 *       properties:
 *         id:
 *           type: string
 *           example: "64f123abc456def7890"
 *         title:
 *           type: string
 *           example: "Product Name"
 *         price:
 *           type: number
 *           example: 49.99
 *         quantity:
 *           type: number
 *           example: 2
 *         image:
 *           type: string
 *           example: "http://example.com/product.jpg"
 *     ClientInfo:
 *       type: object
 *       required:
 *         - fullName
 *         - email
 *         - address
 *       properties:
 *         fullName:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           example: johndoe@example.com
 *         phone:
 *           type: string
 *           example: "+123456789"
 *         address:
 *           type: string
 *           example: "123 Main St, City, Country"
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "64f321abc987def6540"
 *         clientInfo:
 *           $ref: '#/components/schemas/ClientInfo'
 *         cartItems:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CartItem'
 *         paymentMethod:
 *           type: string
 *           enum: [credit_card, paypal, cash_on_delivery]
 *           example: credit_card
 *         totalAmount:
 *           type: number
 *           example: 99.98
 *         status:
 *           type: string
 *           enum: [pending, paid, shipped, delivered]
 *           example: pending
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     OrderRequest:
 *       type: object
 *       required:
 *         - clientInfo
 *         - cartItems
 *         - paymentMethod
 *         - totalAmount
 *       properties:
 *         clientInfo:
 *           $ref: '#/components/schemas/ClientInfo'
 *         cartItems:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CartItem'
 *         paymentMethod:
 *           type: string
 *           enum: [credit_card, paypal, cash_on_delivery]
 *         totalAmount:
 *           type: number
 *         status:
 *           type: string
 *           enum: [pending, paid, shipped, delivered]
 *           default: pending
 */
/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderRequest'
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Validation error
 */
router.post("/", validateOrder_1.validateOrder, orderController_1.createOrder);
/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: List of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 */
router.get("/", orderController_1.getOrders);
/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get a single order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 */
router.get("/:id", orderController_1.getOrderById);
/**
 * @swagger
 * /orders/{id}:
 *   put:
 *     summary: Update an order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderRequest'
 *     responses:
 *       200:
 *         description: Order updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Order not found
 */
router.put("/:id", orderController_1.updateOrder);
/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Delete an order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *       404:
 *         description: Order not found
 */
router.delete("/:id", orderController_1.deleteOrder);
exports.default = router;
