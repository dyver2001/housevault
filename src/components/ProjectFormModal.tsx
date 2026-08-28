import React, { useState } from 'react';
import { FreelanceProject, HouseholdProfile, ProjectCategory, ProjectStatus } from '../types';

interface ProjectFormModalProps {
  initialData?: FreelanceProject | null;
  profile: HouseholdProfile;
  onClose: () => void;
  onSave: (project: FreelanceProject) => void;
}

export const ProjectFormModal: React.FC<ProjectFormModalProps> = ({
  initialData,
  profile,
  onClose,
  onSave
}) => {
  const sym = profile.currencySymbol;
  const [form, setForm] = useState<FreelanceProject>(
    initialData || {
      id: `proj-${Date.now()}`,
      clientName: '',
      projectTitle: '',
      category: 'COMMERCIAL',
      totalFee: 3000,
      depositReceived: 1000,
      invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      dueDate: 'In 2 Weeks',
      status: 'IN_PROGRESS',
      clientPhone: '',
      clientEmail: '',
      notes: ''
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.clientName || !form.projectTitle) return;
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-stone-900 border border-stone-700 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[90vh]"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold font-display text-white">
            {initialData ? 'Edit Freelance Gig' : 'Log New Freelance Gig'}
          </h2>
          <button type="button" onClick={onClose} className="text-stone-400 hover:text-white text-sm">
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-stone-300 mb-1">Client / Brand Name</label>
            <input
              type="text"
              value={form.clientName}
              onChange={(e) => setForm({ ...form, clientName: e.target.value })}
              placeholder="e.g. Apex Media Agency, John & Jane Wedding"
              required
              className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-white text-xs focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-stone-300 mb-1">Project Title / Scope</label>
            <input
              type="text"
              value={form.projectTitle}
              onChange={(e) => setForm({ ...form, projectTitle: e.target.value })}
              placeholder="e.g. Commercial 4K Brand Film, 3-Day Conference Recap"
              required
              className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-white text-xs focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as ProjectCategory })}
              className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-white text-xs focus:outline-none"
            >
              <option value="COMMERCIAL">Commercial / Brand</option>
              <option value="EVENT_WEDDING">Wedding / Event</option>
              <option value="CORPORATE">Corporate Keynote</option>
              <option value="MUSIC_VIDEO">Music Video</option>
              <option value="POST_EDITING">Post-Production / Color</option>
              <option value="DRONE_PHOTO">Drone & Aerial</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as ProjectStatus })}
              className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-white text-xs focus:outline-none"
            >
              <option value="IN_PROGRESS">In Progress (Shooting / Editing)</option>
              <option value="INVOICED">Invoiced (Waiting on Payment)</option>
              <option value="OVERDUE">Overdue ⚠️</option>
              <option value="PENDING_DEPOSIT">Pending Deposit</option>
              <option value="COLLECTED">Fully Collected ✅</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">Total Fee ({sym})</label>
            <input
              type="number"
              step="any"
              min="0"
              value={form.totalFee}
              onChange={(e) => setForm({ ...form, totalFee: parseFloat(e.target.value) || 0 })}
              required
              className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-white text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">Deposit Received ({sym})</label>
            <input
              type="number"
              step="any"
              min="0"
              value={form.depositReceived}
              onChange={(e) => setForm({ ...form, depositReceived: parseFloat(e.target.value) || 0 })}
              required
              className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-white text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">Invoice Number</label>
            <input
              type="text"
              value={form.invoiceNumber}
              onChange={(e) => setForm({ ...form, invoiceNumber: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-white text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">Due Date / Terms</label>
            <input
              type="text"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-white text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">Client Phone (WhatsApp)</label>
            <input
              type="text"
              value={form.clientPhone}
              onChange={(e) => setForm({ ...form, clientPhone: e.target.value })}
              placeholder="+1 (555) 000-0000"
              className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-white text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">Client Email</label>
            <input
              type="email"
              value={form.clientEmail}
              onChange={(e) => setForm({ ...form, clientEmail: e.target.value })}
              placeholder="billing@client.com"
              className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-white text-xs focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-stone-300 mb-1">Production Notes</label>
            <textarea
              rows={2}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="e.g. 50% deposit paid, remaining $1,500 due upon final color-graded ProRes delivery."
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
            className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md shadow-amber-500/20"
          >
            Save Project
          </button>
        </div>
      </form>
    </div>
  );
};
