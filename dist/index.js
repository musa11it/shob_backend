"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
const swagger_1 = require("./config/swagger"); // import swagger
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const cart_routes_1 = __importDefault(require("./routes/cart.routes"));
const subscribeRoutes_1 = __importDefault(require("./routes/subscribeRoutes"));
const contactRoutes_1 = __importDefault(require("./routes/contactRoutes"));
const app = (0, express_1.default)();
// CORS
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));
// Body parser
app.use(express_1.default.json());
// Routes
app.use("/api/products", product_routes_1.default);
app.use("/api/auth", auth_routes_1.default);
app.use("/api/orders", orderRoutes_1.default);
app.use("/api/cart", cart_routes_1.default);
app.use("/api/subscribe", subscribeRoutes_1.default);
app.use("/api", contactRoutes_1.default);
// Swagger docs
(0, swagger_1.swaggerDocs)(app);
// Connect DB and start server
(0, db_1.default)();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📄 Swagger docs available at http://localhost:${PORT}/api/docs`);
});
