import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const SALT_ROUNDS = 10;

router.post("/singin", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "email, password, required" });
  }
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(401).json({ error: "Credenciales inválidas" });
  }
  const isValid = await bcrypt.compare(password, user.password_hashed);
  if (!isValid) {
    return res.status(401).json({ error: "Credenciales inválidas" });
  }

  const token = jwt.sign(
    { id: user.id, tenant_id: user.tenant_id, email: user.email },
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

    
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   if (!emailRegex.test(email)) {
       return res.status(400).json({ error: "Correo electrónico inválido" });
   }

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
        { id: user.id, tenant_id: user.tenant_id, email: user.email },
        JWT_SECRET,
        { expiresIn: "2h" }
    );
    res.json({ token });
})

export default router;
