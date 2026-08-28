import React, { useState } from 'react';
import {
  Landmark,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  ArrowDownCircle
} from 'lucide-react';
import { BankDebt, HouseholdProfile } from '../types';

interface BankDebtViewProps {
  profile: HouseholdProfile;
  debts: BankDebt[];
  onOpenNewDebt: () => void;
  onEditDebt: (debt: BankDebt) => void;
  onDeleteDebt: (debtId: string) => void;
  onMakePayment: (debtId: string, amount: number) => void;
}

export const BankDebtView: React.FC<BankDebtViewProps> = ({
  profile,
  debts,
  onOpenNewDebt,
  onEditDebt,
  onDeleteDebt,
  onMakePayment
}) => {
  const sym = profile.currencySymbol;
  const [strategy, setStrategy] = useState<'AVALANCHE' | 'SNOWBALL'>('AVALANCHE');
  const [paymentModalDebt, setPaymentModalDebt] = useState<BankDebt | null>(null);
  const [paymentInput, setPaymentInput] = useState<string>('');

  const totalCurrentDebt = debts.reduce((acc, d) => acc + d.currentBalance, 0);
  const totalOriginalDebt = debts.reduce((acc, d) => acc + d.originalBalance, 0);
  const totalPaid = Math.max(0, totalOriginalDebt - totalCurrentDebt);
  const overallProgress =
    totalOriginalDebt > 0 ? Math.round((totalPaid / totalOriginalDebt) * 100) : 100;

  const sortedDebts = [...debts].sort((a, b) => {
    if (strategy === 'AVALANCHE') {
      return b.interestRateApr - a.interestRateApr; // Highest interest first
    }
    return a.currentBalance - b.currentBalance; // Smallest balance first
  });

  const handleLogPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModalDebt) return;
    const amt = parseFloat(paymentInput);
    if (!isNaN(amt) && amt > 0) {
      onMakePayment(paymentModalDebt.id, amt);
      setPaymentModalDebt(null);
      setPaymentInput('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight flex items-center space-x-2">
            <Landmark className="w-7 h-7 text-rose-400" />
            <span>Bank Debt Payoff Strategist</span>
          </h1>
          <p className="text-stone-400 text-sm mt-1">
            Eliminate high-interest cards and loans by channeling 35% of freelance windfalls directly into principal.
          </p>
        </div>

        <button
          id="btn-add-new-debt"
          onClick={onOpenNewDebt}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-stone-950 font-bold text-sm shadow-lg shadow-rose-500/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Bank Debt</span>
        </button>
      </div>

      {/* Payoff Progress Banner */}
      <div className="bg-stone-850 border border-stone-700/70 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Total Remaining Debt</span>
            <div className="text-3xl sm:text-4xl font-black font-display text-rose-400">
              {sym}{totalCurrentDebt.toLocaleString()}
            </div>
            <p className="text-xs text-stone-400">
              Original baseline: {sym}{totalOriginalDebt.toLocaleString()} • Cleared: <strong className="text-emerald-400">+{sym}{totalPaid.toLocaleString()}</strong>
            </p>
          </div>

          <div className="flex items-center space-x-3 self-start sm:self-auto">
            <span className="text-xs font-semibold text-stone-400">Strategy:</span>
            <div className="bg-stone-800 p-1 rounded-xl border border-stone-700 flex space-x-1">
              <button
                onClick={() => setStrategy('AVALANCHE')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  strategy === 'AVALANCHE'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 shadow'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Avalanche (High APR First)
              </button>
              <button
                onClick={() => setStrategy('SNOWBALL')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  strategy === 'SNOWBALL'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Snowball (Smallest First)
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-1.5 pt-2">
          <div className="flex items-center justify-between text-xs text-stone-400 font-semibold">
            <span>Overall Elimination Progress</span>
            <span className="text-emerald-400">{overallProgress}% Cleared</span>
          </div>
          <div className="w-full bg-stone-700 h-3 rounded-full overflow-hidden">
            <div className="bg-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: `${overallProgress}%` }} />
          </div>
        </div>
      </div>

      {/* Debts List */}
      <div className="space-y-4">
        {sortedDebts.map((debt, index) => {
          const paid = Math.max(0, debt.originalBalance - debt.currentBalance);
          const progress = debt.originalBalance > 0 ? Math.round((paid / debt.originalBalance) * 100) : 100;
          const isTarget1 = index === 0 && debt.currentBalance > 0;

          return (
            <div
              key={debt.id}
              className={`p-5 rounded-2xl border transition-all ${
                isTarget1
                  ? 'bg-rose-950/20 border-rose-500/40 shadow-xl shadow-rose-950/20'
                  : 'bg-stone-850 border-stone-700/60'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-2 max-w-xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        isTarget1
                          ? 'bg-rose-500 text-stone-950'
                          : 'bg-stone-800 text-stone-300 border border-stone-700'
                      }`}
                    >
                      Priority #{index + 1}
                    </span>
                    <h3 className="text-base font-bold text-white font-display">{debt.bankName}</h3>
                    <span className="text-xs px-2.5 py-0.5 rounded-md bg-rose-500/15 text-rose-300 border border-rose-500/30 font-bold">
                      {debt.interestRateApr}% APR
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-400">
                    <span>Min Monthly: <strong className="text-stone-200">{sym}{debt.minMonthlyPayment}</strong></span>
                    <span>Target Monthly: <strong className="text-emerald-400">{sym}{debt.targetMonthlyPayment}</strong></span>
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-stone-500" />
                      <span>Due day {debt.dueDayOfMonth}th</span>
                    </span>
                  </div>

                  {debt.notes && (
                    <p className="text-xs text-stone-400 bg-stone-900/60 p-2.5 rounded-xl border border-stone-800 italic">
                      "{debt.notes}"
                    </p>
                  )}

                  {/* Progress bar */}
                  <div className="space-y-1 pt-1">
                    <div className="w-full bg-stone-700 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${progress}%` }} />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-stone-400">
                      <span>Paid: {sym}{paid.toLocaleString()} of {sym}{debt.originalBalance.toLocaleString()}</span>
                      <span className="text-emerald-400 font-bold">{progress}% complete</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col sm:items-center lg:items-end justify-between gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-stone-800">
                  <div className="text-left lg:text-right">
                    <div className="text-2xl font-black font-display text-white">
                      {sym}{debt.currentBalance.toLocaleString()}
                    </div>
                    <div className="text-xs text-stone-400">Current Balance</div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {debt.currentBalance > 0 && (
                      <button
                        onClick={() => {
                          setPaymentModalDebt(debt);
                          setPaymentInput(debt.minMonthlyPayment.toString());
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-stone-950 font-bold text-xs shadow-md transition-all flex items-center space-x-1.5 cursor-pointer"
                      >
                        <ArrowDownCircle className="w-3.5 h-3.5" />
                        <span>Log Payment</span>
                      </button>
                    )}

                    <button
                      onClick={() => onEditDebt(debt)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
                      title="Edit debt"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onDeleteDebt(debt.id)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-rose-400 hover:bg-stone-800 transition-colors"
                      title="Delete debt"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Payment Logger Modal */}
      {paymentModalDebt && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleLogPayment}
            className="bg-stone-900 border border-stone-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-base font-display">Log Debt Payment</h3>
              <button
                type="button"
                onClick={() => setPaymentModalDebt(null)}
                className="text-stone-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-300">
              Applying payment towards <strong>{paymentModalDebt.bankName}</strong>. Current balance: <strong>{sym}{paymentModalDebt.currentBalance.toLocaleString()}</strong>.
            </p>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Payment Amount ({sym})
              </label>
              <input
                type="number"
                step="any"
                min="1"
                max={paymentModalDebt.currentBalance}
                value={paymentInput}
                onChange={(e) => setPaymentInput(e.target.value)}
                required
                className="w-full px-3.5 py-2 rounded-xl bg-stone-800 border border-stone-700 text-white text-sm focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setPaymentModalDebt(null)}
                className="flex-1 py-2 rounded-xl bg-stone-800 text-stone-300 text-xs font-semibold hover:bg-stone-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-stone-950 text-xs font-bold shadow-md shadow-rose-500/20"
              >
                Confirm Payment
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
