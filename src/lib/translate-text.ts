const MYMEMORY_URL = "https://api.mymemory.translated.net/get";

function hasCjk(text: string): boolean {
  return /[\u4e00-\u9fff]/.test(text);
}

/** Machine-translate English hotel copy to Simplified Chinese */
export async function translateEnToZh(text: string): Promise<string | null> {
  const trimmed = text.trim();
  if (!trimmed || hasCjk(trimmed)) return trimmed || null;
  if (trimmed.length > 450) {
    const chunks: string[] = [];
    let rest = trimmed;
    while (rest.length > 0) {
      let cut = rest.slice(0, 420);
      if (rest.length > 420) {
        const punct = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("，"), cut.lastIndexOf("。"));
        if (punct > 120) cut = rest.slice(0, punct + 1);
      }
      chunks.push(cut.trim());
      rest = rest.slice(cut.length).trim();
    }
    const parts: string[] = [];
    for (const chunk of chunks) {
      const t = await translateEnToZh(chunk);
      if (!t) return null;
      parts.push(t);
      await new Promise((r) => setTimeout(r, 350));
    }
    return parts.join("");
  }

  try {
    const q = encodeURIComponent(trimmed);
    const res = await fetch(`${MYMEMORY_URL}?q=${q}&langpair=en|zh-CN`, {
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      responseData?: { translatedText?: string };
      responseStatus?: number;
    };
    const out = data.responseData?.translatedText?.trim();
    if (!out || data.responseStatus === 403) return null;
    return out.replace(/&#39;/g, "'").replace(/&quot;/g, '"');
  } catch {
    return null;
  }
}