import React, { useState, useEffect } from 'react';
import { ShieldCheck, Sparkles, Key, Lock, Unlock, X } from 'lucide-react';
import { soundFx } from '../../utils/audioEffects';
import { triggerCoinRain } from '../../utils/confetti';

interface VaultDoorIntroModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
}

export const VaultDoorIntroModal: React.FC<VaultDoorIntroModalProps> = ({
  isOpen,
  onClose,
  title = 'HouseVault • Seiful Familiei',
  subtitle = 'Haytham & Cati'
}) => {
  const [wheelRotation, setWheelRotation] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    if (isOpen) {
      soundFx.playCashChime();
      const interval = setInterval(() => {
        setWheelRotation((prev) => prev + 15);
      }, 50);

      const t1 = setTimeout(() => {
        clearInterval(interval);
        setIsUnlocked(true);
        soundFx.playVictoryFanfare();
        triggerCoinRain();
      }, 1200);

      return () => {
        clearInterval(interval);
        clearTimeout(t1);
      };
    } else {
      setIsUnlocked(false);
      setWheelRotation(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg animate-fadeIn">
      <div className="relative w-full max-w-lg p-6 sm:p-8 bg-stone-950 border border-amber-500/40 rounded-3xl shadow-2xl text-center space-y-6 overflow-hidden">
        {/* Golden Aura Glow behind vault */}
        <div className="absolute -inset-10 bg-gradient-to-tr from-amber-500/20 via-emerald-500/20 to-transparent blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ACCES SECURIZAT</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-display tracking-tight">
            {title}
          </h2>
          <p className="text-xs text-stone-400 font-medium">{subtitle}</p>
        </div>

        {/* 3D Circular Steel Vault Door SVG with Rotating Wheel */}
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 mx-auto flex items-center justify-center">
          <svg viewBox="0 0 200 200" className="w-full h-full filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)]">
            <defs>
              <linearGradient id="vaultOuterSteel" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3f3f46" />
                <stop offset="50%" stopColor="#18181b" />
                <stop offset="100%" stopColor="#09090b" />
              </linearGradient>

              <linearGradient id="vaultGoldRing" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="50%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>
            </defs>

            {/* Outer Heavy Steel Door Rim */}
            <circle cx="100" cy="100" r="92" fill="url(#vaultOuterSteel)" stroke="#52525b" strokeWidth="4" />
            <circle cx="100" cy="100" r="82" fill="#18181b" stroke="url(#vaultGoldRing)" strokeWidth="3" />

            {/* 8 Steel Locking Bolts (Retracting on Unlock) */}
            {[...Array(8)].map((_, i) => {
              const angle = (i * 45 * Math.PI) / 180;
              const boltDistance = isUnlocked ? 72 : 86;
              const bx = 100 + Math.cos(angle) * boltDistance;
              const by = 100 + Math.sin(angle) * boltDistance;
              return (
                <circle
                  key={i}
                  cx={bx}
                  cy={by}
                  r="6"
                  fill="#e4e4e7"
                  stroke="#71717a"
                  strokeWidth="1.5"
                  className="transition-all duration-700"
                />
              );
            })}

            {/* Inner Golden Mechanical Wheel */}
            <g
              transform={`translate(100, 100) rotate(${wheelRotation}) translate(-100, -100)`}
              className="transition-transform duration-100"
            >
              {/* Wheel Spokes */}
              <line x1="100" y1="55" x2="100" y2="145" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" />
              <line x1="55" y1="100" x2="145" y2="100" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" />
              <line x1="68" y1="68" x2="132" y2="132" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" />
              <line x1="132" y1="68" x2="68" y2="132" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" />

              {/* Central Wheel Hub */}
              <circle cx="100" cy="100" r="28" fill="#18181b" stroke="#f59e0b" strokeWidth="3" />
              <circle cx="100" cy="100" r="14" fill="#f59e0b" />
            </g>
          </svg>

          {/* Center Lock / Unlock Icon */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {isUnlocked ? (
              <Unlock className="w-8 h-8 text-emerald-400 animate-bounce drop-shadow-[0_0_10px_#34d399]" />
            ) : (
              <Lock className="w-7 h-7 text-amber-400 animate-pulse" />
            )}
          </div>
        </div>

        {/* Status Text & Enter Button */}
        <div className="space-y-3 relative z-10">
          <p className="text-xs font-bold text-emerald-400 animate-pulse">
            {isUnlocked ? '✓ SEIF DEBLOCAT CU SUCCES!' : '⚙️ Mecanismele seifului se rotesc...'}
          </p>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-emerald-500 to-teal-500 hover:from-amber-400 hover:to-teal-400 text-stone-950 font-black text-sm shadow-xl shadow-emerald-500/20 transition active:scale-95 cursor-pointer flex items-center justify-center space-x-2"
          >
            <Key className="w-4 h-4" />
            <span>Intră în Panoul Financiar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
