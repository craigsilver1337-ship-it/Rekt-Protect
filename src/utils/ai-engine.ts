import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { logger } from './logger';

const SYSTEM_PROMPT = `You are REKT Shield AI — the intelligence core of a 10-agent autonomous security swarm protecting the Solana blockchain.

Your role:
- Analyze token data, transaction patterns, and wallet behavior to detect threats
- Provide clear, actionable security assessments
- Rate risk levels from 0-100 with detailed reasoning
- Detect rug pull patterns, drainer kits, phishing attacks, and state-sponsored threats
- Assess quantum computing readiness
- Always be direct, technical, and security-focused

You protect Solana users from losing money. Every analysis you provide could save someone from a scam.`;

export class AIEngine {
  private anthropic: Anthropic | null = null;
  private openai: OpenAI | null = null;
  private provider: 'anthropic' | 'openai';
  private totalCalls = 0;

  constructor() {
    if (process.env.ANTHROPIC_API_KEY) {
      this.anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      this.provider = 'anthropic';
      logger.info('[AI] Anthropic Claude initialized');
    } else if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      this.provider = 'openai';
      logger.info('[AI] OpenAI GPT initialized');
    } else {
      this.provider = 'anthropic';
      logger.warn('[AI] No AI API key found — using rule-based fallback');
    }
  }

  async analyze(prompt: string, context?: string): Promise<string> {
    this.totalCalls++;

    const fullPrompt = context
      ? `Context data:\n${context}\n\nTask:\n${prompt}`
      : prompt;

    try {
      if (this.anthropic) {
        return await this.callAnthropic(fullPrompt);
      } else if (this.openai) {
        return await this.callOpenAI(fullPrompt);
      }
    } catch (error) {
      logger.error(`[AI] Analysis failed: ${error}`);
    }

    return this.fallbackAnalysis(prompt, context);
  }

  private async callAnthropic(prompt: string): Promise<string> {
    const response = await this.anthropic!.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    });

    const block = response.content[0];
    return block.type === 'text' ? block.text : '';
  }

  private async callOpenAI(prompt: string): Promise<string> {
    const response = await this.openai!.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 1024,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ],
    });

    return response.choices[0]?.message?.content || '';
  }

  async analyzeTokenRisk(tokenData: Record<string, unknown>): Promise<AITokenAnalysis> {
    const prompt = `Analyze this Solana token for security risks. Provide a risk assessment.

Token Data:
${JSON.stringify(tokenData, null, 2)}

Respond in this exact JSON format:
{
  "aiRiskScore": <0-100>,
  "verdict": "<one line verdict>",
  "reasoning": "<detailed reasoning>",
  "redFlags": ["<flag1>", "<flag2>"],
  "recommendation": "<what should the user do>"
}`;

    const response = await this.analyze(prompt);
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]);
    } catch {}

    return {
      aiRiskScore: 50,
      verdict: 'Unable to perform AI analysis — using rule-based assessment',
      reasoning: response,
      redFlags: [],
      recommendation: 'Exercise caution. Manual review recommended.',
    };
  }

  async analyzeWalletBehavior(walletData: Record<string, unknown>): Promise<string> {
    const prompt = `Analyze this Solana wallet's transaction behavior for suspicious patterns:

Wallet Data:
${JSON.stringify(walletData, null, 2)}

Check for:
1. Drainer kit signatures (Aqua, Vanish)
2. Phishing attack patterns (owner permission hijack)
3. Wash trading
4. Lazarus Group TTPs (rapid chain-hopping, peel chains, UTC+9 activity)
5. Unusual token approval patterns

Provide a brief security assessment.`;

    return this.analyze(prompt);
  }

  async analyzeSmartContract(programCode: string): Promise<AIContractAudit> {
    const prompt = `Audit this Solana smart contract for security vulnerabilities:

\`\`\`rust
${programCode.slice(0, 3000)}
\`\`\`

Check for:
1. Missing owner checks
2. Integer overflow/underflow
3. PDA validation gaps
4. Unauthorized access
5. Reentrancy risks
6. Missing signer verification
7. Account confusion attacks

Respond in this exact JSON format:
{
  "securityScore": <0-100 where 100 is most secure>,
  "vulnerabilities": [{"severity": "critical|high|medium|low", "title": "<title>", "description": "<desc>", "line": "<approx line>"}],
  "summary": "<one paragraph summary>",
  "recommendation": "<what to fix>"
}`;

    const response = await this.analyze(prompt);
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]);
    } catch {}

    return {
      securityScore: 50,
      vulnerabilities: [],
      summary: 'AI audit unavailable — manual review recommended.',
      recommendation: 'Submit for professional audit.',
    };
  }

  async generateThreatReport(threatData: Record<string, unknown>): Promise<string> {
    const prompt = `Generate a professional threat intelligence report for this detected threat:

Threat Data:
${JSON.stringify(threatData, null, 2)}

Write a brief, clear report covering:
1. Threat Summary (2-3 sentences)
2. Impact Assessment
3. Affected Parties
4. Recommended Actions
5. Indicators of Compromise (IOCs)

Keep it concise and actionable.`;

    return this.analyze(prompt);
  }

  async chat(userMessage: string, swarmStatus: Record<string, unknown>): Promise<string> {
    const prompt = `A user is interacting with REKT Shield. Answer their question based on the current swarm status.

Current Swarm Status:
${JSON.stringify(swarmStatus, null, 2)}

User Message: ${userMessage}

Respond helpfully and concisely. If they ask to scan a token or check a wallet, tell them which API endpoint to use. If they ask about threats, summarize the current threat landscape.`;

    return this.analyze(prompt);
  }

  async predictMarketRisk(marketData: Record<string, unknown>): Promise<string> {
    const prompt = `Based on this market data, assess the current risk level for Solana DeFi users:

Market Data:
${JSON.stringify(marketData, null, 2)}

Consider:
1. Price volatility → rug pull risk correlation
2. Market sentiment → scam activity patterns
3. Network congestion → MEV/sandwich attack likelihood
4. Historical patterns

Provide a brief risk assessment with actionable advice.`;

    return this.analyze(prompt);
  }

  private fallbackAnalysis(prompt: string, context?: string): string {
    // Rule-based fallback when no AI API key is available
    if (prompt.includes('token') || prompt.includes('risk')) {
      return 'Rule-based analysis: Check mint authority, freeze authority, holder concentration, and dev wallet age. Tokens with unrenounced authorities carry elevated risk. Set ANTHROPIC_API_KEY or OPENAI_API_KEY for AI-powered deep analysis.';
    }
    if (prompt.includes('wallet') || prompt.includes('behavior')) {
      return 'Rule-based analysis: Monitor for large outbound transfers, unusual approval patterns, and interactions with known malicious addresses. Configure AI API key for behavioral pattern analysis.';
    }
    if (prompt.includes('contract') || prompt.includes('audit')) {
      return 'Rule-based analysis: Verify owner checks, signer verification, PDA validation, and access controls. Configure AI API key for comprehensive smart contract auditing.';
    }
    return 'AI analysis unavailable. Set ANTHROPIC_API_KEY or OPENAI_API_KEY in .env for AI-powered security intelligence.';
  }

  isAvailable(): boolean {
    return this.anthropic !== null || this.openai !== null;
  }

  getProvider(): string {
    return this.provider;
  }

  getTotalCalls(): number {
    return this.totalCalls;
  }
}

export interface AITokenAnalysis {
  aiRiskScore: number;
  verdict: string;
  reasoning: string;
  redFlags: string[];
  recommendation: string;
}

export interface AIContractAudit {
  securityScore: number;
  vulnerabilities: { severity: string; title: string; description: string; line: string }[];
  summary: string;
  recommendation: string;
}
