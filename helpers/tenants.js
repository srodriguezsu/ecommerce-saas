import dotenv from "dotenv";
import Tenant from "../models/Tenant.js";
import { decryptKey } from "./encryptKey.js";
dotenv.config();

export async function getWooConfig(tenantId) {
  console.log("Fetching config for tenant ID:", tenantId);
  const tenant = await Tenant.findByPk(tenantId);
  if (!tenant) return null;
  if (!tenant || !tenant.url || !tenant.woo_public_key || !tenant.woo_private_key) return null;
  return {
    id: tenant.id,
    domain: tenant.url,
    consumerKey: decryptKey(tenant.woo_public_key),
    consumerSecret:  decryptKey(tenant.woo_private_key)
  };
}

export async function getWPConfig(tenantId) {
  console.log("Fetching WP config for tenant ID:", tenantId);
  const tenant = await Tenant.findByPk(tenantId);
  if (!tenant || !tenant.url || !tenant.wp_public_key || !tenant.wp_private_key) return null;
  return {
    id: tenant.id,
    domain: tenant.url,
    consumerKey: decryptKey(tenant.wp_public_key),
    consumerSecret: decryptKey(tenant.wp_private_key)
  };
}