'use client';

import { clsx } from 'clsx';
import { Bot, User } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '@/lib/types';

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={clsx('flex gap-2', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser && (
        <div className="w-7 h-7 rounded bg-cyber-green/10 border border-cyber-green/30 flex items-center justify-center flex-shrink-0 mt-1">
          <Bot size={14} className="text-cyber-green" />
        </div>
      )}
      <div
        className={clsx(
          'max-w-[80%] rounded-lg px-3 py-2 text-sm',
          isUser
            ? 'bg-cyber-blue/10 border border-cyber-blue/30 text-cyber-text'
            : 'bg-cyber-darker border border-cyber-green/20 text-cyber-green/90',
        )}
      >
        <pre className="whitespace-pre-wrap font-mono text-[12px] leading-relaxed">
          {message.content}
        </pre>
      </div>
      {isUser && (
        <div className="w-7 h-7 rounded bg-cyber-blue/10 border border-cyber-blue/30 flex items-center justify-center flex-shrink-0 mt-1">
          <User size={14} className="text-cyber-blue" />
        </div>
      )}
    </div>
  );
}
