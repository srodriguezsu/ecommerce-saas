import express from "express";
import axios from "axios";
import { authJWT } from "../middleware/authJWT.js";
import { getWooConfig } from "../helpers/tenants.js";

const router = express.Router();

// Solo permite GET
router.get("/*", authJWT, async (req, res) => {
  try {
    const tenant_id = req.user?.tenant_id;
    const tenant = await getWooConfig(tenant_id);
    if (!tenant) return res.status(403).json({ error: "Tenant not configured" });

    // Construye la URL para /wp-json/wc-analytics/*
    const resourcePath = req.params[0] || "";
    const baseUrl = `${tenant.domain.replace(/\/$/, "")}/wp-json/wc-analytics/${resourcePath.replace(/^\/+/, "")}`;
    const params = new URLSearchParams();

    // Copia los query params originales
    for (const [k, v] of Object.entries(req.query || {})) {
      if (k === "consumer_key" || k === "consumer_secret") continue;
      params.append(k, v);
    }

    // Adjunta credenciales del tenant
    params.append("consumer_key", tenant.consumerKey);
    params.append("consumer_secret", tenant.consumerSecret);

    const targetUrl = `${baseUrl}?${params.toString()}`;

    const axiosCfg = {
      method: "GET",
      url: targetUrl,
      timeout: 15000,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      validateStatus: () => true
    };

    const upstream = await axios(axiosCfg);

    const safeHeaders = {};
    for (const [k, v] of Object.entries(upstream.headers || {})) {
      if (!/^set-cookie$/i.test(k)) safeHeaders[k] = v;
    }

    res.status(upstream.status).set(safeHeaders).send(upstream.data);
  } catch (err) {
    console.error("Woo Analytics Proxy error:", err?.message);
    res.status(502).json({ error: "Bad gateway", detail: err?.message });
  }
});

export default router;