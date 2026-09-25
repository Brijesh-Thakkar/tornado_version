'use strict';

const spendingLimitService = require('./spendingLimitService');
const interceptaClient = require('./interceptaClient');
const { isCanonicalUSDC } = require('../utils/tokenAllowlist');

class SpendingLimitExceededError extends Error {
  constructor(reason) {
    super(`Spending limit exceeded: ${reason}`);
    this.name = 'SpendingLimitExceededError';
    this.reason = reason;
  }
}

class PaymentScreeningRejectedError extends Error {
  constructor(reason) {
    super(`Payment screening rejected: ${reason}`);
    this.name = 'PaymentScreeningRejectedError';
    this.reason = reason;
  }
}

function claimsToBeUSDC(payload) {
  const candidates = [
    payload?.tokenSymbol,
    payload?.symbol,
    payload?.currency,
    payload?.asset,
    payload?.token?.symbol,
    payload?.paymentRequirements?.assetSymbol,
  ];
  return candidates.some((value) => typeof value === 'string' && value.toUpperCase() === 'USDC');
}

function createPaymentScreeningService({
  spending = spendingLimitService,
  intercepta = interceptaClient,
} = {}) {
  return Object.freeze({
    async screenOutboundPayment({ payTo, tokenAddress, amount, chainId, agentId, payload }) {
      const limit = await spending.checkLimit(agentId, amount);
      if (!limit.allowed) throw new SpendingLimitExceededError(limit.reason || 'LIMIT_EXCEEDED');

      if (claimsToBeUSDC(payload) && !isCanonicalUSDC(tokenAddress, chainId)) {
        throw new PaymentScreeningRejectedError('NON_CANONICAL_USDC');
      }

      const tokenResult = await intercepta.screenToken(tokenAddress, chainId);
      if (tokenResult.verdict === 'BLOCK') {
        throw new PaymentScreeningRejectedError('TOKEN_FLAGGED');
      }

      const addressResult = await intercepta.screenAddress(payTo, chainId);
      if (addressResult.verdict === 'BLOCK') {
        throw new PaymentScreeningRejectedError('DESTINATION_FLAGGED');
      }

      const simulationResult = await intercepta.simulateTransaction(payload, chainId);
      if (simulationResult.verdict === 'BLOCK') {
        throw new PaymentScreeningRejectedError('SIMULATION_FLAGGED');
      }

      return { allowed: true };
    },
  });
}

const service = createPaymentScreeningService();

module.exports = {
  ...service,
  createPaymentScreeningService,
  SpendingLimitExceededError,
  PaymentScreeningRejectedError,
};
