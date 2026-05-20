/**
 * Per-content text direction detection.
 *
 * Rules (post titles and post bodies):
 *   - English (or any LTR-only) text  → "ltr"
 *   - Contains any RTL character      → "rtl"  (covers Farsi, Arabic, Hebrew,
 *                                                bilingual EN+FA, etc.)
 *
 * We intentionally don't try to be smarter (e.g. counting characters or
 * detecting "majority script") because mixed EN+FA reads most naturally as RTL
 * with English fragments embedded — the browser's bidi algorithm handles the
 * inline runs correctly once the block direction is RTL.
 */

// Unicode blocks covering RTL scripts we care about:
//   0590-05FF Hebrew
//   0600-06FF Arabic
//   0700-074F Syriac
//   0750-077F Arabic Supplement
//   08A0-08FF Arabic Extended-A
//   FB1D-FDFF Hebrew/Arabic Presentation Forms-A
//   FE70-FEFF Arabic Presentation Forms-B
const RTL_CHAR_REGEX =
  /[\u0590-\u05FF\u0600-\u06FF\u0700-\u074F\u0750-\u077F\u08A0-\u08FF\uFB1D-\uFDFF\uFE70-\uFEFF]/;

export type TextDirection = "ltr" | "rtl";

export function detectTextDirection(input: string | undefined | null): TextDirection {
  if (!input) {
    return "ltr";
  }
  return RTL_CHAR_REGEX.test(input) ? "rtl" : "ltr";
}

/**
 * Detect direction from HTML by first stripping tags. Used for rich-text post
 * bodies where the raw string contains markup that would otherwise be scanned.
 */
export function detectHtmlTextDirection(html: string | undefined | null): TextDirection {
  if (!html) {
    return "ltr";
  }
  const stripped = html.replace(/<[^>]*>/g, " ");
  return detectTextDirection(stripped);
}
