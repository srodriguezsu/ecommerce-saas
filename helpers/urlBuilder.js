import { URLSearchParams } from "url";

export function buildWooUrl(tenant, resourcePath, originalQuery) {
  const base = `${tenant.domain.replace(/\/$/, "")}/wp-json/wc/v3/${resourcePath.replace(/^\/+/, "")}`;

  const params = new URLSearchParams();

  for (const [k, v] of Object.entries(originalQuery || {})) {
    if (k === "consumer_key" || k === "consumer_secret") continue;
    params.append(k, v);
  }

  return `${base}?${params.toString()}`;
}

export function buildWPUrl(tenant, resourcePath, queryParams) {
  const baseUrl = `${tenant.domain}/wp-json/wp/v2/${resourcePath}`;
  const query = new URLSearchParams(queryParams).toString();
  return query ? `${baseUrl}?${query}` : baseUrl;
}

