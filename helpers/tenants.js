import dotenv from "dotenv";
import Tenant from "../models/Tenant.js";
import { decryptKey } from "./encryptKey.js";
import { Op } from "sequelize";
dotenv.config();

// Helper to find tenant and active plan
export async function findTenantWithActivePlan(tenantId) {
  const tenant = await Tenant.findByPk(tenantId);
  if (!tenant) return { tenant: null, plan: null };

  const today = new Date();
  const plans = await tenant.getPlans({
    where: {
      start_date: { [Op.lte]: today },
      end_date: { [Op.gte]: today }
    },
    limit: 1
  });

  return { tenant, plan: plans?.[0] || null };
}

export async function getWooConfig(tenantId) {
  const { tenant, plan } = await findTenantWithActivePlan(tenantId);
  if (!tenant || !tenant.url || !tenant.woo_public_key || !tenant.woo_private_key || !plan) return null;
  return {
    id: tenant.id,
    domain: tenant.url,
    consumerKey: decryptKey(tenant.woo_public_key),
    consumerSecret: decryptKey(tenant.woo_private_key),
    plan
  };
}

export async function getWPConfig(tenantId) {
  const { tenant, plan } = await findTenantWithActivePlan(tenantId);
  if (!tenant || !tenant.url || !tenant.wp_public_key || !tenant.wp_private_key || !plan) return null;
  return {
    id: tenant.id,
    domain: tenant.url,
    consumerKey: decryptKey(tenant.wp_public_key),
    consumerSecret: decryptKey(tenant.wp_private_key),
    plan
  };
}