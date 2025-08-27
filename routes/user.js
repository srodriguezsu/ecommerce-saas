import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import { sendEmail } from "../helpers/sendEmail.js"; // Add this import

const router = express.Router();
const SALT_ROUNDS = 10;

// CREATE
router.post("/create", async (req, res) => {
  const { email, password, tenant_id, name, last_name } = req.body || {};
  if (!email || !password || !tenant_id) {
    return res.status(400).json({ error: "email, password, tenant_id required" });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Correo electrónico inválido" });
  }
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{12,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      error: "La contraseña debe tener al menos 12 caracteres, una mayúscula, una minúscula, un número y un carácter especial",
    });
  }
  try {
    const password_hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({
      email,
      password_hashed,
      tenant_id,
      name,
      last_name,
    });

    // Send welcome email
    await sendEmail({
      to: email,
      subject: "¡Bienvenido a la plataforma!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; border: 1px solid #eee; border-radius: 8px; padding: 24px; background: #fafafa;">
          <h2 style="color: #2d3748;">¡Bienvenido${name ? `, ${name}` : ""}!</h2>
          <p>Tu cuenta ha sido creada exitosamente en nuestra plataforma.</p>
          <p>Ahora puedes iniciar sesión y comenzar a usar nuestros servicios.</p>
          <hr style="margin: 32px 0;">
          <p style="font-size: 0.9em; color: #888;">Si tienes alguna duda, responde a este correo y nuestro equipo te ayudará.</p>
        </div>
      `,
    });

    res.status(201).json({ user });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        error: "El correo electrónico ya está registrado.",
        details: error.errors?.map(e => e.message).join(", "),
      });
    }
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        error: "Error de validación.",
        details: error.errors?.map(e => e.message).join(", "),
      });
    }
    res.status(500).json({ error: "Error al crear el usuario.", details: error.message });
  }
});

// READ ALL
router.get("/", async (_req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los usuarios.", details: error.message });
  }
});

// READ ONE
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el usuario.", details: error.message });
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }
    // If password is being updated, hash it
    if (req.body.password) {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{12,}$/;
      if (!passwordRegex.test(req.body.password)) {
        return res.status(400).json({
          error: "La contraseña debe tener al menos 12 caracteres, una mayúscula, una minúscula, un número y un carácter especial",
        });
      }
      req.body.password_hashed = await bcrypt.hash(req.body.password, SALT_ROUNDS);
      delete req.body.password;
    }
    await user.update(req.body);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el usuario.", details: error.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }
    await user.destroy();
    res.json({ message: "Usuario eliminado correctamente." });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el usuario.", details: error.message });
  }
});

export default router;