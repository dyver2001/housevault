import React, { useState } from 'react';
import { HouseholdExpense, ExpenseCategory, ExpensePayer, HouseholdProfile } from '../types';

interface ExpenseFormModalProps {
  initialData?: HouseholdExpense | null;
  profile: HouseholdProfile;
  onClose: () => void;
  onSave: (expense: HouseholdExpense) => void;
}

export const ExpenseFormModal: React.FC<ExpenseFormModalProps> = ({
  initialData,
  profile,
  onClose,
  onSave
}) => {
  const sym = profile.currencySymbol;
  const [form, setForm] = useState<HouseholdExpense>(
    initialData || {
      id: `exp-${Date.now()}`,
      title: '',
      amount: 250,
      category: 'GROCERIES',
      isFixed: true,
      assignedPayer: 'WIFE_SALARY'
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) return;
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
            {initialData ? 'Edit Household Bill' : 'Add Household Bill'}
          </h2>
          <button type="button" onClick={onClose} className="text-stone-400 hover:text-white text-sm">
            ✕
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">Expense / Bill Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Rent, Groceries, Electricity, Adobe CC"
              required
              className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-white text-xs focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">Monthly Amount ({sym})</label>
              <input
                type="number"
                step="any"
                min="1"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })}
                required
                className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-white text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as ExpenseCategory })}
                className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-white text-xs focus:outline-none"
              >
                <option value="HOUSING">Housing / Rent</option>
                <option value="GROCERIES">Groceries & Food</option>
                <option value="UTILITIES">Utilities (Power/Water)</option>
                <option value="INTERNET_PHONE">Internet & Mobiles</option>
                <option value="HEALTH">Health & Insurance</option>
                <option value="TRANSPORT">Transport & Fuel</option>
                <option value="VIDEO_SOFTWARE">Video Software / Gear</option>
                <option value="FAMILY_LEISURE">Family Dining & Fun</option>
                <option value="MISC">Misc / Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">Assigned Income Source</label>
            <select
              value={form.assignedPayer}
              onChange={(e) => setForm({ ...form, assignedPayer: e.target.value as ExpensePayer })}
              className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-white text-xs focus:outline-none"
            >
              <option value="WIFE_SALARY">{profile.wifeName.split(' ')[0]}'s IT Salary (Fixed Base)</option>
              <option value="FREELANCE_BUFFER">Alex's Freelance Buffer</option>
              <option value="SHARED_POOL">Shared Family Account</option>
            </select>
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="isFixedCheckbox"
              checked={form.isFixed}
              onChange={(e) => setForm({ ...form, isFixed: e.target.checked })}
              className="w-4 h-4 rounded text-emerald-500 bg-stone-800 border-stone-700 focus:ring-emerald-500"
            />
            <label htmlFor="isFixedCheckbox" className="text-xs text-stone-300">
              Fixed essential cost (Must be paid every month)
            </label>
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
            className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs shadow-md shadow-emerald-500/20"
          >
            Save Bill
          </button>
        </div>
      </form>
    </div>
  );
};
