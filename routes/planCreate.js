const express = require('express');
const router = express.Router();
const { Plan } = require('../models');

// Ruta para crear un nuevo plan
router.post('/create', async (req, res) => {
  try {
    const { name, price, description } = req.body;
    if (!name || !price) {
      return res.status(400).json({ error: 'Faltan datos requeridos.' });
    }
    const plan = await Plan.create({ name, price, description });
    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el plan.', details: error.message });
  }
});

export default router;