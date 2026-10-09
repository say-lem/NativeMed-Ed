/**
 * Validate a post-login redirect target. Only internal, absolute paths are
 * allowed — anything that could point off-site (protocol-relative `//host`,
 * `/\host`, or an absolute URL) falls back to `fallback`. This prevents an
 * open-redirect via a crafted `?redirect=` param.
 */
export function safeRedirect(
  target: string | undefined | null,
  fallback = "/dashboard",
): string {
  if (!target || !target.startsWith("/") || /[\\\x00-\x20\x7f]/.test(target)) return fallback;
  // Reject protocol-relative ("//evil.com") and backslash tricks ("/\evil.com").
  if (target.startsWith("//") || target.startsWith("/\\")) return fallback;
  return target;
}
