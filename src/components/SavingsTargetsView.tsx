import React, { useState } from 'react';
import {
  Vault,
  Plus,
  Home,
  Shield,
  Camera,
  Plane,
  Trash2,
  Edit2,
  Calendar,
  ArrowUpCircle
} from 'lucide-react';
import { SavingsTarget, HouseholdProfile, TargetPriority } from '../types';

import { LiquidJarVisualizer } from './animations/LiquidJarVisualizer';
import { soundFx } from '../utils/audioEffects';

interface SavingsTargetsViewProps {
  profile: HouseholdProfile;
  targets: SavingsTarget[];
  onOpenNewTarget: () => void;
  onEditTarget: (target: SavingsTarget) => void;
  onDeleteTarget: (targetId: string) => void;
  onDepositToTarget: (targetId: string, amount: number) => void;
}

export const SavingsTargetsView: React.FC<SavingsTargetsViewProps> = ({
  profile,
  targets,
  onOpenNewTarget,
  onEditTarget,
  onDeleteTarget,
  onDepositToTarget
}) => {
  const sym = profile.currencySymbol;
  const [depositModalTarget, setDepositModalTarget] = useState<SavingsTarget | null>(null);
  const [depositInput, setDepositInput] = useState<string>('500');
  const [jarViewMode, setJarViewMode] = useState<'CARDS' | 'JARS'>('JARS');

  const totalSaved = targets.reduce((acc, t) => acc + t.currentSavedAmount, 0);
  const totalGoals = targets.reduce((acc, t) => acc + t.targetAmount, 0);
  const overallProgress = totalGoals > 0 ? Math.round((totalSaved / totalGoals) * 100) : 0;

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositModalTarget) return;
    const amt = parseFloat(depositInput);
    if (!isNaN(amt) && amt > 0) {
      soundFx.playCashChime();
      onDepositToTarget(depositModalTarget.id, amt);
      setDepositModalTarget(null);
      setDepositInput('500');
    }
  };

  const getTargetIcon = (iconName: string) => {
    switch (iconName) {
      case 'home':
        return <Home className="w-5 h-5 text-amber-400" />;
      case 'shield':
        return <Shield className="w-5 h-5 text-emerald-400" />;
      case 'camera':
        return <Camera className="w-5 h-5 text-cyan-400" />;
      case 'airplane':
        return <Plane className="w-5 h-5 text-blue-400" />;
      default:
        return <Vault className="w-5 h-5 text-purple-400" />;
    }
  };

  const getPriorityBadge = (priority: TargetPriority) => {
    switch (priority) {
      case 'CRITICAL':
        return (
          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            Top Priority
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Medium Goal
          </span>
        );
      case 'FLEXIBLE':
        return (
          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
            Flexible Wish
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight flex items-center space-x-2">
            <Vault className="w-7 h-7 text-cyan-400" />
            <span>Family Savings Vaults</span>
          </h1>
          <p className="text-stone-400 text-sm mt-1">
            Lock in 35% of freelance windfalls directly into your house downpayment and family safety reserves.
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          {/* Mode Switcher */}
          <div className="flex bg-stone-900 p-1 rounded-xl border border-stone-700">
            <button
              type="button"
              onClick={() => {
                soundFx.playCashChime();
                setJarViewMode('JARS');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                jarViewMode === 'JARS' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-stone-400'
              }`}
            >
              🌊 Borcane Neon
            </button>
            <button
              type="button"
              onClick={() => {
                soundFx.playCashChime();
                setJarViewMode('CARDS');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                jarViewMode === 'CARDS' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-stone-400'
              }`}
            >
              📋 Carduri
            </button>
          </div>

          <button
            id="btn-add-new-target"
            onClick={onOpenNewTarget}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-stone-950 font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Savings Vault</span>
          </button>
        </div>
      </div>

      {/* Progress Banner */}
      <div className="bg-stone-850 border border-stone-700/70 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Total Saved Across Vaults</span>
            <div className="text-3xl sm:text-4xl font-black font-display text-cyan-400">
              {sym}{totalSaved.toLocaleString()}
            </div>
            <p className="text-xs text-stone-400">
              Target cumulative goals: {sym}{totalGoals.toLocaleString()} • Remaining to fund: <strong className="text-white">{sym}{(totalGoals - totalSaved).toLocaleString()}</strong>
            </p>
          </div>

          <div className="bg-stone-800 p-4 rounded-xl border border-stone-700/60 text-right">
            <div className="text-2xl font-black font-display text-emerald-400">{overallProgress}%</div>
            <div className="text-xs text-stone-400 font-semibold">Total Goals Funded</div>
          </div>
        </div>

        <div className="space-y-1.5 pt-2">
          <div className="w-full bg-stone-700 h-3 rounded-full overflow-hidden">
            <div className="bg-cyan-400 h-full rounded-full transition-all duration-500" style={{ width: `${overallProgress}%` }} />
          </div>
        </div>
      </div>

      {/* Conditionally Render Liquid Jars vs Standard Cards */}
      {jarViewMode === 'JARS' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {targets.map((target) => (
            <LiquidJarVisualizer
              key={target.id}
              target={target}
              currencySymbol={sym}
              onDeposit={() => setDepositModalTarget(target)}
            />
          ))}
        </div>
      ) : (
        /* Targets Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {targets.map((target) => {
          const progress =
            target.targetAmount > 0
              ? Math.min(100, Math.round((target.currentSavedAmount / target.targetAmount) * 100))
              : 0;
          const remaining = Math.max(0, target.targetAmount - target.currentSavedAmount);

          return (
            <div
              key={target.id}
              className="bg-stone-850 border border-stone-700/70 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4 hover:border-stone-600 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-stone-800 border border-stone-700 flex items-center justify-center">
                      {getTargetIcon(target.iconName)}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base font-display">{target.title}</h3>
                      <span className="text-xs text-stone-400">{target.category}</span>
                    </div>
                  </div>
                  {getPriorityBadge(target.priority)}
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-baseline justify-between text-xs text-stone-400 font-semibold">
                    <span>
                      Saved: <strong className="text-white text-sm">{sym}{target.currentSavedAmount.toLocaleString()}</strong>
                    </span>
                    <span>Goal: {sym}{target.targetAmount.toLocaleString()}</span>
                  </div>

                  <div className="w-full bg-stone-700 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-cyan-400 h-full rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-stone-400">
                    <span>{sym}{remaining.toLocaleString()} left</span>
                    <span className="text-cyan-300 font-bold">{progress}% funded</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-stone-800 text-xs">
                <div className="flex items-center space-x-1 text-stone-400">
                  <Calendar className="w-3.5 h-3.5 text-stone-500" />
                  <span>Target: {target.deadline}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setDepositModalTarget(target);
                      setDepositInput('500');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-stone-950 font-bold text-xs shadow-md transition-all flex items-center space-x-1 cursor-pointer"
                  >
                    <ArrowUpCircle className="w-3.5 h-3.5" />
                    <span>Quick Deposit</span>
                  </button>

                  <button
                    onClick={() => onEditTarget(target)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
                    title="Edit target"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onDeleteTarget(target.id)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-rose-400 hover:bg-stone-800 transition-colors"
                    title="Delete target"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        </div>
      )}

      {/* Deposit Modal */}
      {depositModalTarget && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleDepositSubmit}
            className="bg-stone-900 border border-stone-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-base font-display">Deposit into Vault</h3>
              <button
                type="button"
                onClick={() => setDepositModalTarget(null)}
                className="text-stone-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-300">
              Adding funds to <strong>{depositModalTarget.title}</strong>. Currently saved: <strong>{sym}{depositModalTarget.currentSavedAmount.toLocaleString()}</strong> of {sym}{depositModalTarget.targetAmount.toLocaleString()}.
            </p>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Deposit Amount ({sym})
              </label>
              <input
                type="number"
                step="any"
                min="1"
                value={depositInput}
                onChange={(e) => setDepositInput(e.target.value)}
                required
                className="w-full px-3.5 py-2 rounded-xl bg-stone-800 border border-stone-700 text-white text-sm focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setDepositModalTarget(null)}
                className="flex-1 py-2 rounded-xl bg-stone-800 text-stone-300 text-xs font-semibold hover:bg-stone-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-stone-950 text-xs font-bold shadow-md shadow-cyan-500/20"
              >
                Confirm Deposit
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
