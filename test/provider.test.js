import test from 'node:test';
import assert from 'node:assert/strict';
import {
  m2mFreedomActionProvider,
  M2MFreedomActionProvider,
  AGENTKIT_TOOLS,
  BASE_TREASURY_ADDRESS
} from '../src/index.js';

test('M2MFreedomActionProvider exposes 10 AgentKit actions and supports all networks', () => {
  const provider = m2mFreedomActionProvider();
  assert.ok(provider instanceof M2MFreedomActionProvider);
  assert.equal(provider.name, 'm2m-freedom');
  assert.equal(provider.supportsNetwork({ networkId: 'base-mainnet' }), true);

  const actions = provider.getActions();
  assert.equal(actions.length, 10);
  assert.equal(AGENTKIT_TOOLS.length, 10);

  for (const act of actions) {
    assert.ok(act.name);
    assert.ok(act.description);
    assert.equal(typeof act.invoke, 'function');
  }
});

test('AgentKit WalletProvider automatically settles HTTP 402 via Base USDC transfer and retries', async () => {
  let callCount = 0;
  let walletCalled = false;

  const mockFetch = async (_url, opts) => {
    callCount++;
    if (callCount === 1) {
      return new Response(
        JSON.stringify({
          x402Version: 2,
          accepts: [
            {
              scheme: 'exact',
              network: 'eip155:8453',
              amount: '9400',
              payTo: BASE_TREASURY_ADDRESS
            }
          ]
        }),
        { status: 402, headers: { 'Content-Type': 'application/json' } }
      );
    }
    assert.equal(
      opts.headers.Authorization,
      'x402 base:0x1111111111111111111111111111111111111111111111111111111111111111'
    );
    return new Response(
      JSON.stringify({
        id: 'chatcmpl-test',
        model: 'openai/gpt-oss-120b',
        choices: [{ message: { role: 'assistant', content: 'Hello from M2M Freedom LLM!' } }]
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  };

  const mockWalletProvider = {
    sendTransaction: async (tx) => {
      walletCalled = true;
      assert.equal(tx.to, '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913');
      assert.ok(tx.data.startsWith('0xa9059cbb'));
      return '0x1111111111111111111111111111111111111111111111111111111111111111';
    }
  };

  const provider = m2mFreedomActionProvider({ fetch: mockFetch });
  const actions = provider.getActions(mockWalletProvider);
  const llmAction = actions.find((a) => a.name === 'freedom_llm_inference');

  const rawOut = await llmAction.invoke({ prompt: 'Test AgentKit Base USDC auto-settlement' });
  const out = JSON.parse(rawOut);

  assert.equal(walletCalled, true);
  assert.equal(callCount, 2);
  assert.equal(out.ok, true);
  assert.equal(out.settled_via, 'AGENTKIT_BASE_USDC_X402');
});

test('Live M2M Freedom Gateway verification via AgentKit ActionProvider', async (t) => {
  if (!process.env.LIVE) {
    t.skip('Set LIVE=1 to run live tests against https://m2mfreedom.com');
    return;
  }

  const provider = m2mFreedomActionProvider();

  // 1. Live LLM Inference dryRun
  const llmDry = await provider.invokeTool('freedom_llm_inference', { prompt: 'AgentKit ping', dryRun: true });
  assert.equal(llmDry.ok, true);
  assert.equal(llmDry.result.dryRun, true);

  // 2. Live unpaid call returns Base USDC treasury address
  const unpaid = await provider.invokeTool('freedom_llm_inference', { prompt: 'Unpaid quote check' });
  assert.equal(unpaid.payment_required, true);
  assert.equal(unpaid.pay_to_base, BASE_TREASURY_ADDRESS);
});
