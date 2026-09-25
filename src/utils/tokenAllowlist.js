'use strict';

const CANONICAL_USDC = Object.freeze({
  1: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  8453: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
  42161: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
});

function isCanonicalUSDC(tokenAddress, chainId) {
  const expected = CANONICAL_USDC[String(chainId)];
  return typeof tokenAddress === 'string'
    && Boolean(expected)
    && tokenAddress.toLowerCase() === expected;
}

module.exports = { CANONICAL_USDC, isCanonicalUSDC };
