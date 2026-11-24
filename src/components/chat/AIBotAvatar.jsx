import React from 'react';
import charlyBotImg from '../../Assets/charlybot-avatar.png';

/**
 * 3D CharlyBot Avatar
 * Renders the crisp transparent 3D mascot with subtle state-reactive glow
 * for 'idle' | 'hover' | 'thinking' | 'guarded'.
 */
export function AIBotAvatar({ size = 32, state = 'idle', className = '' }) {
  const isThinking = state === 'thinking';
  const isHover = state === 'hover';
  const isGuarded = state === 'guarded';

  const glowStyle = isGuarded
    ? 'drop-shadow(0 0 8px rgba(52, 211, 153, 0.55))'
    : isThinking
    ? 'drop-shadow(0 0 10px rgba(34, 211, 238, 0.75))'
    : isHover
    ? 'drop-shadow(0 0 9px rgba(34, 211, 238, 0.55))'
    : 'drop-shadow(0 2px 6px rgba(34, 211, 238, 0.28))';

  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {isThinking && (
        <span className="pointer-events-none absolute inset-[-2px] animate-ping rounded-full border border-cyan-400/50 opacity-60" />
      )}
      <img
        src={charlyBotImg}
        alt="CharlyBot"
        width={size}
        height={size}
        draggable={false}
        style={{ filter: glowStyle }}
        className={`h-full w-full object-contain transition-transform duration-300 ${
          isHover ? 'scale-110 -rotate-3' : isThinking ? 'animate-pulse scale-105' : ''
        }`}
      />
    </span>
  );
}
