"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const contactController_1 = require("../controllers/contactController");
const validateRequest_1 = __importDefault(require("../middleware/validateRequest"));
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Contact
 *   description: Contact form endpoints
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Contact:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Contact ID
 *           example: "64f987abc123def4560"
 *         name:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           example: johndoe@example.com
 *         subject:
 *           type: string
 *           example: Inquiry
 *         message:
 *           type: string
 *           example: "Hello, I need help with your product."
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-10-02T08:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-10-02T08:05:00.000Z"
 *     ContactRequest:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - message
 *       properties:
 *         name:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           example: johndoe@example.com
 *         subject:
 *           type: string
 *           example: Inquiry
 *         message:
 *           type: string
 *           example: "Hello, I need help with your product."
 */
/**
 * @swagger
 * /contact/create:
 *   post:
 *     summary: Create a new contact message
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContactRequest'
 *     responses:
 *       201:
 *         description: Contact created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 *       400:
 *         description: Validation error
 */
router.post("/create", [
    (0, express_validator_1.body)("name").notEmpty().withMessage("Name is required"),
    (0, express_validator_1.body)("email").isEmail().withMessage("Valid email required"),
    (0, express_validator_1.body)("message").notEmpty().withMessage("Message is required"),
], validateRequest_1.default, contactController_1.createContact);
exports.default = router;
