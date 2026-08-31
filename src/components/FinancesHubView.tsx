import React, { useState } from 'react';
import { Receipt, Landmark, ShoppingCart, Sparkles, Plus, Camera } from 'lucide-react';
import {
  HouseholdProfile,
  HouseholdExpense,
  BankDebt,
  GroceryItem,
  GroceryCatalogItem,
  CashPocketsBalance,
  ExpensePayer
} from '../types';
import { HouseholdBudgetView } from './HouseholdBudgetView';
import { BankDebtView } from './BankDebtView';
import { GroceryOptimizerView } from './GroceryOptimizerView';

export type FinanceSubTab = 'bills' | 'debts' | 'groceries';

interface FinancesHubViewProps {
  initialSubTab?: FinanceSubTab;
  profile: HouseholdProfile;
  expenses: HouseholdExpense[];
  debts: BankDebt[];
  shoppingList: GroceryItem[];
  groceryCatalog: GroceryCatalogItem[];
  cashBalances: CashPocketsBalance;
  onOpenNewExpense: () => void;
  onOpenScanner: () => void;
  onEditExpense: (expense: HouseholdExpense) => void;
  onDeleteExpense: (expenseId: string) => void;
  onOpenNewDebt: () => void;
  onEditDebt: (debt: BankDebt) => void;
  onDeleteDebt: (debtId: string) => void;
  onMakeDebtPayment: (debtId: string, amount: number, source?: ExpensePayer, deductFromAccount?: boolean) => void;
  onUpdateShoppingList: (list: GroceryItem[]) => void;
  onUpdateGroceryCatalog: (cat: GroceryCatalogItem[]) => void;
  onAddDirectExpense: (exp: HouseholdExpense) => void;
}

export const FinancesHubView: React.FC<FinancesHubViewProps> = ({
  initialSubTab = 'bills',
  profile,
  expenses,
  debts,
  shoppingList,
  groceryCatalog,
  cashBalances,
  onOpenNewExpense,
  onOpenScanner,
  onEditExpense,
  onDeleteExpense,
  onOpenNewDebt,
  onEditDebt,
  onDeleteDebt,
  onMakeDebtPayment,
  onUpdateShoppingList,
  onUpdateGroceryCatalog,
  onAddDirectExpense
}) => {
  const [subTab, setSubTab] = useState<FinanceSubTab>(initialSubTab);
  const sym = profile?.currencySymbol || 'lei';
  const isRo = profile?.language === 'ro';

  const fixedExpenses = (expenses || []).filter((e) => e.isFixed).reduce((s, e) => s + (e.amount || 0), 0);
  const totalDebt = (debts || []).reduce((s, d) => s + (d.currentBalance || 0), 0);
  const pendingGroceries = (shoppingList || []).filter((g) => !g.checked).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Luxury Segmented Hub Selector */}
      <div className="bg-gradient-to-r from-stone-900/90 via-stone-850/90 to-stone-900/90 backdrop-blur-2xl p-1.5 sm:p-2 rounded-3xl border border-white/[0.08] shadow-2xl flex items-center justify-between gap-1 sm:gap-2">
        <div className="flex items-center gap-1 sm:gap-2 flex-1 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setSubTab('bills')}
            className={`flex items-center space-x-2 px-3.5 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              subTab === 'bills'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-stone-950 shadow-lg shadow-emerald-500/25 scale-[1.02]'
                : 'text-stone-300 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Receipt className="w-4 h-4 shrink-0" />
            <span>{isRo ? 'Facturi & Bonuri' : 'Bills & Vouchers'}</span>
            <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${
              subTab === 'bills' ? 'bg-stone-950/20 text-stone-950 font-black' : 'bg-stone-800 text-emerald-400'
            }`}>
              {sym}{fixedExpenses.toLocaleString()}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('debts')}
            className={`flex items-center space-x-2 px-3.5 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              subTab === 'debts'
                ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-stone-950 shadow-lg shadow-rose-500/25 scale-[1.02]'
                : 'text-stone-300 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Landmark className="w-4 h-4 shrink-0" />
            <span>{isRo ? 'Datorii Bancare' : 'Bank Debt'}</span>
            <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${
              subTab === 'debts' ? 'bg-stone-950/20 text-stone-950 font-black' : 'bg-stone-800 text-rose-400'
            }`}>
              {sym}{totalDebt.toLocaleString()}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('groceries')}
            className={`flex items-center space-x-2 px-3.5 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              subTab === 'groceries'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 shadow-lg shadow-amber-500/25 scale-[1.02]'
                : 'text-stone-300 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <ShoppingCart className="w-4 h-4 shrink-0" />
            <span>{isRo ? 'Cumpărături & Meniu' : 'Groceries & Menu'}</span>
            {pendingGroceries > 0 && (
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                subTab === 'groceries' ? 'bg-stone-950/20 text-stone-950 font-black' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                {pendingGroceries}
              </span>
            )}
          </button>
        </div>

        {/* Joyful Scanner Action Button */}
        <button
          type="button"
          onClick={onOpenScanner}
          className="hidden md:flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 font-bold text-xs shadow-md transition-all cursor-pointer shrink-0"
        >
          <Camera className="w-4 h-4 text-cyan-400" />
          <span>{isRo ? 'Scanează Bon' : 'Scan Receipt'}</span>
        </button>
      </div>

      {/* Sub-View Content */}
      <div className="transition-all duration-300">
        {subTab === 'bills' && (
          <HouseholdBudgetView
            expenses={expenses}
            profile={profile}
            onOpenNewExpense={onOpenNewExpense}
            onOpenScanner={onOpenScanner}
            onEditExpense={onEditExpense}
            onDeleteExpense={onDeleteExpense}
          />
        )}

        {subTab === 'debts' && (
          <BankDebtView
            debts={debts}
            profile={profile}
            cashBalances={cashBalances}
            onOpenNewDebt={onOpenNewDebt}
            onEditDebt={onEditDebt}
            onDeleteDebt={onDeleteDebt}
            onMakePayment={onMakeDebtPayment}
          />
        )}

        {subTab === 'groceries' && (
          <GroceryOptimizerView
            profile={profile}
            shoppingList={shoppingList}
            onUpdateShoppingList={onUpdateShoppingList}
            groceryCatalog={groceryCatalog}
            onUpdateGroceryCatalog={onUpdateGroceryCatalog}
            onAddExpense={onAddDirectExpense}
            cashBalances={cashBalances}
            onOpenReceiptScanner={onOpenScanner}
          />
        )}
      </div>
    </div>
  );
};
