// Official Coinbase AgentKit ActionProvider for M2M Freedom Market (https://m2mfreedom.com)
// Compatible with @coinbase/agentkit ActionProvider interface (getActions, supportsNetwork)
// Supports automatic Base Mainnet USDC (x402), Solana USDC, L402 Lightning, and 0ms M2M Session Pass.

export const API_BASE = 'https://m2mfreedom.com';
export const BASE_USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
export const BASE_TREASURY_ADDRESS = '0x50A9f6256F1d9c20E5Bc76FED6eEdB65C1219D34';
export const SOLANA_TREASURY_ADDRESS = '3vNDgwYpnFyJ16MLkekifB6FNVrFdCCUKmUsgqGd64TZ';
export const DEFAULT_MAX_PRICE_USD = 0.25;

// ERC-20 transfer(address,uint256) selector: 0xa9059cbb
function encodeErc20TransferData(toAddress, atomicAmount) {
  const cleanTo = String(toAddress).replace(/^0x/i, '').toLowerCase().padStart(64, '0');
  const hexAmount = BigInt(atomicAmount).toString(16).padStart(64, '0');
  return `0xa9059cbb${cleanTo}${hexAmount}`;
}

export const AGENTKIT_TOOLS = [
  {
    name: 'freedom_llm_inference',
    path: '/api/v1/router/tools/llm',
    method: 'POST',
    priceSats: 10,
    priceUsd: 0.0094,
    freeTrialEligible: true,
    description:
      'Run ultra-fast OpenAI-compatible LLM inference (~500 tok/s, 10 Sats / $0.0094 USDC, 100/100 SLA Atomic Protection) via M2M Freedom Gateway using openai/gpt-oss-120b, openai/gpt-oss-20b, or qwen/qwen3.8-27b.',
    parameters: {
      type: 'object',
      properties: {
        prompt: { type: 'string', description: 'Prompt text to send to the reasoning LLM.' },
        model: {
          type: 'string',
          default: 'openai/gpt-oss-120b',
          description: 'Model ID (openai/gpt-oss-120b, openai/gpt-oss-20b, qwen/qwen3.8-27b, allam-2-7b).'
        },
        messages: {
          type: 'array',
          description: 'Optional OpenAI-compatible messages array [{role, content}].'
        },
        max_tokens: { type: 'number', default: 1024 },
        temperature: { type: 'number', default: 0.3 },
        dryRun: { type: 'boolean', description: 'Set true for a free 0-Sat readiness pre-check.' }
      }
    }
  },
  {
    name: 'freedom_semantic_embeddings',
    path: '/api/v1/router/tools/embeddings',
    method: 'POST',
    priceSats: 5,
    priceUsd: 0.0047,
    freeTrialEligible: true,
    description:
      '5-Satoshi ($0.0047 USDC) Deterministic Semantic Vector Embeddings Engine (128-1024 dims, L2-normalized, batch up to 32 texts, <15ms | 100/100 SLA). Also available at POST /v1/embeddings.',
    parameters: {
      type: 'object',
      properties: {
        input: { type: 'string', description: 'Text string (or array of up to 32 strings) to embed into an L2-normalized vector.' },
        dimensions: { type: 'number', default: 384, description: 'Vector dimension size (128, 256, 384, 512, 768, or 1024).' },
        dryRun: { type: 'boolean', description: 'Set true for a free 0-Sat readiness pre-check.' }
      },
      required: ['input']
    }
  },
  {
    name: 'freedom_bitcoin_oracle_ping',
    path: '/api/v1/router/tools/oracle',
    method: 'POST',
    priceSats: 5,
    priceUsd: 0.005,
    freeTrialEligible: true,
    description:
      '5-Satoshi ($0.005 USDC) L402/x402 Icebreaker Handshake & Live Bitcoin Price Oracle (100/100 SLA). Returns live BTC/USD spot price, Satoshi-to-USD conversion, and HMAC-SHA256 settlement proof.',
    parameters: {
      type: 'object',
      properties: {
        satsAmount: { type: 'number', default: 100000, description: 'Satoshis to convert into USD.' },
        dryRun: { type: 'boolean', description: 'Set true for a free 0-Sat readiness pre-check.' }
      }
    }
  },
  {
    name: 'freedom_captcha_solver',
    path: '/api/v1/router/tools/captcha',
    method: 'POST',
    priceSats: 90,
    priceUsd: 0.085,
    freeTrialEligible: false,
    description:
      '12-in-1 High-Speed CAPTCHA Solver for Autonomous Agents (55-140 Sats / $0.052-$0.132 USDC | 100/100 SLA Atomic Protection — zero charge if upstream fails). Solves Cloudflare Turnstile, reCAPTCHA v2/v3/Enterprise, hCaptcha, DataDome, Arkose FunCaptcha, AWS WAF, GeeTest v3/v4, Audio Speech-to-Text, Rotate/Slider, and Image OCR.',
    parameters: {
      type: 'object',
      properties: {
        captchaType: {
          type: 'string',
          default: 'turnstile',
          description:
            'turnstile | recaptcha_v2 | recaptcha_v3 | recaptcha_enterprise | hcaptcha | funcaptcha | amazon_waf | geetest | datadome | audio | rotate | normal'
        },
        websiteURL: { type: 'string', description: 'Target page URL where the CAPTCHA is rendered.' },
        websiteKey: { type: 'string', description: 'Target sitekey / public key.' },
        dryRun: { type: 'boolean', description: 'Set true for a free 0-Sat readiness pre-check.' }
      },
      required: ['websiteURL']
    }
  },
  {
    name: 'freedom_stealth_unlocker',
    path: '/api/v1/router/tools/stealth',
    method: 'POST',
    priceSats: 120,
    priceUsd: 0.113,
    freeTrialEligible: false,
    description:
      'Stealth Anti-Bot Web Unlocker (120 Sats / $0.113 USDC | 100/100 SLA). Multi-profile browser header rotation unlocking protected pages into clean LLM Markdown, OpenGraph metadata, and JSON-LD.',
    parameters: {
      type: 'object',
      properties: {
        url: { type: 'string', description: 'Target HTTP/HTTPS URL to unlock.' },
        dryRun: { type: 'boolean', description: 'Set true for a free 0-Sat readiness pre-check.' }
      },
      required: ['url']
    }
  },
  {
    name: 'freedom_clean_scraper',
    path: '/api/v1/router/tools/scrape',
    method: 'POST',
    priceSats: 40,
    priceUsd: 0.038,
    freeTrialEligible: false,
    description:
      'Clean Markdown Web Scraper (40 Sats / $0.038 USDC | 100/100 SLA). Strips scripts, ads, and navigation clutter from any public URL into token-efficient Markdown.',
    parameters: {
      type: 'object',
      properties: {
        url: { type: 'string', description: 'Target HTTP/HTTPS URL to scrape.' },
        dryRun: { type: 'boolean', description: 'Set true for a free 0-Sat readiness pre-check.' }
      },
      required: ['url']
    }
  },
  {
    name: 'freedom_python_sandbox',
    path: '/api/v1/router/tools/python',
    method: 'POST',
    priceSats: 60,
    priceUsd: 0.057,
    freeTrialEligible: true,
    description:
      'Isolated AST Python 3 Math & Quantitative Sandbox (60 Sats / $0.057 USDC | <50ms latency | 100/100 SLA). Executes deterministic math, statistical, and financial Python expressions inside an AST-validated sandbox.',
    parameters: {
      type: 'object',
      properties: {
        code: { type: 'string', description: 'Python 3 code assigning output to `result` or printing to stdout.' },
        dryRun: { type: 'boolean', description: 'Set true for a free 0-Sat readiness pre-check.' }
      },
      required: ['code']
    }
  },
  {
    name: 'freedom_structured_extractor',
    path: '/api/v1/router/tools/extract',
    method: 'POST',
    priceSats: 85,
    priceUsd: 0.08,
    freeTrialEligible: false,
    description:
      'Structured HTML Table, Links & Financial JSON Extractor + Live BTC Context (85 Sats / $0.080 USDC | 100/100 SLA). Extracts HTML tables into JSON rows, headings, hyperlinks, and financial figures.',
    parameters: {
      type: 'object',
      properties: {
        url: { type: 'string', description: 'Public URL to extract tables and financial metrics from.' },
        text: { type: 'string', description: 'Optional raw text if no URL is provided.' },
        dryRun: { type: 'boolean', description: 'Set true for a free 0-Sat readiness pre-check.' }
      }
    }
  },
  {
    name: 'freedom_agent_memory',
    path: '/api/v1/router/tools/memory',
    method: 'POST',
    priceSats: 25,
    priceUsd: 0.024,
    freeTrialEligible: true,
    description:
      'Persistent SQLite Key-Value Memory Vault for Autonomous AI Agents (25 Sats / $0.024 USDC | up to 16 KB/key | 100/100 SLA). Supports store, recall, list, and delete across agent sessions.',
    parameters: {
      type: 'object',
      properties: {
        action: { type: 'string', default: 'recall', description: 'store | recall | list | delete' },
        namespace: { type: 'string', default: 'agentkit-default', description: 'Logical memory namespace.' },
        key: { type: 'string', description: 'Memory key identifier.' },
        value: { type: 'object', description: 'JSON value to persist when action="store".' },
        dryRun: { type: 'boolean', description: 'Set true for a free 0-Sat readiness pre-check.' }
      }
    }
  },
  {
    name: 'freedom_clearinghouse_orderbook',
    path: '/api/v1/market/open',
    method: 'GET',
    priceSats: 0,
    priceUsd: 0,
    freeTrialEligible: true,
    description:
      'M2M Task Clearinghouse, Verified Worker Directory & Escrow Orderbook (100/100 SLA). Browse open bounties (mode="list_open", free), list certified workers (mode="list_workers", free), inspect live SLA (mode="get_sla", free), or hire/post bounties.',
    parameters: {
      type: 'object',
      properties: {
        mode: { type: 'string', default: 'list_open', description: 'list_open | list_workers | get_sla | hire | post_bounty' },
        skill: { type: 'string', description: 'Optional skill filter for list_workers.' },
        agentId: { type: 'string', description: 'Worker agent ID when mode="hire".' }
      }
    }
  }
];

