import React, { useState } from 'react';
import { FileText, Copy, Check, Printer, Share2, Sparkles, TrendingUp, ShieldCheck, Landmark, X } from 'lucide-react';
import { HouseholdProfile, FreelanceProject, BankDebt, SavingsTarget, HouseholdExpense } from '../types';

interface MonthlyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: HouseholdProfile;
  projects: FreelanceProject[];
  debts: BankDebt[];
  targets: SavingsTarget[];
  expenses: HouseholdExpense[];
  currencySymbol?: string;
  lang?: string;
}

export const MonthlyReportModal: React.FC<MonthlyReportModalProps> = ({
  isOpen,
  onClose,
  profile,
  projects,
  debts,
  targets,
  expenses,
  currencySymbol = 'lei',
  lang = 'ro'
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentMonthName = new Date().toLocaleDateString(lang === 'ro' ? 'ro-RO' : 'en-US', { month: 'long', year: 'numeric' });

  // Compute metrics
  const totalCollectedFreelance = projects
    .filter((p) => p.status === 'COLLECTED' || p.depositReceived > 0)
    .reduce((sum, p) => sum + (p.depositReceived || 0), 0);

  const totalMonthlyIncome = totalCollectedFreelance + (profile.wifeMonthlySalary || 0);

  const totalFixedExpenses = expenses
    .filter((e) => e.isFixed)
    .reduce((sum, e) => sum + (e.amount || 0), 0);

  const totalDebtRemaining = debts.reduce((sum, d) => sum + (d.currentBalance || 0), 0);
  const totalSavedInTargets = targets.reduce((sum, t) => sum + (t.currentSavedAmount || 0), 0);

  const houseTarget = targets.find((t) => t.title.toLowerCase().includes('cas') || t.title.toLowerCase().includes('house')) || targets[0];
  const houseSaved = houseTarget ? houseTarget.currentSavedAmount : 0;
  const houseGoal = houseTarget ? houseTarget.targetAmount : 150000;
  const housePercent = Math.min(100, Math.round((houseSaved / (houseGoal || 1)) * 100));

  const runwayMonths = totalFixedExpenses > 0 ? (totalSavedInTargets / totalFixedExpenses).toFixed(1) : '12+';

  const generateWhatsAppMessage = () => {
    return `🏡 *RAPORTUL SEIFULUI NOSTRU • ${currentMonthName.toUpperCase()}* 👫✨
━━━━━━━━━━━━━━━━━━━━
💰 *Venituri Totale Luna Aceasta:* ${totalMonthlyIncome.toLocaleString()} ${currencySymbol}
  🎬 *Haytham (Încasări Video):* ${totalCollectedFreelance.toLocaleString()} ${currencySymbol}
  💻 *Cati (Salariu IT Fix):* ${(profile.wifeMonthlySalary || 0).toLocaleString()} ${currencySymbol}

🏠 *Cheltuieli Fixe Acoperite:* ${totalFixedExpenses.toLocaleString()} ${currencySymbol} / lună
🛡️ *Luni de Siguranță Financiară (Runway):* ${runwayMonths} Luni

🏦 *Datorii Rămase:* ${totalDebtRemaining.toLocaleString()} ${currencySymbol} (În scădere constantă! 📉)
🏡 *Avans Casă de Vis:* ${houseSaved.toLocaleString()} / ${houseGoal.toLocaleString()} ${currencySymbol} (${housePercent}% Gata 🔑)

🎉 *Mândru de noi doi! Continuăm să construim viitorul nostru pas cu pas!* ❤️🚀
━━━━━━━━━━━━━━━━━━━━
_Generat cu HouseVault App_`;
  };

  const handleCopyWhatsApp = () => {
    navigator.clipboard.writeText(generateWhatsAppMessage());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-stone-900 border border-stone-700 rounded-3xl max-w-xl w-full p-6 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh] print:m-0 print:p-0 print:border-none print:shadow-none print:bg-white print:text-black">
        {/* Header */}
        <div className="flex items-center justify-between print:hidden">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black font-display text-white">
                {lang === 'ro' ? 'Raportul Lunar al Seifului' : 'Monthly State of the Vault'}
              </h2>
              <p className="text-xs text-stone-400">{currentMonthName}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-white p-1 text-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Infographic Report Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-stone-850 to-stone-900 border border-stone-750 space-y-4 shadow-inner">
          <div className="text-center pb-3 border-b border-stone-800">
            <h3 className="text-base font-black text-white uppercase tracking-wider font-display">
              {lang === 'ro' ? 'Situația Financiară în Cuplu' : 'Couple Financial Statement'}
            </h3>
            <p className="text-xs text-emerald-400 font-bold mt-0.5">
              {profile.husbandName} & {profile.wifeName} • {currentMonthName}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-stone-900/80 border border-stone-800">
              <span className="text-[11px] text-stone-400 block">{lang === 'ro' ? 'Venit Total Cuplu' : 'Total Couple Income'}</span>
              <span className="text-base font-black text-emerald-400 font-mono">
                {totalMonthlyIncome.toLocaleString()} {currencySymbol}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-stone-900/80 border border-stone-800">
              <span className="text-[11px] text-stone-400 block">{lang === 'ro' ? 'Siguranță (Runway)' : 'Financial Runway'}</span>
              <span className="text-base font-black text-amber-400 font-mono">
                {runwayMonths} {lang === 'ro' ? 'Luni' : 'Months'}
              </span>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-stone-800/60">
              <span className="text-stone-400">🎬 {lang === 'ro' ? 'Încasări Haytham (Freelance)' : 'Haytham Video Inflows'}:</span>
              <span className="font-bold text-white font-mono">{totalCollectedFreelance.toLocaleString()} {currencySymbol}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-stone-800/60">
              <span className="text-stone-400">💻 {lang === 'ro' ? 'Salariu Cati (IT Fix)' : 'Cati IT Salary'}:</span>
              <span className="font-bold text-white font-mono">{(profile.wifeMonthlySalary || 0).toLocaleString()} {currencySymbol}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-stone-800/60">
              <span className="text-stone-400">🏠 {lang === 'ro' ? 'Cheltuieli Fixe Supraviețuire' : 'Fixed Monthly Bills'}:</span>
              <span className="font-bold text-rose-300 font-mono">{totalFixedExpenses.toLocaleString()} {currencySymbol}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-stone-800/60">
              <span className="text-stone-400">🏦 {lang === 'ro' ? 'Sold Datorii Rămase' : 'Remaining Bank Debt'}:</span>
              <span className="font-bold text-purple-300 font-mono">{totalDebtRemaining.toLocaleString()} {currencySymbol}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-stone-400">🔑 {lang === 'ro' ? 'Progres Avans Casă' : 'House Down Payment'}:</span>
              <span className="font-bold text-emerald-400 font-mono">{houseSaved.toLocaleString()} {currencySymbol} ({housePercent}%)</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 print:hidden">
          <button
            type="button"
            onClick={handleCopyWhatsApp}
            className="py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs shadow-lg transition cursor-pointer flex items-center justify-center space-x-2"
          >
            {copied ? <Check className="w-4 h-4 text-stone-950" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? (lang === 'ro' ? 'Copiat pe WhatsApp!' : 'Copied!') : (lang === 'ro' ? 'Copiază Text WhatsApp' : 'Copy for WhatsApp')}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="py-2.5 px-4 rounded-xl bg-stone-800 hover:bg-stone-750 text-white font-bold text-xs border border-stone-700 transition cursor-pointer flex items-center justify-center space-x-2"
          >
            <Printer className="w-4 h-4 text-stone-300" />
            <span>{lang === 'ro' ? 'Exportă PDF / Printează' : 'Print / Export PDF'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
