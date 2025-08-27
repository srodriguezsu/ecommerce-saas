import dotenv from "dotenv";
dotenv.config();

export function getTenantConfig(tenantId) {
  const t = TENANTS[tenantId];
  if (!t || !t.domain || !t.consumerKey || !t.consumerSecret) return null;
  return t;
}
