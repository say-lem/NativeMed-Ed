# Security review — 9 October 2026

## Dependency results

The screenshots show 142 advisory entries (4 critical, 54 high, 77 moderate,
7 low), although the request mentions 141. They cover only the first 20 entries.
Hostinger's advisory count is not directly comparable with npm's affected-package
count. The deployed versions in the screenshots also differ from this checkout.

Before changes, this checkout had 25 npm audit findings: 17 high, 6 moderate,
2 low, and no critical findings. Compatible updates in package-lock.json reduce
this to 9 high findings in development dependencies. The production audit
(`npm run audit:production`) reports zero known vulnerabilities.

Versions covering packages visible in the screenshots:

| Package | Locked version after remediation |
| --- | --- |
| next | 16.4.0 (already present) |
| axios | 1.20.0 (already present) |
| proxy-addr | 2.0.8 (already present) |
| sharp | 0.35.5 (already present) |
| prosemirror-view | 1.42.6 (already present) |
| @modelcontextprotocol/sdk | 1.32.1 |
| brace-expansion | 1.1.21 and 5.0.12 |
| fast-uri | 3.1.8 |
| source-map-js | 1.2.2 |
| js-yaml | 4.3.2 |

Additional compatible patches include Babel, Hono, body-parser, browserslist,
humanfs, ip-address, markdown-it, qs, and express-rate-limit.

### Unresolved upstream advisory

[GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)
affects braces through 3.0.3. Both the advisory and npm's current release listing
show no patched release. This propagates to nine affected development packages:
braces, micromatch, fast-glob, @next/eslint-plugin-next, eslint-config-next,
@shadcn/registry, @ts-morph/common, ts-morph, and shadcn.

Do not run `npm audit fix --force`: its proposed framework lint/CLI downgrades
are breaking changes and do not establish that the current application remains
supported. Do not feed untrusted glob patterns into this tooling. Revisit when
an upstream fix is released. The findings are not suppressed or relabelled.

## Application fixes

- Removed process-global token refresh sharing; credentials are now deduplicated
  only within a React server render, keyed by that user's refresh token.
- Backend `/auth/me` now verifies identity and role before rendering protected
  layouts. Decoding a JWT is not signature verification. Backend errors and
  inactive accounts fail closed. React request caching avoids duplicate lookups
  within a render; the backend must allow normal authenticated `/auth/me` traffic.
- Settings use the same verified user and do not fall back to unsigned cookies.
- Transport failures retry reads only; a lost response must not replay payments,
  account changes, or other mutations.
- Checkout return origins come from APP_URL / NEXT_PUBLIC_APP_URL /
  NEXT_PUBLIC_SITE_URL, with the canonical site as the production default.
  Browser-provided origins and forwarding headers are no longer trusted.
- Redirect validation rejects control characters and backslashes that browsers
  can normalize into an external destination. Missing/invalid JWT expiry fails closed.
- PDF proxies allow only HTTPS res.cloudinary.com URLs, disallow redirects,
  bound fetch time, disable caching, reject HTML, force PDF responses with a
  sandbox policy, and no longer log signed file URLs.

## Deployment and verification

These changes are local; Hostinger has not been redeployed or rescanned.
Deploy the updated source and package-lock.json using a clean `npm ci` install,
then build with `npm run build`. Do not reuse the old node_modules or .next
artifact. Install build dependencies for the build; use production-only
dependencies for the running deployment where the hosting workflow supports it.
Do not omit dev dependencies before building (Tailwind is needed for the build).
Set APP_URL=https://nativemeded.co.uk in production, or the intended HTTPS origin
for a staging deployment.

Run `npm run test:security`, `npm run audit:production`, `npm audit`,
`npm run lint`, and `npm run build`. After deployment, smoke-test login, refresh,
admin access, settings, checkout return links, and PDF downloads, then rerun
Hostinger's scan. Obtain its full export if findings remain beyond the known
development-tooling advisory. This repository does not include the backend;
backend authorization, payment enforcement, rate limits, and Hostinger's full
server inventory have not been audited here.

### Local validation results

- Six security regression tests pass, including concurrent-user refresh isolation.
- TypeScript (`tsc --noEmit --incremental false`) passes.
- Production build passes. Existing dynamic-render diagnostics for cookie-using
  pages are logged during prerender discovery; they do not fail the build.
- ESLint passes for the changed application files and regression tests.
- Full-project lint remains blocked by an existing `react-hooks/set-state-in-effect`
  error in BookingProductsManager.tsx:30, plus three existing unused-symbol warnings.
- Production audit: 0 findings. Full audit: 9 high development-tooling findings
  from the unpatched braces advisory described above.
