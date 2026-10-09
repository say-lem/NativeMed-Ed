import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { AsyncLocalStorage } from 'node:async_hooks';
import ts from 'typescript';

function load(file, mocks = {}, globals = {}) {
  const output = ts.transpileModule(readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText;
  const exports = {};
  runInNewContext(output, {
    exports, require: (name) => {
      if (name in mocks) return mocks[name];
      throw new Error(`Unexpected import ${name}`);
    }, URL, Response, AbortSignal, process, console, setTimeout, ...globals,
  });
  return exports;
}

test('redirects reject browser-normalized external destinations', () => {
  const { safeRedirect } = load('src/lib/redirect.ts');
  for (const target of ['https://evil.test', '//evil.test', '/\\evil.test', '/\t/evil.test', '/\n/evil.test', '/\r/evil.test']) {
    assert.equal(safeRedirect(target), '/dashboard');
  }
  assert.equal(safeRedirect('/courses?sort=recent'), '/courses?sort=recent');
});

test('missing and malformed JWT expiry fail closed', () => {
  const { isExpired } = load('src/lib/jwt.ts');
  for (const payload of [null, {}, { exp: '99999999999' }, { exp: 0 }]) assert.equal(isExpired(payload), true);
  assert.equal(isExpired({ exp: Date.now() / 1000 + 3600 }), false);
});

test('PDF proxy blocks SSRF destinations before fetching and rejects HTML', async () => {
  const calls = [];
  let type = 'text/html';
  const { fetchStoredPdf } = load('src/lib/pdf-proxy.ts', {}, {
    fetch: async (url, options) => {
      calls.push({ url, options });
      return new Response('data', { headers: { 'content-type': type } });
    },
  });
  for (const url of ['http://127.0.0.1/a', 'https://evil.test/a', 'https://res.cloudinary.com.evil.test/a', 'https://user@res.cloudinary.com/a', 'https://res.cloudinary.com:8443/a', 'https://api.cloudinary.com/v1_1/account/raw/upload', 'https://api.cloudinary.com.evil.test/v1_1/account/raw/download']) {
    await assert.rejects(fetchStoredPdf(url));
  }
  assert.equal(calls.length, 0);
  await assert.rejects(fetchStoredPdf('https://res.cloudinary.com/account/file'));
  type = 'application/pdf';
  const response = await fetchStoredPdf('https://res.cloudinary.com/account/file');
  assert.equal(await response.text(), 'data');
  assert.equal(calls[1].options.redirect, 'error');
  assert.equal(calls[1].options.cache, 'no-store');
  const signedUrl = 'https://api.cloudinary.com/v1_1/account/raw/download?public_id=resource&signature=test&timestamp=123';
  const download = await fetchStoredPdf(signedUrl);
  assert.equal(await download.text(), 'data');
  assert.equal(calls[2].url.href, signedUrl);
  assert.equal(calls[2].options.redirect, 'error');
});

test('identity comes from backend verification and fails closed', async () => {
  let result = { success: true, data: { _id: 'member', role: 'user', isActive: true } };
  const { getSessionUser } = load('src/lib/current-user.ts', {
    'server-only': {}, react: { cache: (fn) => fn },
    '@/lib/session': { getAccessToken: async () => 'forged.admin.token' },
    '@/services/auth.service': { me: async () => { if (result instanceof Error) throw result; return result; } },
  });
  assert.equal((await getSessionUser()).role, 'user');
  result = { success: false };
  assert.equal(await getSessionUser(), null);
  result = new Error('Unauthorized');
  assert.equal(await getSessionUser(), null);
  result = { success: true, data: { isActive: false } };
  assert.equal(await getSessionUser(), null);
});

test('concurrent refreshes never exchange credentials across users', async () => {
  const context = new AsyncLocalStorage();
  const saved = [];
  let onError;
  const api = async (config) => config.headers.get('Authorization');
  api.interceptors = { request: { use() {} }, response: { use(_ok, error) { onError = error; } } };
  load('src/lib/api.ts', {
    'server-only': {}, react: { cache: (fn) => fn },
    axios: {
      create: () => api,
      post: async (_url, { refreshToken }) => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        return { data: { success: true, data: { accessToken: `${refreshToken}-access`, refreshToken: `${refreshToken}-new` } } };
      },
    },
    './session': {
      getRefreshToken: async () => context.getStore(),
      setSession: async (tokens) => saved.push([context.getStore(), tokens.accessToken]),
    },
  });
  const run = (user) => context.run(user, () => onError({
    response: { status: 401 }, config: { url: '/private', method: 'get', headers: new Map() },
  }));
  assert.deepEqual(await Promise.all([run('alice'), run('bob')]), ['Bearer alice-access', 'Bearer bob-access']);
  assert.deepEqual(saved.sort(), [['alice', 'alice-access'], ['bob', 'bob-access']]);
  const error = { code: 'ECONNRESET', config: { method: 'post' } };
  await assert.rejects(onError(error), (actual) => actual === error);
});

test('checkout ignores untrusted client origins', async () => {
  const { getOrigin } = load('src/lib/checkout.ts', {
    'server-only': {}, axios: {}, '@/lib/site': { SITE_URL: 'https://nativemeded.co.uk' },
    '@/services/payments.service': {},
  }, { process: { env: { NODE_ENV: 'production' } } });
  assert.equal(await getOrigin('https://evil.test'), 'https://nativemeded.co.uk');
});
