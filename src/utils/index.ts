/**
 * 拼接 url 和参数
 * @param url 
 * @param query 
 * @returns 
 */
export function joinUrlWithQuery(url: string, query: Record<string, string>) {
  if (!url) throw new Error("URL 不能为空");
  if (!query || typeof query !== "object") return url;

  const urlObj = new URL(url,  window.location.origin);

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      urlObj.searchParams.set(key, value);
    }
  });

  return urlObj.pathname + urlObj.search;
}