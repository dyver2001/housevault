import React, { useState } from 'react';
import { BankDebt, DebtType, HouseholdProfile } from '../types';

interface DebtFormModalProps {
  initialData?: BankDebt | null;
  profile: HouseholdProfile;
  onClose: () => void;
  onSave: (debt: BankDebt) => void;
}

export const DebtFormModal: React.FC<DebtFormModalProps> = ({
  initialData,
  profile,
  onClose,
  onSave
}) => {
  const sym = profile.currencySymbol;
  const [form, setForm] = useState<BankDebt>(
    initialData || {
      id: `debt-${Date.now()}`,
      bankName: '',
      debtType: 'CREDIT_CARD',
      currentBalance: 3000,
      originalBalance: 4500,
      interestRateApr: 19.9,
      minMonthlyPayment: 100,
      targetMonthlyPayment: 400,
      dueDayOfMonth: 15,
      notes: ''
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.bankName) return;
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-stone-900 border border-stone-700 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[90vh]"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold font-display text-white">
            {initialData ? 'Edit Bank Debt' : 'Add New Bank Debt'}
          </h2>
          <button type="button" onClick={onClose} className="text-stone-400 hover:text-white text-sm">
            ✕
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">Bank / Issuer Name</label>
            <input
              type="text"
              value={form.bankName}
              onChange={(e) => setForm({ ...form, bankName: e.target.value })}
              placeholder="e.g. Chase Freedom Card, Equipment Loan"
              required
              className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-white text-xs focus:border-rose-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">Debt Type</label>
              <select
                value={form.debtType}
                onChange={(e) => setForm({ ...form, debtType: e.target.value as DebtType })}
                className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-white text-xs focus:outline-none"
              >
                <option value="CREDIT_CARD">Credit Card</option>
                <option value="PERSONAL_LOAN">Personal Loan</option>
                <option value="EQUIPMENT_LOAN">Equipment Loan</option>
                <option value="OVERDRAFT">Overdraft</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">Annual APR %</label>
              <input
                type="number"
                step="any"
                min="0"
                value={form.interestRateApr}
                onChange={(e) => setForm({ ...form, interestRateApr: parseFloat(e.target.value) || 0 })}
                required
                className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-white text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">Current Balance ({sym})</label>
              <input
                type="number"
                step="any"
                min="0"
                value={form.currentBalance}
                onChange={(e) => setForm({ ...form, currentBalance: parseFloat(e.target.value) || 0 })}
                required
                className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-white text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">Original Balance ({sym})</label>
              <input
                type="number"
                step="any"
                min="0"
                value={form.originalBalance}
                onChange={(e) => setForm({ ...form, originalBalance: parseFloat(e.target.value) || 0 })}
                required
                className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-white text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">Min Monthly ({sym})</label>
              <input
                type="number"
                step="any"
                min="0"
                value={form.minMonthlyPayment}
                onChange={(e) => setForm({ ...form, minMonthlyPayment: parseFloat(e.target.value) || 0 })}
                required
                className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-white text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">Target Monthly ({sym})</label>
              <input
                type="number"
                step="any"
                min="0"
                value={form.targetMonthlyPayment}
                onChange={(e) => setForm({ ...form, targetMonthlyPayment: parseFloat(e.target.value) || 0 })}
                required
                className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-white text-xs focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">Due Day of Month</label>
            <input
              type="number"
              min="1"
              max="31"
              value={form.dueDayOfMonth}
              onChange={(e) => setForm({ ...form, dueDayOfMonth: parseInt(e.target.value, 10) || 1 })}
              className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-white text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">Notes / Terms</label>
            <textarea
              rows={2}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="e.g. 0% promo expires in October, pay off before then!"
              className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-white text-xs focus:outline-none"
            />
          </div>
        </div>

        <div className="flex space-x-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-stone-800 text-stone-300 font-semibold text-xs hover:bg-stone-750"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-stone-950 font-bold text-xs shadow-md shadow-rose-500/20"
          >
            Save Debt
          </button>
        </div>
      </form>
    </div>
  );
};
