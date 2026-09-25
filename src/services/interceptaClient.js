'use strict';

const { loadEnv } = require('../config/env');

const UNAVAILABLE_MESSAGE = 'Intercepta screening unavailable - transaction blocked';
const ENDPOINTS = Object.freeze({
  address: '/v1/address/risk',
  token: '/v1/tokens/check',
  transaction: '/v1/transactions/simulate',
});

function normalizeResponse(response) {
  const payload = response && response.data && typeof response.data === 'object'
    ? response.data
    : response || {};
  const rawScore = payload.risk_score ?? payload.riskScore ?? payload.score ?? 0;
  const parsedScore = Number(rawScore);
  const riskScore = Number.isFinite(parsedScore) ? parsedScore : 0;
  const rawReasons = payload.reasons ?? payload.flags ?? payload.indicators ?? [];
  const reasons = Array.isArray(rawReasons)
    ? rawReasons.map((reason) => (typeof reason === 'string' ? reason : reason?.code ?? reason?.type))
      .filter((reason) => typeof reason === 'string')
    : [];

  return { verdict: riskScore < 70 ? 'PASS' : 'BLOCK', riskScore, reasons };
}

function endpointUrl(baseUrl, path) {
  // The default base URL already includes /v1; avoid producing /v1/v1/... .
  const base = new URL(baseUrl);
  const prefix = base.pathname.replace(/\/+$/, '');
  const suffix = path.startsWith('/v1/') && prefix.endsWith('/v1')
    ? path.slice(3)
    : path;
  base.pathname = `${prefix}${suffix}`.replace(/\/{2,}/g, '/');
  return base.toString();
}

function createInterceptaClient({
  config = loadEnv(),
  fetchImpl = globalThis.fetch,
  logger = console,
} = {}) {
  if (typeof fetchImpl !== 'function') {
    throw new Error('A fetch implementation is required');
  }

  async function post(path, body) {
    try {
      let response;
      for (let attempt = 0; attempt < 2; attempt += 1) {
        response = await fetchImpl(endpointUrl(config.INTERCEPTA_BASE_URL, path), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': config.INTERCEPTA_API_KEY,
          },
          body: JSON.stringify(body),
          signal: AbortSignal.timeout(config.INTERCEPTA_TIMEOUT_MS),
        });
        if (!(response.status >= 500 && response.status <= 599) || attempt === 1) break;
      }

      if (!response.ok) {
        throw new Error(`Intercepta returned HTTP ${response.status}`);
      }
      return normalizeResponse(await response.json());
    } catch (error) {
      if (config.INTERCEPTA_FAIL_CLOSED) {
        throw new Error(UNAVAILABLE_MESSAGE, { cause: error });
      }
      logger.warn?.(`${UNAVAILABLE_MESSAGE}: ${error.message}`);
      return { verdict: 'PASS', riskScore: 0, reasons: [] };
    }
  }

  return Object.freeze({
    screenAddress(address, chainId) {
      return post(ENDPOINTS.address, { address, chainId });
    },
    screenToken(tokenAddress, chainId) {
      return post(ENDPOINTS.token, { tokenAddress, chainId });
    },
    simulateTransaction(txPayload, chainId) {
      return post(ENDPOINTS.transaction, { ...txPayload, chainId });
    },
  });
}

const client = createInterceptaClient();

module.exports = { ...client, createInterceptaClient, normalizeResponse };
