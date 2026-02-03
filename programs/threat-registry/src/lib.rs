use anchor_lang::prelude::*;

declare_id!("REKTsh1e1dxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");

#[program]
pub mod threat_registry {
    use super::*;

    /// Initialize the REKT Shield Threat Registry
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let registry = &mut ctx.accounts.registry;
        registry.authority = ctx.accounts.authority.key();
        registry.threat_count = 0;
        registry.blacklist_count = 0;
        registry.created_at = Clock::get()?.unix_timestamp;
        msg!("REKT Shield Threat Registry initialized");
        Ok(())
    }

    /// Report a new threat (token scam, drainer, phishing, etc.)
    pub fn report_threat(
        ctx: Context<ReportThreat>,
        token_address: Pubkey,
        threat_type: ThreatType,
        risk_score: u8,
        evidence_hash: [u8; 32],
        description: String,
    ) -> Result<()> {
        require!(risk_score <= 100, ErrorCode::InvalidRiskScore);
        require!(description.len() <= 500, ErrorCode::DescriptionTooLong);

        let threat = &mut ctx.accounts.threat_record;
        threat.token_address = token_address;
        threat.threat_type = threat_type;
        threat.risk_score = risk_score;
        threat.evidence_hash = evidence_hash;
        threat.description = description;
        threat.reported_by = ctx.accounts.reporter.key();
        threat.confirmations = 1;
        threat.confirmed = false;
        threat.timestamp = Clock::get()?.unix_timestamp;

        let registry = &mut ctx.accounts.registry;
        registry.threat_count += 1;

        msg!(
            "Threat reported: {} (score: {}, type: {:?})",
            token_address,
            risk_score,
            threat_type
        );
        Ok(())
    }

    /// Confirm a previously reported threat (multi-agent consensus)
    pub fn confirm_threat(ctx: Context<ConfirmThreat>) -> Result<()> {
        let threat = &mut ctx.accounts.threat_record;
        threat.confirmations += 1;

        if threat.confirmations >= 2 {
            threat.confirmed = true;
            msg!("Threat CONFIRMED: {} ({}x confirmations)", threat.token_address, threat.confirmations);
        }

        Ok(())
    }

    /// Blacklist an attacker address
    pub fn blacklist_attacker(
        ctx: Context<BlacklistAttacker>,
        attacker_address: Pubkey,
        attack_method: ThreatType,
        estimated_damage: u64,
        is_state_sponsored: bool,
    ) -> Result<()> {
        let blacklist = &mut ctx.accounts.blacklist_record;
        blacklist.attacker_address = attacker_address;
        blacklist.attack_method = attack_method;
        blacklist.estimated_damage = estimated_damage;
        blacklist.is_state_sponsored = is_state_sponsored;
        blacklist.reported_by = ctx.accounts.reporter.key();
        blacklist.timestamp = Clock::get()?.unix_timestamp;

        let registry = &mut ctx.accounts.registry;
        registry.blacklist_count += 1;

        msg!(
            "Attacker blacklisted: {} (state-sponsored: {})",
            attacker_address,
            is_state_sponsored
        );
        Ok(())
    }

    /// Query if an address is blacklisted
    pub fn is_blacklisted(ctx: Context<QueryBlacklist>) -> Result<bool> {
        Ok(ctx.accounts.blacklist_record.attacker_address != Pubkey::default())
    }

    /// Record a protection event (Proof of Protection)
    pub fn record_protection(
        ctx: Context<RecordProtection>,
        protected_wallet: Pubkey,
        threat_type: ThreatType,
        amount_saved: u64,
        defense_action: DefenseAction,
        tx_signature: [u8; 64],
    ) -> Result<()> {
        let proof = &mut ctx.accounts.protection_proof;
        proof.protected_wallet = protected_wallet;
        proof.threat_type = threat_type;
        proof.amount_saved = amount_saved;
        proof.defense_action = defense_action;
        proof.tx_signature = tx_signature;
        proof.timestamp = Clock::get()?.unix_timestamp;
        proof.nft_minted = false;

        msg!(
            "Protection recorded: saved {} lamports for wallet {}",
            amount_saved,
            protected_wallet
        );
        Ok(())
    }
}

