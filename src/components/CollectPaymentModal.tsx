import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  DollarSign,
  Zap,
  Landmark,
  Vault,
  Shield,
  Smile,
  CheckCircle2
} from 'lucide-react';
import {
  FreelanceProject,
  HouseholdProfile,
  BankDebt,
  SavingsTarget,
  WindfallSplitRule
} from '../types';
import { soundFx } from '../utils/audioEffects';
import { triggerCoinRain } from '../utils/confetti';

interface CollectPaymentModalProps {
  project: FreelanceProject;
  profile: HouseholdProfile;
  debts: BankDebt[];
  targets: SavingsTarget[];
  splitRule: WindfallSplitRule;
  onClose: () => void;
  onConfirmCollection: (
    projectId: string,
    collectedAmount: number,
    splitAllocations: {
      debtId?: string;
      debtAmount: number;
      targetId?: string;
      targetAmount: number;
      taxAmount: number;
      safeAmount: number;
    }
  ) => void;
}

export const CollectPaymentModal: React.FC<CollectPaymentModalProps> = ({
  project,
  profile,
  debts,
  targets,
  splitRule,
  onClose,
  onConfirmCollection
}) => {
  const sym = profile.currencySymbol;
  const remainingDue = Math.max(0, project.totalFee - project.depositReceived);
  const [collectionAmount, setCollectionAmount] = useState<number>(remainingDue);
  const [selectedDebtId, setSelectedDebtId] = useState<string>(debts[0]?.id || '');
  const [selectedTargetId, setSelectedTargetId] = useState<string>(targets[0]?.id || '');

  const debtAllocation = (collectionAmount * splitRule.debtPayoffPercent) / 100;
  const targetAllocation = (collectionAmount * splitRule.savingsTargetPercent) / 100;
  const taxAllocation = (collectionAmount * splitRule.businessTaxReservePercent) / 100;
  const safeAllocation = (collectionAmount * splitRule.safePocketPercent) / 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (collectionAmount <= 0) return;

    // Play chime & Golden Coin Rain
    soundFx.playCashChime();
    triggerCoinRain();

    // Trigger celebratory confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    onConfirmCollection(project.id, collectionAmount, {
      debtId: selectedDebtId || undefined,
      debtAmount: debtAllocation,
      targetId: selectedTargetId || undefined,
      targetAmount: targetAllocation,
      taxAmount: taxAllocation,
      safeAmount: safeAllocation
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-stone-900 border border-stone-700 rounded-3xl max-w-xl w-full p-6 sm:p-7 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <DollarSign className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-lg font-black font-display text-white">Collect & Auto-Split Payout</h2>
              <p className="text-xs text-stone-400">
                {project.clientName} • {project.projectTitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-white text-lg p-1"
          >
            ✕
          </button>
        </div>

        {/* Collection Input */}
        <div className="bg-stone-850 p-4 rounded-2xl border border-stone-700/60 space-y-2">
          <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider">
            Collected Cash Amount ({sym})
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="number"
              step="any"
              min="1"
              max={project.totalFee}
              value={collectionAmount}
              onChange={(e) => setCollectionAmount(parseFloat(e.target.value) || 0)}
              required
              className="flex-1 px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white font-display text-lg font-bold focus:border-emerald-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setCollectionAmount(remainingDue)}
              className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold whitespace-nowrap"
            >
              Full Balance ({sym}{remainingDue.toLocaleString()})
            </button>
          </div>
          <p className="text-[11px] text-stone-400">
            Total project fee: {sym}{project.totalFee.toLocaleString()} • Prior deposits: {sym}{project.depositReceived.toLocaleString()}
          </p>
        </div>

        {/* Golden Split Breakdown Preview */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 flex items-center space-x-1.5 uppercase tracking-wider">
              <Zap className="w-4 h-4" />
              <span>Instant Windfall Split Allocations</span>
            </span>
            <span className="text-[11px] text-stone-400 font-semibold">100% Directed</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Split 1: Debt */}
            <div className="p-3.5 rounded-2xl bg-stone-850 border border-rose-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400 flex items-center space-x-1">
                  <Landmark className="w-3.5 h-3.5" />
                  <span>Debt Paydown ({splitRule.debtPayoffPercent}%)</span>
                </span>
                <span className="text-sm font-black font-display text-rose-300">
                  {sym}{debtAllocation.toLocaleString()}
                </span>
              </div>
              <select
                value={selectedDebtId}
                onChange={(e) => setSelectedDebtId(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-stone-900 border border-stone-700 text-stone-200 text-xs focus:outline-none"
              >
                {debts.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.bankName} (Bal: {sym}{d.currentBalance})
                  </option>
                ))}
              </select>
            </div>

            {/* Split 2: Savings Vault */}
            <div className="p-3.5 rounded-2xl bg-stone-850 border border-cyan-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400 flex items-center space-x-1">
                  <Vault className="w-3.5 h-3.5" />
                  <span>Savings Vault ({splitRule.savingsTargetPercent}%)</span>
                </span>
                <span className="text-sm font-black font-display text-cyan-300">
                  {sym}{targetAllocation.toLocaleString()}
                </span>
              </div>
              <select
                value={selectedTargetId}
                onChange={(e) => setSelectedTargetId(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-stone-900 border border-stone-700 text-stone-200 text-xs focus:outline-none"
              >
                {targets.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Split 3: Business Tax */}
            <div className="p-3.5 rounded-2xl bg-stone-850 border border-amber-500/30 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 flex items-center space-x-1">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Tax & Gear ({splitRule.businessTaxReservePercent}%)</span>
                </span>
                <span className="text-sm font-black font-display text-amber-300">
                  {sym}{taxAllocation.toLocaleString()}
                </span>
              </div>
              <p className="text-[10px] text-stone-400">
                Hold in self-employment tax buffer account.
              </p>
            </div>

            {/* Split 4: Safe Pocket */}
            <div className="p-3.5 rounded-2xl bg-stone-850 border border-emerald-500/30 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1">
                  <Smile className="w-3.5 h-3.5" />
                  <span>Safe Pocket ({splitRule.safePocketPercent}%)</span>
                </span>
                <span className="text-sm font-black font-display text-emerald-300">
                  {sym}{safeAllocation.toLocaleString()}
                </span>
              </div>
              <p className="text-[10px] text-stone-400">
                Guilt-free personal spending for Alex.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl bg-stone-800 text-stone-300 font-semibold text-xs hover:bg-stone-750 transition-colors"
          >
            Cancel
          </button>
          <button
            id="btn-confirm-collection"
            type="submit"
            className="flex-1 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
            <span>Confirm & Distribute Funds</span>
          </button>
        </div>
      </form>
    </div>
  );
};
