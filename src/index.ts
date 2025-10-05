import dotenv from "dotenv";
dotenv.config();

import express, { Application } from "express";
import cors from "cors";
import connectDB from "./config/db";
import { swaggerDocs } from "./config/swagger"; // Swagger setup

import productRoutes from "./routes/product.routes";
import authRoutes from "./routes/auth.routes";
import orderRoutes from "./routes/orderRoutes";
import cartRoutes from "./routes/cart.routes";
import subscribeRoutes from "./routes/subscribeRoutes";
import contactRoutes from "./routes/contactRoutes";

const app: Application = express();


app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://your-frontend-domain.vercel.app", 
    "https://shob-backend.onrender.com" // allow backend origin too
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));


app.use(express.json());


app.get("/", (req, res) => {
  res.send(" Shob Backend API is running successfully. Visit /api/docs for Swagger documentation.");
});


app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/subscribe", subscribeRoutes);
app.use("/api", contactRoutes);


swaggerDocs(app);


connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📄 Swagger docs available at http://localhost:${PORT}/api/docs`);
});
