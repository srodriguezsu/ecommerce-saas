import express from "express";
import Tenant from "../models/Tenant.js";
const router = express.Router();

// Ruta para registrar un nuevo tenant
router.post('/create', async (req, res) => {
  try {
    const { name, email, planId } = req.body;
    if (!name || !email || !planId) {
      return res.status(400).json({ error: 'Faltan datos requeridos.' });
    }
    const tenant = await Tenant.create({ name, email, planId });
    res.status(201).json(tenant);
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar el tenant.', details: error.message });
  }
});



export default router;
