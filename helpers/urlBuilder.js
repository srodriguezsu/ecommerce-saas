import { URLSearchParams } from "url";

export function buildWooUrl(tenant, resourcePath, originalQuery) {
  const base = `${tenant.domain.replace(/\/$/, "")}/wp-json/wc/v3/${resourcePath.replace(/^\/+/, "")}`;
  console.log("Base URL:", base);
  const params = new URLSearchParams();

  for (const [k, v] of Object.entries(originalQuery || {})) {
    if (k === "consumer_key" || k === "consumer_secret") continue;
    params.append(k, v);
  }

  params.append("consumer_key", tenant.consumerKey);
  params.append("consumer_secret", tenant.consumerSecret);

  return `${base}?${params.toString()}`;
}

export function buildWPUrl(tenant, resourcePath, queryParams) {
  const baseUrl = `${tenant.domain}/wp-json/wp/v2/${resourcePath}`;
  const query = new URLSearchParams(queryParams).toString();
  return query ? `${baseUrl}?${query}` : baseUrl;
}

