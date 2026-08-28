import React from 'react';
import { Sparkles } from 'lucide-react';
import { SavingsTarget } from '../../types';

interface LiquidJarVisualizerProps {
  target: SavingsTarget;
  currencySymbol?: string;
  onDeposit?: () => void;
}

export const LiquidJarVisualizer: React.FC<LiquidJarVisualizerProps> = ({
  target,
  currencySymbol = 'lei',
  onDeposit
}) => {
  const percent = Math.min(100, Math.round(((target?.currentSavedAmount || 0) / (target?.targetAmount || 1)) * 100));
  const fillHeight = Math.max(12, Math.min(180, (percent / 100) * 170));
  const safeId = (target?.id || 'jar').replace(/[^a-zA-Z0-9_-]/g, '_');

  return (
    <div className="relative p-5 rounded-3xl bg-stone-900 border border-stone-800 hover:border-emerald-500/40 transition shadow-xl flex flex-col items-center justify-between space-y-4 group">
      {/* Target Title & Stats */}
      <div className="w-full text-center space-y-1">
        <h4 className="font-black text-sm text-white font-display truncate">
          {target?.title || 'Obiectiv'}
        </h4>
        <p className="text-xs text-stone-400 font-mono">
          {(target?.currentSavedAmount || 0).toLocaleString()} / {(target?.targetAmount || 0).toLocaleString()} {currencySymbol}
        </p>
      </div>

      {/* 3D Glass Jar with Animated Waving Neon Liquid */}
      <div className="relative w-28 h-44 flex items-center justify-center">
        <svg viewBox="0 0 120 180" className="w-full h-full filter drop-shadow-[0_8px_16px_rgba(16,185,129,0.25)]">
          <defs>
            <linearGradient id={`liquidGrad-${safeId}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>

            <clipPath id={`jarClip-${safeId}`}>
              {/* Glass Jar Interior Shape */}
              <rect x="15" y="25" width="90" height="145" rx="18" />
            </clipPath>
          </defs>

          {/* Jar Neck & Rim */}
          <rect x="30" y="10" width="60" height="14" rx="4" fill="#27272a" stroke="#52525b" strokeWidth="2" />
          <line x1="25" y1="24" x2="95" y2="24" stroke="#71717a" strokeWidth="3" strokeLinecap="round" />

          {/* Outer Glass Jar */}
          <rect
            x="15"
            y="25"
            width="90"
            height="145"
            rx="18"
            fill="#18181b"
            fillOpacity="0.6"
            stroke="#52525b"
            strokeWidth="3"
          />

          {/* Liquid Container clipped to Jar */}
          <g clipPath={`url(#jarClip-${safeId})`}>
            {/* Liquid Body */}
            <rect
              x="0"
              y={180 - fillHeight}
              width="120"
              height={fillHeight}
              fill={`url(#liquidGrad-${safeId})`}
            />

            {/* Dynamic Wave Top */}
            <path
              d={`M 0 ${180 - fillHeight} 
                 Q 30 ${180 - fillHeight - 6}, 60 ${180 - fillHeight} 
                 T 120 ${180 - fillHeight} 
                 L 120 180 L 0 180 Z`}
              fill="#6ee7b7"
              opacity="0.7"
              style={{
                animation: 'waveOscillate 2.5s ease-in-out infinite alternate'
              }}
            />

            {/* Rising Carbonation Micro-Bubbles */}
            <circle cx="35" cy="140" r="2.5" fill="#ffffff" opacity="0.6">
              <animate attributeName="cy" from="160" to="40" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="75" cy="150" r="3" fill="#ffffff" opacity="0.5">
              <animate attributeName="cy" from="170" to="50" dur="2.8s" repeatCount="indefinite" />
            </circle>
            <circle cx="55" cy="165" r="2" fill="#ffffff" opacity="0.7">
              <animate attributeName="cy" from="175" to="35" dur="1.8s" repeatCount="indefinite" />
            </circle>
          </g>

          {/* Glass Reflection Highlight */}
          <path
            d="M 22 35 L 22 155 Q 22 160 28 160 L 32 160 Q 26 160 26 155 L 26 35 Z"
            fill="#ffffff"
            opacity="0.25"
          />
        </svg>

        {/* Big Percentage Inside Jar */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xl font-black text-white font-mono drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            {percent}%
          </span>
        </div>
      </div>

      {/* Quick Deposit Pill */}
      {onDeposit && (
        <button
          type="button"
          onClick={onDeposit}
          className="w-full py-2 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition flex items-center justify-center space-x-1.5 active:scale-95 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Alimentează Seiful</span>
        </button>
      )}

      <style>{`
        @keyframes waveOscillate {
          from { transform: translateY(0px) scaleY(1); }
          to { transform: translateY(-3px) scaleY(1.15); }
        }
      `}</style>
    </div>
  );
};
