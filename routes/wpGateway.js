import express from "express";
import axios from "axios";
import { authJWT } from "../middleware/authJWT.js";
import { getWPConfig } from "../helpers/tenants.js";
import { buildWPUrl } from "../helpers/urlBuilder.js";

const router = express.Router();

// Allowed WordPress REST API resources
const ALLOWED_WP_RESOURCES = new Set([
  "posts",
  "pages",
  "categories",
  "tags",
  "media",
  "users",
  "comments",
]);

router.all("/*", authJWT, async (req, res) => {
  try {
    const tenant_id = req.user?.tenant_id;
    const tenant = await getWPConfig(tenant_id);
    console.log("Tenant WP config:", tenant);
    if (!tenant) return res.status(403).json({ error: "Tenant not configured" });

    const resourcePath = req.params[0] || "";
    const firstSegment = (resourcePath.split("/")[0] || "").toLowerCase();

    if (!ALLOWED_WP_RESOURCES.has(firstSegment)) {
      return res.status(403).json({ error: `Resource not allowed: ${firstSegment}` });
    }

    const method = req.method.toUpperCase();
    if (!["GET", "POST", "PUT", "DELETE", "PATCH"].includes(method)) {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const targetUrl = buildWPUrl(tenant, resourcePath, req.query);

    const axiosCfg = {
      method,
      url: targetUrl,
      timeout: 15000,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      auth: {
        username: tenant.consumerKey,
        password: tenant.consumerSecret
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
    console.error("WP Proxy error:", err?.message);
    res.status(502).json({ error: "Bad gateway", detail: err?.message });
  }
});

export default router;
