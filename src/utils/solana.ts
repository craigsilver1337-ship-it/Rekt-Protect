import {
  Connection,
  PublicKey,
  Keypair,
  Transaction,
  VersionedTransaction,
  SendOptions,
  AccountInfo,
  ParsedAccountData,
} from '@solana/web3.js';
import {
  TOKEN_PROGRAM_ID,
  getAccount,
  getMint,
  getAssociatedTokenAddress,
} from '@solana/spl-token';
import bs58 from 'bs58';
import { logger } from './logger';

export class SolanaClient {
  private connection: Connection;
  private wallet: Keypair | null = null;

  constructor(rpcUrl?: string) {
    this.connection = new Connection(
      rpcUrl || process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
      'confirmed',
    );
  }

  getConnection(): Connection {
    return this.connection;
  }

  loadWallet(privateKey: string): Keypair {
    this.wallet = Keypair.fromSecretKey(bs58.decode(privateKey));
    return this.wallet;
  }

  getWallet(): Keypair | null {
    return this.wallet;
  }

  async getBalance(address: string): Promise<number> {
    const pubkey = new PublicKey(address);
    const balance = await this.connection.getBalance(pubkey);
    return balance / 1e9; // Convert lamports to SOL
  }

  async getTokenAccounts(walletAddress: string): Promise<TokenAccountInfo[]> {
    const pubkey = new PublicKey(walletAddress);
    const tokenAccounts = await this.connection.getParsedTokenAccountsByOwner(pubkey, {
      programId: TOKEN_PROGRAM_ID,
    });

    return tokenAccounts.value.map((account) => {
      const parsed = account.account.data as ParsedAccountData;
      const info = parsed.parsed?.info;
      return {
        mint: info?.mint || '',
        owner: info?.owner || '',
        amount: info?.tokenAmount?.uiAmount || 0,
        decimals: info?.tokenAmount?.decimals || 0,
        address: account.pubkey.toBase58(),
      };
    });
  }

  async getTokenMintInfo(mintAddress: string): Promise<MintInfo> {
    const mint = await getMint(this.connection, new PublicKey(mintAddress));
    return {
      address: mintAddress,
      decimals: mint.decimals,
      supply: Number(mint.supply),
      mintAuthority: mint.mintAuthority?.toBase58() || null,
      freezeAuthority: mint.freezeAuthority?.toBase58() || null,
      isInitialized: mint.isInitialized,
    };
  }

  async getTokenHolders(mintAddress: string, limit = 20): Promise<TokenHolder[]> {
    const mint = new PublicKey(mintAddress);
    const accounts = await this.connection.getTokenLargestAccounts(mint);

    return accounts.value.slice(0, limit).map((account) => ({
      address: account.address.toBase58(),
      amount: Number(account.uiAmount || 0),
      percentage: 0, // Calculated by caller with total supply
    }));
  }

  async getRecentTransactions(address: string, limit = 20) {
    const pubkey = new PublicKey(address);
    const signatures = await this.connection.getSignaturesForAddress(pubkey, { limit });

    return signatures.map((sig) => ({
      signature: sig.signature,
      slot: sig.slot,
      timestamp: sig.blockTime,
      err: sig.err,
      memo: sig.memo,
    }));
  }

  async getAccountAge(address: string): Promise<number> {
    const txs = await this.connection.getSignaturesForAddress(new PublicKey(address), {
      limit: 1,
    });
    if (txs.length === 0) return 0;
    const firstTx = txs[txs.length - 1];
    if (!firstTx.blockTime) return 0;
    return Math.floor((Date.now() / 1000 - firstTx.blockTime) / 86400); // days
  }

  async getSlot(): Promise<number> {
    return this.connection.getSlot();
  }

  async getEpochInfo() {
    return this.connection.getEpochInfo();
  }

  async getPerformanceSamples(limit = 10) {
    return this.connection.getRecentPerformanceSamples(limit);
  }
}

export interface TokenAccountInfo {
  mint: string;
  owner: string;
  amount: number;
  decimals: number;
  address: string;
}

export interface MintInfo {
  address: string;
  decimals: number;
  supply: number;
  mintAuthority: string | null;
  freezeAuthority: string | null;
  isInitialized: boolean;
}

export interface TokenHolder {
  address: string;
  amount: number;
  percentage: number;
}
