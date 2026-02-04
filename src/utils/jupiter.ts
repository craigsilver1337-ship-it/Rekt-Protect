import axios from 'axios';
import { logger } from './logger';

// lite-api.jup.ag is free and doesn't require an API key
// api.jup.ag requires an API key (set JUPITER_API_KEY)
const JUPITER_API_KEY = process.env.JUPITER_API_KEY;

function resolveJupiterUrl(): string {
  const envUrl = process.env.JUPITER_API_URL;
  // If api.jup.ag is set but no API key provided, force lite API
  if (envUrl && envUrl.includes('api.jup.ag') && !envUrl.includes('lite') && !JUPITER_API_KEY) {
    logger.warn('[Jupiter] api.jup.ag requires an API key — falling back to lite-api.jup.ag');
    return 'https://lite-api.jup.ag';
  }
  return envUrl || (JUPITER_API_KEY ? 'https://api.jup.ag' : 'https://lite-api.jup.ag');
}

const JUPITER_API = resolveJupiterUrl();

function jupiterHeaders(): Record<string, string> {
  if (JUPITER_API_KEY) {
    return { 'x-api-key': JUPITER_API_KEY };
  }
  return {};
}

const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';

// Decimals for known tokens to derive price from quotes
const TOKEN_DECIMALS: Record<string, number> = {
  'So11111111111111111111111111111111111111112': 9,
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': 6,
  'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB': 6,
  'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263': 5,
  'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN': 6,
  '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R': 6,
  'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm': 6,
  'HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3': 6,
};

export interface TokenInfo {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
  tags?: string[];
}

