import React, { useState } from 'react';
import { SavingsTarget, TargetPriority, HouseholdProfile } from '../types';

interface TargetFormModalProps {
  initialData?: SavingsTarget | null;
  profile: HouseholdProfile;
  onClose: () => void;
  onSave: (target: SavingsTarget) => void;
}

export const TargetFormModal: React.FC<TargetFormModalProps> = ({
  initialData,
  profile,
  onClose,
  onSave
}) => {
  const sym = profile.currencySymbol;
  const [form, setForm] = useState<SavingsTarget>(
    initialData || {
      id: `target-${Date.now()}`,
      title: '',
      targetAmount: 10000,
      currentSavedAmount: 2000,
      priority: 'CRITICAL',
      category: 'Family Home',
      deadline: 'Dec 2027',
      iconName: 'home'
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
            {initialData ? 'Edit Savings Vault' : 'New Savings Vault'}
          </h2>
          <button type="button" onClick={onClose} className="text-stone-400 hover:text-white text-sm">
            ✕
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">Vault Goal Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. House Downpayment, 6-Month Emergency Buffer"
              required
              className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-white text-xs focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">Target Goal ({sym})</label>
              <input
                type="number"
                step="any"
                min="1"
                value={form.targetAmount}
                onChange={(e) => setForm({ ...form, targetAmount: parseFloat(e.target.value) || 0 })}
                required
                className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-white text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">Currently Saved ({sym})</label>
              <input
                type="number"
                step="any"
                min="0"
                value={form.currentSavedAmount}
                onChange={(e) => setForm({ ...form, currentSavedAmount: parseFloat(e.target.value) || 0 })}
                required
                className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-white text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">Priority</label>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value as TargetPriority })}
                className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-white text-xs focus:outline-none"
              >
                <option value="CRITICAL">Critical / Must-Have</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="FLEXIBLE">Flexible Wish</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">Icon Symbol</label>
              <select
                value={form.iconName}
                onChange={(e) => setForm({ ...form, iconName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-white text-xs focus:outline-none"
              >
                <option value="home">🏠 House</option>
                <option value="shield">🛡️ Emergency Buffer</option>
                <option value="camera">📷 Freelance Gear</option>
                <option value="airplane">✈️ Family Vacation</option>
                <option value="vault">🔒 General Vault</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">Category</label>
              <input
                type="text"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="e.g. Real Estate, Family"
                className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-white text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">Target Deadline</label>
              <input
                type="text"
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                placeholder="e.g. Dec 2027"
                className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-white text-xs focus:outline-none"
              />
            </div>
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
            className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-stone-950 font-bold text-xs shadow-md shadow-cyan-500/20"
          >
            Save Vault
          </button>
        </div>
      </form>
    </div>
  );
};
