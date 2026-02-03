import axios from 'axios';
import { logger } from './logger';

const JUPITER_API = process.env.JUPITER_API_URL || 'https://api.jup.ag';

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
    });

    return data;
  }

  async emergencySwapToUSDC(
    tokenMint: string,
    amount: number,
    userPublicKey: string,
  ): Promise<SwapResponse | null> {
    const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';

    try {
      logger.warn(`[Jupiter] EMERGENCY SWAP: ${tokenMint} → USDC`);

      const quote = await this.getQuote({
        inputMint: tokenMint,
        outputMint: USDC_MINT,
        amount,
        slippageBps: 500, // Higher slippage for emergency
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
    try {
      const { data } = await axios.get('https://api.jup.ag/price/v2', {
        params: { ids: mints.join(',') },
      });
      const prices: Record<string, number | null> = {};
      for (const mint of mints) {
        prices[mint] = data?.data?.[mint]?.price ?? null;
      }
      return prices;
    } catch (error) {
      logger.error(`[Jupiter] Batch price fetch failed: ${error}`);
      const prices: Record<string, number | null> = {};
      for (const mint of mints) {
        prices[mint] = null;
      }
      return prices;
    }
  }

  async getTokenPrice(tokenMint: string): Promise<number | null> {
    try {
      const { data } = await axios.get(`https://api.jup.ag/price/v2`, {
        params: { ids: tokenMint },
      });
      return data?.data?.[tokenMint]?.price || null;
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