export const POPULAR_TOKENS: TokenInfo[] = [
  { address: 'So11111111111111111111111111111111111111112', name: 'Wrapped SOL', symbol: 'SOL', decimals: 9, logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png' },
  { address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', name: 'USD Coin', symbol: 'USDC', decimals: 6, logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png' },
  { address: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', name: 'USDT', symbol: 'USDT', decimals: 6, logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.png' },
  { address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', name: 'Bonk', symbol: 'BONK', decimals: 5, logoURI: 'https://arweave.net/hQiPZOsRZXGXBJd_82PhVdlM_hACsT_q6wqwf5cSY7I' },
  { address: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN', name: 'Jupiter', symbol: 'JUP', decimals: 6, logoURI: 'https://static.jup.ag/jup/icon.png' },
  { address: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R', name: 'Raydium', symbol: 'RAY', decimals: 6, logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R/logo.png' },
  { address: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm', name: 'dogwifhat', symbol: 'WIF', decimals: 6, logoURI: 'https://bafkreibk3covs5ltyqxa272uodhculbr6kea6betiez5tcoafatiksmre.ipfs.nftstorage.link' },
  { address: 'HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3', name: 'Pyth Network', symbol: 'PYTH', decimals: 6, logoURI: 'https://pyth.network/token.svg' },
];

export class JupiterClient {
  async getQuote(params: QuoteParams): Promise<QuoteResponse> {
    const { data } = await axios.get(`${JUPITER_API}/swap/v1/quote`, {
      params: {
        inputMint: params.inputMint,
        outputMint: params.outputMint,
        amount: params.amount,
        slippageBps: params.slippageBps || 300,
        restrictIntermediateTokens: true,
      },
      headers: jupiterHeaders(),
    });

    logger.debug(`[Jupiter] Quote: ${params.inputMint} → ${params.outputMint}`);
    return data;
  }

  async getSwapTransaction(params: SwapParams): Promise<SwapResponse> {
    const { data } = await axios.post(`${JUPITER_API}/swap/v1/swap`, {
      quoteResponse: params.quoteResponse,
      userPublicKey: params.userPublicKey,
      dynamicSlippage: { maxBps: 500 },
      prioritizationFeeLamports: {
        priorityLevelWithMaxLamports: {
          maxLamports: 5000000,
          priorityLevel: 'veryHigh',
        },
      },
    }, {
      headers: jupiterHeaders(),
    });

    return data;
  }

  async emergencySwapToUSDC(
    tokenMint: string,
    amount: number,
    userPublicKey: string,
  ): Promise<SwapResponse | null> {
    try {
      logger.warn(`[Jupiter] EMERGENCY SWAP: ${tokenMint} → USDC`);

      const quote = await this.getQuote({
        inputMint: tokenMint,
        outputMint: USDC_MINT,
        amount,
        slippageBps: 500,
      });

      const swap = await this.getSwapTransaction({
        quoteResponse: quote,
        userPublicKey,
      });

      logger.warn(`[Jupiter] Emergency swap transaction ready`);
      return swap;
    } catch (error) {
      logger.error(`[Jupiter] Emergency swap failed: ${error}`);
      return null;
    }
  }

  async getTokenList(): Promise<TokenInfo[]> {
    try {
      const { data } = await axios.get<TokenInfo[]>('https://tokens.jup.ag/tokens?tags=verified', {
        timeout: 5000,
      });
      logger.debug(`[Jupiter] Fetched ${data.length} verified tokens`);
      return data;
    } catch (error) {
      logger.warn(`[Jupiter] Failed to fetch token list, using popular tokens fallback: ${error}`);
      return POPULAR_TOKENS;
    }
  }

  async getBatchPrices(mints: string[]): Promise<Record<string, number | null>> {
    // If API key is available, use the price API directly
    if (JUPITER_API_KEY) {
      try {
        const { data } = await axios.get('https://api.jup.ag/price/v2', {
          params: { ids: mints.join(',') },
          headers: jupiterHeaders(),
        });
        const prices: Record<string, number | null> = {};
        for (const mint of mints) {
          prices[mint] = data?.data?.[mint]?.price ?? null;
        }
        return prices;
      } catch (error) {
        logger.warn(`[Jupiter] Price API failed, falling back to quote-derived prices: ${error}`);
      }
    }

    // Fallback: derive prices from small quotes against USDC
    const prices: Record<string, number | null> = {};
    for (const mint of mints) {
      prices[mint] = await this.getTokenPrice(mint);
    }
    return prices;
  }

  async getTokenPrice(tokenMint: string): Promise<number | null> {
    // If API key available, try price API first
    if (JUPITER_API_KEY) {
      try {
        const { data } = await axios.get('https://api.jup.ag/price/v2', {
          params: { ids: tokenMint },
          headers: jupiterHeaders(),
        });
        const price = data?.data?.[tokenMint]?.price;
        if (price) return Number(price);
      } catch {
        // fall through to quote-based pricing
      }
    }

    // Derive price from a quote: 1 token → USDC
    if (tokenMint === USDC_MINT) return 1;
    try {
      const decimals = TOKEN_DECIMALS[tokenMint] ?? 6;
      const oneUnit = Math.pow(10, decimals);
      const quote = await this.getQuote({
        inputMint: tokenMint,
        outputMint: USDC_MINT,
        amount: oneUnit,
        slippageBps: 100,
      });
      // outAmount is in USDC (6 decimals)
      return Number(quote.outAmount) / 1e6;
    } catch {
      return null;
    }
  }
}

export interface QuoteParams {
  inputMint: string;
  outputMint: string;
  amount: number;
  slippageBps?: number;
}

export interface QuoteResponse {
  inputMint: string;
  outputMint: string;
  inAmount: string;
  outAmount: string;
  otherAmountThreshold: string;
  swapMode: string;
  slippageBps: number;
  routePlan: unknown[];
  priceImpactPct: string;
}

export interface SwapParams {
  quoteResponse: QuoteResponse;
  userPublicKey: string;
}

export interface SwapResponse {
  swapTransaction: string;
  lastValidBlockHeight: number;
  prioritizationFeeLamports: number;
  dynamicSlippageReport?: {
    slippageBps: number;
    otherAmount: number;
    simulatedIncurredSlippageBps: number;
  };
}
