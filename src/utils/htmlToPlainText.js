/**
 * Job APIs often return descriptions as HTML strings. React shows those as raw
 * text unless we parse them. This extracts readable plain text (no tags).
 */
export function htmlToPlainText(html) {
  if (html == null || typeof html !== "string") return "";

  const withLineBreaks = html.replace(/<br\s*\/?>/gi, "\n");
  const doc = new DOMParser().parseFromString(withLineBreaks, "text/html");
  const text = doc.body.textContent ?? "";

  return text.replace(/\n{3,}/g, "\n\n").trim();
}
