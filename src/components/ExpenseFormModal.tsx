import React, { useState, useMemo } from 'react';
import { HouseholdExpense, ExpenseCategory, ExpensePayer, HouseholdProfile, CashPocketsBalance } from '../types';
import { ShieldAlert, Wallet } from 'lucide-react';

interface ExpenseFormModalProps {
  initialData?: HouseholdExpense | null;
  profile: HouseholdProfile;
  cashBalances: CashPocketsBalance;
  onClose: () => void;
  onSave: (expense: HouseholdExpense) => void;
}

export const ExpenseFormModal: React.FC<ExpenseFormModalProps> = ({
  initialData,
  profile,
  cashBalances,
  onClose,
  onSave
}) => {
  const sym = profile.currencySymbol || 'lei';
  const [form, setForm] = useState<HouseholdExpense>(
    initialData || {
      id: `exp-${Date.now()}`,
      title: '',
      amount: 150,
      category: 'GROCERIES',
      isFixed: true,
      assignedPayer: 'WIFE_SALARY'
    }
  );

  const selectedBalance = useMemo(() => {
    switch (form.assignedPayer) {
      case 'WIFE_SALARY':
        return cashBalances.wifeSalaryBalance;
      case 'WIFE_MEAL_TICKETS':
        return cashBalances.wifeMealTicketsBalance;
      case 'FREELANCE_BUFFER':
        return cashBalances.freelanceBufferBalance;
      case 'SHARED_POOL':
        return cashBalances.sharedPoolBalance;
      default:
        return 0;
    }
  }, [form.assignedPayer, cashBalances]);

  const isBrokeOrInsufficient = selectedBalance <= 0 || selectedBalance < form.amount;
  const remainingAfterBill = selectedBalance - form.amount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || form.amount <= 0 || isBrokeOrInsufficient) return;
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-sm flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-stone-900 border border-stone-700 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[90vh]"
      >
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <h2 className="text-base font-bold font-display text-white">
            {initialData ? 'Editează Cheltuială / Factură' : 'Adaugă Cheltuială / Factură'}
          </h2>
          <button type="button" onClick={onClose} className="text-stone-400 hover:text-white text-sm cursor-pointer">
            ✕
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">Nume Factură / Cheltuială</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="ex: Chirie, Supermarket Lidl, Curent, Adobe CC"
              required
              className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-white text-xs focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">Sumă ({sym})</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })}
                required
                className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-white font-mono font-bold text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">Categorie</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as ExpenseCategory })}
                className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-white text-xs focus:outline-none"
              >
                <option value="HOUSING">Locuință & Chirie</option>
                <option value="GROCERIES">Alimente & Supermarket</option>
                <option value="UTILITIES">Utilități (Curent/Apă/Gaz)</option>
                <option value="INTERNET_PHONE">Internet & Telefoane</option>
                <option value="HEALTH">Sănătate & Asigurări</option>
                <option value="TRANSPORT">Transport & Combustibil</option>
                <option value="VIDEO_SOFTWARE">Echipament & Soft Video</option>
                <option value="FAMILY_LEISURE">Timp Liber & Ieșiri</option>
                <option value="MISC">Diverse</option>
              </select>
            </div>
          </div>

          {/* Assigned Income Source with Live Balances */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">Sursă de Plată (Din ce bani se scade?)</label>
            <select
              value={form.assignedPayer}
              onChange={(e) => setForm({ ...form, assignedPayer: e.target.value as ExpensePayer })}
              className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-white text-xs focus:outline-none"
            >
              <option value="WIFE_SALARY">
                💳 Salariu {profile.wifeName.split(' ')[0]} (Disponibil: {cashBalances.wifeSalaryBalance.toFixed(2)} {sym})
              </option>
              <option value="WIFE_MEAL_TICKETS">
                🥗 Card Bonuri de Masă {profile.wifeName.split(' ')[0]} (Edenred/Pluxee) (Disponibil: {cashBalances.wifeMealTicketsBalance.toFixed(2)} {sym})
              </option>
              <option value="FREELANCE_BUFFER">
                💼 Buffer Freelance {profile.husbandName.split(' ')[0]} (Disponibil: {cashBalances.freelanceBufferBalance.toFixed(2)} {sym})
              </option>
              <option value="SHARED_POOL">
                🏡 Fond Comun Familie (Disponibil: {cashBalances.sharedPoolBalance.toFixed(2)} {sym})
              </option>
            </select>
          </div>

          {/* Cash Reduction Preview Card */}
          <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 text-xs space-y-1">
            <div className="flex justify-between text-stone-400">
              <span>Sold disponibil curent:</span>
              <span className="font-mono font-bold text-white">{selectedBalance.toFixed(2)} {sym}</span>
            </div>
            <div className="flex justify-between text-rose-400">
              <span>Sumă de scăzut:</span>
              <span className="font-mono font-bold">-{form.amount.toFixed(2)} {sym}</span>
            </div>
            <div className="flex justify-between font-bold pt-1 border-t border-stone-800">
              <span className="text-stone-300">Sold rămas:</span>
              <span className={`font-mono ${remainingAfterBill < 0 ? 'text-rose-400 font-black' : 'text-emerald-400'}`}>
                {remainingAfterBill.toFixed(2)} {sym}
              </span>
            </div>
          </div>

          {/* Broke Warning Banner */}
          {isBrokeOrInsufficient && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/50 text-rose-200 text-xs flex items-start gap-2 animate-pulse">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-rose-300">⚠️ FONDURI INSUFICIENTE</strong>
                <span>Soldul disponibil este de {selectedBalance.toFixed(2)} {sym}. Nu poți introduce o factură fără fonduri suficiente!</span>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="isFixedCheckbox"
              checked={form.isFixed}
              onChange={(e) => setForm({ ...form, isFixed: e.target.checked })}
              className="w-4 h-4 rounded text-emerald-500 bg-stone-800 border-stone-700 focus:ring-emerald-500"
            />
            <label htmlFor="isFixedCheckbox" className="text-xs text-stone-300">
              Cheltuială fixă lunară (Recurentă în fiecare lună)
            </label>
          </div>
        </div>

        <div className="flex space-x-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-stone-800 text-stone-300 font-semibold text-xs hover:bg-stone-750 cursor-pointer"
          >
            Anulează
          </button>
          <button
            type="submit"
            disabled={isBrokeOrInsufficient || form.amount <= 0}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs shadow-md transition cursor-pointer ${
              isBrokeOrInsufficient || form.amount <= 0
                ? 'bg-stone-800 text-stone-500 border border-stone-700 cursor-not-allowed opacity-60'
                : 'bg-emerald-500 hover:bg-emerald-400 text-stone-950 shadow-emerald-500/20 active:scale-98'
            }`}
          >
            {isBrokeOrInsufficient ? 'Sold 0 — Blocat' : 'Salvează & Scade din Sold'}
          </button>
        </div>
      </form>
    </div>
  );
};

