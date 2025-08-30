import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import Tenant from "../models/Tenant.js";
import OTP from "../models/OTP.js";
import { sendEmail } from "../helpers/sendEmail.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const OTP_EXP_TIME = process.env.OTP_EXP_TIME || 10 * 60 * 1000; // 10 minutes

router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "email, password, required" });
  }
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(401).json({ error: "Credenciales inválidas" });
  }
  const tenant = await Tenant.findOne({ where: { id: user.tenant_id } });
  const isValid = await bcrypt.compare(password, user.password_hashed);
  if (!isValid) {
    return res.status(401).json({ error: "Credenciales inválidas" });
  }

  const token = jwt.sign(
    { id: user.id, tenant_id: user.tenant_id, email: user.email },
    JWT_SECRET,
    { expiresIn: "2h" }
  );
  res.json({ user: { id: user.id, email: user.email, name: user.name, last_name: user.last_name, tenant: { id: tenant.id, name: tenant.name, url: tenant.url } }, token });
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
    // if user has an otp that is not expired
    const isExpired = existingOtp.created_at < Date.now() - OTP_EXP_TIME;
    if (!isExpired) {
      return res.status(400).json({ error: "OTP ya enviado" });
    }

    await OTP.update(
      { value: otp, created_at: new Date() },
      { where: { user_id: user.id } }
    );
  } else {
    await OTP.create({ user_id: user.id, value: otp });
  }
  await sendEmail({
    to: email,
    subject: "Cambio de contraseña",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; border: 1px solid #eee; border-radius: 8px; padding: 24px; background: #fafafa;">
        <h2 style="color: #2d3748;">Verificación de seguridad</h2>
        <p>Hola <b>${user.name || user.email}</b>,</p>
        <p>Recibimos una solicitud para cambiar tu contraseña. Por favor, utiliza el siguiente código de verificación para continuar:</p>
        <div style="text-align: center; margin: 24px 0;">
          <span style="font-size: 2rem; letter-spacing: 8px; background: #e2e8f0; padding: 12px 24px; border-radius: 6px; color: #2b6cb0; font-weight: bold;">
            ${otp}
          </span>
        </div>
        <p>Si no solicitaste este cambio, ignora este correo y tu contraseña permanecerá segura.</p>
        <hr style="margin: 32px 0;">
        <p style="font-size: 0.9em; color: #888;">Este código es válido por ${OTP_EXP_TIME / 60000} minutos y solo debe ser usado por ti.</p>
      </div>
    `,
  });
  res.json({ message: "OTP enviado" });
});

router.put("/change-password", async (req, res) => {
  const { email, otp, new_password } = req.body || {};
  if (!email || !otp || !new_password) {
    return res.status(400).json({ error: "email, otp, new_password required" });
  }
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }
  const validOtp = await OTP.findOne({ where: { user_id: user.id, value: otp } });
  if (!validOtp) {
    return res.status(400).json({ error: "OTP inválido" });
  }
  const isExpired = validOtp.created_at < Date.now() - OTP_EXP_TIME;
  if (isExpired) {
    return res.status(400).json({ error: "OTP expirado" });
  }
  try {
    user.password_hashed = await bcrypt.hash(new_password, 10);
    await user.save();
    await validOtp.destroy();
    res.json({ message: "Contraseña cambiada exitosamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al cambiar la contraseña.", details: error.message });
  }
});

export default router;
