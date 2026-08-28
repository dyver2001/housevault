import React, { useEffect, useState } from 'react';
import { Camera } from 'lucide-react';
import { soundFx } from '../../utils/audioEffects';

interface CameraShutterFlashProps {
  projectTitle?: string;
  amount?: number;
  currencySymbol?: string;
  onComplete?: () => void;
}

export const CameraShutterFlash: React.FC<CameraShutterFlashProps> = ({
  projectTitle,
  amount,
  currencySymbol = 'lei',
  onComplete
}) => {
  const [stage, setStage] = useState<'SNAP' | 'FLASH' | 'FILM' | 'DONE'>('SNAP');

  useEffect(() => {
    soundFx.playCashChime();
    const t1 = setTimeout(() => setStage('FLASH'), 300);
    const t2 = setTimeout(() => setStage('FILM'), 600);
    const t3 = setTimeout(() => {
      setStage('DONE');
      if (onComplete) onComplete();
    }, 1800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  if (stage === 'DONE') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
      {/* Camera Iris Flash Burst */}
      {stage === 'FLASH' && (
        <div className="absolute inset-0 bg-white z-50 animate-ping opacity-75 pointer-events-none" />
      )}

      <div className="relative w-full max-w-sm p-6 bg-stone-950 border border-cyan-500/50 rounded-3xl shadow-2xl text-center space-y-4 overflow-hidden">
        {/* Cinema Film Strip Top & Bottom */}
        <div className="h-4 bg-stone-900 border-y border-stone-700 flex justify-between px-2 items-center">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="w-2.5 h-2.5 bg-stone-950 rounded-xs border border-stone-800" />
          ))}
        </div>

        {/* Camera Aperture Icon */}
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-cyan-500 to-emerald-500 p-0.5 shadow-xl shadow-cyan-500/30">
          <div className="w-full h-full bg-stone-950 rounded-[14px] flex items-center justify-center text-cyan-400">
            <Camera className="w-8 h-8 animate-pulse" />
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-[11px] font-black uppercase tracking-wider text-cyan-400">
            🎬 ÎNCASARE FREELANCE VIDEO
          </span>
          <h3 className="text-xl font-black text-white font-display">
            +{(amount || 0).toLocaleString()} {currencySymbol}
          </h3>
          <p className="text-xs text-stone-400 font-medium truncate">{projectTitle || 'Proiect Video'}</p>
        </div>

        <p className="text-[11px] font-bold text-emerald-400 animate-pulse">
          ✓ Proiect colectat & arhivat pe peliculă!
        </p>

        <div className="h-4 bg-stone-900 border-y border-stone-700 flex justify-between px-2 items-center">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="w-2.5 h-2.5 bg-stone-950 rounded-xs border border-stone-800" />
          ))}
        </div>
      </div>
    </div>
  );
};
