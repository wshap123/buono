const maxFetchedContentLength = 150_000;
const fetchTimeoutMs = 15_000;

const browserHeaders = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
};

export function parseRecipeUrl(url: string) {
  const trimmedUrl = url.trim();

  if (!trimmedUrl) {
    throw new Error("Recipe URL is required.");
  }

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(trimmedUrl);
  } catch {
    throw new Error("Enter a valid recipe URL.");
  }

  if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
    throw new Error("Only http and https recipe URLs are supported.");
  }

  return parsedUrl.toString();
}

function htmlToText(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxFetchedContentLength);
}

export async function fetchRecipeUrlContent(url: string) {
  try {
    const response = await fetch(url, {
      headers: browserHeaders,
      redirect: "follow",
      signal: AbortSignal.timeout(fetchTimeoutMs),
    });

    if (!response.ok) {
      return null;
    }

    const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";

    if (
      !contentType.includes("text/html") &&
      !contentType.includes("application/xhtml+xml") &&
      !contentType.includes("application/json")
    ) {
      return null;
    }

    const rawContent = await response.text();
    const text = htmlToText(rawContent);

    return text || null;
  } catch {
    return null;
  }
}
