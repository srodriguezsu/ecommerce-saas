import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import morgan from "morgan";

import authRouter from "./routes/auth.js";
import tenantRegisterRouter from "./routes/tenantRegister.js";
import planCreateRouter from "./routes/planCreate.js";
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

const PORT = process.env.PORT || 3002;

// Auth routes
app.use("/auth", authRouter);

// Tenant register
app.use("/super/tenant", tenantRegisterRouter);

// Plan create
app.use("/super/plan", planCreateRouter);

// WooCommerce gateway
app.use("/api/woo", wooGatewayRouter);

// Healthcheck
app.get("/health", (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Gateway listening on http://localhost:${PORT}`);
});
