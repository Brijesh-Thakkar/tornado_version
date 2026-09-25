'use strict';

const DEFAULTS = Object.freeze({
  INTERCEPTA_API_KEY: 'your_intercepta_api_key_here',
  INTERCEPTA_BASE_URL: 'https://api.web3antivirus.io/v1',
  INTERCEPTA_TIMEOUT_MS: 2500,
  INTERCEPTA_FAIL_CLOSED: true,
  MAX_SINGLE_TX_USDC: '500',
  MAX_DAILY_USDC: '2000',
});

function positiveInteger(value, name) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`${name} must be a positive integer`);
  }
  return parsed;
}

function booleanValue(value, name) {
  if (typeof value === 'boolean') return value;
  if (value === 'true' || value === '1') return true;
  if (value === 'false' || value === '0') return false;
  throw new Error(`${name} must be true or false`);
}

function usdcLimit(value, name) {
  const text = String(value);
  if (!/^\d+(?:\.\d{1,6})?$/.test(text)) {
    throw new Error(`${name} must be a non-negative USDC amount with at most 6 decimals`);
  }
  const [whole, fraction = ''] = text.split('.');
  return (BigInt(whole) * 1_000_000n + BigInt(fraction.padEnd(6, '0') || '0')).toString();
}

function loadEnv(source = process.env) {
  const config = {
    INTERCEPTA_API_KEY: source.INTERCEPTA_API_KEY || DEFAULTS.INTERCEPTA_API_KEY,
    INTERCEPTA_BASE_URL: source.INTERCEPTA_BASE_URL || DEFAULTS.INTERCEPTA_BASE_URL,
    INTERCEPTA_TIMEOUT_MS: positiveInteger(
      source.INTERCEPTA_TIMEOUT_MS || DEFAULTS.INTERCEPTA_TIMEOUT_MS,
      'INTERCEPTA_TIMEOUT_MS',
    ),
    INTERCEPTA_FAIL_CLOSED: booleanValue(
      source.INTERCEPTA_FAIL_CLOSED === undefined
        ? DEFAULTS.INTERCEPTA_FAIL_CLOSED
        : source.INTERCEPTA_FAIL_CLOSED,
      'INTERCEPTA_FAIL_CLOSED',
    ),
    MAX_SINGLE_TX_USDC_BASE_UNITS: usdcLimit(
      source.MAX_SINGLE_TX_USDC ?? DEFAULTS.MAX_SINGLE_TX_USDC,
      'MAX_SINGLE_TX_USDC',
    ),
    MAX_DAILY_USDC_BASE_UNITS: usdcLimit(
      source.MAX_DAILY_USDC ?? DEFAULTS.MAX_DAILY_USDC,
      'MAX_DAILY_USDC',
    ),
  };

  try {
    new URL(config.INTERCEPTA_BASE_URL);
  } catch {
    throw new Error('INTERCEPTA_BASE_URL must be a valid URL');
  }
  return Object.freeze(config);
}

module.exports = { DEFAULTS, loadEnv, usdcLimit };
