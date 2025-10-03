import { Response } from "express";
import Cart from "../models/cart.model";
import Product from "../models/product.model";
import { AuthRequest } from "../middleware/auth";

// Add product to cart (or increase quantity)
export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    const { productId, quantity = 1 } = req.body;
    if (!productId) return res.status(400).json({ message: "Product ID is required" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ user: req.user?.userId });
    if (!cart) {
      cart = await Cart.create({
        user: req.user?.userId,
        items: [{ product: productId, quantity }],
      });
    } else {
      const existingItem = cart.items.find((i) => i.product.toString() === productId);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }
      await cart.save();
    }

    const populatedCart = await cart.populate("items.product");
    return res.json(populatedCart);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Update product quantity in cart
export const updateCartItem = async (req: AuthRequest, res: Response) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId || quantity < 1) return res.status(400).json({ message: "Invalid input" });

    const cart = await Cart.findOne({ user: req.user?.userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find((i) => i.product.toString() === productId);
    if (!item) return res.status(404).json({ message: "Product not in cart" });

    item.quantity = quantity;
    await cart.save();

    const populatedCart = await cart.populate("items.product");
    return res.json(populatedCart);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get user cart
export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    const cart = await Cart.findOne({ user: req.user?.userId }).populate("items.product");
    if (!cart) return res.json({ items: [] });

    return res.json(cart);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Remove product from cart
export const removeFromCart = async (req: AuthRequest, res: Response) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ message: "Product ID required" });

    const cart = await Cart.findOne({ user: req.user?.userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((i) => i.product.toString() !== productId);
    await cart.save();

    const populatedCart = await cart.populate("items.product");
    return res.json(populatedCart);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
