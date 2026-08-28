import React, { useEffect, useState } from 'react';
import { Flame, Sparkles, Trash2, CheckCircle2 } from 'lucide-react';
import { soundFx } from '../../utils/audioEffects';

interface DebtBurnEffectProps {
  debtTitle: string;
  amount: number;
  currencySymbol?: string;
  onComplete?: () => void;
}

export const DebtBurnEffect: React.FC<DebtBurnEffectProps> = ({
  debtTitle,
  amount,
  currencySymbol = 'lei',
  onComplete
}) => {
  const [stage, setStage] = useState<'BURNING' | 'SHREDDED' | 'DONE'>('BURNING');

  useEffect(() => {
    soundFx.playCashChime();
    const t1 = setTimeout(() => setStage('SHREDDED'), 1200);
    const t2 = setTimeout(() => {
      setStage('DONE');
      if (onComplete) onComplete();
    }, 2400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onComplete]);

  if (stage === 'DONE') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md p-6 bg-stone-950 border border-rose-500/60 rounded-3xl shadow-2xl text-center overflow-hidden">
        {/* Fire Sparks Aura */}
        <div className="absolute -inset-4 bg-gradient-to-t from-rose-600/30 via-amber-500/20 to-transparent blur-xl animate-pulse pointer-events-none" />

        {/* Floating Ember Particles */}
        <div className="absolute inset-0 pointer-events-none flex justify-around">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce"
              style={{
                animationDuration: `${0.8 + (i * 0.2)}s`,
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>

        <div className="relative z-10 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-br from-rose-500 to-amber-500 p-0.5 shadow-xl shadow-rose-500/40">
            <div className="w-full h-full bg-stone-950 rounded-[22px] flex items-center justify-center text-rose-400">
              <Flame className="w-8 h-8 animate-pulse text-amber-400" />
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-black uppercase tracking-wider text-rose-400">
              🔥 DISTRUGERE DATORIE BANCARĂ!
            </span>
            <h3 className="text-xl font-black text-white font-display">
              -{amount.toLocaleString()} {currencySymbol}
            </h3>
            <p className="text-xs text-stone-400">{debtTitle}</p>
          </div>

          {/* Paper Shredder Visual Strips */}
          <div className="h-16 flex justify-center space-x-1.5 overflow-hidden py-2">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="w-4 bg-gradient-to-b from-stone-800 to-rose-950/80 border-t border-amber-400 transform translate-y-2 opacity-80"
                style={{
                  transition: 'all 0.8s ease-in-out',
                  transform: stage === 'SHREDDED' ? `translateY(${50 + (i % 3) * 15}px) rotate(${(i - 6) * 8}deg)` : 'translateY(0)',
                  opacity: stage === 'SHREDDED' ? 0 : 1
                }}
              />
            ))}
          </div>

          <p className="text-[11px] font-bold text-emerald-400 animate-pulse">
            ✓ Sold redus cu succes din seiful familiei!
          </p>
        </div>
      </div>
    </div>
  );
};
