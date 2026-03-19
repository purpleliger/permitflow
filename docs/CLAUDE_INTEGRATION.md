# Claude AI Integration Guide

PermitFlow uses the Claude API to perform compliance analysis on uploaded project documents. This document covers environment configuration, model selection, self-hosted deployment, and prompt customization.

---

## Environment Variables

Create a `.env.local` file in the project root (see `.env.example`):

```bash
# Required for real AI analysis; if omitted, the app uses mock data (demo/dev mode)
VITE_CLAUDE_API_KEY=sk-ant-...

# Model to use (see model options below)
VITE_CLAUDE_MODEL=claude-sonnet-4-6

# API base URL — change this to point at a self-hosted proxy or ECS instance
VITE_CLAUDE_BASE_URL=https://api.anthropic.com
```

> **Security note:** These variables are embedded into the frontend bundle at build time. The `VITE_CLAUDE_API_KEY` is visible to end users in the browser. For production, route all Claude API calls through a backend proxy (your Supabase Edge Function, a Node.js server, or AWS Lambda). The proxy holds the API key server-side and forwards requests to Anthropic.

---

## Switching Models

All supported Claude models use the same API contract. Change `VITE_CLAUDE_MODEL` in your `.env.local`:

| Model ID | Use case |
|---|---|
| `claude-sonnet-4-6` | **Default.** Best balance of analysis depth and speed. Recommended for production. |
| `claude-opus-4-6` | Highest reasoning capability. Use for complex multi-code projects or when accuracy is paramount. Slower and more expensive. |
| `claude-haiku-4-5-20251001` | Fastest and cheapest. Suitable for simple single-code checks or high-volume batch processing. |

To switch models at runtime without redeploying, expose the model selection as a server-side config (environment variable in your proxy) rather than a Vite build-time variable.

---

## Self-Hosted / ECS Deployment

If you want to host Claude on your own infrastructure (e.g., via an AWS ECS proxy or Alibaba Cloud ECS instance that forwards to Anthropic), override the base URL:

```bash
VITE_CLAUDE_BASE_URL=https://your-internal-api.yourdomain.com
```

### ECS Proxy Architecture

```
Browser → Your ECS/Lambda Proxy → api.anthropic.com
                ↑
         Holds API key (server-side)
         Adds auth headers
         Rate limits per org
         Logs for audit trail
```

**Proxy implementation (Node.js / Express example):**

```typescript
import express from 'express';
import fetch from 'node-fetch';

const app = express();
app.use(express.json());

// Auth middleware: verify Supabase JWT before forwarding
app.post('/v1/messages', verifySupabaseJWT, async (req, res) => {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.CLAUDE_API_KEY,           // server-side secret
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(req.body),
  });

  const data = await response.json();
  res.status(response.status).json(data);
});
```

With this setup, set `VITE_CLAUDE_BASE_URL=https://your-proxy-domain.com` and remove `VITE_CLAUDE_API_KEY` from the frontend entirely.

### Alibaba Cloud ECS

The proxy pattern above works identically on Alibaba Cloud ECS. Deploy the Node.js proxy as a containerized service (ACK) or directly on ECS. Use Alibaba Cloud RAM roles instead of environment variable secrets where possible.

---

## Prompt Architecture

The compliance analysis prompt is defined in `src/services/claudeService.ts`. There are two parts:

### System Prompt
Defines Claude's role as an Ontario permit compliance analyst and specifies the exact JSON output format. The system prompt includes the full list of codes and bylaws Claude should reason over.

### User Prompt
Built dynamically per request, including:
- Project name, description, municipality, project type
- Document titles (file names and categories)

### Adding New Jurisdictions

To extend coverage to a new municipality or province:

1. **Add to the system prompt** in `claudeService.ts`:
   ```typescript
   // In SYSTEM_PROMPT, add to the expertise list:
   // - City of Hamilton Zoning Bylaw 05-200 (2005, amended 2023)
   ```

2. **Add to the municipality dropdown** in `NewProject.tsx`:
   ```typescript
   const MUNICIPALITIES = [
     ...
     'City of Hamilton',
   ];
   ```

3. **Add to the mock building codes** in `mockData.ts` for demo/dev mode.

4. **Add to the Supabase `building_codes` table** (see `schema/supabase_schema.sql`).

### Adjusting Analysis Depth

The `max_tokens` parameter in the API call controls response length:
- `2048` — faster, 4–6 compliance checks
- `4096` — default, 6–10 checks with detailed remediation
- `8192` — comprehensive analysis for complex projects (Opus recommended)

---

## Fallback / Demo Mode

When `VITE_CLAUDE_API_KEY` is not set, `analyzeCompliance()` returns mock compliance check data from `src/data/mockData.ts`. This makes the app fully functional for demos without incurring API costs.

The mock data uses realistic Ontario/GTA compliance scenarios including OBC, AODA, Toronto Green Standard, and municipal zoning findings.

---

## API Cost Estimates

Approximate Anthropic API costs per project analysis (March 2026 pricing):

| Model | Avg tokens/analysis | Approx. cost |
|---|---|---|
| Haiku 4.5 | ~3,000 | ~$0.002 |
| Sonnet 4.6 | ~4,000 | ~$0.015 |
| Opus 4.6 | ~5,000 | ~$0.075 |

For the Professional plan (20 projects/month), Sonnet costs ≈ **$0.30/month** in AI API fees — well within margins at $299/month pricing.

---

## Response Format

Claude returns a JSON array of compliance check objects. The service parses the array and maps it to the `ComplianceCheck` TypeScript interface defined in `src/types/index.ts`.

If Claude returns invalid JSON or wraps the response in markdown code fences, the service uses a regex fallback to extract the array before parsing.

On any API error, the service falls back to mock data so the user experience is never broken.