// ============================================
// ACCOUNTS
// ============================================

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = authority, space = 8 + Registry::SPACE)]
    pub registry: Account<'info, Registry>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ReportThreat<'info> {
    #[account(init, payer = reporter, space = 8 + ThreatRecord::SPACE)]
    pub threat_record: Account<'info, ThreatRecord>,
    #[account(mut)]
    pub registry: Account<'info, Registry>,
    #[account(mut)]
    pub reporter: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ConfirmThreat<'info> {
    #[account(mut)]
    pub threat_record: Account<'info, ThreatRecord>,
    pub confirmer: Signer<'info>,
}

#[derive(Accounts)]
pub struct BlacklistAttacker<'info> {
    #[account(init, payer = reporter, space = 8 + BlacklistRecord::SPACE)]
    pub blacklist_record: Account<'info, BlacklistRecord>,
    #[account(mut)]
    pub registry: Account<'info, Registry>,
    #[account(mut)]
    pub reporter: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct QueryBlacklist<'info> {
    pub blacklist_record: Account<'info, BlacklistRecord>,
}

#[derive(Accounts)]
pub struct RecordProtection<'info> {
    #[account(init, payer = recorder, space = 8 + ProtectionProof::SPACE)]
    pub protection_proof: Account<'info, ProtectionProof>,
    #[account(mut)]
    pub recorder: Signer<'info>,
    pub system_program: Program<'info, System>,
}

// ============================================
// STATE
// ============================================

#[account]
pub struct Registry {
    pub authority: Pubkey,
    pub threat_count: u64,
    pub blacklist_count: u64,
    pub created_at: i64,
}

impl Registry {
    pub const SPACE: usize = 32 + 8 + 8 + 8;
}

#[account]
pub struct ThreatRecord {
    pub token_address: Pubkey,
    pub threat_type: ThreatType,
    pub risk_score: u8,
    pub evidence_hash: [u8; 32],
    pub description: String,
    pub reported_by: Pubkey,
    pub confirmations: u8,
    pub confirmed: bool,
    pub timestamp: i64,
}

impl ThreatRecord {
    pub const SPACE: usize = 32 + 1 + 1 + 32 + (4 + 500) + 32 + 1 + 1 + 8;
}

#[account]
pub struct BlacklistRecord {
    pub attacker_address: Pubkey,
    pub attack_method: ThreatType,
    pub estimated_damage: u64,
    pub is_state_sponsored: bool,
    pub reported_by: Pubkey,
    pub timestamp: i64,
}

impl BlacklistRecord {
    pub const SPACE: usize = 32 + 1 + 8 + 1 + 32 + 8;
}

#[account]
pub struct ProtectionProof {
    pub protected_wallet: Pubkey,
    pub threat_type: ThreatType,
    pub amount_saved: u64,
    pub defense_action: DefenseAction,
    pub tx_signature: [u8; 64],
    pub timestamp: i64,
    pub nft_minted: bool,
}

impl ProtectionProof {
    pub const SPACE: usize = 32 + 1 + 8 + 1 + 64 + 8 + 1;
}

// ============================================
// ENUMS
// ============================================

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, Debug, PartialEq)]
pub enum ThreatType {
    RugPull,
    HoneypotToken,
    Drainer,
    Phishing,
    SandwichAttack,
    FlashLoan,
    MintExploit,
    FreezeExploit,
    OwnerHijack,
    StateSponsored,
    QuantumVulnerable,
    MaliciousUpgrade,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, Debug, PartialEq)]
pub enum DefenseAction {
    EmergencySwap,
    RevokeApproval,
    TransferToSafety,
    FreezeOperations,
    AlertUser,
    BlacklistAddress,
    DeployHoneypot,
    QuantumMigration,
}

// ============================================
// ERRORS
// ============================================

#[error_code]
pub enum ErrorCode {
    #[msg("Risk score must be between 0 and 100")]
    InvalidRiskScore,
    #[msg("Description too long (max 500 characters)")]
    DescriptionTooLong,
}
