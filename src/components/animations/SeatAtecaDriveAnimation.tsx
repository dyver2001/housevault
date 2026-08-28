import React, { useState } from 'react';
import { Gauge, Zap, Flame } from 'lucide-react';
import { soundFx } from '../../utils/audioEffects';
import { triggerConfetti } from '../../utils/confetti';

interface SeatAtecaDriveAnimationProps {
  percent?: number;
  currentAmount?: number;
  targetAmount?: number;
  currencySymbol?: string;
  lang?: string;
}

export const SeatAtecaDriveAnimation: React.FC<SeatAtecaDriveAnimationProps> = ({
  percent = 30,
  currentAmount = 22500,
  targetAmount = 75000,
  currencySymbol = 'lei',
  lang = 'ro'
}) => {
  const [isNitro, setIsNitro] = useState(false);
  const [speed, setSpeed] = useState(Math.round(40 + ((percent || 0) * 1.2)));

  const triggerNitro = () => {
    soundFx.playEngineRev();
    setIsNitro(true);
    setSpeed((prev) => Math.min(220, prev + 60));
    triggerConfetti(65, 50);

    setTimeout(() => {
      setIsNitro(false);
      setSpeed(Math.round(40 + ((percent || 0) * 1.2)));
    }, 2500);
  };

  return (
    <div className="relative w-full overflow-hidden rounded-3xl bg-stone-950 border border-emerald-500/30 p-4 sm:p-5 shadow-2xl space-y-3 select-none">
      {/* Night Sky & Road Container */}
      <div className="relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden bg-gradient-to-b from-[#060c09] via-[#091510] to-[#040806] border border-stone-800 flex flex-col justify-end">
        {/* Distant City Skyline Silhouette & Stars */}
        <div className="absolute top-2 left-0 right-0 h-16 flex items-end justify-around opacity-30 pointer-events-none">
          <div className="w-8 h-12 bg-emerald-950/60 rounded-t-sm" />
          <div className="w-12 h-8 bg-emerald-950/40 rounded-t-sm" />
          <div className="w-6 h-14 bg-emerald-950/50 rounded-t-sm" />
          <div className="w-10 h-10 bg-emerald-950/30 rounded-t-sm" />
          <div className="w-14 h-16 bg-emerald-950/60 rounded-t-sm" />
          <div className="w-8 h-9 bg-emerald-950/40 rounded-t-sm" />
        </div>

        {/* Speed Streaks in Nitro Mode */}
        {isNitro && (
          <div className="absolute inset-0 pointer-events-none z-10 animate-pulse bg-emerald-500/10">
            <div className="absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-marquee" />
            <div className="absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-marquee" />
            <div className="absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-300 to-transparent animate-marquee" />
          </div>
        )}

        {/* Headlight Beams illuminating the road forward */}
        <div className="absolute bottom-8 right-4 w-72 h-36 bg-gradient-to-r from-amber-100/25 via-emerald-400/15 to-transparent blur-md transform -skew-x-12 pointer-events-none z-10" />

        {/* The Animated Highway */}
        <div className="relative w-full h-24 bg-gradient-to-b from-stone-900 to-stone-950 border-t-2 border-emerald-500/40 overflow-hidden shadow-inner">
          {/* Animated Dashed Center Road Lines */}
          <div className="absolute top-1/2 left-0 right-0 h-1.5 flex space-x-6 transform -translate-y-1/2 overflow-hidden">
            <div
              className="flex space-x-8 whitespace-nowrap min-w-full"
              style={{
                animation: `moveRoadStripes ${isNitro ? '0.35s' : '0.85s'} linear infinite`
              }}
            >
              {[...Array(16)].map((_, i) => (
                <div key={i} className="w-12 h-1.5 bg-amber-400/80 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
              ))}
            </div>
          </div>

          {/* Road Asphalt Texture */}
          <div className="absolute bottom-1 left-0 right-0 h-0.5 bg-stone-700/60" />
        </div>

        {/* Seat Ateca Vehicle Model Driving */}
        <div
          onClick={triggerNitro}
          title="Apasă pentru NITRO & Sunet Motor!"
          className={`absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 cursor-pointer transition-transform duration-300 ${
            isNitro ? 'scale-110 -translate-y-1' : 'hover:scale-105'
          }`}
        >
          {/* Exhaust Nitro Flame */}
          {isNitro && (
            <div className="absolute bottom-4 -left-7 flex items-center space-x-1 animate-pulse">
              <div className="w-7 h-3 bg-gradient-to-l from-cyan-400 via-blue-500 to-transparent rounded-full blur-[2px]" />
              <Flame className="w-5 h-5 text-cyan-400 transform -rotate-90 animate-bounce" />
            </div>
          )}

          <svg viewBox="0 0 420 180" className="w-64 sm:w-80 h-auto filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
            <defs>
              <linearGradient id="driveAtecaBody" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#047857" />
                <stop offset="50%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#065f46" />
              </linearGradient>
              <linearGradient id="driveWheelGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#27272a" />
                <stop offset="50%" stopColor="#52525b" />
                <stop offset="100%" stopColor="#18181b" />
              </linearGradient>
            </defs>

            {/* Silver Roof Rails */}
            <path d="M 120 40 Q 200 32 300 48" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" fill="none" />
            <line x1="140" y1="40" x2="140" y2="48" stroke="#94a3b8" strokeWidth="3" />
            <line x1="280" y1="46" x2="280" y2="52" stroke="#94a3b8" strokeWidth="3" />

            {/* Car Cabin & Windows */}
            <path d="M 110 52 L 170 38 L 290 44 L 330 78 L 90 78 Z" fill="#022c22" stroke="#10b981" strokeWidth="2" />
            <path d="M 175 42 L 235 44 L 235 74 L 140 74 Z" fill="#064e3b" opacity="0.8" />
            <path d="M 245 44 L 285 46 L 318 74 L 245 74 Z" fill="#064e3b" opacity="0.8" />

            {/* Main SUV Body */}
            <path
              d="M 60 100 
                 Q 65 72 95 68 
                 L 330 68 
                 Q 375 75 395 102 
                 L 395 125 
                 L 370 125 
                 A 28 28 0 0 0 314 125 
                 L 166 125 
                 A 28 28 0 0 0 110 125 
                 L 60 125 Z"
              fill="url(#driveAtecaBody)"
              stroke="#34d399"
              strokeWidth="2.5"
            />

            {/* Seat Front Grille & Chrome 'S' */}
            <path d="M 385 92 L 398 94 L 395 116 L 382 114 Z" fill="#18181b" stroke="#71717a" strokeWidth="1.5" />
            <text x="388" y="107" fill="#ffffff" fontSize="9" fontWeight="900">S</text>

            {/* Seat Triangular Full-LED Headlights */}
            <polygon points="360,78 392,86 368,98" fill="#fef08a" filter="drop-shadow(0 0 6px #fef08a)" />

            {/* Rear LED Taillight */}
            <polygon points="60,88 85,90 80,102 58,98" fill="#f43f5e" filter="drop-shadow(0 0 4px #f43f5e)" />

            {/* Wheel 1 (Rear Wheel with Animated Spokes) */}
            <g transform="translate(138, 125)">
              <circle cx="0" cy="0" r="26" fill="url(#driveWheelGlow)" stroke="#09090b" strokeWidth="3" />
              <circle cx="0" cy="0" r="16" fill="#18181b" stroke="#e2e8f0" strokeWidth="2" />
              <circle cx="-5" cy="-5" r="4" fill="#ef4444" /> {/* Sport Red Caliper */}
              <g
                style={{
                  transformOrigin: '0 0',
                  animation: `spinWheel ${isNitro ? '0.15s' : '0.45s'} linear infinite`
                }}
              >
                <line x1="-14" y1="0" x2="14" y2="0" stroke="#f8fafc" strokeWidth="2.5" />
                <line x1="0" y1="-14" x2="0" y2="14" stroke="#f8fafc" strokeWidth="2.5" />
                <line x1="-10" y1="-10" x2="10" y2="10" stroke="#f8fafc" strokeWidth="2" />
                <line x1="-10" y1="10" x2="10" y2="-10" stroke="#f8fafc" strokeWidth="2" />
              </g>
            </g>

            {/* Wheel 2 (Front Wheel with Animated Spokes) */}
            <g transform="translate(342, 125)">
              <circle cx="0" cy="0" r="26" fill="url(#driveWheelGlow)" stroke="#09090b" strokeWidth="3" />
              <circle cx="0" cy="0" r="16" fill="#18181b" stroke="#e2e8f0" strokeWidth="2" />
              <circle cx="-5" cy="-5" r="4" fill="#ef4444" />
              <g
                style={{
                  transformOrigin: '0 0',
                  animation: `spinWheel ${isNitro ? '0.15s' : '0.45s'} linear infinite`
                }}
              >
                <line x1="-14" y1="0" x2="14" y2="0" stroke="#f8fafc" strokeWidth="2.5" />
                <line x1="0" y1="-14" x2="0" y2="14" stroke="#f8fafc" strokeWidth="2.5" />
                <line x1="-10" y1="-10" x2="10" y2="10" stroke="#f8fafc" strokeWidth="2" />
                <line x1="-10" y1="10" x2="10" y2="-10" stroke="#f8fafc" strokeWidth="2" />
              </g>
            </g>
          </svg>
        </div>
      </div>

      {/* Control Dashboard & Speedometer */}
      <div className="flex items-center justify-between bg-stone-900/90 border border-stone-800 p-3 rounded-2xl">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-stone-950 border border-stone-800">
            <Gauge className={`w-4 h-4 ${isNitro ? 'text-cyan-400 animate-spin' : 'text-emerald-400'}`} />
            <span className="font-mono font-black text-sm text-white">{speed} km/h</span>
          </div>

          <span className="text-xs text-stone-400 hidden sm:inline">
            Seat Ateca 2.0 TDI • {percent}% din 15.000 €
          </span>
        </div>

        <button
          type="button"
          onClick={triggerNitro}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-stone-950 font-black text-xs shadow-lg shadow-emerald-500/25 transition active:scale-95 flex items-center space-x-1.5 cursor-pointer"
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>{isNitro ? '🔥 TURBO ACTIVAT!' : '🚀 DĂ-I NITRO!'}</span>
        </button>
      </div>

      <style>{`
        @keyframes spinWheel {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes moveRoadStripes {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};
