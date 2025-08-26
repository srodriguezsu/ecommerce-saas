import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const SALT_ROUNDS = 10;

router.post("/singin", (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "email, password, required" });
  }
  // TODO find user info and verify password from the db
  const token = jwt.sign(
    { email }, // TODO add user's id
    JWT_SECRET,
    { expiresIn: "2h" }
  );
  res.json({ token });
});

router.post("/signup", async (req, res) => {
    const { email, password, tenant_id, name, last_name } = req.body || {};
    if (!email || !password) {
        return res.status(400).json({ error: "email, password, tenantId required" });
    }
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{12,}$/;

  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      error:
        "La contraseña debe tener al menos 12 caracteres, una mayúscula, una minúscula, un número y un carácter especial",
    });
  }    
    // TODO hash the password
    const password_hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({
        email,
        password_hashed,
        tenant_id,
        name,
        last_name
    })
    const token = jwt.sign(
        { email }, // TODO add user's id
        JWT_SECRET,
        { expiresIn: "2h" }
    );
    res.json({ token });
})

export default router;
