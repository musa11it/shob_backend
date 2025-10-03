"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const subscribeController_1 = require("../controllers/subscribeController");
const validateEmail_1 = require("../middleware/validateEmail");
const router = express_1.default.Router();
/**
 * @swagger
 * tags:
 *   name: Subscribers
 *   description: Subscriber management endpoints
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Subscriber:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "64f987abc123def4560"
 *         email:
 *           type: string
 *           example: "subscriber@example.com"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-10-02T08:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-10-02T08:05:00.000Z"
 *     SubscriberRequest:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           example: "subscriber@example.com"
 */
/**
 * @swagger
 * /subscribe:
 *   post:
 *     summary: Subscribe with an email
 *     tags: [Subscribers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SubscriberRequest'
 *     responses:
 *       201:
 *         description: Subscriber added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subscriber'
 *       400:
 *         description: Validation error or email already exists
 */
router.post("/", validateEmail_1.validateEmail, subscribeController_1.subscribe);
/**
 * @swagger
 * /subscribe:
 *   get:
 *     summary: Get all subscribers
 *     tags: [Subscribers]
 *     responses:
 *       200:
 *         description: List of subscribers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Subscriber'
 */
router.get("/", subscribeController_1.getSubscribers);
/**
 * @swagger
 * /subscribe/{id}:
 *   delete:
 *     summary: Delete a subscriber by ID
 *     tags: [Subscribers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Subscriber ID
 *     responses:
 *       200:
 *         description: Subscriber deleted successfully
 *       404:
 *         description: Subscriber not found
 */
router.delete("/:id", subscribeController_1.deleteSubscriber);
exports.default = router;
