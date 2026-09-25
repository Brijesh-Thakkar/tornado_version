'use strict';

const {
  createPaymentScreeningService,
  SpendingLimitExceededError,
} = require('../src/services/paymentScreeningService');
const { createScreenIncomingPayment } = require('../src/middleware/x402Screening');
const { createInterceptaClient } = require('../src/services/interceptaClient');

const CANONICAL_USDC_BASE = '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913';
const CLEAN_ADDRESS = '0x1111111111111111111111111111111111111111';
const RISKY_ADDRESS = '0x2222222222222222222222222222222222222222';
const PAYMENT = Object.freeze({ symbol: 'USDC', recipient: CLEAN_ADDRESS });

function mockIntercepta({ token, address, simulation } = {}) {
  return {
    screenToken: jest.fn().mockResolvedValue(token || { verdict: 'PASS', riskScore: 2, reasons: [] }),
    screenAddress: jest.fn().mockResolvedValue(address || { verdict: 'PASS', riskScore: 3, reasons: [] }),
    simulateTransaction: jest.fn().mockResolvedValue(simulation || { verdict: 'PASS', riskScore: 1, reasons: [] }),
  };
}

function mockSpending({ allowed = true } = {}) {
  return {
    checkLimit: jest.fn().mockResolvedValue(allowed
      ? { allowed: true }
      : { allowed: false, reason: 'DAILY_LIMIT_EXCEEDED' }),
    recordSpend: jest.fn().mockResolvedValue(undefined),
  };
}

async function runSigningFlow({ screening, spending, signer, payment }) {
  await screening.screenOutboundPayment(payment);
  const signature = await signer();
  // Record only after signing returns successfully.
  await spending.recordSpend(payment.agentId, payment.amount);
  return signature;
}

describe('Intercepta x402 screening', () => {
  describe('outbound pre-sign screening', () => {
    const payment = {
      payTo: CLEAN_ADDRESS,
      tokenAddress: CANONICAL_USDC_BASE,
      amount: 5_000_000n,
      chainId: 8453,
      agentId: 'agent-1',
      payload: PAYMENT,
    };

    test('passes canonical USDC and records spend after successful signing', async () => {
      const intercepta = mockIntercepta();
      const spending = mockSpending();
      const screening = createPaymentScreeningService({ intercepta, spending });
      const signer = jest.fn().mockResolvedValue('signed-payment');

      await expect(runSigningFlow({ screening, spending, signer, payment }))
        .resolves.toBe('signed-payment');

      expect(intercepta.screenToken).toHaveBeenCalledWith(CANONICAL_USDC_BASE, 8453);
      expect(intercepta.screenAddress).toHaveBeenCalledWith(CLEAN_ADDRESS, 8453);
      expect(intercepta.simulateTransaction).toHaveBeenCalledWith(PAYMENT, 8453);
      expect(signer).toHaveBeenCalledTimes(1);
      expect(spending.recordSpend).toHaveBeenCalledWith('agent-1', 5_000_000n);
    });

    test('rejects a recipient flagged for sanctions before signing', async () => {
      const intercepta = mockIntercepta({
        address: { verdict: 'BLOCK', riskScore: 99, reasons: ['SANCTIONS_AML'] },
      });
      const spending = mockSpending();
      const screening = createPaymentScreeningService({ intercepta, spending });
      const signer = jest.fn();

      await expect(runSigningFlow({ screening, spending, signer, payment }))
        .rejects.toThrow('DESTINATION_FLAGGED');
      expect(signer).not.toHaveBeenCalled();
      expect(spending.recordSpend).not.toHaveBeenCalled();
      expect(intercepta.simulateTransaction).not.toHaveBeenCalled();
    });

    test('rejects a non-canonical token claiming to be USDC before signing', async () => {
      const intercepta = mockIntercepta();
      const spending = mockSpending();
      const screening = createPaymentScreeningService({ intercepta, spending });
      const signer = jest.fn();

      await expect(runSigningFlow({
        screening,
        spending,
        signer,
        payment: { ...payment, tokenAddress: CLEAN_ADDRESS },
      })).rejects.toThrow('NON_CANONICAL_USDC');
      expect(signer).not.toHaveBeenCalled();
      expect(intercepta.screenToken).not.toHaveBeenCalled();
    });

    test('rejects an amount over the daily limit before calling Intercepta', async () => {
      const intercepta = mockIntercepta();
      const spending = mockSpending({ allowed: false });
      const screening = createPaymentScreeningService({ intercepta, spending });
      const signer = jest.fn();

      await expect(runSigningFlow({ screening, spending, signer, payment }))
        .rejects.toBeInstanceOf(SpendingLimitExceededError);
      expect(intercepta.screenToken).not.toHaveBeenCalled();
      expect(intercepta.screenAddress).not.toHaveBeenCalled();
      expect(intercepta.simulateTransaction).not.toHaveBeenCalled();
      expect(signer).not.toHaveBeenCalled();
    });
  });

  describe('inbound pre-accept middleware', () => {
    function responseDouble() {
      const res = { status: jest.fn(), json: jest.fn() };
      res.status.mockReturnValue(res);
      return res;
    }

    test('calls next for a clean payer and attaches the risk profile', async () => {
      const intercepta = mockIntercepta({
        address: { verdict: 'PASS', riskScore: 8, reasons: [] },
      });
      const middleware = createScreenIncomingPayment({ intercepta });
      const req = { headers: { 'x-payment': JSON.stringify({ from: CLEAN_ADDRESS }) } };
      const res = responseDouble();
      const next = jest.fn();

      await middleware(req, res, next);

      expect(intercepta.screenAddress).toHaveBeenCalledWith(CLEAN_ADDRESS, 1);
      expect(req.payerRiskProfile).toEqual({ verdict: 'PASS', riskScore: 8 });
      expect(next).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
    });

    test('returns HTTP 402 with risk details for a malicious payer', async () => {
      const intercepta = mockIntercepta({
        address: { verdict: 'BLOCK', riskScore: 100, reasons: ['SCAM_ATTRIBUTION'] },
      });
      const middleware = createScreenIncomingPayment({ intercepta });
      const req = { body: { payerAddress: RISKY_ADDRESS, chainId: 1 } };
      const res = responseDouble();
      const next = jest.fn();

      await middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(402);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Payment rejected by security layer',
        code: 'COUNTERPARTY_RISK_HIGH',
        reasons: ['SCAM_ATTRIBUTION'],
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('outage behavior', () => {
    test('fails closed on an Intercepta timeout when configured', async () => {
      const fetchImpl = jest.fn().mockRejectedValue(Object.assign(new Error('timeout'), { name: 'AbortError' }));
      const client = createInterceptaClient({
        config: {
          INTERCEPTA_API_KEY: 'test-key',
          INTERCEPTA_BASE_URL: 'https://api.web3antivirus.io/v1',
          INTERCEPTA_TIMEOUT_MS: 2500,
          INTERCEPTA_FAIL_CLOSED: true,
        },
        fetchImpl,
      });

      await expect(client.screenAddress(CLEAN_ADDRESS, 1))
        .rejects.toThrow('Intercepta screening unavailable - transaction blocked');
      expect(fetchImpl).toHaveBeenCalledTimes(1);
      expect(fetchImpl).toHaveBeenCalledWith(
        'https://api.web3antivirus.io/v1/address/risk',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({ 'X-API-KEY': 'test-key' }),
        }),
      );
    });
  });
});
