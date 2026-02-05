'use client';

import { useState, useCallback } from 'react';
import { ChatWindow, ChatInput } from '@/components/chat';
import { ChatMessage } from '@/lib/types';
import { aiChat } from '@/lib/api';
import { CyberButton } from '@/components/shared';
import { Sparkles } from 'lucide-react';

const QUICK_ACTIONS = [
  { label: 'Threat Report', action: 'Generate a current threat landscape report for Solana' },
  { label: 'Market Risk', action: 'What is the current market risk level and why?' },
  { label: 'Top Threats', action: 'What are the top active threats right now?' },
  { label: 'Agent Status', action: 'Give me a summary of all agent statuses and any issues' },
];

export default function ChatTab() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = useCallback(async (content: string) => {
    const userMsg: ChatMessage = {
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await aiChat(content) as Record<string, unknown>;
      const reply = (response?.response as string) ?? (response?.message as string) ?? 'No response received.';
      const assistantMsg: ChatMessage = {
        role: 'assistant',
        content: reply,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        role: 'assistant',
        content: `Error: ${err instanceof Error ? err.message : 'Failed to get response'}`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-cyber-green glow-text-green mb-1">
            AI Intelligence Terminal
          </h1>
          <p className="text-xs text-cyber-text-dim max-w-md mx-auto">
            Chat with the REKT PROTECT AI swarm intelligence
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <Sparkles size={12} className="text-cyber-green" />
          <span className="text-[10px] text-cyber-green">Powered by Claude</span>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {QUICK_ACTIONS.map((qa) => (
          <CyberButton
            key={qa.label}
            size="sm"
            variant="secondary"
            onClick={() => sendMessage(qa.action)}
            disabled={loading}
          >
            {qa.label}
          </CyberButton>
        ))}
      </div>

      <ChatWindow messages={messages} loading={loading} />
      <ChatInput onSend={sendMessage} disabled={loading} />
    </div>
  );
}
