'use strict';

const fs = require('node:fs/promises');
const path = require('node:path');
const { loadEnv } = require('../config/env');

const USDC_DECIMALS = 6;
const WINDOW_MS = 24 * 60 * 60 * 1000;
const DEFAULT_STORE_PATH = path.resolve(__dirname, '../../data/spending.json');

function toBaseUnits(value) {
  try {
    const amount = typeof value === 'bigint' ? value : BigInt(value);
    if (amount < 0n) throw new Error('amount must not be negative');
    return amount;
  } catch (error) {
    throw new Error('amountInBaseUnits must be a non-negative integer', { cause: error });
  }
}

function createSpendingLimitService({
  storePath = DEFAULT_STORE_PATH,
  config = loadEnv(),
  now = Date.now,
} = {}) {
  const maxSingleTx = BigInt(config.MAX_SINGLE_TX_USDC_BASE_UNITS);
  const maxDaily = BigInt(config.MAX_DAILY_USDC_BASE_UNITS);
  let pending = Promise.resolve();

  // Serialize read/modify/write operations so concurrent calls in this process
  // cannot overwrite one another's spend records.
  function serialized(operation) {
    const result = pending.then(operation);
    pending = result.catch(() => {});
    return result;
  }

  async function readStore() {
    try {
      const contents = await fs.readFile(storePath, 'utf8');
      const parsed = JSON.parse(contents);
      return parsed && typeof parsed === 'object' && Array.isArray(parsed.spends)
        ? parsed
        : { spends: [] };
    } catch (error) {
      if (error.code === 'ENOENT') return { spends: [] };
      throw error;
    }
  }

  function liveSpends(store, at) {
    const cutoff = at - WINDOW_MS;
    return store.spends.filter((entry) =>
      entry && typeof entry.agentId === 'string'
      && Number.isFinite(entry.timestamp) && entry.timestamp > cutoff
      && typeof entry.amountInBaseUnits === 'string'
      && /^\d+$/.test(entry.amountInBaseUnits));
  }

  function sumForAgent(spends, agentId) {
    return spends.reduce((total, spend) => (
      spend.agentId === agentId ? total + BigInt(spend.amountInBaseUnits) : total
    ), 0n);
  }

  async function writeStore(spends) {
    await fs.mkdir(path.dirname(storePath), { recursive: true });
    const temporaryPath = `${storePath}.${process.pid}.${Date.now()}.tmp`;
    await fs.writeFile(temporaryPath, JSON.stringify({ spends }, null, 2), 'utf8');
    await fs.rename(temporaryPath, storePath);
  }

  return Object.freeze({
    checkLimit(agentId, amountInBaseUnits) {
      const amount = toBaseUnits(amountInBaseUnits);
      return serialized(async () => {
        const at = now();
        const store = await readStore();
        const spends = liveSpends(store, at);
        if (spends.length !== store.spends.length) await writeStore(spends);
        if (amount > maxSingleTx) {
          return { allowed: false, reason: 'SINGLE_TX_LIMIT_EXCEEDED' };
        }
        if (sumForAgent(spends, String(agentId)) + amount > maxDaily) {
          return { allowed: false, reason: 'DAILY_LIMIT_EXCEEDED' };
        }
        return { allowed: true };
      });
    },

    recordSpend(agentId, amountInBaseUnits) {
      const amount = toBaseUnits(amountInBaseUnits);
      return serialized(async () => {
        const at = now();
        const store = await readStore();
        const spends = liveSpends(store, at);
        spends.push({ agentId: String(agentId), amountInBaseUnits: amount.toString(), timestamp: at });
        await writeStore(spends);
      });
    },

    getAgentUsage(agentId) {
      return serialized(async () => {
        const at = now();
        const store = await readStore();
        const spends = liveSpends(store, at);
        if (spends.length !== store.spends.length) await writeStore(spends);
        const spent = sumForAgent(spends, String(agentId));
        return {
          spentInBaseUnits: spent,
          remainingDailyAllowanceInBaseUnits: spent >= maxDaily ? 0n : maxDaily - spent,
        };
      });
    },
  });
}

const service = createSpendingLimitService();

module.exports = {
  ...service,
  createSpendingLimitService,
  USDC_DECIMALS,
  WINDOW_MS,
};
