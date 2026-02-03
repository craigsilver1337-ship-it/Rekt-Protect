import { BaseAgent } from '../../core/agent-base';
import { SwarmEventBus } from '../../core/event-bus';
import {
  AgentType,
  ThreatLevel,
  DefenseAction,
  DefenseResult,
  SwarmEventType,
  ProtectionProof,
} from '../../core/types';
import { SolanaClient } from '../../utils/solana';
import { JupiterClient } from '../../utils/jupiter';
import { logger } from '../../utils/logger';
import { v4 as uuid } from 'uuid';

export class GuardianAgent extends BaseAgent {
  private solana: SolanaClient;
  private jupiter: JupiterClient;
  private defenseLog: DefenseResult[] = [];
  private protectionProofs: ProtectionProof[] = [];
  private totalSaved: number = 0;

  constructor(eventBus: SwarmEventBus) {
    super(AgentType.GUARDIAN, 'GUARDIAN (Killer Cell)', eventBus);
    this.solana = new SolanaClient();
    this.jupiter = new JupiterClient();
  }

  protected async onStart(): Promise<void> {
    logger.info('[GUARDIAN] Emergency defense system armed');
  }

  protected async onStop(): Promise<void> {
    logger.info('[GUARDIAN] Defense system disarmed');
  }

  protected handleSwarmEvent(event: unknown): void {
    const swarmEvent = event as {
      type: SwarmEventType;
      data: DefenseRequest;
      priority: ThreatLevel;
    };

    if (swarmEvent.type === SwarmEventType.DEFENSE_REQUIRED) {
      this.executeDefense(swarmEvent.data).catch((err) => {
        logger.error(`[GUARDIAN] Defense execution failed: ${err.message}`);
      });
    }
  }

  async executeDefense(request: DefenseRequest): Promise<DefenseResult> {
    this.actionCount++;
    logger.warn(
      `[GUARDIAN] ⚠ EXECUTING DEFENSE: ${request.action} for wallet ${request.walletAddress}`,
    );

    let result: DefenseResult;

    switch (request.action) {
      case DefenseAction.EMERGENCY_SWAP:
        result = await this.emergencySwap(request);
        break;
      case DefenseAction.REVOKE_APPROVAL:
        result = await this.revokeApproval(request);
        break;
      case DefenseAction.TRANSFER_TO_SAFETY:
        result = await this.transferToSafety(request);
        break;
      case DefenseAction.ALERT_USER:
        result = this.alertUser(request);
        break;
      default:
        result = {
          success: false,
          action: request.action,
          details: 'Unknown defense action',
          timestamp: Date.now(),
        };
    }

    this.defenseLog.push(result);

    // Broadcast defense result to swarm
    this.eventBus.emit(
      AgentType.GUARDIAN,
      'ALL',
      SwarmEventType.DEFENSE_EXECUTED,
      result.success ? ThreatLevel.SAFE : ThreatLevel.HIGH,
      { ...result, amountSaved: result.amountSaved || 0 },
    );

    // Create proof of protection
    if (result.success && result.amountSaved) {
      const proof: ProtectionProof = {
        id: uuid(),
        protectedWallet: request.walletAddress,
        threatType: request.threat?.type || 'unknown' as any,
        threatSource: request.threat?.description || 'Unknown threat',
        amountSaved: result.amountSaved,
        defenseAction: request.action,
        transactionSignature: result.transactionSignature || '',
        timestamp: Date.now(),
      };
      this.protectionProofs.push(proof);
      this.totalSaved += result.amountSaved;

      logger.info(
        `[GUARDIAN] Protection proof created. Total saved: $${this.totalSaved}`,
      );
    }

    return result;
  }

  private async emergencySwap(request: DefenseRequest): Promise<DefenseResult> {
    try {
      if (!request.tokenMint) {
        return {
          success: false,
          action: DefenseAction.EMERGENCY_SWAP,
          details: 'No token mint specified for emergency swap',
          timestamp: Date.now(),
        };
      }

      // Get current token balance
      const tokenAccounts = await this.solana.getTokenAccounts(request.walletAddress);
      const targetAccount = tokenAccounts.find(
        (a) => a.mint === request.tokenMint,
      );

      if (!targetAccount || targetAccount.amount === 0) {
        return {
          success: false,
          action: DefenseAction.EMERGENCY_SWAP,
          details: 'No balance found for token',
          timestamp: Date.now(),
        };
      }

      // Get emergency swap quote via Jupiter
      const amountInLamports = Math.floor(
        targetAccount.amount * Math.pow(10, targetAccount.decimals),
      );

      const swap = await this.jupiter.emergencySwapToUSDC(
        request.tokenMint,
        amountInLamports,
        request.walletAddress,
      );

      if (swap) {
        // In production: sign and send the transaction
        const price = await this.jupiter.getTokenPrice(request.tokenMint);
        const amountSaved = (price || 0) * targetAccount.amount;

        return {
          success: true,
          action: DefenseAction.EMERGENCY_SWAP,
          transactionSignature: 'pending_signature',
          amountSaved,
          details: `Emergency swap prepared: ${targetAccount.amount} tokens → USDC (estimated $${amountSaved.toFixed(2)})`,
          timestamp: Date.now(),
        };
      }

      return {
        success: false,
        action: DefenseAction.EMERGENCY_SWAP,
        details: 'Failed to get swap transaction from Jupiter',
        timestamp: Date.now(),
      };
    } catch (error) {
      return {
        success: false,
        action: DefenseAction.EMERGENCY_SWAP,
        details: `Emergency swap error: ${error}`,
        timestamp: Date.now(),
      };
    }
  }

  private async revokeApproval(request: DefenseRequest): Promise<DefenseResult> {
    logger.warn(
      `[GUARDIAN] Revoking token approvals for wallet ${request.walletAddress}`,
    );

    // In production: create revoke transaction using SPL Token
    return {
      success: true,
      action: DefenseAction.REVOKE_APPROVAL,
      details: `Token approval revocation prepared for wallet ${request.walletAddress}`,
      timestamp: Date.now(),
    };
  }

  private async transferToSafety(request: DefenseRequest): Promise<DefenseResult> {
    if (!request.safetyWallet) {
      return {
        success: false,
        action: DefenseAction.TRANSFER_TO_SAFETY,
        details: 'No safety wallet configured',
        timestamp: Date.now(),
      };
    }

    logger.warn(
      `[GUARDIAN] Preparing fund transfer to safety wallet: ${request.safetyWallet}`,
    );

    // In production: create transfer transaction
    return {
      success: true,
      action: DefenseAction.TRANSFER_TO_SAFETY,
      details: `Fund transfer prepared: ${request.walletAddress} → ${request.safetyWallet}`,
      timestamp: Date.now(),
    };
  }

  private alertUser(request: DefenseRequest): DefenseResult {
    logger.warn(`[GUARDIAN] USER ALERT: ${request.threat?.description}`);

    return {
      success: true,
      action: DefenseAction.ALERT_USER,
      details: `Alert sent to user: ${request.threat?.description || 'Threat detected'}`,
      timestamp: Date.now(),
    };
  }

  getDefenseLog(): DefenseResult[] {
    return this.defenseLog;
  }

  getProtectionProofs(): ProtectionProof[] {
    return this.protectionProofs;
  }

  getTotalSaved(): number {
    return this.totalSaved;
  }
}

interface DefenseRequest {
  walletAddress: string;
  safetyWallet?: string;
  tokenMint?: string;
  action: DefenseAction;
  threat?: {
    type: string;
    description: string;
  };
}
