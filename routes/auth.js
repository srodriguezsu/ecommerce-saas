import express from "express";
import jwt from "jsonwebtoken";
import { TENANTS } from "../config/tenants.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

router.post("/login", (req, res) => {
  const { username, password, tenantId } = req.body || {};
  if (!username || !password || !tenantId) {
    return res.status(400).json({ error: "username, password, tenantId required" });
  }
  if (!TENANTS[tenantId]) {
    return res.status(400).json({ error: "Unknown tenantId" });
  }
  const token = jwt.sign(
    { sub: `user:${username}`, tenantId, role: "admin" },
    JWT_SECRET,
    { expiresIn: "2h" }
  );
  res.json({ token });
});



export default router;
