'use client';

import { useRef, useEffect } from 'react';
import { ChatMessage as ChatMessageType } from '@/lib/types';
import ChatMessage from './ChatMessage';
import { Terminal } from 'lucide-react';

interface ChatWindowProps {
  messages: ChatMessageType[];
  loading: boolean;
}

export default function ChatWindow({ messages, loading }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="bg-cyber-black border border-cyber-green/20 rounded-lg flex-1 overflow-hidden flex flex-col">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-cyber-green/10 bg-cyber-green/5">
        <Terminal size={12} className="text-cyber-green" />
        <span className="text-[10px] text-cyber-green font-mono uppercase tracking-wider">
          rekt-shield-ai@swarm:~$
        </span>
        <div className="flex gap-1 ml-auto">
          <div className="w-2 h-2 rounded-full bg-cyber-green/30" />
          <div className="w-2 h-2 rounded-full bg-cyber-green/30" />
          <div className="w-2 h-2 rounded-full bg-cyber-green" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <Terminal size={32} className="text-cyber-green/20 mx-auto mb-3" />
            <p className="text-xs text-cyber-green/40 font-mono">
              REKT SHIELD AI Terminal
            </p>
            <p className="text-[10px] text-cyber-green/30 font-mono mt-1">
              Ask about threats, scan tokens, or get security recommendations
            </p>
          </div>
        )}
        {messages.map((msg, i) => (
          <ChatMessage key={i} message={msg} />
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-cyber-green/60 text-xs">
            <div className="flex gap-1">
              <span className="animate-pulse">.</span>
              <span className="animate-pulse" style={{ animationDelay: '0.2s' }}>.</span>
              <span className="animate-pulse" style={{ animationDelay: '0.4s' }}>.</span>
            </div>
            <span className="font-mono">Processing</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
