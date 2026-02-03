import axios from 'axios';
import { logger } from './logger';

const JUPITER_API = process.env.JUPITER_API_URL || 'https://api.jup.ag';

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
