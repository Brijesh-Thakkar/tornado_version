'use strict';

const interceptaClient = require('../services/interceptaClient');

const WALLET_ADDRESS = /0x[a-fA-F0-9]{40}/;

function parseJsonCandidate(value) {
  if (typeof value !== 'string') return value;
  const candidates = [value];
  // x402 payment headers commonly carry a base64-encoded JSON payment object.
  try {
    candidates.push(Buffer.from(value, 'base64').toString('utf8'));
  } catch {
    // Try the header as plain text below.
  }
  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate);
      if (parsed && typeof parsed === 'object') return parsed;
    } catch {
      // Header may be a scheme plus a serialized object or a raw address.
    }
  }
  return value;
}

function findAddress(value, depth = 0) {
  if (depth > 5 || value == null) return undefined;
  if (typeof value === 'string') return value.match(WALLET_ADDRESS)?.[0];
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findAddress(item, depth + 1);
      if (found) return found;
    }
    return undefined;
  }
  if (typeof value !== 'object') return undefined;

  const preferred = ['payerAddress', 'payer', 'from', 'walletAddress', 'address', 'signer'];
  for (const key of preferred) {
    if (value[key] !== undefined) {
      const found = findAddress(value[key], depth + 1);
      if (found) return found;
    }
  }
  for (const [key, nested] of Object.entries(value)) {
    if (!preferred.includes(key)) {
      const found = findAddress(nested, depth + 1);
      if (found) return found;
    }
  }
  return undefined;
}

function getHeader(req, name) {
  if (typeof req.get === 'function') return req.get(name);
  const headers = req.headers || {};
  return headers[name.toLowerCase()];
}

function extractPayerAddress(req) {
  // Prefer x402's structured payment headers, with Authorization as a fallback.
  for (const name of ['x-payment', 'payment-signature', 'x-payment-signature', 'authorization']) {
    const candidate = parseJsonCandidate(getHeader(req, name));
    const address = findAddress(candidate);
    if (address) return address;
  }
  return findAddress(req.body);
}

function extractChainId(req) {
  const raw = req.chainId
    ?? req.context?.chainId
    ?? req.body?.chainId
    ?? getHeader(req, 'x-chain-id')
    ?? getHeader(req, 'chain-id');
  if (raw === undefined || raw === null || raw === '') return 1;
  const parsed = Number(raw);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

function createScreenIncomingPayment({ intercepta = interceptaClient } = {}) {
  return async function screenIncomingPayment(req, res, next) {
    const payerAddress = extractPayerAddress(req);
    if (!payerAddress) {
      return res.status(400).json({
        error: 'Payer wallet address is required for payment screening',
        code: 'PAYER_ADDRESS_MISSING',
      });
    }

    try {
      const result = await intercepta.screenAddress(payerAddress, extractChainId(req));
      if (result.verdict === 'BLOCK') {
        return res.status(402).json({
          error: 'Payment rejected by security layer',
          code: 'COUNTERPARTY_RISK_HIGH',
          reasons: result.reasons,
        });
      }
      req.payerRiskProfile = { verdict: 'PASS', riskScore: result.riskScore };
      return next();
    } catch (error) {
      // Never continue to settlement when screening itself is unavailable.
      return res.status(503).json({
        error: 'Payment screening unavailable',
        code: 'SCREENING_UNAVAILABLE',
      });
    }
  };
}

const screenIncomingPayment = createScreenIncomingPayment();

module.exports = {
  screenIncomingPayment,
  createScreenIncomingPayment,
  extractPayerAddress,
  extractChainId,
};
