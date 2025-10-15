/**
 * 拼接 url 和参数
 * @param url 
 * @param query 
 * @returns 
 */
export function joinUrlWithQuery(url: string, query: Record<string, string>) {
  if (!url) throw new Error("URL 不能为空");
  if (!query || typeof query !== "object") return url;

  // 拆分基础 URL 和已有 query、hash
  const [base, hashPart] = url.split("#");
  const [path, search] = base.split("?");

  // 解析已有 query
  const params: Record<string, string> = {};
  if (search) {
    search.split("&").forEach(pair => {
      const [k, v] = pair.split("=");
      if (k) params[decodeURIComponent(k)] = decodeURIComponent(v || "");
    });
  }

  // 合并新 query
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params[key] = String(value);
    }
  });

  // 重新拼接 query 字符串
  const queryStr = Object.keys(params)
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
    .join("&");

  // 拼接完整 URL（不带 origin）
  return path + (queryStr ? `?${queryStr}` : "") + (hashPart ? `#${hashPart}` : "");
}

/**
 * 判断是否为 URL
 */
export function isUrl(str: string): boolean {
  if (typeof str !== "string") return false;
  // 粗略校验 http(s):// 或 protocol 相对路径 //xxx
  return /^(https?:\/\/|\/\/)[^\s]+$/i.test(str);
}

/**
 * 解析 URL 的 query 参数
 */
export function parseUrlQuery(url: string): Record<string, string> {
  if (!isUrl(url)) {
    throw new Error("传入的字符串不是有效的 URL");
  }

  const result: Record<string, string> = {};

  // 从 URL 中提取 query 部分（忽略 hash）
  const match = url.match(/\?([^#]+)/);
  if (!match) return result;

  // 匹配每个 key=value
  const paramRegex = /([^?&=]+)=?([^&]*)/g;
  let m: RegExpExecArray | null;
  while ((m = paramRegex.exec(match[1])) !== null) {
    const key = decodeURIComponent(m[1]);
    const value = decodeURIComponent(m[2] || "");
    result[key] = value;
  }

  return result;
}

export function isEmpty(val) {
    const flag = Symbol('flag')
    return (val ?? flag) === flag
}