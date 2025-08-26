import dotenv from "dotenv";
dotenv.config();

export const TENANTS = {
  tenantA: {
    domain: process.env.TENANT_A_DOMAIN,
    consumerKey: process.env.TENANT_A_CK,
    consumerSecret: process.env.TENANT_A_CS,
  },
  tenantB: {
    domain: process.env.TENANT_B_DOMAIN,
    consumerKey: process.env.TENANT_B_CK,
    consumerSecret: process.env.TENANT_B_CS,
  },
};

export function getTenantConfig(tenantId) {
  const t = TENANTS[tenantId];
  if (!t || !t.domain || !t.consumerKey || !t.consumerSecret) return null;
  return t;
}
