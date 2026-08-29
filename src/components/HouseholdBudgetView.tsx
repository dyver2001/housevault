import React, { useState } from 'react';
import {
  Receipt,
  Plus,
  ShieldCheck,
  Trash2,
  Edit2,
  Camera
} from 'lucide-react';
import { HouseholdExpense, HouseholdProfile, ExpenseCategory, ExpensePayer } from '../types';

interface HouseholdBudgetViewProps {
  profile: HouseholdProfile;
  expenses: HouseholdExpense[];
  onOpenNewExpense: () => void;
  onOpenScanner?: () => void;
  onEditExpense: (expense: HouseholdExpense) => void;
  onDeleteExpense: (expenseId: string) => void;
}

export const HouseholdBudgetView: React.FC<HouseholdBudgetViewProps> = ({
  profile,
  expenses,
  onOpenNewExpense,
  onOpenScanner,
  onEditExpense,
  onDeleteExpense
}) => {
  const sym = profile.currencySymbol;
  const [filterPayer, setFilterPayer] = useState<string>('ALL');

  const fixedExpenses = expenses
    .filter((e) => e.isFixed)
    .reduce((acc, e) => acc + e.amount, 0);

  const flexibleExpenses = expenses
    .filter((e) => !e.isFixed)
    .reduce((acc, e) => acc + e.amount, 0);

  const totalMonthlyExpenses = fixedExpenses + flexibleExpenses;

  // Assigned Payer sums
  const wifeCovered = expenses
    .filter((e) => e.assignedPayer === 'WIFE_SALARY')
    .reduce((acc, e) => acc + e.amount, 0);

  const freelanceCovered = expenses
    .filter((e) => e.assignedPayer === 'FREELANCE_BUFFER')
    .reduce((acc, e) => acc + e.amount, 0);

  const wifeSurplus = profile.wifeMonthlySalary - wifeCovered;
  const coveragePercent =
    fixedExpenses > 0
      ? Math.min(200, Math.round((profile.wifeMonthlySalary / fixedExpenses) * 100))
      : 100;

  const filteredExpenses = expenses.filter((e) => {
    if (filterPayer === 'ALL') return true;
    if (filterPayer === 'FIXED') return e.isFixed;
    if (filterPayer === 'FLEXIBLE') return !e.isFixed;
    return e.assignedPayer === filterPayer;
  });

  const getCategoryColor = (category: ExpenseCategory) => {
    switch (category) {
      case 'HOUSING':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'GROCERIES':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'UTILITIES':
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
      case 'HEALTH':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      case 'TRANSPORT':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'VIDEO_SOFTWARE':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      default:
        return 'text-stone-300 bg-stone-800 border-stone-700';
    }
  };

  const getPayerBadge = (payer: ExpensePayer) => {
    switch (payer) {
      case 'WIFE_SALARY':
        return (
          <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            {profile.wifeName.split(' ')[0]}'s Salary Anchor
          </span>
        );
      case 'FREELANCE_BUFFER':
        return (
          <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Freelance Buffer
          </span>
        );
      case 'SHARED_POOL':
        return (
          <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            Shared Pool
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
            <Receipt className="w-7 h-7 text-emerald-400" />
            <span>Household Budget & Bills</span>
          </h1>
          <p className="text-stone-400 text-sm mt-1">
            Anchored by Elena's IT salary to guarantee all fixed family necessities are paid automatically.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 items-center self-start sm:self-auto">
          {onOpenScanner && (
            <button
              type="button"
              onClick={onOpenScanner}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-750 text-cyan-300 border border-cyan-500/30 font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              <Camera className="w-4 h-4 text-cyan-400" />
              <span>Scanează Bon / Galerie</span>
            </button>
          )}
          <button
            id="btn-add-new-expense"
            onClick={onOpenNewExpense}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Household Bill</span>
          </button>
        </div>
      </div>

      {/* Salary Foundation Banner */}
      <div className="bg-gradient-to-br from-stone-850 to-stone-900 border border-emerald-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Foundation Rule: 100% Fixed Costs Covered</span>
            </div>
            <div className="flex items-baseline space-x-3">
              <span className="text-3xl sm:text-4xl font-black font-display text-white">
                {sym}{profile.wifeMonthlySalary.toLocaleString()}
              </span>
              <span className="text-stone-400 text-sm">Elena's Monthly Salary</span>
              <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {coveragePercent}% Covered
              </span>
            </div>
            <p className="text-xs text-stone-300 max-w-xl">
              Fixed essential bills total <strong className="text-white">{sym}{fixedExpenses.toLocaleString()}/mo</strong>.
              Elena's salary leaves a <strong className="text-emerald-400">+{sym}{wifeSurplus.toLocaleString()}</strong> monthly surplus before freelance earnings even begin.
            </p>
          </div>

          {/* Mini Coverage Bar */}
          <div className="w-full lg:w-72 bg-stone-800/80 p-4 rounded-xl border border-stone-700/60 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-400">Fixed Bills</span>
              <span className="text-white font-bold">{sym}{fixedExpenses.toLocaleString()}</span>
            </div>
            <div className="w-full bg-stone-700 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full"
                style={{ width: `${Math.min(100, (fixedExpenses / profile.wifeMonthlySalary) * 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span>Elena's Net Buffer:</span>
              <span className="text-emerald-300 font-bold">+{sym}{wifeSurplus.toLocaleString()}/mo</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-stone-850 border border-stone-700/60 rounded-xl p-4">
          <span className="text-xs text-stone-400 font-semibold uppercase tracking-wider">Fixed Monthly Bills</span>
          <div className="text-2xl font-black font-display text-white mt-1">
            {sym}{fixedExpenses.toLocaleString()}
          </div>
          <span className="text-xs text-emerald-400 font-medium">100% covered by wife's salary</span>
        </div>

        <div className="bg-stone-850 border border-stone-700/60 rounded-xl p-4">
          <span className="text-xs text-stone-400 font-semibold uppercase tracking-wider">Freelance Buffer Bills</span>
          <div className="text-2xl font-black font-display text-amber-400 mt-1">
            {sym}{freelanceCovered.toLocaleString()}
          </div>
          <span className="text-xs text-stone-400">Gear, Adobe & family dining</span>
        </div>

        <div className="bg-stone-850 border border-stone-700/60 rounded-xl p-4">
          <span className="text-xs text-stone-400 font-semibold uppercase tracking-wider">Total Monthly Overhead</span>
          <div className="text-2xl font-black font-display text-white mt-1">
            {sym}{totalMonthlyExpenses.toLocaleString()}
          </div>
          <span className="text-xs text-stone-400">{expenses.length} recurring expenses</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex overflow-x-auto py-1 space-x-2 border-b border-stone-800">
        {[
          { id: 'ALL', label: 'All Expenses' },
          { id: 'WIFE_SALARY', label: `${profile.wifeName.split(' ')[0]}'s Anchor` },
          { id: 'FREELANCE_BUFFER', label: 'Freelance Buffer' },
          { id: 'FIXED', label: 'Fixed Only' },
          { id: 'FLEXIBLE', label: 'Flexible / Discretionary' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterPayer(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              filterPayer === tab.id
                ? 'bg-stone-700 text-white border border-stone-600'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-850'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Expenses Table / List */}
      <div className="space-y-3">
        {filteredExpenses.map((expense) => {
          return (
            <div
              key={expense.id}
              className="p-4 rounded-xl bg-stone-850 border border-stone-700/60 hover:border-stone-600 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md"
            >
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-white text-base">{expense.title}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getCategoryColor(expense.category)}`}>
                    {expense.category.replace('_', ' ')}
                  </span>
                  {expense.isFixed ? (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-800 text-stone-300 border border-stone-700">
                      Fixed
                    </span>
                  ) : (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      Flexible
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  {getPayerBadge(expense.assignedPayer)}
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end space-x-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-800">
                <div className="text-left sm:text-right">
                  <div className="text-lg font-black font-display text-white">
                    {sym}{expense.amount.toLocaleString()}
                    <span className="text-xs text-stone-400 font-normal ml-1">/mo</span>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => onEditExpense(expense)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
                    title="Edit expense"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteExpense(expense.id)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-rose-400 hover:bg-stone-800 transition-colors"
                    title="Delete expense"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
