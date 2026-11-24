import React from 'react';

/**
 * Bespoke Interactive AI Core / Neural Bot SVG Avatar
 * Replaces the generic robot icon with a refined, AI-native orbital visor
 * that visually reacts to `state`: 'idle' | 'hover' | 'thinking' | 'guarded'.
 */
export function AIBotAvatar({ size = 32, state = 'idle', className = '' }) {
  const isThinking = state === 'thinking';
  const isHover = state === 'hover';
  const isGuarded = state === 'guarded';
  const uid = React.useId().replace(/:/g, '');

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`core-${uid}`} cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor={isGuarded ? '#34D399' : '#67E8F9'} />
          <stop offset="55%" stopColor={isGuarded ? '#059669' : '#6366F1'} />
          <stop offset="100%" stopColor="#0F1020" />
        </radialGradient>
        <linearGradient id={`ring-${uid}`} x1="6" y1="6" x2="58" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#22D3EE" />
          <stop offset="50%" stopColor="#818CF8" />
          <stop offset="100%" stopColor="#34D399" />
        </linearGradient>
        <linearGradient id={`visor-${uid}`} x1="16" y1="22" x2="48" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0B1120" />
          <stop offset="100%" stopColor="#161930" />
        </linearGradient>
      </defs>

      {/* Outer orbital neural ring */}
      <g
        style={{
          transformOrigin: '32px 32px',
          animation: isThinking
            ? 'orbit-slow 2.2s linear infinite'
            : 'orbit-slow 14s linear infinite'
        }}
      >
        <circle
          cx="32"
          cy="32"
          r="28.5"
          stroke={`url(#ring-${uid})`}
          strokeWidth="1.5"
          strokeDasharray={isThinking ? '14 8 6 8' : '26 10 8 10'}
          strokeLinecap="round"
          opacity={isHover || isThinking ? '0.95' : '0.6'}
        />
        <circle cx="32" cy="3.5" r="2.2" fill="#22D3EE" />
        <circle cx="57" cy="46" r="1.8" fill="#818CF8" />
      </g>

      {/* Subtle ambient halo */}
      <circle
        cx="32"
        cy="32"
        r="22.5"
        fill={`url(#core-${uid})`}
        opacity={isThinking ? '0.32' : '0.2'}
      />

      {/* Sleek metallic dark head chassis */}
      <rect
        x="12"
        y="14"
        width="40"
        height="36"
        rx="14"
        fill="#11121B"
        stroke={`url(#ring-${uid})`}
        strokeWidth="1.75"
      />

      {/* Subtle neural antenna spark */}
      <path
        d="M32 9.5V14"
        stroke="#22D3EE"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <circle
        cx="32"
        cy="8.5"
        r={isThinking ? '2.8' : '2'}
        fill={isGuarded ? '#34D399' : '#22D3EE'}
      />

      {/* Glass AI Visor */}
      <rect
        x="17"
        y="21"
        width="30"
        height="18"
        rx="9"
        fill={`url(#visor-${uid})`}
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1"
      />

      {/* Expressive AI Eyes / Neural Wave */}
      {isThinking ? (
        <g>
          <circle cx="24" cy="30" r="2.4" fill="#22D3EE">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1s" repeatCount="indefinite" begin="0s" />
          </circle>
          <circle cx="32" cy="30" r="2.4" fill="#818CF8">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1s" repeatCount="indefinite" begin="0.2s" />
          </circle>
          <circle cx="40" cy="30" r="2.4" fill="#34D399">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1s" repeatCount="indefinite" begin="0.4s" />
          </circle>
        </g>
      ) : (
        <g>
          {/* Left glowing eye */}
          <rect
            x="22.5"
            y={isHover ? '26.5' : '27'}
            width="5"
            height={isHover ? '7' : '6'}
            rx="2.5"
            fill="#22D3EE"
          />
          <circle cx="24.2" cy="28.7" r="1" fill="#ECFEFF" />

          {/* Right glowing eye */}
          <rect
            x="36.5"
            y={isHover ? '26.5' : '27'}
            width="5"
            height={isHover ? '7' : '6'}
            rx="2.5"
            fill="#818CF8"
          />
          <circle cx="38.2" cy="28.7" r="1" fill="#EEF2FF" />

          {/* Subtle neural smile / waveform bar */}
          <path
            d={isHover ? 'M27.5 43.2C29.3 45.2 34.7 45.2 36.5 43.2' : 'M28.5 43.5H35.5'}
            stroke="#22D3EE"
            strokeWidth="1.75"
            strokeLinecap="round"
            opacity="0.85"
          />
        </g>
      )}
    </svg>
  );
}
