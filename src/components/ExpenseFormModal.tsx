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

  const initialCredit = initialData && initialData.assignedPayer === form.assignedPayer ? Number(initialData.amount || 0) : 0;
  const currentAvailable = (Number(selectedBalance) || 0) + initialCredit;
  const remainingAfterBill = currentAvailable - (Number(form.amount) || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || Number(form.amount) <= 0) return;
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
            <label className="block text-xs font-semibold text-stone-300 mb-1">Sursă de Plată (Cine plătește?)</label>
            <select
              value={form.assignedPayer}
              onChange={(e) => setForm({ ...form, assignedPayer: e.target.value as ExpensePayer })}
              className="w-full px-3 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-white text-xs font-semibold focus:outline-none focus:border-emerald-500"
            >
              <option value="DECIDE_LATER">
                🤔 Se decide la plată (Haytham sau Cati în funcție de proiecte)
              </option>
              <option value="WIFE_SALARY">
                💳 Salariu {profile.wifeName.split(' ')[0]} ({profile.wifeMonthlySalary.toLocaleString()} {sym}/lună)
              </option>
              <option value="WIFE_MEAL_TICKETS">
                🥗 Card Bonuri de Masă {profile.wifeName.split(' ')[0]} ({(profile.wifeMealTicketsMonthly ?? 800).toLocaleString()} {sym}/lună)
              </option>
              <option value="FREELANCE_BUFFER">
                💼 Buffer Freelance {profile.husbandName.split(' ')[0]} (din onorarii video)
              </option>
              <option value="SHARED_POOL">
                🏡 Fond Comun Familie
              </option>
            </select>
          </div>

          {/* Cash Reduction Preview Card */}
          {form.assignedPayer === 'DECIDE_LATER' ? (
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs space-y-1 text-amber-200">
              <span className="font-bold block">✨ Plată Flexibilă:</span>
              <p className="text-[11px] leading-relaxed text-amber-300/90">
                Această factură este salvată în buget, dar nu blochează niciun ban din cont acum. Când vine scadența sau când Haytham încasează un proiect nou, decideți pe loc cine o achită.
              </p>
            </div>
          ) : (
            <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 text-xs space-y-1">
              <div className="flex justify-between text-stone-400">
                <span>Disponibil în cont:</span>
                <span className="font-mono font-bold text-white">{currentAvailable.toFixed(2)} {sym}</span>
              </div>
              <div className="flex justify-between text-rose-400">
                <span>Valoare factură:</span>
                <span className="font-mono font-bold">-{Number(form.amount || 0).toFixed(2)} {sym}</span>
              </div>
              <div className="flex justify-between font-bold pt-1 border-t border-stone-800">
                <span className="text-stone-300">Sold estimat după plată:</span>
                <span className={`font-mono ${remainingAfterBill < 0 ? 'text-amber-400 font-bold' : 'text-emerald-400'}`}>
                  {remainingAfterBill.toFixed(2)} {sym}
                </span>
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
            disabled={!form.title.trim() || Number(form.amount) <= 0}
            className="flex-1 py-2.5 rounded-xl font-bold text-xs shadow-md transition cursor-pointer bg-emerald-500 hover:bg-emerald-400 text-stone-950 shadow-emerald-500/20 active:scale-98"
          >
            Salvează Cheltuiala
          </button>
        </div>
      </form>
    </div>
  );
};

