'use strict';

const interceptaClient = require('../services/interceptaClient');

const EVM_ADDRESS_PATTERN = /^0x[a-fA-F0-9]{40}$/;

function createRiskProfileHandler({ intercepta = interceptaClient, now = () => new Date() } = {}) {
  return async function getRiskProfile(req, res) {
    const { address } = req.params;
    if (!EVM_ADDRESS_PATTERN.test(address)) {
      return res.status(400).json({ error: 'Invalid EVM address', code: 'INVALID_ADDRESS' });
    }

    const rawChainId = req.query?.chainId;
    const chainId = rawChainId === undefined ? 1 : Number(rawChainId);
    if (!Number.isSafeInteger(chainId) || chainId <= 0) {
      return res.status(400).json({ error: 'Invalid chainId', code: 'INVALID_CHAIN_ID' });
    }

    try {
      const profile = await intercepta.screenAddress(address, chainId);
      return res.status(200).json({
        address,
        chainId,
        verdict: profile.verdict,
        riskScore: profile.riskScore,
        reasons: profile.reasons,
        timestamp: now().toISOString(),
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Unable to retrieve risk profile',
        code: 'RISK_PROFILE_UNAVAILABLE',
      });
    }
  };
}

function createRiskRouter({ express: expressImpl, intercepta, now } = {}) {
  const express = expressImpl || require('express');
  const router = express.Router();
  router.get('/api/v1/risk-profile/:address', createRiskProfileHandler({ intercepta, now }));
  return router;
}

module.exports = {
  createRiskRouter,
  createRiskProfileHandler,
  EVM_ADDRESS_PATTERN,
};
