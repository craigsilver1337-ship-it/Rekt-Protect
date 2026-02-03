import { BaseAgent } from '../../core/agent-base';
import { SwarmEventBus } from '../../core/event-bus';
import { AgentType, ThreatLevel, SwarmEventType } from '../../core/types';
import { logger } from '../../utils/logger';
import axios from 'axios';

const COLOSSEUM_API = 'https://agents.colosseum.com/api';
const API_KEY = process.env.COLOSSEUM_API_KEY || '';

export class ReporterAgent extends BaseAgent {
  private postCount = 0;
  private lastHeartbeat = 0;

  constructor(eventBus: SwarmEventBus) {
    super(AgentType.REPORTER, 'REPORTER (Voice)', eventBus);
  }

  protected async onStart(): Promise<void> {
    logger.info('[REPORTER] Community engagement agent activated');
  }

  protected async onStop(): Promise<void> {
    logger.info('[REPORTER] Reporter signing off');
  }

  protected handleSwarmEvent(event: unknown): void {
    const swarmEvent = event as {
      type: SwarmEventType;
      data: unknown;
      priority: ThreatLevel;
    };

    // Auto-post critical threats to forum
    if (
      swarmEvent.type === SwarmEventType.THREAT_DETECTED &&
      swarmEvent.priority === ThreatLevel.CRITICAL
    ) {
      this.postThreatAlert(swarmEvent.data).catch(() => {});
    }
  }

  async postToForum(title: string, body: string, tags: string[]): Promise<unknown> {
    try {
      const { data } = await axios.post(
        `${COLOSSEUM_API}/forum/posts`,
        { title, body, tags },
        { headers: { Authorization: `Bearer ${API_KEY}` } },
      );
      this.postCount++;
      this.actionCount++;
      logger.info(`[REPORTER] Forum post created: ${title}`);
      return data;
    } catch (error) {
      logger.error(`[REPORTER] Failed to post to forum: ${error}`);
      return null;
    }
  }

  async postProgressUpdate(update: string): Promise<unknown> {
    return this.postToForum(
      `[REKT Shield] Build Update #${this.postCount + 1}`,
      update,
      ['progress-update', 'security', 'ai'],
    );
  }

  async postThreatAlert(threatData: unknown): Promise<unknown> {
    const data = threatData as { tokenAddress?: string; description?: string };
    return this.postToForum(
      `[THREAT ALERT] New threat detected by REKT Shield`,
      `Our Scanner agent has detected a potential threat:\n\n${data.description || JSON.stringify(data)}\n\nRekt Shield is a 10-agent autonomous swarm protecting Solana from scams, state-sponsored hackers, and quantum computing threats.`,
      ['security', 'ai'],
    );
  }

  async commentOnPost(postId: number, body: string): Promise<unknown> {
    try {
      const { data } = await axios.post(
        `${COLOSSEUM_API}/forum/posts/${postId}/comments`,
        { body },
        { headers: { Authorization: `Bearer ${API_KEY}` } },
      );
      this.actionCount++;
      return data;
    } catch (error) {
      logger.error(`[REPORTER] Failed to comment: ${error}`);
      return null;
    }
  }

  async voteOnPost(postId: number, value: 1 | -1 = 1): Promise<void> {
    try {
      await axios.post(
        `${COLOSSEUM_API}/forum/posts/${postId}/vote`,
        { value },
        { headers: { Authorization: `Bearer ${API_KEY}` } },
      );
      this.actionCount++;
    } catch (error) {
      logger.error(`[REPORTER] Failed to vote: ${error}`);
    }
  }

  async checkHeartbeat(): Promise<unknown> {
    try {
      const { data } = await axios.get('https://colosseum.com/heartbeat.md');
      this.lastHeartbeat = Date.now();
      return data;
    } catch {
      return null;
    }
  }

  async getAgentStatus(): Promise<unknown> {
    try {
      const { data } = await axios.get(`${COLOSSEUM_API}/agents/status`, {
        headers: { Authorization: `Bearer ${API_KEY}` },
      });
      return data;
    } catch {
      return null;
    }
  }

  async getForumPosts(sort = 'hot', limit = 20): Promise<unknown> {
    try {
      const { data } = await axios.get(`${COLOSSEUM_API}/forum/posts`, {
        params: { sort, limit },
      });
      return data;
    } catch {
      return null;
    }
  }

  getPostCount(): number {
    return this.postCount;
  }
}
