import React from 'react';
import { Car, Sparkles, Key, CheckCircle, ChevronRight, Gauge, Zap } from 'lucide-react';
import { SavingsTarget } from '../types';

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
  // Find primary car/auto target (or default to top savings target)
  const carTarget = targets.find(
    (t) =>
      t.title.toLowerCase().includes('masin') ||
      t.title.toLowerCase().includes('mașin') ||
      t.title.toLowerCase().includes('car') ||
      t.title.toLowerCase().includes('auto') ||
      t.title.toLowerCase().includes('bmw') ||
      t.title.toLowerCase().includes('audi') ||
      t.title.toLowerCase().includes('porsche') ||
      t.title.toLowerCase().includes('tesla')
  ) || targets[0] || {
    id: 'default-car',
    title: 'Mașina Noastră de Vis (BMW / Sport Edition)',
    targetAmount: 85000,
    currentSavedAmount: 38500,
    priority: 'CRITICAL',
    category: 'VEHICLE',
    deadline: '2027-12-31',
    iconName: 'car'
  };

  const percent = Math.min(100, Math.round((carTarget.currentSavedAmount / (carTarget.targetAmount || 1)) * 100));

  // Determine car assembly stage
  const getStage = (pct: number) => {
    if (pct < 25) return { stage: 1, label: lang === 'ro' ? 'Șasiu Sport, Suspensie & Jante Aliaj' : 'Sport Chassis & Alloy Wheels', icon: '🛞', next: 25 };
    if (pct < 50) return { stage: 2, label: lang === 'ro' ? 'Caroserie Aerodinamică & Geamuri Fumurii' : 'Aerodynamic Body & Tinted Glass', icon: '🏎️', next: 50 };
    if (pct < 75) return { stage: 3, label: lang === 'ro' ? 'Motor Twin-Turbo, Cockpit & Faruri Matrix LED' : 'Twin-Turbo Engine & Matrix LEDs', icon: '⚡', next: 75 };
    return { stage: 4, label: lang === 'ro' ? 'Mașina Visurilor Gata de Drum • Cheia în Mână!' : 'Dream Car Ready • Keys in Hand!', icon: '🔑', next: 100 };
  };

  const currentStageInfo = getStage(percent);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-900 via-stone-850 to-emerald-950/40 border border-emerald-500/30 p-5 sm:p-6 shadow-2xl">
      {/* Decorative glows */}
      <div className="absolute -right-12 -top-12 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 via-emerald-500 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-stone-950 rounded-[14px] flex items-center justify-center text-emerald-400">
              <Car className="w-6 h-6" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-black text-white font-display">
                {lang === 'ro' ? 'Constructorul Mașinii Noastre de Vis' : 'Dream Car Visual Builder'}
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                {percent}% {lang === 'ro' ? 'Construit' : 'Built'}
              </span>
            </div>
            <p className="text-xs text-stone-400">
              {carTarget.title} • {carTarget.currentSavedAmount.toLocaleString()} / {carTarget.targetAmount.toLocaleString()} {currencySymbol}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {percent >= 100 ? (
            <span className="px-3 py-1.5 rounded-xl bg-amber-500 text-stone-950 font-black text-xs flex items-center space-x-1.5 shadow-lg animate-bounce">
              <Key className="w-4 h-4" />
              <span>{lang === 'ro' ? 'CHEIA ÎN MÂNĂ!' : 'KEYS UNLOCKED!'}</span>
            </span>
          ) : (
            <button
              type="button"
              onClick={() => onDepositMore && onDepositMore(carTarget.id)}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'ro' ? 'Adaugă la Seif' : 'Deposit'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Visual Car Illustration (4-Stage Animated SVG) */}
      <div className="my-5 p-4 rounded-2xl bg-stone-950/80 border border-stone-800/80 flex flex-col items-center justify-center relative z-10 overflow-hidden">
        <svg
          viewBox="0 0 460 210"
          className="w-full max-w-lg h-44 transition-all duration-700 select-none"
        >
          <defs>
            {/* Gradients for car body & neon glow */}
            <linearGradient id="carBodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
            <linearGradient id="carGlassGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0369a1" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="headlightBeam" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
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
            <polygon points="390,140 455,120 455,175 390,150" fill="url(#headlightBeam)" />
          )}

          {/* STAGE 1: CHASSIS & WHEELS (0% - 24%) */}
          <g className="transition-all duration-500">
            {/* Chassis Frame Bar */}
            <rect
              x="85"
              y="160"
              width="290"
              height="14"
              rx="4"
              fill={percent >= 5 ? '#292524' : '#1c1917'}
              stroke={percent >= 25 ? '#10b981' : '#57534e'}
              strokeWidth="2"
              strokeDasharray={percent < 25 ? '4 4' : 'none'}
            />

            {/* Rear Wheel (Left) */}
            <circle cx="140" cy="172" r="22" fill="#09090b" stroke="#78716c" strokeWidth="3" />
            <circle cx="140" cy="172" r="14" fill="#27272a" stroke={percent >= 25 ? '#10b981' : '#71717a'} strokeWidth="2" />
            <circle cx="140" cy="172" r="6" fill="#10b981" />
            {/* Wheel Spokes */}
            <line x1="140" y1="158" x2="140" y2="186" stroke="#a1a1aa" strokeWidth="1.5" />
            <line x1="126" y1="172" x2="154" y2="172" stroke="#a1a1aa" strokeWidth="1.5" />

            {/* Front Wheel (Right) */}
            <circle cx="340" cy="172" r="22" fill="#09090b" stroke="#78716c" strokeWidth="3" />
            <circle cx="340" cy="172" r="14" fill="#27272a" stroke={percent >= 25 ? '#10b981' : '#71717a'} strokeWidth="2" />
            <circle cx="340" cy="172" r="6" fill="#10b981" />
            {/* Wheel Spokes */}
            <line x1="340" y1="158" x2="340" y2="186" stroke="#a1a1aa" strokeWidth="1.5" />
            <line x1="326" y1="172" x2="354" y2="172" stroke="#a1a1aa" strokeWidth="1.5" />

            {/* Brake Calipers in Brembo Red */}
            {percent >= 15 && (
              <>
                <rect x="150" y="162" width="6" height="12" rx="2" fill="#ef4444" />
                <rect x="350" y="162" width="6" height="12" rx="2" fill="#ef4444" />
              </>
            )}

            {percent < 25 && (
              <text x="240" y="145" textAnchor="middle" fill="#a8a29e" fontSize="11" fontWeight="bold">
                🛞 {lang === 'ro' ? 'Montare Șasiu & Jante Aliaj...' : 'Assembling Sport Chassis & Rims...'}
              </text>
            )}
          </g>

          {/* STAGE 2: AERODYNAMIC CAR BODY & GLASS (25% - 49%) */}
          {percent >= 25 && (
            <g className="transition-all duration-700">
              {/* Lower Body Shell */}
              <path
                d="M 75 162 L 95 135 L 155 125 L 365 125 L 405 150 L 400 165 L 75 165 Z"
                fill={percent >= 50 ? 'url(#carBodyGrad)' : '#064e3b'}
                stroke="#10b981"
                strokeWidth="2.5"
              />

              {/* Cabin Roof & Windshield (Sport Coupe Curve) */}
              <path
                d="M 160 125 L 195 80 L 295 80 L 345 125 Z"
                fill="#0f172a"
                stroke="#10b981"
                strokeWidth="2"
              />

              {/* Tinted Windows */}
              {/* Rear Window */}
              <polygon points="170,120 198,87 235,87 235,120" fill="url(#carGlassGrad)" stroke="#0284c7" strokeWidth="1" />
              {/* Front Windshield Window */}
              <polygon points="245,120 245,87 290,87 335,120" fill="url(#carGlassGrad)" stroke="#0284c7" strokeWidth="1" />

              {/* Side Door & Handle Lines */}
              <line x1="240" y1="125" x2="240" y2="160" stroke="#047857" strokeWidth="2" />
              <rect x="250" y="132" width="12" height="3" rx="1.5" fill="#e2e8f0" />
            </g>
          )}

          {/* STAGE 3: TWIN TURBO ENGINE, SPOILER & MATRIX LEDS (50% - 74%) */}
          {percent >= 50 && (
            <g className="transition-all duration-700">
              {/* Rear Aerodynamic Spoiler */}
              <path d="M 65 130 L 95 130 L 85 136 L 70 136 Z" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
              <line x1="72" y1="136" x2="72" y2="148" stroke="#10b981" strokeWidth="2.5" />
              <line x1="88" y1="136" x2="88" y2="148" stroke="#10b981" strokeWidth="2.5" />

              {/* Front Matrix LED Headlight */}
              <polygon points="380,138 402,142 390,148 375,145" fill="#38bdf8" stroke="#bae6fd" strokeWidth="1.5" />

              {/* Rear Sport Tail Light (Neon Red Strip) */}
              <rect x="75" y="140" width="10" height="6" rx="2" fill="#ef4444" stroke="#f87171" strokeWidth="1" />

              {/* Front Sport Grille / Intercooler */}
              <rect x="395" y="152" width="8" height="10" rx="2" fill="#18181b" stroke="#71717a" strokeWidth="1" />

              {/* Dual Exhaust Pipes with Blue Flame effect */}
              <rect x="68" y="162" width="8" height="4" rx="1" fill="#71717a" />
              {percent >= 65 && (
                <circle cx="64" cy="164" r="3" fill="#38bdf8" opacity="0.8" />
              )}
            </g>
          )}

          {/* STAGE 4: GLOWING BADGES, LIGHTS & KEY UNLOCKED (75% - 100%) */}
          {percent >= 75 && (
            <g className="transition-all duration-700">
              {/* Sport Racing Stripe */}
              <path d="M 195 80 L 295 80 L 365 125 L 400 155" stroke="#f59e0b" strokeWidth="3" fill="none" opacity="0.8" />

              {/* Side Mirror */}
              <polygon points="288,118 302,114 300,122" fill="#047857" stroke="#10b981" strokeWidth="1" />

              {/* Speed Dash Particles */}
              <line x1="30" y1="110" x2="55" y2="110" stroke="#10b981" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
              <line x1="15" y1="130" x2="45" y2="130" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
              <line x1="25" y1="150" x2="50" y2="150" stroke="#10b981" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
            </g>
          )}

          {/* 100% Complete Golden Key Badge */}
          {percent >= 100 && (
            <g className="animate-bounce">
              <circle cx="230" cy="50" r="22" fill="#f59e0b" stroke="#fef08a" strokeWidth="3" />
              <text x="230" y="58" textAnchor="middle" fontSize="20">🔑</text>
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
                      ? `Mai sunt ${Math.max(0, Math.round(carTarget.targetAmount * (currentStageInfo.next / 100) - carTarget.currentSavedAmount)).toLocaleString()} ${currencySymbol} până la următoarea etapă`
                      : `${Math.max(0, Math.round(carTarget.targetAmount * (currentStageInfo.next / 100) - carTarget.currentSavedAmount)).toLocaleString()} ${currencySymbol} until next milestone`)
                  : (lang === 'ro' ? '🎉 Felicitări Haytham & Cati! Mașina este complet deblocată!' : '🎉 Congratulations Haytham & Cati! Dream Car Unlocked!')}
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
          { step: 1, label: lang === 'ro' ? 'Șasiu & Jante' : 'Chassis & Rims', threshold: 25, icon: '🛞' },
          { step: 2, label: lang === 'ro' ? 'Caroserie' : 'Bodywork', threshold: 50, icon: '🏎️' },
          { step: 3, label: lang === 'ro' ? 'Motor & LED' : 'Engine & LEDs', threshold: 75, icon: '⚡' },
          { step: 4, label: lang === 'ro' ? 'La Drum!' : 'Ready to Drive', threshold: 100, icon: '🔑' }
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
    </div>
  );
};
