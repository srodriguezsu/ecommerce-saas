import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import OTP from "../models/OTP.js";
import { sendEmail } from "../helpers/sendEmail.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";


router.post("/login", async (req, res) => {
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

router.post("/send-otp", async (req, res) => {
  const { email } = req.body || {};
  if (!email) {
    return res.status(400).json({ error: "email required" });
  }
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // find if an otp for that user had already been sent
  const existingOtp = await OTP.findOne({ where: { user_id: user.id } });
  if (existingOtp) {
    await OTP.update(
      { value: otp, created_at: new Date() },
      { where: { user_id: user.id } }
    );
  } else {
    await OTP.create({ user_id: user.id, value: otp });
  }
  await sendEmail({
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}`,
  });
  res.json({ message: "OTP creado" });
});


export default router;
