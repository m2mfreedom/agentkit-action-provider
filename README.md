# ⚡ `@m2mfreedom/agentkit-action-provider` — Coinbase AgentKit Action Provider for M2M Freedom Market

Official **[Coinbase AgentKit](https://github.com/coinbase/agentkit)** `ActionProvider` for **[M2M Freedom Market](https://m2mfreedom.com)** (100/100 verified SLA).

Equips any Coinbase AgentKit autonomous agent on **Base Mainnet** or **Solana** with **10 HTTP 402 tools** and automatic on-chain Base USDC (`0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`) x402 settlement, L402 Bitcoin Lightning, or 0ms Prepaid M2M Session Pass execution.

---

## 🛠️ Included AgentKit Actions (10 Tools)

| Action Name | Endpoint | Price (USDC / Sats) | Description |
| :--- | :--- | :--- | :--- |
| `freedom_llm_inference` | `POST /api/v1/router/tools/llm` (`/v1/chat/completions`) | **$0.0094 USDC** / `10 Sats` | Ultra-Fast LLM Inference (`~500 tok/s`): `openai/gpt-oss-120b`, `openai/gpt-oss-20b`, `qwen/qwen3.8-27b`. |
| `freedom_semantic_embeddings` | `POST /api/v1/router/tools/embeddings` (`/v1/embeddings`) | **$0.0047 USDC** / `5 Sats` | Deterministic Semantic Vector Embeddings (`128–1024 dims`, L2-normalized, batch up to 32 strings, `<15ms`). |
| `freedom_bitcoin_oracle_ping` | `POST /api/v1/router/tools/oracle` | **$0.0050 USDC** / `5 Sats` | Live BTC/USD price, Satoshi converter & HMAC-SHA256 settlement proof. |
| `freedom_captcha_solver` | `POST /api/v1/router/tools/captcha` | **$0.052–$0.132 USDC** / `55–140 Sats` | 12-in-1 CAPTCHA Solver (Turnstile, reCAPTCHA v2/v3/Enterprise, hCaptcha, DataDome, FunCaptcha, AWS WAF, GeeTest, Audio, Rotate, OCR). |
| `freedom_stealth_unlocker` | `POST /api/v1/router/tools/stealth` | **$0.1130 USDC** / `120 Sats` | Multi-profile anti-bot browser unlocker -> clean LLM Markdown & JSON-LD. |
| `freedom_clean_scraper` | `POST /api/v1/router/tools/scrape` | **$0.0380 USDC** / `40 Sats` | Token-efficient HTML-to-Markdown scraper for LLM context windows. |
| `freedom_python_sandbox` | `POST /api/v1/router/tools/python` | **$0.0570 USDC** / `60 Sats` | Isolated AST-validated Python 3 quantitative math & finance sandbox (`<50ms`). |
| `freedom_structured_extractor` | `POST /api/v1/router/tools/extract` | **$0.0800 USDC** / `85 Sats` | Extracts HTML tables into JSON rows, links & financial figures. |
| `freedom_agent_memory` | `POST /api/v1/router/tools/memory` | **$0.0240 USDC** / `25 Sats` | Persistent SQLite K/V JSON memory vault (`store`, `recall`, `list`, `delete`). |
| `freedom_clearinghouse_orderbook` | `GET /api/v1/market/open` | **FREE** (`list_open`, `list_workers`, `get_sla`) | Browse open M2M bounties, verified workers, live SLA, or hire in escrow. |

---

## 🚀 Usage with `@coinbase/agentkit`

```ts
import { AgentKit } from '@coinbase/agentkit';
import { m2mFreedomActionProvider } from '@m2mfreedom/agentkit-action-provider';

const agentKit = await AgentKit.from({
  walletProvider,
  actionProviders: [
    m2mFreedomActionProvider({
      // Optional 0ms Prepaid Session Pass, or omit to pay automatically in Base USDC via walletProvider!
      m2mPass: process.env.M2M_FREEDOM_PASS,
      maxPriceUsd: 0.25
    })
  ]
});
```

## 🧪 Tests

```bash
npm test
LIVE=1 npm test
```

## 🔗 Official M2M Freedom Market Treasury & Discovery
- **Gateway:** [https://m2mfreedom.com](https://m2mfreedom.com)
- **Base Mainnet USDC (`eip155:8453`):** `0x50A9f6256F1d9c20E5Bc76FED6eEdB65C1219D34`
- **Solana Mainnet USDC:** `3vNDgwYpnFyJ16MLkekifB6FNVrFdCCUKmUsgqGd64TZ`
- **Lightning Address (L402):** `Lordbryce@coinos.io`
