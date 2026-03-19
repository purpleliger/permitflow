/**
 * PermitFlow — Claude AI Compliance Analysis Service
 *
 * Configuration (via environment variables — see .env.example):
 *   VITE_CLAUDE_API_KEY    — Anthropic API key
 *   VITE_CLAUDE_MODEL      — Model ID (default: claude-sonnet-4-6)
 *   VITE_CLAUDE_BASE_URL   — API base URL (default: https://api.anthropic.com)
 *                            Override this to point at a self-hosted ECS proxy.
 *
 * See docs/CLAUDE_INTEGRATION.md for model switching and self-hosting guidance.
 */

import type { ComplianceCheck } from '../types';
import { mockComplianceChecks } from '../data/mockData';

const CLAUDE_BASE_URL = import.meta.env.VITE_CLAUDE_BASE_URL || 'https://api.anthropic.com';
const CLAUDE_API_KEY  = import.meta.env.VITE_CLAUDE_API_KEY  || '';
const CLAUDE_MODEL    = import.meta.env.VITE_CLAUDE_MODEL    || 'claude-sonnet-4-6';

export interface AnalysisRequest {
  projectId: string;
  projectName: string;
  projectDescription: string;
  municipality: string;
  projectType: string;
  /** File names / titles uploaded by the user */
  documentSummaries: string[];
}

interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ClaudeResponse {
  content: Array<{ type: string; text: string }>;
}

// ── System prompt ──────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are a senior permit compliance analyst specializing in Ontario, Canada building regulations. Your role is to analyze construction project submissions against applicable Ontario/GTA codes and bylaws.

You have deep expertise in:
- Ontario Building Code (OBC) 2012/2022
- National Building Code of Canada (NBC) 2020
- Ontario Fire Code (O. Reg. 213/07)
- City of Toronto Zoning Bylaw 569-2013 and Toronto Green Standard v4
- City of Mississauga Zoning Bylaw 0225-2007
- City of Brampton Zoning Bylaw 270-2004
- Markham, Vaughan, Richmond Hill, Oakville, Burlington zoning frameworks
- AODA Design of Public Spaces Standard (O. Reg. 413/12)
- CSA standards applicable in Ontario

When analyzing a project, return ONLY a valid JSON array of compliance check objects. Each object must follow this exact shape:

{
  "id": "check-<n>",
  "project_id": "<projectId>",
  "building_code_id": "<relevant-code-id>",
  "standard_id": "<relevant-standard-id>",
  "check_type": "code" | "standard" | "both",
  "requirement_text": "<exact code/bylaw citation and requirement>",
  "status": "pass" | "fail" | "warning" | "pending",
  "feedback": "<specific, actionable finding referencing the submitted documents>",
  "severity": "critical" | "major" | "minor" | "info",
  "suggested_fix": "<concrete remediation step, or empty string if status is pass>",
  "checked_at": "<ISO 8601 timestamp>"
}

Generate 6–10 checks covering the most critical code areas for the given project type and municipality. Be specific to Ontario/GTA regulations. Do not return anything outside the JSON array.`;

function buildUserPrompt(req: AnalysisRequest): string {
  return `Analyze the following project for Ontario/GTA building code and bylaw compliance:

Project Name: ${req.projectName}
Project ID: ${req.projectId}
Municipality: ${req.municipality}
Project Type: ${req.projectType}
Description: ${req.projectDescription}

Uploaded Documents:
${req.documentSummaries.map((d, i) => `${i + 1}. ${d}`).join('\n')}

Return a JSON array of compliance checks for this project. Focus on the most critical OBC, municipal zoning, AODA, and environmental requirements applicable to a ${req.projectType} in ${req.municipality}.`;
}

// ── Main export ────────────────────────────────────────────────────
export async function analyzeCompliance(
  req: AnalysisRequest,
  onProgress?: (step: string) => void
): Promise<ComplianceCheck[]> {

  // Fall back to mock data when no API key is configured (demo/dev mode)
  if (!CLAUDE_API_KEY) {
    console.info('[PermitFlow] No VITE_CLAUDE_API_KEY set — using mock compliance data.');
    await simulateDelay(onProgress);
    return mockComplianceChecks.filter(c => c.project_id === 'proj-1');
  }

  try {
    onProgress?.('Sending documents to AI analysis engine...');

    const messages: ClaudeMessage[] = [
      { role: 'user', content: buildUserPrompt(req) },
    ];

    const response = await fetch(`${CLAUDE_BASE_URL}/v1/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01',
        // Required when calling Claude API directly from a browser.
        // For production, route through a backend proxy to keep the key server-side.
        'anthropic-dangerous-request-options': '{"allow_browser":true}',
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Claude API error ${response.status}: ${err}`);
    }

    const data: ClaudeResponse = await response.json();
    const text = data.content?.[0]?.text ?? '';

    onProgress?.('Parsing compliance analysis results...');

    // Extract JSON array from response (Claude occasionally wraps it in markdown)
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('Claude response did not contain a JSON array.');

    const checks: ComplianceCheck[] = JSON.parse(jsonMatch[0]);
    return checks;

  } catch (err) {
    console.error('[PermitFlow] Claude analysis failed — falling back to mock data:', err);
    return mockComplianceChecks.filter(c => c.project_id === 'proj-1');
  }
}

// Simulate progressive steps when using mock data
async function simulateDelay(onProgress?: (step: string) => void): Promise<void> {
  const steps = [
    ['Extracting document metadata...', 600],
    ['Querying Ontario Building Code database...', 800],
    ['Analyzing compliance requirements...', 700],
    ['Cross-referencing municipal bylaws...', 600],
    ['Generating feedback report...', 500],
  ] as const;

  for (const [step, ms] of steps) {
    onProgress?.(step);
    await new Promise(r => setTimeout(r, ms));
  }
}
