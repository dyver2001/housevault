import React, { useState } from 'react';
import {
  Receipt,
  Plus,
  ShieldCheck,
  Trash2,
  Edit2,
  Camera,
  Zap,
  HelpCircle,
  CheckCircle2
} from 'lucide-react';
import { HouseholdExpense, HouseholdProfile, ExpenseCategory, ExpensePayer } from '../types';

interface HouseholdBudgetViewProps {
  profile: HouseholdProfile;
  expenses: HouseholdExpense[];
  onOpenNewExpense: () => void;
  onOpenScanner?: () => void;
  onOpenQuickBuy?: () => void;
  onEditExpense: (expense: HouseholdExpense) => void;
  onDeleteExpense: (expenseId: string) => void;
  onAssignPayer?: (expenseId: string, payer: ExpensePayer) => void;
}

export const HouseholdBudgetView: React.FC<HouseholdBudgetViewProps> = ({
  profile,
  expenses,
  onOpenNewExpense,
  onOpenScanner,
  onOpenQuickBuy,
  onEditExpense,
  onDeleteExpense,
  onAssignPayer
}) => {
  const sym = profile.currencySymbol;
  const husbandShort = (profile.husbandName || 'Haytham').split(' ')[0];
  const wifeShort = (profile.wifeName || 'Cati').split(' ')[0];
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

  const wifeTicketsAllowance = profile.wifeMealTicketsMonthly ?? 800;
  const wifeTicketsCovered = expenses
    .filter((e) => e.assignedPayer === 'WIFE_MEAL_TICKETS')
    .reduce((acc, e) => acc + e.amount, 0);
  const wifeTicketsRemaining = Math.max(0, wifeTicketsAllowance - wifeTicketsCovered);

  const freelanceCovered = expenses
    .filter((e) => e.assignedPayer === 'FREELANCE_BUFFER')
    .reduce((acc, e) => acc + e.amount, 0);

  const decideLaterCovered = expenses
    .filter((e) => e.assignedPayer === 'DECIDE_LATER')
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
      case 'DECIDE_LATER':
        return (
          <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
            <span>🤔 Se decide la plată</span>
          </span>
        );
      case 'WIFE_SALARY':
        return (
          <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            💳 Salariu {wifeShort}
          </span>
        );
      case 'WIFE_MEAL_TICKETS':
        return (
          <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-lime-500/20 text-lime-300 border border-lime-500/30">
            🥗 Bonuri Masă {wifeShort} (Edenred)
          </span>
        );
      case 'FREELANCE_BUFFER':
        return (
          <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            💼 Buffer Freelance {husbandShort}
          </span>
        );
      case 'SHARED_POOL':
        return (
          <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            🏡 Fond Comun Familie
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
            <span>Buget Familie & Facturi Lunare</span>
          </h1>
          <p className="text-stone-400 text-xs sm:text-sm mt-1">
            Plătește din salariul lui {wifeShort}, din bonurile de masă sau din încasările video ale lui {husbandShort}.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 items-center self-start sm:self-auto">
          {onOpenQuickBuy && (
            <button
              type="button"
              onClick={onOpenQuickBuy}
              className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer active:scale-95"
            >
              <Zap className="w-4 h-4 fill-stone-950" />
              <span>⚡ Cumpără Rapid (Hell, Țigări)</span>
            </button>
          )}

          {onOpenScanner && (
            <button
              type="button"
              onClick={onOpenScanner}
              className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-2xl bg-stone-850 hover:bg-stone-800 text-cyan-300 border border-cyan-500/30 font-bold text-xs shadow-md transition-all cursor-pointer active:scale-95"
            >
              <Camera className="w-4 h-4 text-cyan-400" />
              <span>Scanează Bon</span>
            </button>
          )}

          <button
            id="btn-add-new-expense"
            onClick={onOpenNewExpense}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ Adaugă Factură</span>
          </button>
        </div>
      </div>

      {/* Salary & Meal Tickets Foundation Banner */}
      <div className="bg-gradient-to-br from-stone-900/90 via-stone-850/80 to-stone-900/90 border border-emerald-500/30 rounded-3xl p-6 shadow-xl relative overflow-hidden backdrop-blur-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Garanție Cheltuieli Lunare</span>
            </div>
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-black font-display text-white">
                {sym}{profile.wifeMonthlySalary.toLocaleString()}
              </span>
              <span className="text-stone-400 text-sm">Salariu {wifeShort}</span>
              <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-lime-500/20 text-lime-300 border border-lime-500/30">
                + {sym}{wifeTicketsAllowance.toLocaleString()} Bonuri de Masă (Edenred)
              </span>
              {decideLaterCovered > 0 && (
                <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {sym}{decideLaterCovered.toLocaleString()} De Decis la Plată
                </span>
              )}
            </div>
            <p className="text-xs text-stone-300 max-w-xl">
              Facturile fixe planificate totalizează <strong className="text-white">{sym}{fixedExpenses.toLocaleString()}/lună</strong>.
              Salariul acoperă nevoile de bază, iar facturile flexibile se pot plăti direct din proiectele video când intră banii!
            </p>
          </div>

          {/* Mini Coverage Bar */}
          <div className="w-full lg:w-72 bg-stone-900/80 p-4 rounded-2xl border border-stone-700/60 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-400">Facturi Fixe</span>
              <span className="text-white font-bold">{sym}{fixedExpenses.toLocaleString()}</span>
            </div>
            <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (fixedExpenses / (profile.wifeMonthlySalary || 1)) * 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span>Surplus Net {wifeShort}:</span>
              <span className="text-emerald-300 font-bold">+{sym}{wifeSurplus.toLocaleString()}/mo</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Overview Account Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-stone-900/80 border border-emerald-500/30 rounded-2xl p-4">
          <span className="text-[11px] text-emerald-400 font-bold uppercase tracking-wider">💳 Salariu {wifeShort}</span>
          <div className="text-xl font-black font-display text-white mt-1">
            {sym}{(profile.wifeMonthlySalary - wifeCovered).toLocaleString()}
          </div>
          <span className="text-[10px] text-stone-400">Disponibil din {sym}{profile.wifeMonthlySalary.toLocaleString()}</span>
        </div>

        <div className="bg-stone-900/80 border border-lime-500/30 rounded-2xl p-4">
          <span className="text-[11px] text-lime-400 font-bold uppercase tracking-wider">🥗 Card Bonuri Masă</span>
          <div className="text-xl font-black font-display text-lime-300 mt-1">
            {sym}{wifeTicketsRemaining.toLocaleString()}
          </div>
          <span className="text-[10px] text-stone-400">Rămas din {sym}{wifeTicketsAllowance.toLocaleString()}/lună</span>
        </div>

        <div className="bg-stone-900/80 border border-amber-500/30 rounded-2xl p-4">
          <span className="text-[11px] text-amber-400 font-bold uppercase tracking-wider">💼 Buffer Freelance</span>
          <div className="text-xl font-black font-display text-amber-400 mt-1">
            {sym}{freelanceCovered.toLocaleString()}
          </div>
          <span className="text-[10px] text-stone-400">Plătit din onorarii {husbandShort}</span>
        </div>

        <div className="bg-stone-900/80 border border-cyan-500/30 rounded-2xl p-4">
          <span className="text-[11px] text-cyan-400 font-bold uppercase tracking-wider">🤔 De Decis la Plată</span>
          <div className="text-xl font-black font-display text-cyan-300 mt-1">
            {sym}{decideLaterCovered.toLocaleString()}
          </div>
          <span className="text-[10px] text-stone-400">Se alege cine plătește la scadență</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex overflow-x-auto py-1 space-x-2 border-b border-stone-800 no-scrollbar">
        {[
          { id: 'ALL', label: 'Toate' },
          { id: 'DECIDE_LATER', label: '🤔 De Decis la Plată' },
          { id: 'WIFE_SALARY', label: `💳 Salariu ${wifeShort}` },
          { id: 'WIFE_MEAL_TICKETS', label: `🥗 Bonuri Masă ${wifeShort}` },
          { id: 'FREELANCE_BUFFER', label: `💼 Buffer Freelance` },
          { id: 'SHARED_POOL', label: `🏡 Fond Comun` },
          { id: 'FIXED', label: 'Fixe' },
          { id: 'FLEXIBLE', label: 'Variabile' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterPayer(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
              filterPayer === tab.id
                ? 'bg-stone-800 text-white border border-stone-600 shadow-sm'
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
              className="p-4 rounded-2xl bg-stone-900/80 border border-stone-750/70 hover:border-stone-600 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md"
            >
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                  <span className="font-bold text-white text-base">{expense.title}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getCategoryColor(expense.category)}`}>
                    {expense.category.replace('_', ' ')}
                  </span>
                  {expense.isFixed ? (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-800 text-stone-300 border border-stone-700">
                      Fixă lunară
                    </span>
                  ) : (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      Variabilă
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2 flex-wrap gap-1.5">
                  {getPayerBadge(expense.assignedPayer)}

                  {/* Quick Change Payer dropdown / buttons if DECIDE_LATER */}
                  {expense.assignedPayer === 'DECIDE_LATER' && onEditExpense && (
                    <button
                      type="button"
                      onClick={() => onEditExpense(expense)}
                      className="px-2 py-0.5 rounded-md bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10px] font-bold transition cursor-pointer"
                    >
                      👉 Alege cine o achită acum
                    </button>
                  )}
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
                    className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
                    title="Editează cheltuiala"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteExpense(expense.id)}
                    className="p-2 rounded-xl text-stone-400 hover:text-rose-400 hover:bg-stone-800 transition-colors cursor-pointer"
                    title="Șterge cheltuiala"
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
