'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={disabled ? 'Waiting for response...' : 'Ask the AI swarm anything...'}
        disabled={disabled}
        className="flex-1 bg-cyber-black border border-cyber-green/30 rounded px-3 py-2 text-sm text-cyber-green font-mono placeholder:text-cyber-green/30 focus:outline-none focus:border-cyber-green/60 disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={disabled || !input.trim()}
        className="bg-cyber-green/10 border border-cyber-green/40 text-cyber-green rounded px-3 py-2 hover:bg-cyber-green/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <Send size={16} />
      </button>
    </form>
  );
}
