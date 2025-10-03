import dotenv from "dotenv";
dotenv.config();

import express, { Application } from "express";
import cors from "cors";
import connectDB from "./config/db";
import { swaggerDocs } from "./config/swagger"; // import swagger

import productRoutes from "./routes/product.routes";
import authRoutes from "./routes/auth.routes";
import orderRoutes from "./routes/orderRoutes"; 
import cartRoutes from "./routes/cart.routes";
import subscribeRoutes from "./routes/subscribeRoutes";
import contactRoutes from "./routes/contactRoutes";

const app: Application = express();

// CORS
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

// Body parser
app.use(express.json());

// Routes
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/subscribe", subscribeRoutes);
app.use("/api", contactRoutes);

// Swagger docs
swaggerDocs(app);

// Connect DB and start server
connectDB();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📄 Swagger docs available at http://localhost:${PORT}/api/docs`);
});
