import express from "express";
import Tenant from "../models/Tenant.js";
const router = express.Router();
import { encryptKey } from "../helpers/encryptKey.js";


// CREATE
router.post('/create', async (req, res) => {
  try {
    const { name, national_id, national_id_type, url, wp_public_key, wp_private_key } = req.body;
    if (!name || !national_id || !national_id_type) {
      return res.status(400).json({ error: 'Faltan datos requeridos.' });
    }

    // encriptar keys
    const encrypted_wp_public_key = encryptKey(wp_public_key);
    const encrypted_wp_private_key = encryptKey(wp_private_key);
    const tenant = await Tenant.create({
      name, national_id, national_id_type, url, 
      wp_public_key: encrypted_wp_public_key, wp_private_key: encrypted_wp_private_key
    });

    res.status(201).json(tenant);
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar el tenant.', details: error.message });
  }
});

// READ ALL
router.get('/', async (req, res) => {
  try {
    const tenants = await Tenant.findAll();
    res.json(tenants);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los tenants.', details: error.message });
  }
});

// READ ONE
router.get('/:id', async (req, res) => {
  try {
    const tenant = await Tenant.findByPk(req.params.id);
    if (!tenant) return res.status(404).json({ error: 'Tenant no encontrado.' });
    res.json(tenant);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el tenant.', details: error.message });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    const { name, national_id, national_id_type, url, wp_public_key, wp_private_key } = req.body;
    const tenant = await Tenant.findByPk(req.params.id);
    if (!tenant) return res.status(404).json({ error: 'Tenant no encontrado.' });

    // encriptar keys
    const encrypted_wp_public_key = encryptKey(wp_public_key);
    const encrypted_wp_private_key = encryptKey(wp_private_key);

    await tenant.update({ 
      name, national_id, national_id_type, url, 
      wp_public_key: encrypted_wp_public_key, wp_private_key: encrypted_wp_private_key 
    });

    res.json(tenant);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el tenant.', details: error.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const tenant = await Tenant.findByPk(req.params.id);
    if (!tenant) return res.status(404).json({ error: 'Tenant no encontrado.' });
    await tenant.destroy();
    res.json({ message: 'Tenant eliminado.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el tenant.', details: error.message });
  }
});

export default router;
