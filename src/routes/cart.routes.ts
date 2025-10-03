import { Router } from "express";
import { addToCart, getCart, updateCartItem, removeFromCart } from "../controllers/cart.controller";
import { auth } from "../middleware/auth";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping cart operations
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CartItem:
 *       type: object
 *       required:
 *         - product
 *         - quantity
 *       properties:
 *         product:
 *           type: string
 *           description: Product ID
 *           example: "64f123abc456def7890"
 *         quantity:
 *           type: number
 *           description: Number of products
 *           example: 2
 *     Cart:
 *       type: object
 *       properties:
 *         user:
 *           type: string
 *           description: User ID
 *           example: "64f321abc987def6540"
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CartItem'
 */

/**
 * @swagger
 * /cart/add:
 *   post:
 *     summary: Add an item to the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CartItem'
 *     responses:
 *       200:
 *         description: Item added to cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       400:
 *         description: Bad request
 */
router.post("/add", auth, addToCart);

/**
 * @swagger
 * /cart/:
 *   get:
 *     summary: Get current user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User cart retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       401:
 *         description: Unauthorized
 */
router.get("/", auth, getCart);

/**
 * @swagger
 * /cart/update:
 *   put:
 *     summary: Update an item in the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CartItem'
 *     responses:
 *       200:
 *         description: Cart item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       400:
 *         description: Bad request
 */
router.put("/update", auth, updateCartItem);

/**
 * @swagger
 * /cart/remove:
 *   delete:
 *     summary: Remove an item from the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product
 *             properties:
 *               product:
 *                 type: string
 *                 description: Product ID to remove
 *                 example: "64f123abc456def7890"
 *     responses:
 *       200:
 *         description: Item removed from cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       400:
 *         description: Bad request
 */
router.delete("/remove", auth, removeFromCart);

export default router;
