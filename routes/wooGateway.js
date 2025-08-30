import express from "express";
import axios from "axios";
import { authJWT } from "../middleware/authJWT.js";
import { getWooConfig } from "../helpers/tenants.js";
import { buildWooUrl } from "../helpers/urlBuilder.js";

const router = express.Router();

const ALLOWED_WC_RESOURCES = new Set([
  "orders",
  "products",
  "customers",
  "coupons",
  "reports",
  "categories",
  "variations",
  "refunds"
]);

// TODO revisar proxy
router.all("/*", authJWT, async (req, res) => {
  try {
    const tenant_id = req.user?.tenant_id;
    const tenant = await getWooConfig(tenant_id);
    if (!tenant) return res.status(403).json({ error: "Tenant not configured" });

    const resourcePath = req.params[0] || "";
    const firstSegment = (resourcePath.split("/")[0] || "").toLowerCase();

    if (!ALLOWED_WC_RESOURCES.has(firstSegment)) {
      return res.status(403).json({ error: `Resource not allowed: ${firstSegment}` });
    }

    const method = req.method.toUpperCase();
    if (!["GET", "POST", "PUT", "DELETE", "PATCH"].includes(method)) {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const targetUrl = buildWooUrl(tenant, resourcePath, req.query);

    const axiosCfg = {
      method,
      url: targetUrl,
      timeout: 15000,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      validateStatus: () => true
    };

    if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
      axiosCfg.data = req.body;
    }

    const upstream = await axios(axiosCfg);

    const safeHeaders = {};
    for (const [k, v] of Object.entries(upstream.headers || {})) {
      if (!/^set-cookie$/i.test(k)) safeHeaders[k] = v;
    }

    res.status(upstream.status).set(safeHeaders).send(upstream.data);
  } catch (err) {
    console.error("Proxy error:", err?.message);
    res.status(502).json({ error: "Bad gateway", detail: err?.message });
  }
});

export default router;
