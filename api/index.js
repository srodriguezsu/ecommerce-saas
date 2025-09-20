import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import morgan from "morgan";

import authRouter from "../routes/auth.js";
import planRouter from "../routes/plan.js";
import tenantRouter from "../routes/tenant.js";
import userRouter from "../routes/user.js";
import wooGatewayRouter from "../routes/wooGateway.js";
import wpGatewayRouter from "../routes/wpGateway.js";
import wooAnalyticsGatewayRouter from "../routes/wooAnalyticsGateway.js";

import { superPassword } from "../middleware/superPassword.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(helmet());
app.use(cors({ 
  origin: true, // allow all origins
  credentials: true 
}));
app.use(morgan("combined"));

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
});
app.use(limiter);

const PORT = process.env.PORT || 3002;

// Auth routes
app.use("/auth", authRouter);


// Apply superPassword middleware to all /super/ routes
app.use("/super", superPassword);
app.use("/super/tenant", tenantRouter);
app.use("/super/plan", planRouter);
app.use("/super/user", userRouter);

// WooCommerce gateway
app.use("/api/woo", wooGatewayRouter);
app.use("/api/woo-analytics", wooAnalyticsGatewayRouter);

//WordPress gateway
app.use("/api/wp", wpGatewayRouter);

// Healthcheck
app.get("/health", (_req, res) => res.json({ ok: true }));

// app.listen(PORT, () => {
//   console.log(`Gateway listening on http://localhost:${PORT}`);
// });
// Serverless for vercel
import serverless from "serverless-http";

export const handler = serverless(app);
