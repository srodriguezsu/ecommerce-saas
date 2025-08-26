import { URLSearchParams } from "url";

export function buildWooUrl(tenant, resourcePath, originalQuery) {
  const base = `${tenant.domain.replace(/\/$/, "")}/wp-json/wc/v3/${resourcePath.replace(/^\/+/, "")}`;
  const params = new URLSearchParams();

  for (const [k, v] of Object.entries(originalQuery || {})) {
    if (k === "consumer_key" || k === "consumer_secret") continue;
    params.append(k, v);
  }

  params.append("consumer_key", tenant.consumerKey);
  params.append("consumer_secret", tenant.consumerSecret);

  return `${base}?${params.toString()}`;
}
