import axios from 'axios';
import { logger } from './logger';

const HERMES_URL = process.env.PYTH_HERMES_URL || 'https://hermes.pyth.network';

// Common Pyth price feed IDs
export const PRICE_FEEDS = {
  SOL_USD: '0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d',
  BTC_USD: '0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43',
  ETH_USD: '0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace',
  USDC_USD: '0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a',
  BONK_USD: '0x72b021217ca3fe68922a19aaf990109cb9d84e9ad004b4d2025ad6f529314419',
  JUP_USD: '0x0a0408d619e9380abad35060f9192039ed5042fa6f82301d0e48bb52be830996',
} as const;

export class PythClient {
  async getPrice(feedId: string): Promise<PriceData | null> {
    try {
      const { data } = await axios.get(`${HERMES_URL}/v2/updates/price/latest`, {
        params: { ids: [feedId] },
      });

      const parsed = data?.parsed?.[0];
      if (!parsed) return null;

      const price = Number(parsed.price.price) * Math.pow(10, parsed.price.expo);
      const confidence = Number(parsed.price.conf) * Math.pow(10, parsed.price.expo);

      return {
        feedId,
        price,
        confidence,
        publishTime: parsed.price.publish_time,
        emaPrice: Number(parsed.ema_price.price) * Math.pow(10, parsed.ema_price.expo),
      };
    } catch (error) {
      logger.error(`[Pyth] Failed to get price for ${feedId}: ${error}`);
      return null;
    }
  }

  async getSOLPrice(): Promise<number> {
    const data = await this.getPrice(PRICE_FEEDS.SOL_USD);
    return data?.price || 0;
  }

  async getMultiplePrices(feedIds: string[]): Promise<Map<string, PriceData>> {
    const results = new Map<string, PriceData>();

    try {
      const { data } = await axios.get(`${HERMES_URL}/v2/updates/price/latest`, {
        params: { ids: feedIds },
      });

      for (const parsed of data?.parsed || []) {
        const price = Number(parsed.price.price) * Math.pow(10, parsed.price.expo);
        const confidence = Number(parsed.price.conf) * Math.pow(10, parsed.price.expo);

        results.set(parsed.id, {
          feedId: parsed.id,
          price,
          confidence,
          publishTime: parsed.price.publish_time,
          emaPrice: Number(parsed.ema_price.price) * Math.pow(10, parsed.ema_price.expo),
        });
      }
    } catch (error) {
      logger.error(`[Pyth] Failed to get multiple prices: ${error}`);
    }

    return results;
  }

  async detectPriceCrash(feedId: string, thresholdPercent = 20): Promise<CrashAlert | null> {
    const current = await this.getPrice(feedId);
    if (!current) return null;

    // Compare current price with EMA (exponential moving average)
    const deviation = ((current.price - current.emaPrice) / current.emaPrice) * 100;

    if (deviation < -thresholdPercent) {
      return {
        feedId,
        currentPrice: current.price,
        emaPrice: current.emaPrice,
        dropPercent: Math.abs(deviation),
        severity: Math.abs(deviation) > 50 ? 'critical' : 'high',
        timestamp: Date.now(),
      };
    }

    return null;
  }
}

export interface PriceData {
  feedId: string;
  price: number;
  confidence: number;
  publishTime: number;
  emaPrice: number;
}

export interface CrashAlert {
  feedId: string;
  currentPrice: number;
  emaPrice: number;
  dropPercent: number;
  severity: 'high' | 'critical';
  timestamp: number;
}