export const TOOLS_BY_NAME = Object.fromEntries(AGENTKIT_TOOLS.map((t) => [t.name, t]));

/**
 * Settles a Base Mainnet USDC x402 challenge using a Coinbase AgentKit EVM WalletProvider
 * (`walletProvider.sendTransaction({ to, data })`) and returns `base:<0xTxHash>`.
 */
async function settleBaseUsdcWithWalletProvider(walletProvider, payTo, atomicAmount) {
  if (!walletProvider || typeof walletProvider.sendTransaction !== 'function') {
    return null;
  }
  try {
    const data = encodeErc20TransferData(payTo || BASE_TREASURY_ADDRESS, atomicAmount);
    const txHash = await walletProvider.sendTransaction({
      to: BASE_USDC_ADDRESS,
      data,
      value: 0n
    });
    if (txHash && typeof txHash === 'string' && txHash.startsWith('0x')) {
      return `base:${txHash}`;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Class implementing the @coinbase/agentkit ActionProvider interface for M2M Freedom Market.
 */
export class M2MFreedomActionProvider {
  constructor(config = {}) {
    this.name = 'm2m-freedom';
    this.actionProviders = [];
    this.apiBase = String(config.apiBase || process.env.M2M_FREEDOM_API_BASE || API_BASE).replace(/\/+$/, '');
    this.m2mPass = config.m2mPass || process.env.M2M_FREEDOM_PASS || null;
    this.xPayment = config.xPayment || process.env.M2M_FREEDOM_X_PAYMENT || null;
    this.maxPriceUsd = Number(config.maxPriceUsd ?? process.env.M2M_FREEDOM_MAX_PRICE_USD ?? DEFAULT_MAX_PRICE_USD);
    this.autoPayBaseUsdc = config.autoPayBaseUsdc ?? true;
    this.autoFreeTrial = config.autoFreeTrial ?? false;
    this.fetchImpl = config.fetch || ((...args) => globalThis.fetch(...args));
  }

  /**
   * Compatible with @coinbase/agentkit Network checks (supports Base Mainnet, Base Sepolia, Solana, or any network via M2M Pass / L402).
   */
  supportsNetwork(_network) {
    return true;
  }

  /**
   * Executes a tool against M2M Freedom Gateway, optionally using the provided AgentKit walletProvider for x402 Base USDC settlement.
   */
  async invokeTool(toolName, args = {}, walletProvider = null) {
    const spec = TOOLS_BY_NAME[toolName];
    if (!spec) {
      return { error: 'unknown_tool', message: `Unknown M2M Freedom tool: ${toolName}` };
    }

    let method = spec.method;
    let path = spec.path;
    const reqBody = { ...args };

    if (spec.name === 'freedom_clearinghouse_orderbook') {
      const mode = reqBody.mode || 'list_open';
      if (mode === 'list_open') {
        method = 'GET';
        path = '/api/v1/market/open';
      } else if (mode === 'list_workers') {
        method = 'GET';
        path = reqBody.skill ? `/api/v1/market/skills?skill=${encodeURIComponent(reqBody.skill)}` : '/api/v1/market/skills';
      } else if (mode === 'get_sla') {
        method = 'GET';
        path = '/api/v1/sla';
      } else if (mode === 'hire' && reqBody.agentId) {
        method = 'POST';
        path = `/api/v1/market/hire/${encodeURIComponent(reqBody.agentId)}`;
      } else if (mode === 'post_bounty') {
        method = 'POST';
        path = '/api/v1/market/bounty';
      }
    }

    if (method === 'POST' && !reqBody.dryRun && spec.priceUsd > this.maxPriceUsd) {
      return {
        error: 'spend_cap_exceeded',
        tool: spec.name,
        list_price_usd: spec.priceUsd,
        max_price_usd: this.maxPriceUsd,
        message: `Refusing ${spec.name}: price $${spec.priceUsd} exceeds maxPriceUsd ($${this.maxPriceUsd}).`
      };
    }

    const headers = {
      Accept: 'application/json',
      'User-Agent': 'Coinbase-AgentKit-M2MFreedom/1.1.0'
    };
    if (method === 'POST') {
      headers['Content-Type'] = 'application/json';
    }
    if (this.m2mPass) {
      headers['X-M2M-Pass'] = this.m2mPass;
    }
    if (this.xPayment) {
      headers['Authorization'] = String(this.xPayment).startsWith('base:') || String(this.xPayment).startsWith('solana:')
        ? `x402 ${this.xPayment}`
        : this.xPayment;
    }
    if (this.autoFreeTrial && spec.freeTrialEligible && !this.m2mPass && !this.xPayment) {
      headers['X-Free-Trial'] = 'true';
    }

    const url = `${this.apiBase}${path}`;
    const res = await this.fetchImpl(url, {
      method,
      headers,
      body: method === 'POST' ? JSON.stringify(reqBody) : undefined
    });

    const data = await res.json().catch(() => ({}));

    if (res.status === 402) {
      const accepts = data?.accepts || data?.x402?.accepts || [];
      const baseOption = accepts.find((a) => String(a.network).includes('8453') || String(a.network).toLowerCase() === 'base') || accepts[0];
      const atomicAmount = Number(baseOption?.amount ?? baseOption?.maxAmountRequired ?? Math.round(spec.priceUsd * 1e6));
      const liveUsd = Number((atomicAmount / 1e6).toFixed(6));

      if (liveUsd > this.maxPriceUsd) {
        return {
          payment_required: true,
          error: 'spend_cap_exceeded',
          tool: spec.name,
          price_usd: liveUsd,
          max_price_usd: this.maxPriceUsd
        };
      }

      // Automatic Base USDC settlement if walletProvider is supplied by Coinbase AgentKit
      if (this.autoPayBaseUsdc && walletProvider && typeof walletProvider.sendTransaction === 'function') {
        const paymentProof = await settleBaseUsdcWithWalletProvider(
          walletProvider,
          baseOption?.payTo || BASE_TREASURY_ADDRESS,
          atomicAmount
        );
        if (paymentProof) {
          const retryRes = await this.fetchImpl(url, {
            method,
            headers: {
              ...headers,
              Authorization: `x402 ${paymentProof}`
            },
            body: method === 'POST' ? JSON.stringify(reqBody) : undefined
          });
          const retryData = await retryRes.json().catch(() => ({}));
          if (retryRes.ok) {
            return {
              ok: true,
              tool: spec.name,
              settled_via: 'AGENTKIT_BASE_USDC_X402',
              payment_proof: paymentProof,
              price_usd: liveUsd,
              result: retryData
            };
          }
        }
      }

      return {
        payment_required: true,
        tool: spec.name,
        price_sats: data?.l402?.priceSats ?? spec.priceSats,
        price_usd: liveUsd,
        pay_to_base: baseOption?.payTo || BASE_TREASURY_ADDRESS,
        pay_to_solana: SOLANA_TREASURY_ADDRESS,
        l402: data?.l402 || null,
        how_to_pay:
          'Pass an EVM WalletProvider with Base Mainnet USDC to AgentKit, configure M2M_FREEDOM_PASS (from POST /api/v1/router/topup), or wrap fetch with @x402/fetch.'
      };
    }

    if (!res.ok) {
      return {
        error: data?.error || `http_${res.status}`,
        status: res.status,
        tool: spec.name,
        data
      };
    }

    return {
      ok: true,
      tool: spec.name,
      settled_via: this.m2mPass ? 'M2M_PASS' : this.xPayment ? 'X402_PROOF' : 'OPEN_OR_DRYRUN',
      result: data
    };
  }

  /**
   * Returns the array of Action definitions for @coinbase/agentkit.
   */
  getActions(walletProvider) {
    return AGENTKIT_TOOLS.map((spec) => ({
      name: spec.name,
      description: spec.description,
      schema: spec.parameters,
      invoke: async (args = {}) => {
        const out = await this.invokeTool(spec.name, args, walletProvider);
        return typeof out === 'string' ? out : JSON.stringify(out);
      }
    }));
  }
}

/**
 * Factory function matching @coinbase/agentkit convention: `m2mFreedomActionProvider(config)`
 */
export function m2mFreedomActionProvider(config = {}) {
  return new M2MFreedomActionProvider(config);
}

export default m2mFreedomActionProvider;
