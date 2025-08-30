import express from "express";
import Tenant from "../models/Tenant.js";
const router = express.Router();
import { encryptKey } from "../helpers/encryptKey.js";


// CREATE
router.post('/create', async (req, res) => {
  try {
    const { name, national_id, national_id_type, url, wp_public_key, wp_private_key, woo_public_key, woo_private_key } = req.body;
    if (!name || !national_id || !national_id_type) {
      return res.status(400).json({ error: 'Faltan datos requeridos.' });
    }

    // encriptar keys
    const encrypted_wp_public_key = encryptKey(wp_public_key);
    const encrypted_wp_private_key = encryptKey(wp_private_key);
    const encrypted_woo_public_key = encryptKey(woo_public_key);
    const encrypted_woo_private_key = encryptKey(woo_private_key);

    const tenant = await Tenant.create({
      name, national_id, national_id_type, url, 
      wp_public_key: encrypted_wp_public_key, wp_private_key: encrypted_wp_private_key,
      woo_public_key: encrypted_woo_public_key, woo_private_key: encrypted_woo_private_key
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
    const tenant = await Tenant.findByPk(req.params.id);
    if (!tenant) return res.status(404).json({ error: 'Tenant no encontrado.' });

    // List of fields to update directly
    const directFields = ['name', 'national_id', 'national_id_type', 'url'];
    // List of keys to encrypt
    const keyFields = ['wp_public_key', 'wp_private_key', 'woo_public_key', 'woo_private_key'];

    let updated = {};

    // Update direct fields if provided
    for (const field of directFields) {
      if (req.body[field] !== undefined) updated[field] = req.body[field];
    }

    // Encrypt and update key fields if provided
    for (const key of keyFields) {
      if (req.body[key] !== undefined) {
        updated[key] = encryptKey(req.body[key]);
      }
    }

    await tenant.update(updated);

    // Return the updated tenant
    res.json(tenant);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el tenant.', details: error.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const tenant = await Tenant.findByPk(req.params.id);
    if (!tenant) {
      return res.status(404).json({ error: 'Tenant no encontrado.' });
    }
    await tenant.destroy();
    res.json({ message: 'Tenant eliminado correctamente.' });
  } catch (error) {
    if (
      error.name === 'SequelizeForeignKeyConstraintError' ||
      (error.parent && error.parent.code === 'ER_ROW_IS_REFERENCED_2')
    ) {
      return res.status(409).json({
        error: 'No se puede eliminar el tenant porque tiene planes asociados.',
        details: error.message,
      });
    }
    res.status(500).json({ error: 'Error al eliminar el tenant.', details: error.message });
  }
});

export default router;
