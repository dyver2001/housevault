import React, { useState } from 'react';
import { Car, Sparkles, Key, CheckCircle, ChevronRight, Gauge, Zap, Compass } from 'lucide-react';
import { SavingsTarget } from '../types';

import { soundFx } from '../utils/audioEffects';
import { triggerConfetti } from '../utils/confetti';
import { SeatAtecaDriveAnimation } from './animations/SeatAtecaDriveAnimation';

interface DreamHouseVisualizerProps {
  targets: SavingsTarget[];
  currencySymbol?: string;
  onDepositMore?: (targetId: string) => void;
  lang?: string;
}

export const DreamHouseVisualizer: React.FC<DreamHouseVisualizerProps> = ({
  targets,
  currencySymbol = 'lei',
  onDepositMore,
  lang = 'ro'
}) => {
  const [viewMode, setViewMode] = useState<'BUILD' | 'DRIVE'>('BUILD');

  // Find primary Seat Ateca / car target (or default to Seat Ateca)
  const carTarget = targets.find(
    (t) =>
      t.title.toLowerCase().includes('seat') ||
      t.title.toLowerCase().includes('ateca') ||
      t.title.toLowerCase().includes('masin') ||
      t.title.toLowerCase().includes('mașin') ||
      t.title.toLowerCase().includes('car') ||
      t.title.toLowerCase().includes('auto')
  ) || targets[0] || {
    id: 'target-seat-ateca',
    title: 'Seat Ateca (15.000 €)',
    targetAmount: 75000,
    currentSavedAmount: 22500,
    priority: 'CRITICAL',
    category: 'VEHICLE',
    deadline: '2027-12-31',
    iconName: 'car'
  };

  const percent = Math.min(100, Math.round((carTarget.currentSavedAmount / (carTarget.targetAmount || 1)) * 100));

  const handleCarClick = () => {
    soundFx.playEngineRev();
    triggerConfetti(50, 40);
  };

  // Determine car assembly stage
  const getStage = (pct: number) => {
    if (pct < 25) return { stage: 1, label: lang === 'ro' ? 'Șasiu SUV, Suspensie & Jante Aliaj 18"' : 'SUV Chassis & 18" Alloy Wheels', icon: '🛞', next: 25 };
    if (pct < 50) return { stage: 2, label: lang === 'ro' ? 'Caroserie Seat Ateca & Bare Plafon Argintii' : 'Seat Ateca Body & Roof Rails', icon: '🚙', next: 50 };
    if (pct < 75) return { stage: 3, label: lang === 'ro' ? 'Motor 2.0 TDI/TSI, Faruri Seat Full-LED & Cockpit' : '2.0 TDI Engine & Seat Full-LEDs', icon: '⚡', next: 75 };
    return { stage: 4, label: lang === 'ro' ? 'Seat Ateca Gata de Drum • Cheia în Mână!' : 'Seat Ateca Ready • Keys in Hand!', icon: '🔑', next: 100 };
  };

  const currentStageInfo = getStage(percent);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-900 via-stone-850 to-emerald-950/40 border border-emerald-500/30 p-5 sm:p-6 shadow-2xl space-y-4">
      {/* Decorative glows */}
      <div className="absolute -right-12 -top-12 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
        <div className="flex items-center space-x-3">
          <div
            onClick={handleCarClick}
            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 via-emerald-500 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/20 cursor-pointer active:scale-95 transition"
            title="Apasă pentru sunet motor Seat Ateca!"
          >
            <div className="w-full h-full bg-stone-950 rounded-[14px] flex items-center justify-center text-emerald-400">
              <Car className="w-6 h-6" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-black text-white font-display">
                {lang === 'ro' ? 'Seat Ateca SUV • Mașina Noastră de Vis' : 'Seat Ateca SUV • Dream Car Builder'}
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                {percent}% {lang === 'ro' ? 'Construit' : 'Built'}
              </span>
            </div>
            <p className="text-xs text-stone-400">
              {carTarget.title} • {carTarget.currentSavedAmount.toLocaleString()} / {carTarget.targetAmount.toLocaleString()} {currencySymbol} (~15.000 €)
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Mode Switcher */}
          <div className="flex bg-stone-950/80 p-1 rounded-xl border border-stone-800">
            <button
              type="button"
              onClick={() => {
                soundFx.playCashChime();
                setViewMode('BUILD');
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                viewMode === 'BUILD' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-stone-400'
              }`}
            >
              🛠️ {lang === 'ro' ? 'Atelier' : 'Workshop'}
            </button>
            <button
              type="button"
              onClick={() => {
                soundFx.playEngineRev();
                setViewMode('DRIVE');
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                viewMode === 'DRIVE' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-stone-400'
              }`}
            >
              🛣️ {lang === 'ro' ? 'La Drum' : 'Night Drive'}
            </button>
          </div>

          {percent >= 100 ? (
            <span
              onClick={handleCarClick}
              className="px-3 py-1.5 rounded-xl bg-amber-500 text-stone-950 font-black text-xs flex items-center space-x-1.5 shadow-lg animate-bounce cursor-pointer"
            >
              <Key className="w-4 h-4" />
              <span>{lang === 'ro' ? 'CHEIA ÎN MÂNĂ!' : 'KEYS UNLOCKED!'}</span>
            </span>
          ) : (
            <button
              type="button"
              onClick={() => {
                soundFx.playCashChime();
                if (onDepositMore) onDepositMore(carTarget.id);
              }}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition flex items-center space-x-1 cursor-pointer active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'ro' ? 'Adaugă' : 'Deposit'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Conditionally Render Night Drive Animation vs Workshop SVG */}
      {viewMode === 'DRIVE' ? (
        <SeatAtecaDriveAnimation
          percent={percent}
          currentAmount={carTarget.currentSavedAmount}
          targetAmount={carTarget.targetAmount}
          currencySymbol={currencySymbol}
          lang={lang}
        />
      ) : (
        <>
      {/* Visual Car Illustration (Seat Ateca SUV 4-Stage Animated SVG) */}
      <div
        onClick={handleCarClick}
        title="Apasă pe mașină pentru a tura motorul Seat Ateca!"
        className="my-5 p-4 rounded-2xl bg-stone-950/80 hover:bg-stone-950/90 border border-stone-800/80 hover:border-emerald-500/40 flex flex-col items-center justify-center relative z-10 overflow-hidden cursor-pointer transition group"
      >
        <svg
          viewBox="0 0 460 210"
          className="w-full max-w-lg h-44 transition-all duration-700 select-none group-hover:scale-[1.02]"
        >
          <defs>
            {/* Gradients for Seat Ateca body & neon glow */}
            <linearGradient id="atecaBodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#047857" />
              <stop offset="40%" stopColor="#10b981" />
              <stop offset="80%" stopColor="#059669" />
              <stop offset="100%" stopColor="#064e3b" />
            </linearGradient>
            <linearGradient id="atecaGlassGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#0369a1" stopOpacity="0.5" />
            </linearGradient>
            <linearGradient id="headlightBeam" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Asphalt Road & Animated Speed Lines */}
          <rect x="10" y="180" width="440" height="18" rx="9" fill="#1c1917" />
          <line x1="30" y1="189" x2="430" y2="189" stroke="#44403c" strokeWidth="2" strokeDasharray="14 12" />

          {/* Dynamic Neon Underglow (Green/Cyan) when >= 50% */}
          {percent >= 50 && (
            <ellipse cx="230" cy="180" rx="140" ry="10" fill="#10b981" opacity={percent >= 75 ? '0.4' : '0.2'} filter="blur(6px)" />
          )}

          {/* Headlight Beams projecting forward when >= 75% */}
          {percent >= 75 && (
            <polygon points="395,135 458,115 458,175 395,150" fill="url(#headlightBeam)" />
          )}

          {/* STAGE 1: CHASSIS & SUV WHEELS (0% - 24%) */}
          <g className="transition-all duration-500">
            {/* SUV High-Clearance Chassis Frame */}
            <rect
              x="85"
              y="158"
              width="290"
              height="14"
              rx="4"
              fill={percent >= 5 ? '#292524' : '#1c1917'}
              stroke={percent >= 25 ? '#10b981' : '#57534e'}
              strokeWidth="2"
              strokeDasharray={percent < 25 ? '4 4' : 'none'}
            />

            {/* Rear Wheel (Left) - 18" Bi-Color Alloy Rim */}
            <circle cx="140" cy="168" r="24" fill="#09090b" stroke="#78716c" strokeWidth="3.5" />
            <circle cx="140" cy="168" r="15" fill="#27272a" stroke={percent >= 25 ? '#10b981' : '#71717a'} strokeWidth="2" />
            <circle cx="140" cy="168" r="6" fill="#10b981" />
            {/* Rim Spokes */}
            <line x1="140" y1="152" x2="140" y2="184" stroke="#e2e8f0" strokeWidth="1.5" />
            <line x1="124" y1="168" x2="156" y2="168" stroke="#e2e8f0" strokeWidth="1.5" />
            <line x1="128" y1="156" x2="152" y2="180" stroke="#a1a1aa" strokeWidth="1.2" />
            <line x1="128" y1="180" x2="152" y2="156" stroke="#a1a1aa" strokeWidth="1.2" />

            {/* Front Wheel (Right) - 18" Bi-Color Alloy Rim */}
            <circle cx="340" cy="168" r="24" fill="#09090b" stroke="#78716c" strokeWidth="3.5" />
            <circle cx="340" cy="168" r="15" fill="#27272a" stroke={percent >= 25 ? '#10b981' : '#71717a'} strokeWidth="2" />
            <circle cx="340" cy="168" r="6" fill="#10b981" />
            {/* Rim Spokes */}
            <line x1="340" y1="152" x2="340" y2="184" stroke="#e2e8f0" strokeWidth="1.5" />
            <line x1="324" y1="168" x2="356" y2="168" stroke="#e2e8f0" strokeWidth="1.5" />
            <line x1="328" y1="156" x2="352" y2="180" stroke="#a1a1aa" strokeWidth="1.2" />
            <line x1="328" y1="180" x2="352" y2="156" stroke="#a1a1aa" strokeWidth="1.2" />

            {/* Brembo Sport Calipers */}
            {percent >= 15 && (
              <>
                <rect x="150" y="156" width="7" height="14" rx="2" fill="#ef4444" />
                <rect x="350" y="156" width="7" height="14" rx="2" fill="#ef4444" />
              </>
            )}

            {percent < 25 && (
              <text x="240" y="140" textAnchor="middle" fill="#a8a29e" fontSize="11" fontWeight="bold">
                🛞 {lang === 'ro' ? 'Montare Șasiu & Jante Aliaj 18" Seat...' : 'Assembling Seat Ateca Chassis & 18" Rims...'}
              </text>
            )}
          </g>

          {/* STAGE 2: SEAT ATECA SUV BODYWORK, SILVER ROOF RAILS & GLASS (25% - 49%) */}
          {percent >= 25 && (
            <g className="transition-all duration-700">
              {/* Lower SUV Protective Plastic Cladding */}
              <path d="M 75 160 L 95 138 L 155 125 L 365 125 L 405 145 L 400 162 L 75 162 Z" fill="#18181b" />

              {/* Main Body Shell (Seat Ateca dynamic muscular shoulders) */}
              <path
                d="M 75 158 L 92 130 L 145 118 L 365 118 L 405 138 L 402 158 L 75 158 Z"
                fill={percent >= 50 ? 'url(#atecaBodyGrad)' : '#064e3b'}
                stroke="#10b981"
                strokeWidth="2.5"
              />

              {/* SUV Tall Cabin & Roofline (Seat Ateca Crossover profile) */}
              <path
                d="M 148 118 L 180 72 L 310 72 L 358 118 Z"
                fill="#0f172a"
                stroke="#10b981"
                strokeWidth="2"
              />

              {/* Seat Ateca Silver Roof Rails (Bare Plafon) */}
              <line x1="190" y1="68" x2="305" y2="68" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
              <line x1="205" y1="68" x2="205" y2="72" stroke="#94a3b8" strokeWidth="2" />
              <line x1="290" y1="68" x2="290" y2="72" stroke="#94a3b8" strokeWidth="2" />

              {/* Tinted Windows */}
              {/* Rear Quarter Window */}
              <polygon points="158,114 185,78 225,78 225,114" fill="url(#atecaGlassGrad)" stroke="#0284c7" strokeWidth="1" />
              {/* Middle Door Window */}
              <polygon points="230,114 230,78 280,78 280,114" fill="url(#atecaGlassGrad)" stroke="#0284c7" strokeWidth="1" />
              {/* Front Windshield Window */}
              <polygon points="285,114 285,78 305,78 348,114" fill="url(#atecaGlassGrad)" stroke="#0284c7" strokeWidth="1" />

              {/* Side Door & Handle Lines */}
              <line x1="228" y1="118" x2="228" y2="155" stroke="#047857" strokeWidth="1.5" />
              <line x1="282" y1="118" x2="282" y2="155" stroke="#047857" strokeWidth="1.5" />
              <rect x="238" y="125" width="12" height="3" rx="1.5" fill="#e2e8f0" />
              <rect x="292" y="125" width="12" height="3" rx="1.5" fill="#e2e8f0" />
            </g>
          )}

          {/* STAGE 3: SEAT FULL-LED SIGNATURE, ENGINE, SPOILER & RADIATOR GRILLE (50% - 74%) */}
          {percent >= 50 && (
            <g className="transition-all duration-700">
              {/* Rear Roof Spoiler */}
              <path d="M 144 75 L 175 72 L 175 78 L 148 80 Z" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />

              {/* Seat Triangular Matrix Full-LED Headlight Signature */}
              <polygon points="380,126 405,134 392,142 374,136" fill="#38bdf8" stroke="#bae6fd" strokeWidth="1.5" />
              <polyline points="380,128 402,135 378,138" fill="none" stroke="#f0f9ff" strokeWidth="1.5" />

              {/* Front Seat Trapezoidal Honeycomb Radiator Grille */}
              <polygon points="398,138 406,140 405,152 396,150" fill="#18181b" stroke="#94a3b8" strokeWidth="1.2" />
              {/* Seat 'S' Chrome Emblem */}
              <line x1="400" y1="144" x2="403" y2="144" stroke="#f8fafc" strokeWidth="2" />

              {/* Rear Seat Coast-to-Coast LED Tail Light */}
              <rect x="74" y="132" width="12" height="6" rx="2" fill="#ef4444" stroke="#f87171" strokeWidth="1" />

              {/* Dual Chrome Exhaust Tips */}
              <rect x="68" y="156" width="8" height="5" rx="1.5" fill="#e2e8f0" stroke="#71717a" strokeWidth="1" />
              {percent >= 65 && (
                <circle cx="63" cy="158" r="3" fill="#38bdf8" opacity="0.8" />
              )}
            </g>
          )}

          {/* STAGE 4: NEVADA METALLIC ACCENTS, DRIVING PARTICLES & KEY UNLOCKED (75% - 100%) */}
          {percent >= 75 && (
            <g className="transition-all duration-700">
              {/* Dynamic Chrome Side Window Trim */}
              <path d="M 156 114 Q 240 70 348 114" stroke="#f8fafc" strokeWidth="2" fill="none" opacity="0.9" />

              {/* Side Mirror */}
              <polygon points="296,112 312,108 308,116" fill="#047857" stroke="#e2e8f0" strokeWidth="1" />

              {/* Speed Dash Particles */}
              <line x1="30" y1="105" x2="55" y2="105" stroke="#10b981" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
              <line x1="15" y1="125" x2="45" y2="125" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
              <line x1="25" y1="145" x2="50" y2="145" stroke="#10b981" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
            </g>
          )}

          {/* 100% Complete Golden Key Badge */}
          {percent >= 100 && (
            <g className="animate-bounce">
              <circle cx="230" cy="48" r="22" fill="#f59e0b" stroke="#fef08a" strokeWidth="3" />
              <text x="230" y="56" textAnchor="middle" fontSize="20">🔑</text>
            </g>
          )}
        </svg>

        {/* Live Construction Stage Info */}
        <div className="w-full mt-3 flex items-center justify-between px-2 pt-2 border-t border-stone-800/80 text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{currentStageInfo.icon}</span>
            <div>
              <span className="font-bold text-white block">
                {lang === 'ro' ? `Etapa ${currentStageInfo.stage}/4: ` : `Stage ${currentStageInfo.stage}/4: `}
                <span className="text-emerald-400">{currentStageInfo.label}</span>
              </span>
              <span className="text-[11px] text-stone-400">
                {percent < 100
                  ? (lang === 'ro'
                      ? `Mai sunt ${Math.max(0, Math.round(carTarget.targetAmount * (currentStageInfo.next / 100) - carTarget.currentSavedAmount)).toLocaleString()} ${currencySymbol} (~${Math.round(Math.max(0, carTarget.targetAmount * (currentStageInfo.next / 100) - carTarget.currentSavedAmount) / 5)} €) până la următoarea etapă`
                      : `${Math.max(0, Math.round(carTarget.targetAmount * (currentStageInfo.next / 100) - carTarget.currentSavedAmount)).toLocaleString()} ${currencySymbol} until next milestone`)
                  : (lang === 'ro' ? '🎉 Felicitări Haytham & Cati! Seat Ateca este al vostru!' : '🎉 Congratulations Haytham & Cati! Seat Ateca Unlocked!')}
              </span>
            </div>
          </div>

          <span className="text-base font-black font-mono text-emerald-400">
            {percent}%
          </span>
        </div>
      </div>

      {/* 4-Step Milestone Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 relative z-10">
        {[
          { step: 1, label: lang === 'ro' ? 'Șasiu & Jante 18"' : 'Chassis & Rims', threshold: 25, icon: '🛞' },
          { step: 2, label: lang === 'ro' ? 'Caroserie & Bare' : 'Body & Rails', threshold: 50, icon: '🚙' },
          { step: 3, label: lang === 'ro' ? 'Motor & Full-LED' : 'Engine & LEDs', threshold: 75, icon: '⚡' },
          { step: 4, label: lang === 'ro' ? 'La Drum (15k €)!' : 'Ready (15k €)!', threshold: 100, icon: '🔑' }
        ].map((m) => {
          const isDone = percent >= m.threshold;
          const isCurrent = !isDone && (m.step === 1 ? percent < 25 : percent >= (m.threshold - 25));

          return (
            <div
              key={m.step}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                isDone
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                  : isCurrent
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 ring-1 ring-amber-500/40'
                  : 'bg-stone-900/60 border-stone-800 text-stone-500'
              }`}
            >
              <div className="text-base mb-0.5">{m.icon}</div>
              <div className="text-[11px] font-bold">
                {m.label} ({m.threshold}%)
              </div>
              <div className="text-[10px] mt-0.5">
                {isDone ? '✅ Finalizat' : isCurrent ? '⏳ În Lucru' : '🔒 Blocat'}
              </div>
            </div>
          );
        })}
      </div>
        </>
      )}
    </div>
  );
};
