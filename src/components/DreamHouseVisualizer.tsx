import React, { useState } from 'react';
import { Home, Sparkles, Key, CheckCircle, ChevronRight, Award, Flame } from 'lucide-react';
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
  // Find the primary house target (or default to the largest target)
  const houseTarget = targets.find(
    (t) => t.title.toLowerCase().includes('cas') || t.title.toLowerCase().includes('house') || t.title.toLowerCase().includes('avans')
  ) || targets[0] || {
    id: 'default-house',
    title: 'Avans Casă de Vis (3 Camere)',
    targetAmount: 150000,
    currentSavedAmount: 38500,
    priority: 'CRITICAL',
    category: 'HOUSING',
    deadline: '2027-12-31',
    iconName: 'home'
  };

  const percent = Math.min(100, Math.round((houseTarget.currentSavedAmount / (houseTarget.targetAmount || 1)) * 100));

  // Determine construction stage
  const getStage = (pct: number) => {
    if (pct < 25) return { stage: 1, label: lang === 'ro' ? 'Fundație & Terasament' : 'Foundation & Groundwork', icon: '🏗️', next: 25 };
    if (pct < 50) return { stage: 2, label: lang === 'ro' ? 'Zidărie Cărămidă & Geamuri' : 'Brick Walls & Windows', icon: '🧱', next: 50 };
    if (pct < 75) return { stage: 3, label: lang === 'ro' ? 'Acoperiș & Panouri Solare' : 'Roof & Solar Panels', icon: '🏠', next: 75 };
    return { stage: 4, label: lang === 'ro' ? 'Casa Finalizată • Cheia în Mână!' : 'Completed • Keys in Hand!', icon: '🔑', next: 100 };
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
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-emerald-500 p-0.5 shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-stone-950 rounded-[14px] flex items-center justify-center text-amber-400">
              <Home className="w-6 h-6" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-black text-white font-display">
                {lang === 'ro' ? 'Constructorul Casei Noastre de Vis' : 'Dream House Visual Builder'}
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                {percent}% {lang === 'ro' ? 'Gata' : 'Built'}
              </span>
            </div>
            <p className="text-xs text-stone-400">
              {houseTarget.title} • {houseTarget.currentSavedAmount.toLocaleString()} / {houseTarget.targetAmount.toLocaleString()} {currencySymbol}
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
              onClick={() => onDepositMore && onDepositMore(houseTarget.id)}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'ro' ? 'Adaugă la Seif' : 'Deposit'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Visual House Illustration (4-Stage Architectural SVG) */}
      <div className="my-5 p-4 rounded-2xl bg-stone-950/70 border border-stone-800/80 flex flex-col items-center justify-center relative z-10">
        <svg
          viewBox="0 0 400 220"
          className="w-full max-w-md h-44 transition-all duration-700 select-none"
        >
          {/* Ground Base */}
          <rect x="20" y="195" width="360" height="15" rx="7" fill="#292524" />
          <path d="M 20 195 Q 200 190 380 195" stroke="#10b981" strokeWidth="3" fill="none" opacity="0.6" />

          {/* STAGE 1: FOUNDATION (Visible always, glowing if >= 25%) */}
          <g className="transition-all duration-500">
            <rect
              x="80"
              y="170"
              width="240"
              height="25"
              rx="4"
              fill={percent >= 5 ? '#44403c' : '#292524'}
              stroke={percent >= 25 ? '#10b981' : '#57534e'}
              strokeWidth="2"
              strokeDasharray={percent < 25 ? '4 4' : 'none'}
            />
            {/* Foundation pillars */}
            <rect x="95" y="180" width="10" height="15" fill={percent >= 10 ? '#78716c' : '#292524'} />
            <rect x="195" y="180" width="10" height="15" fill={percent >= 15 ? '#78716c' : '#292524'} />
            <rect x="295" y="180" width="10" height="15" fill={percent >= 20 ? '#78716c' : '#292524'} />
            {percent < 25 && (
              <text x="200" y="160" textAnchor="middle" fill="#a8a29e" fontSize="11" fontWeight="bold">
                🏗️ {lang === 'ro' ? 'Fundație în construcție...' : 'Building Foundation...'}
              </text>
            )}
          </g>

          {/* STAGE 2: BRICK WALLS & WINDOWS (Visible if >= 25%) */}
          {percent >= 25 && (
            <g className="transition-all duration-700 animate-fadeIn">
              {/* Main Body Walls */}
              <rect
                x="90"
                y="95"
                width="220"
                height="75"
                rx="4"
                fill={percent >= 50 ? '#7c2d12' : '#451a03'}
                stroke={percent >= 50 ? '#f97316' : '#7c2d12'}
                strokeWidth="2"
              />
              {/* Brick Lines Texture */}
              <line x1="90" y1="120" x2="310" y2="120" stroke="#9a3412" strokeWidth="1" strokeDasharray="6 4" opacity="0.6" />
              <line x1="90" y1="145" x2="310" y2="145" stroke="#9a3412" strokeWidth="1" strokeDasharray="6 4" opacity="0.6" />

              {/* Windows (Left & Right) */}
              <rect x="115" y="110" width="35" height="35" rx="4" fill="#06b6d4" fillOpacity={percent >= 40 ? '0.85' : '0.4'} stroke="#22d3ee" strokeWidth="2" />
              <line x1="132" y1="110" x2="132" y2="145" stroke="#083344" strokeWidth="1.5" />
              <line x1="115" y1="127" x2="150" y2="127" stroke="#083344" strokeWidth="1.5" />

              <rect x="250" y="110" width="35" height="35" rx="4" fill="#06b6d4" fillOpacity={percent >= 40 ? '0.85' : '0.4'} stroke="#22d3ee" strokeWidth="2" />
              <line x1="267" y1="110" x2="267" y2="145" stroke="#083344" strokeWidth="1.5" />
              <line x1="250" y1="127" x2="285" y2="127" stroke="#083344" strokeWidth="1.5" />

              {/* Front Door */}
              <rect x="180" y="120" width="40" height="50" rx="3" fill="#b45309" stroke="#f59e0b" strokeWidth="2" />
              <circle cx="212" cy="146" r="2.5" fill="#fef08a" />
            </g>
          )}

          {/* STAGE 3: ROOF & CHIMNEY (Visible if >= 50%) */}
          {percent >= 50 && (
            <g className="transition-all duration-700 animate-fadeIn">
              {/* Chimney */}
              <rect x="260" y="30" width="22" height="45" fill="#991b1b" stroke="#dc2626" strokeWidth="1.5" />
              {/* Roof Triangle */}
              <polygon points="70,95 200,25 330,95" fill={percent >= 75 ? '#065f46' : '#14532d'} stroke="#10b981" strokeWidth="2.5" />

              {/* Solar Panels on Roof */}
              {percent >= 65 && (
                <g opacity="0.9">
                  <polygon points="120,85 180,50 195,50 145,85" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
                  <polygon points="205,50 220,50 280,85 255,85" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
                </g>
              )}
            </g>
          )}

          {/* STAGE 4: LANDSCAPING, LIGHTS & KEY (Visible if >= 75%) */}
          {percent >= 75 && (
            <g className="transition-all duration-700 animate-fadeIn">
              {/* Garden bushes */}
              <circle cx="65" cy="185" r="16" fill="#059669" />
              <circle cx="80" cy="180" r="12" fill="#10b981" />
              <circle cx="320" cy="180" r="12" fill="#10b981" />
              <circle cx="335" cy="185" r="16" fill="#059669" />

              {/* Flowers */}
              <circle cx="60" cy="180" r="3" fill="#f43f5e" />
              <circle cx="75" cy="176" r="3" fill="#fbbf24" />
              <circle cx="325" cy="176" r="3" fill="#fbbf24" />
              <circle cx="340" cy="180" r="3" fill="#f43f5e" />

              {/* Porch Warm Light */}
              <polygon points="180,120 200,105 220,120" fill="#fef08a" opacity="0.4" />
            </g>
          )}

          {/* 100% Complete Golden Key Badge */}
          {percent >= 100 && (
            <g className="animate-bounce">
              <circle cx="200" cy="65" r="22" fill="#f59e0b" stroke="#fef08a" strokeWidth="3" />
              <text x="200" y="73" textAnchor="middle" fontSize="20">🔑</text>
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
                      ? `Mai sunt ${Math.max(0, Math.round(houseTarget.targetAmount * (currentStageInfo.next / 100) - houseTarget.currentSavedAmount)).toLocaleString()} ${currencySymbol} până la următoarea etapă`
                      : `${Math.max(0, Math.round(houseTarget.targetAmount * (currentStageInfo.next / 100) - houseTarget.currentSavedAmount)).toLocaleString()} ${currencySymbol} until next milestone`)
                  : (lang === 'ro' ? '🎉 Felicitări Haytham & Cati! Obiectiv atins!' : '🎉 Congratulations Haytham & Cati! Goal Achieved!')}
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
          { step: 1, label: lang === 'ro' ? 'Fundație' : 'Foundation', threshold: 25, icon: '🏗️' },
          { step: 2, label: lang === 'ro' ? 'Ziduri' : 'Walls', threshold: 50, icon: '🧱' },
          { step: 3, label: lang === 'ro' ? 'Acoperiș' : 'Roof', threshold: 75, icon: '🏠' },
          { step: 4, label: lang === 'ro' ? 'Cheia' : 'Key', threshold: 100, icon: '🔑' }
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
