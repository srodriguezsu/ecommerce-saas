import express from "express";
import Plan from "../models/Plan.js";

const router = express.Router();

// CREATE
router.post('/create', async (req, res) => {
  try {
    const { tenant_id, start_date, end_date, price, description, type } = req.body;
    if (!tenant_id || !price || !type) {
      return res.status(400).json({ error: 'Faltan datos requeridos.' });
    }
    // Verify start_date is before end_date
    if (new Date(start_date) >= new Date(end_date)) {
      return res.status(400).json({ error: 'La fecha de inicio debe ser anterior a la fecha de fin.' });
    }
    const plan = await Plan.create({ tenant_id, start_date, end_date, price, description, type });
    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el plan.', details: error.message });
  }
});

// READ ALL
router.get('/', async (_req, res) => {
  try {
    const plans = await Plan.findAll();
    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los planes.', details: error.message });
  }
});

// READ ONE
router.get('/:id', async (req, res) => {
  try {
    const plan = await Plan.findByPk(req.params.id);
    if (!plan) {
      return res.status(404).json({ error: 'Plan no encontrado.' });
    }
    res.json(plan);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el plan.', details: error.message });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    const plan = await Plan.findByPk(req.params.id);
    if (!plan) {
      return res.status(404).json({ error: 'Plan no encontrado.' });
    }

    // Only update provided fields
    const updatableFields = ['tenant_id', 'start_date', 'end_date', 'price', 'description', 'type'];
    let updated = {};

    for (const field of updatableFields) {
      if (req.body[field] !== undefined) updated[field] = req.body[field];
    }

    // Validate dates if both are provided
    if (updated.start_date !== undefined && updated.end_date !== undefined) {
      if (new Date(updated.start_date) >= new Date(updated.end_date)) {
        return res.status(400).json({ error: 'La fecha de inicio debe ser anterior a la fecha de fin.' });
      }
    }

    await plan.update(updated);
    res.json(plan);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el plan.', details: error.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const plan = await Plan.findByPk(req.params.id);
    if (!plan) {
      return res.status(404).json({ error: 'Plan no encontrado.' });
    }
    await plan.destroy();
    res.json({ message: 'Plan eliminado correctamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el plan.', details: error.message });
  }
});

export default router;