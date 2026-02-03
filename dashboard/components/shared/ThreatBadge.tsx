'use client';

import { clsx } from 'clsx';
import { ThreatLevel } from '@/lib/types';
import { threatLevelBg, threatLevelColor } from '@/lib/formatters';

interface ThreatBadgeProps {
  level: ThreatLevel;
  className?: string;
}

export default function ThreatBadge({ level, className }: ThreatBadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border',
        threatLevelBg(level),
        threatLevelColor(level),
        className,
      )}
    >
      {level}
    </span>
  );
}
