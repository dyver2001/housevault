import React, { useState } from 'react';
import {
  TrendingDown,
  Sparkles,
  Zap,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  X,
  Calculator,
  Sliders,
  DollarSign
} from 'lucide-react';
import { BankDebt, HouseholdProfile } from '../types';
import { soundFx } from '../utils/audioEffects';
import { triggerConfetti } from '../utils/confetti';

interface DebtPayoffSimulatorModalProps {
  debts: BankDebt[];
  profile: HouseholdProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const DebtPayoffSimulatorModal: React.FC<DebtPayoffSimulatorModalProps> = ({
  debts,
  profile,
  isOpen,
  onClose
}) => {
  const [strategy, setStrategy] = useState<'snowball' | 'avalanche'>('avalanche');
  const [extraMonthlyPayment, setExtraMonthlyPayment] = useState<number>(500);

  if (!isOpen) return null;

  const totalCurrentDebt = debts.reduce((sum, d) => sum + (d.currentBalance || 0), 0);
  const totalMinPayment = debts.reduce((sum, d) => sum + (d.minMonthlyPayment || 0), 0);

  // Calculate Payoff details for baseline vs accelerated
  const calculatePayoff = (strat: 'snowball' | 'avalanche', extra: number) => {
    let debtList = debts.map((d) => ({
      ...d,
      bal: d.currentBalance || 0,
      min: d.minMonthlyPayment || 0,
      apr: (d.interestRateApr || 10) / 100 / 12
    }));

    // Sort order
    if (strat === 'snowball') {
      debtList.sort((a, b) => a.bal - b.bal); // smallest balance first
    } else {
      debtList.sort((a, b) => b.apr - a.apr); // highest interest rate first
    }

    let months = 0;
    let totalInterestPaid = 0;
    const maxMonths = 360; // 30 year safety cap

    while (debtList.some((d) => d.bal > 0) && months < maxMonths) {
      months++;
      let extraPool = extra;

      // 1. Accrue monthly interest on each active debt
      debtList.forEach((d) => {
        if (d.bal > 0) {
          const interest = d.bal * d.apr;
          totalInterestPaid += interest;
          d.bal += interest;
        }
      });

      // 2. Pay minimums
      debtList.forEach((d) => {
        if (d.bal > 0) {
          const payment = Math.min(d.bal, d.min);
          d.bal -= payment;
        }
      });

      // 3. Roll freed minimums + extra payment into the targeted debt
      for (const d of debtList) {
        if (d.bal > 0 && extraPool > 0) {
          const payment = Math.min(d.bal, extraPool);
          d.bal -= payment;
          extraPool -= payment;
        }
      }
    }

    return { months, totalInterestPaid };
  };

  const baseline = calculatePayoff('snowball', 0);
  const accelerated = calculatePayoff(strategy, extraMonthlyPayment);

  const monthsSaved = Math.max(0, baseline.months - accelerated.months);
  const interestSaved = Math.max(0, baseline.totalInterestPaid - accelerated.totalInterestPaid);

  const currentDate = new Date();
  const freedomDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + accelerated.months, 1);
  const freedomDateFormatted = freedomDate.toLocaleDateString(profile.language === 'ro' ? 'ro-RO' : 'en-US', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-stone-900 border border-stone-800 rounded-3xl p-5 sm:p-7 shadow-2xl overflow-y-auto max-h-[90vh] space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-emerald-500 p-0.5 shadow-lg shadow-purple-500/20">
              <div className="w-full h-full bg-stone-950 rounded-[14px] flex items-center justify-center text-purple-400">
                <Calculator className="w-6 h-6" />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-black text-white font-display">
                {profile.language === 'ro' ? 'Acceleratorul Libertății Financiare' : 'Debt Payoff Accelerator'}
              </h2>
              <p className="text-xs text-stone-400">
                {profile.language === 'ro' ? 'Simulează eliminarea accelerată a creditelor bancare' : 'Simulate faster bank debt elimination'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Strategy Selector */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              setStrategy('avalanche');
              soundFx.playCashChime();
            }}
            className={`p-4 rounded-2xl border text-left transition relative cursor-pointer ${
              strategy === 'avalanche'
                ? 'bg-purple-600/20 border-purple-500/60 ring-1 ring-purple-500'
                : 'bg-stone-950/60 border-stone-800 hover:border-stone-700 text-stone-400'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-black text-sm text-purple-300">⚡ Avalanșă (Matematică)</span>
              {strategy === 'avalanche' && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
            </div>
            <p className="text-[11px] text-stone-400">
              Atacă creditul cu cea mai mare dobândă (APR) pentru a economisi maximum de bani.
            </p>
          </button>

          <button
            type="button"
            onClick={() => {
              setStrategy('snowball');
              soundFx.playCashChime();
            }}
            className={`p-4 rounded-2xl border text-left transition relative cursor-pointer ${
              strategy === 'snowball'
                ? 'bg-emerald-600/20 border-emerald-500/60 ring-1 ring-emerald-500'
                : 'bg-stone-950/60 border-stone-800 hover:border-stone-700 text-stone-400'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-black text-sm text-emerald-300">❄️ Bulgăre (Psihologic)</span>
              {strategy === 'snowball' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            </div>
            <p className="text-[11px] text-stone-400">
              Lichidează mai întâi cel mai mic sold pentru victorii rapide și motivație maximă.
            </p>
          </button>
        </div>

        {/* Extra Payment Slider */}
        <div className="p-5 rounded-2xl bg-stone-950/70 border border-stone-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-stone-300">
                Plată Suplimentară din Filmări Freelance / Lună:
              </span>
            </div>
            <span className="text-base font-black font-mono text-emerald-400 bg-emerald-500/15 px-3 py-1 rounded-xl border border-emerald-500/30">
              +{extraMonthlyPayment.toLocaleString()} {profile.currencySymbol}
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="3000"
            step="50"
            value={extraMonthlyPayment}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              setExtraMonthlyPayment(val);
              if (val % 250 === 0) soundFx.playCashChime();
            }}
            className="w-full h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />

          <div className="flex justify-between text-[11px] text-stone-500 font-mono">
            <span>+0 {profile.currencySymbol}</span>
            <span>+1.000 {profile.currencySymbol}</span>
            <span>+2.000 {profile.currencySymbol}</span>
            <span>+3.000 {profile.currencySymbol}</span>
          </div>
        </div>

        {/* Big Impact Results Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/50 to-stone-950 border border-emerald-500/40 text-center">
            <span className="text-[11px] text-emerald-300 font-bold block uppercase tracking-wider">
              Data Libertății Complete
            </span>
            <span className="text-lg font-black text-white font-display mt-1 block">
              🎉 {freedomDateFormatted}
            </span>
            <span className="text-[10px] text-emerald-400/80 mt-0.5 block">
              {accelerated.months} luni rămase
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/50 to-stone-950 border border-purple-500/40 text-center">
            <span className="text-[11px] text-purple-300 font-bold block uppercase tracking-wider">
              Timp Câștigat
            </span>
            <span className="text-lg font-black text-purple-200 font-display mt-1 block">
              ⚡ {monthsSaved} Luni Salvate
            </span>
            <span className="text-[10px] text-purple-400/80 mt-0.5 block">
              ({(monthsSaved / 12).toFixed(1)} ani mai devreme)
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/50 to-stone-950 border border-amber-500/40 text-center">
            <span className="text-[11px] text-amber-300 font-bold block uppercase tracking-wider">
              Dobândă Economisită
            </span>
            <span className="text-lg font-black text-amber-300 font-display mt-1 block">
              💰 {Math.round(interestSaved).toLocaleString()} {profile.currencySymbol}
            </span>
            <span className="text-[10px] text-amber-400/80 mt-0.5 block">
              Rămân în seiful familiei!
            </span>
          </div>
        </div>

        {/* Action button */}
        <button
          type="button"
          onClick={() => {
            soundFx.playVictoryFanfare();
            triggerConfetti(50, 40);
            onClose();
          }}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-stone-950 font-black text-sm shadow-xl shadow-emerald-500/20 transition active:scale-95 cursor-pointer flex items-center justify-center space-x-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Aplică Strategia & Continuă spre Libertate Financiară!</span>
        </button>
      </div>
    </div>
  );
};
