'use client';

import { useSentiment } from '@/hooks';
import { TrendingUp } from 'lucide-react';

const SENTIMENT_COLORS: Record<string, string> = {
  BULLISH: '#00ff88',
  NEUTRAL: '#00d4ff',
  BEARISH: '#ff8800',
  FEAR: '#ff3366',
  EXTREME_FEAR: '#ff0033',
};

export default function SentimentGauge() {
  const { data } = useSentiment();

  const sentiment = data?.overall ?? 'NEUTRAL';
  const score = data?.score ?? 50;
  const signals = data?.signals ?? [];
  const color = SENTIMENT_COLORS[sentiment] ?? '#808090';

  const angle = (score / 100) * 180 - 90;

  return (
    <div className="bg-cyber-card border border-cyber-border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp size={14} className="text-cyber-blue" />
        <h3 className="text-sm font-bold text-cyber-text-dim uppercase tracking-wider">
          Market Sentiment
        </h3>
      </div>

      <div className="flex flex-col items-center">
        <svg width="160" height="90" viewBox="0 0 160 90">
          <path
            d="M 10 80 A 70 70 0 0 1 150 80"
            fill="none"
            stroke="#1e1e2e"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M 10 80 A 70 70 0 0 1 150 80"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${(score / 100) * 220} 220`}
            opacity="0.8"
          />
          <line
            x1="80"
            y1="80"
            x2={80 + 50 * Math.cos((angle * Math.PI) / 180)}
            y2={80 - 50 * Math.sin((angle * Math.PI) / 180)}
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="80" cy="80" r="4" fill={color} />
          <text x="80" y="72" textAnchor="middle" fill={color} fontSize="16" fontFamily="monospace" fontWeight="bold">
            {score}
          </text>
        </svg>

        <span className="text-xs font-bold mt-1" style={{ color }}>
          {sentiment.replace(/_/g, ' ')}
        </span>

        {signals.length > 0 && (
          <div className="mt-2 w-full">
            {signals.slice(0, 3).map((signal, i) => (
              <p key={i} className="text-[10px] text-cyber-text-dim truncate">
                {signal}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
