import axios, { AxiosRequestConfig } from 'axios';
import { logger } from './logger';

const HELIUS_API_KEY = process.env.HELIUS_API_KEY || '';
const HELIUS_BASE = `https://api.helius.xyz/v0`;
const HELIUS_RPC = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;

/** Build config with API key as query param (Helius requires this) but avoid logging */
function heliusConfig(): AxiosRequestConfig {
  return { params: { 'api-key': HELIUS_API_KEY } };
}

export class HeliusClient {
  async createWebhook(params: WebhookParams): Promise<WebhookResponse> {
    const { data } = await axios.post(
      `${HELIUS_BASE}/webhooks`,
      {
        webhookURL: params.webhookURL,
        transactionTypes: params.transactionTypes || ['Any'],
        accountAddresses: params.accountAddresses,
        webhookType: params.webhookType || 'enhanced',
      },
      heliusConfig(),
    );

    logger.info(`[Helius] Webhook created: ${data.webhookID}`);
    return data;
  }

  async getEnhancedTransactions(address: string): Promise<EnhancedTransaction[]> {
    const { data } = await axios.get(
      `${HELIUS_BASE}/addresses/${address}/transactions`,
      heliusConfig(),
    );
    return data;
  }

  async getTokenMetadata(mintAddress: string): Promise<TokenMetadata | null> {
    try {
      const { data } = await axios.post(
        `${HELIUS_BASE}/token-metadata`,
        { mintAccounts: [mintAddress], includeOffChain: true },
        heliusConfig(),
      );
      return data?.[0] || null;
    } catch {
      return null;
    }
  }

  async getAssetsByOwner(ownerAddress: string): Promise<unknown[]> {
    const { data } = await axios.post(HELIUS_RPC, {
      jsonrpc: '2.0',
      id: 'rekt-shield',
      method: 'getAssetsByOwner',
      params: {
        ownerAddress,
        page: 1,
        limit: 100,
      },
    });
    return data?.result?.items || [];
  }

  async parseTransactions(signatures: string[]): Promise<ParsedTransaction[]> {
    const { data } = await axios.post(
      `${HELIUS_BASE}/transactions`,
      { transactions: signatures },
      heliusConfig(),
    );
    return data;
  }

  async getWebhooks(): Promise<WebhookResponse[]> {
    const { data } = await axios.get(
      `${HELIUS_BASE}/webhooks`,
      heliusConfig(),
    );
    return data;
  }

  async deleteWebhook(webhookId: string): Promise<void> {
    await axios.delete(
      `${HELIUS_BASE}/webhooks/${webhookId}`,
      heliusConfig(),
    );
    logger.info(`[Helius] Webhook deleted: ${webhookId}`);
  }
}

export interface WebhookParams {
  webhookURL: string;
  transactionTypes?: string[];
  accountAddresses: string[];
  webhookType?: 'enhanced' | 'raw' | 'discord';
}

export interface WebhookResponse {
  webhookID: string;
  wallet: string;
  webhookURL: string;
  transactionTypes: string[];
  accountAddresses: string[];
  webhookType: string;
}

export interface EnhancedTransaction {
  description: string;
  type: string;
  source: string;
  fee: number;
  feePayer: string;
  signature: string;
  slot: number;
  timestamp: number;
  nativeTransfers: NativeTransfer[];
  tokenTransfers: TokenTransfer[];
  accountData: unknown[];
  events: unknown;
}

export interface NativeTransfer {
  fromUserAccount: string;
  toUserAccount: string;
  amount: number;
}

export interface TokenTransfer {
  fromUserAccount: string;
  toUserAccount: string;
  fromTokenAccount: string;
  toTokenAccount: string;
  tokenAmount: number;
  mint: string;
  tokenStandard: string;
}

export interface TokenMetadata {
  account: string;
  onChainAccountInfo: unknown;
  onChainMetadata: unknown;
  offChainMetadata: unknown;
}

export interface ParsedTransaction {
  description: string;
  type: string;
  source: string;
  fee: number;
  feePayer: string;
  signature: string;
  slot: number;
  timestamp: number;
  nativeTransfers: NativeTransfer[];
  tokenTransfers: TokenTransfer[];
}
