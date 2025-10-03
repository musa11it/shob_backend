import { Router } from "express";
import { body } from "express-validator";
import { createContact } from "../controllers/contactController";
import validateRequest from "../middleware/validateRequest";

const router = Router();

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
router.post(
  "/create",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email required"),
    body("message").notEmpty().withMessage("Message is required"),
  ],
  validateRequest,
  createContact
);

export default router;
