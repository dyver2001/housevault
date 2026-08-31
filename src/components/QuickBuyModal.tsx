import React, { useState } from 'react';
import { ShoppingBag, Zap, Cigarette, Coffee, Utensils, Fuel, Sparkles, Check, ArrowRight } from 'lucide-react';
import { HouseholdProfile, CashPocketsBalance, ExpensePayer, HouseholdExpense } from '../types';
import { soundFx } from '../utils/audioEffects';

interface QuickBuyModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: HouseholdProfile;
  cashBalances: CashPocketsBalance;
  onConfirmPurchase: (expense: Omit<HouseholdExpense, 'id'>) => void;
}

interface QuickPreset {
  label: string;
  name: string;
  amount: number;
  icon: any;
  defaultPayer: ExpensePayer;
  category: any;
}

export const QuickBuyModal: React.FC<QuickBuyModalProps> = ({
  isOpen,
  onClose,
  profile,
  cashBalances,
  onConfirmPurchase
}) => {
  if (!isOpen) return null;

  const sym = profile?.currencySymbol || 'lei';
  const husbandShort = (profile?.husbandName || 'Haytham').split(' ')[0];
  const wifeShort = (profile?.wifeName || 'Cati').split(' ')[0];

  const presets: QuickPreset[] = [
    { label: 'Țigări (25 lei)', name: 'Țigări', amount: 25, icon: Cigarette, defaultPayer: 'FREELANCE_BUFFER', category: 'FAMILY_LEISURE' },
    { label: 'Hell / Suc (7 lei)', name: 'Hell Energy / Suc', amount: 7, icon: Zap, defaultPayer: 'FREELANCE_BUFFER', category: 'GROCERIES' },
    { label: 'Cafea (12 lei)', name: 'Cafea', amount: 12, icon: Coffee, defaultPayer: 'FREELANCE_BUFFER', category: 'FAMILY_LEISURE' },
    { label: 'Sandwich / Prânz (35 lei)', name: 'Mâncare / Prânz rapid', amount: 35, icon: Utensils, defaultPayer: 'WIFE_MEAL_TICKETS', category: 'GROCERIES' },
    { label: 'Benzină (50 lei)', name: 'Alimentare Benzină', amount: 50, icon: Fuel, defaultPayer: 'FREELANCE_BUFFER', category: 'TRANSPORT' },
    { label: 'Mini-Market (40 lei)', name: 'Mini-Cumpărături', amount: 40, icon: ShoppingBag, defaultPayer: 'WIFE_SALARY', category: 'GROCERIES' }
  ];

  const [itemName, setItemName] = useState<string>('Țigări');
  const [itemAmount, setItemAmount] = useState<number>(25);
  const [selectedPayer, setSelectedPayer] = useState<ExpensePayer>('FREELANCE_BUFFER');
  const [category, setCategory] = useState<any>('FAMILY_LEISURE');

  const handleSelectPreset = (p: QuickPreset) => {
    setItemName(p.name);
    setItemAmount(p.amount);
    setSelectedPayer(p.defaultPayer);
    setCategory(p.category);
    soundFx.playTap();
  };

  const getAvailableBalance = (payer: ExpensePayer) => {
    switch (payer) {
      case 'FREELANCE_BUFFER':
        return cashBalances.freelanceBufferBalance || 0;
      case 'WIFE_SALARY':
        return cashBalances.wifeSalaryBalance || 0;
      case 'WIFE_MEAL_TICKETS':
        return cashBalances.wifeMealTicketsBalance || 0;
      case 'SHARED_POOL':
        return cashBalances.sharedPoolBalance || 0;
      default:
        return 0;
    }
  };

  const currentBal = getAvailableBalance(selectedPayer);
  const remainingAfter = currentBal - itemAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim() || itemAmount <= 0) return;

    soundFx.playCashChime();
    onConfirmPurchase({
      title: itemName.trim(),
      amount: Number(itemAmount),
      category: category,
      isFixed: false,
      assignedPayer: selectedPayer
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-gradient-to-br from-stone-900 via-stone-850 to-stone-900 border border-amber-500/30 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl overflow-y-auto max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-3.5">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-stone-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/20">
              <Zap className="w-5 h-5 fill-stone-950" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black font-display text-white">
                ⚡ Cumpără Rapid / Direct Buy
              </h2>
              <p className="text-stone-400 text-xs">
                Înregistrează plăți personale mărunte (Hell, Țigări, Cafea) cu scădere directă din cont.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 text-stone-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Fast 1-Tap Presets */}
        <div>
          <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
            Alege Rapid (1-Tap):
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {presets.map((p, idx) => {
              const Icon = p.icon;
              const isSelected = itemName === p.name && itemAmount === p.amount;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(p)}
                  className={`p-2.5 rounded-2xl border text-left flex items-center space-x-2 transition cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-500 text-white shadow-md'
                      : 'bg-stone-800/80 border-stone-700/60 text-stone-300 hover:border-stone-500 hover:bg-stone-800'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${isSelected ? 'bg-amber-500 text-stone-950' : 'bg-stone-700 text-amber-400'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-xs font-bold block truncate">{p.name}</span>
                    <span className="text-[10px] font-mono text-amber-300">{p.amount} {sym}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Custom Name & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Ce ai cumpărat?
              </label>
              <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="ex: Hell Energy, Țigări, Prânz, Cafea"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-white text-xs font-bold focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Cât a costat ({sym})?
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={itemAmount}
                onChange={(e) => setItemAmount(parseFloat(e.target.value) || 0)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-white font-mono font-black text-xs focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Account / Pocket Choice Selector */}
          <div>
            <label className="block text-xs font-bold text-stone-300 mb-1.5 flex items-center justify-between">
              <span>Din ce cont ai plătit banii?</span>
              <span className="text-[10px] text-amber-400 font-normal">Se va scădea automat</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {/* Option 1: Haytham Freelance Buffer */}
              <button
                type="button"
                onClick={() => setSelectedPayer('FREELANCE_BUFFER')}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  selectedPayer === 'FREELANCE_BUFFER'
                    ? 'bg-amber-500/15 border-amber-500 text-white shadow-md'
                    : 'bg-stone-800/80 border-stone-700/60 text-stone-300 hover:border-stone-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold flex items-center gap-1.5">
                    <span>💼 Buffer Freelance</span>
                  </span>
                  {selectedPayer === 'FREELANCE_BUFFER' && <Check className="w-4 h-4 text-amber-400" />}
                </div>
                <div className="mt-1 text-[11px] text-stone-400 flex items-center justify-between">
                  <span>Sold:</span>
                  <span className="font-mono font-bold text-amber-300">
                    {cashBalances.freelanceBufferBalance.toFixed(2)} {sym}
                  </span>
                </div>
              </button>

              {/* Option 2: Cati Salary */}
              <button
                type="button"
                onClick={() => setSelectedPayer('WIFE_SALARY')}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  selectedPayer === 'WIFE_SALARY'
                    ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-md'
                    : 'bg-stone-800/80 border-stone-700/60 text-stone-300 hover:border-stone-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold flex items-center gap-1.5">
                    <span>💳 Salariu {wifeShort}</span>
                  </span>
                  {selectedPayer === 'WIFE_SALARY' && <Check className="w-4 h-4 text-emerald-400" />}
                </div>
                <div className="mt-1 text-[11px] text-stone-400 flex items-center justify-between">
                  <span>Sold:</span>
                  <span className="font-mono font-bold text-emerald-300">
                    {cashBalances.wifeSalaryBalance.toFixed(2)} {sym}
                  </span>
                </div>
              </button>

              {/* Option 3: Meal Tickets */}
              <button
                type="button"
                onClick={() => setSelectedPayer('WIFE_MEAL_TICKETS')}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  selectedPayer === 'WIFE_MEAL_TICKETS'
                    ? 'bg-lime-500/15 border-lime-500 text-white shadow-md'
                    : 'bg-stone-800/80 border-stone-700/60 text-stone-300 hover:border-stone-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold flex items-center gap-1.5">
                    <span>🥗 Bonuri Masă (Edenred)</span>
                  </span>
                  {selectedPayer === 'WIFE_MEAL_TICKETS' && <Check className="w-4 h-4 text-lime-400" />}
                </div>
                <div className="mt-1 text-[11px] text-stone-400 flex items-center justify-between">
                  <span>Sold:</span>
                  <span className="font-mono font-bold text-lime-300">
                    {cashBalances.wifeMealTicketsBalance.toFixed(2)} {sym}
                  </span>
                </div>
              </button>

              {/* Option 4: Joint Pool */}
              <button
                type="button"
                onClick={() => setSelectedPayer('SHARED_POOL')}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  selectedPayer === 'SHARED_POOL'
                    ? 'bg-cyan-500/15 border-cyan-500 text-white shadow-md'
                    : 'bg-stone-800/80 border-stone-700/60 text-stone-300 hover:border-stone-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold flex items-center gap-1.5">
                    <span>🏡 Fond Comun Familie</span>
                  </span>
                  {selectedPayer === 'SHARED_POOL' && <Check className="w-4 h-4 text-cyan-400" />}
                </div>
                <div className="mt-1 text-[11px] text-stone-400 flex items-center justify-between">
                  <span>Sold:</span>
                  <span className="font-mono font-bold text-cyan-300">
                    {cashBalances.sharedPoolBalance.toFixed(2)} {sym}
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Cash Reduction Preview */}
          <div className="p-3.5 bg-stone-950 rounded-2xl border border-stone-800 text-xs space-y-1.5">
            <div className="flex justify-between text-stone-400">
              <span>Sold disponibil înainte:</span>
              <span className="font-mono font-bold text-white">{currentBal.toFixed(2)} {sym}</span>
            </div>
            <div className="flex justify-between text-rose-400 font-bold">
              <span>Cumpărătură:</span>
              <span className="font-mono">-{Number(itemAmount || 0).toFixed(2)} {sym}</span>
            </div>
            <div className="flex justify-between font-bold pt-1.5 border-t border-stone-800">
              <span className="text-stone-300">Sold nou rămas:</span>
              <span className={`font-mono text-sm ${remainingAfter < 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {remainingAfter.toFixed(2)} {sym}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl bg-stone-800 hover:bg-stone-750 text-stone-300 font-bold text-xs cursor-pointer"
            >
              Anulează
            </button>
            <button
              type="submit"
              disabled={!itemName.trim() || itemAmount <= 0}
              className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-black text-xs shadow-lg shadow-amber-500/20 active:scale-98 transition-all cursor-pointer flex items-center justify-center space-x-1.5"
            >
              <Zap className="w-4 h-4 fill-stone-950" />
              <span>⚡ Plătește & Scade Banii</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
