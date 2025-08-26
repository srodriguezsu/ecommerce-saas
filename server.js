import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import morgan from "morgan";

import authRouter from "./routes/auth.js";
import wooGatewayRouter from "./routes/wooGateway.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(morgan("combined"));

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
});
app.use(limiter);

const PORT = process.env.PORT || 3001;

// Auth routes
app.use("/auth", authRouter);

// WooCommerce gateway
app.use("/api/woo", wooGatewayRouter);

// Healthcheck
app.get("/health", (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Gateway listening on http://localhost:${PORT}`);
});
