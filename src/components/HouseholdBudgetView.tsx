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

  const wifeTicketsAllowance = profile.wifeMealTicketsMonthly ?? 800;
  const wifeTicketsCovered = expenses
    .filter((e) => e.assignedPayer === 'WIFE_MEAL_TICKETS')
    .reduce((acc, e) => acc + e.amount, 0);
  const wifeTicketsRemaining = Math.max(0, wifeTicketsAllowance - wifeTicketsCovered);

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
            💳 Salariu {profile.wifeName.split(' ')[0]}
          </span>
        );
      case 'WIFE_MEAL_TICKETS':
        return (
          <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-lime-500/20 text-lime-300 border border-lime-500/30">
            🥗 Bonuri Masă {profile.wifeName.split(' ')[0]} (Edenred/Pluxee)
          </span>
        );
      case 'FREELANCE_BUFFER':
        return (
          <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            💼 Freelance Buffer
          </span>
        );
      case 'SHARED_POOL':
        return (
          <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            🏡 Fond Comun
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
          <p className="text-stone-400 text-sm mt-1">
            Susținut de salariul fix și cardul de bonuri de masă al {profile.wifeName.split(' ')[0]} pentru a garanta acoperirea tuturor nevoilor de bază.
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
            <span>Adaugă Factură / Cheltuială</span>
          </button>
        </div>
      </div>

      {/* Salary & Meal Tickets Foundation Banner */}
      <div className="bg-gradient-to-br from-stone-850 to-stone-900 border border-emerald-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Regula de Bază: 100% Facturi Fixe Acoperite</span>
            </div>
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-black font-display text-white">
                {sym}{profile.wifeMonthlySalary.toLocaleString()}
              </span>
              <span className="text-stone-400 text-sm">Salariu Fix {profile.wifeName.split(' ')[0]}</span>
              <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-lime-500/20 text-lime-300 border border-lime-500/30">
                + {sym}{wifeTicketsAllowance.toLocaleString()} Bonuri de Masă (Edenred)
              </span>
              <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {coveragePercent}% Acoperire Fixă
              </span>
            </div>
            <p className="text-xs text-stone-300 max-w-xl">
              Facturile fixe esențiale totalizează <strong className="text-white">{sym}{fixedExpenses.toLocaleString()}/lună</strong>.
              Venitul stabil lasă un surplus de <strong className="text-emerald-400">+{sym}{wifeSurplus.toLocaleString()}</strong> și <strong className="text-lime-400">{sym}{wifeTicketsRemaining.toLocaleString()}</strong> pe cardul de tichete de masă pentru alimente.
            </p>
          </div>

          {/* Mini Coverage Bar */}
          <div className="w-full lg:w-72 bg-stone-800/80 p-4 rounded-xl border border-stone-700/60 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-400">Facturi Fixe</span>
              <span className="text-white font-bold">{sym}{fixedExpenses.toLocaleString()}</span>
            </div>
            <div className="w-full bg-stone-700 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full"
                style={{ width: `${Math.min(100, (fixedExpenses / profile.wifeMonthlySalary) * 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span>Surplus Net {profile.wifeName.split(' ')[0]}:</span>
              <span className="text-emerald-300 font-bold">+{sym}{wifeSurplus.toLocaleString()}/mo</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Overview Account Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-stone-850 border border-emerald-500/30 rounded-xl p-4">
          <span className="text-[11px] text-emerald-400 font-bold uppercase tracking-wider">💳 Salariu {profile.wifeName.split(' ')[0]}</span>
          <div className="text-xl font-black font-display text-white mt-1">
            {sym}{(profile.wifeMonthlySalary - wifeCovered).toLocaleString()}
          </div>
          <span className="text-[10px] text-stone-400">Disponibil din {sym}{profile.wifeMonthlySalary.toLocaleString()}</span>
        </div>

        <div className="bg-stone-850 border border-lime-500/30 rounded-xl p-4">
          <span className="text-[11px] text-lime-400 font-bold uppercase tracking-wider">🥗 Card Bonuri Masă</span>
          <div className="text-xl font-black font-display text-lime-300 mt-1">
            {sym}{wifeTicketsRemaining.toLocaleString()}
          </div>
          <span className="text-[10px] text-stone-400">Rămas din {sym}{wifeTicketsAllowance.toLocaleString()}/lună</span>
        </div>

        <div className="bg-stone-850 border border-amber-500/30 rounded-xl p-4">
          <span className="text-[11px] text-amber-400 font-bold uppercase tracking-wider">💼 Buffer Freelance</span>
          <div className="text-xl font-black font-display text-amber-400 mt-1">
            {sym}{freelanceCovered.toLocaleString()}
          </div>
          <span className="text-[10px] text-stone-400">Cheltuieli din proiecte video</span>
        </div>

        <div className="bg-stone-850 border border-stone-700/60 rounded-xl p-4">
          <span className="text-[11px] text-stone-400 font-bold uppercase tracking-wider">Total Cheltuieli</span>
          <div className="text-xl font-black font-display text-white mt-1">
            {sym}{totalMonthlyExpenses.toLocaleString()}
          </div>
          <span className="text-[10px] text-stone-400">{expenses.length} facturi înregistrate</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex overflow-x-auto py-1 space-x-2 border-b border-stone-800">
        {[
          { id: 'ALL', label: 'Toate' },
          { id: 'WIFE_SALARY', label: `💳 Salariu ${profile.wifeName.split(' ')[0]}` },
          { id: 'WIFE_MEAL_TICKETS', label: `🥗 Bonuri Masă ${profile.wifeName.split(' ')[0]}` },
          { id: 'FREELANCE_BUFFER', label: `💼 Buffer Freelance` },
          { id: 'SHARED_POOL', label: `🏡 Fond Comun` },
          { id: 'FIXED', label: 'Fixe' },
          { id: 'FLEXIBLE', label: 'Variabile' }
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
