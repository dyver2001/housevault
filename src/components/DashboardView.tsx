import React from 'react';
import {
  Coins,
  Receipt,
  Landmark,
  Vault,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Zap,
  DollarSign,
  Plus
} from 'lucide-react';
import {
  HouseholdProfile,
  FreelanceProject,
  BankDebt,
  SavingsTarget,
  HouseholdExpense,
  WindfallSplitRule
} from '../types';
import { TabType } from './Navbar';

interface DashboardViewProps {
  profile: HouseholdProfile;
  projects: FreelanceProject[];
  debts: BankDebt[];
  targets: SavingsTarget[];
  expenses: HouseholdExpense[];
  splitRule: WindfallSplitRule;
  syncCode?: string | null;
  onNavigate: (tab: TabType) => void;
  onOpenCollectModal: (project: FreelanceProject) => void;
  onOpenNewProject: () => void;
  onOpenNewExpense: () => void;
  onOpenSettings?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  projects,
  debts,
  targets,
  expenses,
  splitRule,
  syncCode,
  onNavigate,
  onOpenCollectModal,
  onOpenNewProject,
  onOpenSettings
}) => {
  const sym = profile.currencySymbol;

  // Uncollected freelance
  const uncollectedProjects = projects.filter(
    (p) => p.status !== 'COLLECTED' && (p.totalFee - p.depositReceived) > 0
  );
  const totalUncollected = uncollectedProjects.reduce(
    (acc, p) => acc + (p.totalFee - p.depositReceived),
    0
  );

  // Debts
  const totalDebt = debts.reduce((acc, d) => acc + d.currentBalance, 0);
  const originalDebt = debts.reduce((acc, d) => acc + d.originalBalance, 0);
  const totalDebtPaid = Math.max(0, originalDebt - totalDebt);
  const debtProgressPercent =
    originalDebt > 0 ? Math.min(100, Math.round((totalDebtPaid / originalDebt) * 100)) : 100;

  // Savings Targets
  const totalSaved = targets.reduce((acc, t) => acc + t.currentSavedAmount, 0);
  const totalTargetGoal = targets.reduce((acc, t) => acc + t.targetAmount, 0);
  const savingsProgressPercent =
    totalTargetGoal > 0 ? Math.min(100, Math.round((totalSaved / totalTargetGoal) * 100)) : 0;

  // Expenses & Wife Salary
  const fixedExpenses = expenses
    .filter((e) => e.isFixed)
    .reduce((acc, e) => acc + e.amount, 0);

  const wifeSurplus = Math.max(0, profile.wifeMonthlySalary - fixedExpenses);
  const salaryCoveragePercent =
    fixedExpenses > 0 ? Math.min(150, Math.round((profile.wifeMonthlySalary / fixedExpenses) * 100)) : 100;

  // Quick Windfall preview on $3,000 typical shoot payout
  const sampleGigAmount = totalUncollected > 0 ? totalUncollected : 3000;
  const sampleSplit = {
    debt: (sampleGigAmount * splitRule.debtPayoffPercent) / 100,
    savings: (sampleGigAmount * splitRule.savingsTargetPercent) / 100,
    tax: (sampleGigAmount * splitRule.businessTaxReservePercent) / 100,
    safe: (sampleGigAmount * splitRule.safePocketPercent) / 100
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Dual Income Engine Philosophy */}
      <div className="bg-gradient-to-r from-stone-800 via-stone-850 to-stone-900 border border-stone-700/80 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -top-10 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{profile.language === 'ro' ? 'Motor Financiar de Cuplu' : 'Couple Financial Engine'}</span>
              </div>

              {syncCode ? (
                <div
                  onClick={onOpenSettings}
                  className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold cursor-pointer hover:bg-emerald-500/25 transition shadow-sm"
                  title="Apasă pentru detalii sincronizare"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>🟢 {profile.language === 'ro' ? 'Conectat cu' : 'Synced with'} {profile.wifeName.split(' ')[0]} ({syncCode})</span>
                </div>
              ) : (
                <div
                  onClick={onOpenSettings}
                  className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold cursor-pointer hover:bg-amber-500/25 transition"
                  title="Apasă pentru a sincroniza"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>🔴 {profile.language === 'ro' ? 'Neconectat • Sincronizează' : 'Offline • Pair Vault'}</span>
                </div>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
              {profile.wifeName.split(' ')[0]} Anchors Bills. {profile.husbandName.split(' ')[0]} Accelerates Wealth.
            </h1>
            <p className="text-stone-300 text-sm max-w-2xl leading-relaxed">
              {profile.language === 'ro'
                ? `Salariul fix al lui ${profile.wifeName.split(' ')[0]} garantează cheltuielile lunare (${sym}${fixedExpenses.toLocaleString()}/lună), lăsând 100% din onorariile video ale lui ${profile.husbandName.split(' ')[0]} libere să achite datoriile bancare și să umple seiful pentru casă.`
                : `${profile.wifeName.split(' ')[0]}'s steady salary guarantees fixed survival costs (${sym}${fixedExpenses.toLocaleString()}/mo), leaving 100% of ${profile.husbandName.split(' ')[0]}'s freelance videography windfalls to annihilate bank debt and fill your house savings vault.`}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <button
              id="btn-dash-new-project"
              onClick={onOpenNewProject}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Log Freelance Gig</span>
            </button>
            <button
              id="btn-dash-ai-advisor"
              onClick={() => onNavigate('ai')}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-600 font-medium text-sm transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Ask AI Strategist</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Core Financial Pillar Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Uncollected Freelance Inflow */}
        <div
          onClick={() => onNavigate('freelance')}
          className="bg-stone-850 hover:bg-stone-800/90 border border-stone-700/60 rounded-2xl p-5 shadow-lg transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">Freelance Inflow</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
              <Coins className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight">
              {sym}{totalUncollected.toLocaleString()}
            </div>
            <p className="text-xs text-stone-400 mt-1 flex items-center space-x-1">
              <span className="font-semibold text-amber-300">{uncollectedProjects.length} gigs</span>
              <span>awaiting client payment</span>
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400 group-hover:text-stone-200">
            <span>Collect & split funds</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 2: Household Budget Anchor */}
        <div
          onClick={() => onNavigate('budget')}
          className="bg-stone-850 hover:bg-stone-800/90 border border-stone-700/60 rounded-2xl p-5 shadow-lg transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Steady Salary Anchor</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight">
              {sym}{profile.wifeMonthlySalary.toLocaleString()}
              <span className="text-xs text-stone-400 font-normal">/mo</span>
            </div>
            <p className="text-xs text-stone-400 mt-1 flex items-center space-x-1">
              <span className="text-emerald-400 font-semibold">{salaryCoveragePercent}% coverage</span>
              <span>of {sym}{fixedExpenses.toLocaleString()} fixed bills</span>
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400 group-hover:text-stone-200">
            <span>{sym}{wifeSurplus.toLocaleString()} monthly surplus</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 3: Bank Debt Snowball */}
        <div
          onClick={() => onNavigate('debt')}
          className="bg-stone-850 hover:bg-stone-800/90 border border-stone-700/60 rounded-2xl p-5 shadow-lg transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-400">Bank Debt</span>
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 group-hover:scale-105 transition-transform">
              <Landmark className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight">
              {sym}{totalDebt.toLocaleString()}
            </div>
            <div className="w-full bg-stone-700 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-rose-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${100 - debtProgressPercent}%` }}
              />
            </div>
            <p className="text-xs text-stone-400 mt-1 flex items-center justify-between">
              <span>{debts.length} active accounts</span>
              <span className="text-emerald-400 font-medium">{debtProgressPercent}% paid off</span>
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400 group-hover:text-stone-200">
            <span>Avalanche payoff order</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 4: Savings Targets */}
        <div
          onClick={() => onNavigate('targets')}
          className="bg-stone-850 hover:bg-stone-800/90 border border-stone-700/60 rounded-2xl p-5 shadow-lg transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Savings Vaults</span>
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
              <Vault className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight">
              {sym}{totalSaved.toLocaleString()}
            </div>
            <div className="w-full bg-stone-700 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-cyan-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${savingsProgressPercent}%` }}
              />
            </div>
            <p className="text-xs text-stone-400 mt-1 flex items-center justify-between">
              <span>Goal: {sym}{totalTargetGoal.toLocaleString()}</span>
              <span className="text-cyan-300 font-medium">{savingsProgressPercent}% achieved</span>
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400 group-hover:text-stone-200">
            <span>House & Gear funds</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Middle Section: Active Inflow & 35/35/15/15 Windfall Split Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Inflow Collection Stream */}
        <div className="lg:col-span-2 bg-stone-850 border border-stone-700/70 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold font-display text-white flex items-center space-x-2">
                <Coins className="w-5 h-5 text-amber-400" />
                <span>Freelance Inflow Stream</span>
              </h2>
              <p className="text-xs text-stone-400">
                Lump sum client invoices waiting for collection & automatic wealth allocation.
              </p>
            </div>
            <button
              onClick={() => onNavigate('freelance')}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center space-x-1"
            >
              <span>View all ({projects.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {uncollectedProjects.slice(0, 3).map((project) => {
              const remaining = project.totalFee - project.depositReceived;
              const isOverdue = project.status === 'OVERDUE';
              return (
                <div
                  key={project.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isOverdue
                      ? 'bg-rose-950/20 border-rose-500/30'
                      : 'bg-stone-800/70 border-stone-700/50 hover:border-stone-600'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white text-sm">{project.clientName}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isOverdue
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {project.status === 'OVERDUE' ? '⚠️ OVERDUE' : project.status}
                      </span>
                    </div>
                    <p className="text-xs text-stone-300 font-medium">{project.projectTitle}</p>
                    <p className="text-[11px] text-stone-400">
                      Invoice: {project.invoiceNumber || 'Pending'} • Due: {project.dueDate || 'Upon delivery'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end space-x-4">
                    <div className="text-left sm:text-right">
                      <div className="text-base font-black text-white font-display">
                        {sym}{remaining.toLocaleString()}
                      </div>
                      <div className="text-[11px] text-stone-400">
                        of {sym}{project.totalFee.toLocaleString()} total
                      </div>
                    </div>

                    <button
                      id={`btn-collect-dash-${project.id}`}
                      onClick={() => onOpenCollectModal(project)}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs shadow-md transition-all flex items-center space-x-1.5 cursor-pointer whitespace-nowrap"
                    >
                      <DollarSign className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Collect & Split</span>
                    </button>
                  </div>
                </div>
              );
            })}

            {uncollectedProjects.length === 0 && (
              <div className="p-8 text-center bg-stone-800/40 rounded-xl border border-stone-800">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <p className="text-stone-300 font-medium text-sm">All freelance invoices collected!</p>
                <p className="text-xs text-stone-400 mt-1">
                  Log a new commercial or wedding project to queue your next cash split.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Golden 35/35/15/15 Windfall Split Visualizer */}
        <div className="bg-stone-850 border border-stone-700/70 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Zap className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold font-display text-white">Golden Windfall Rule</h2>
            </div>
            <p className="text-xs text-stone-400 mt-1">
              Automatic split calculated on your next freelance collection ({sym}{sampleGigAmount.toLocaleString()}):
            </p>
          </div>

          <div className="space-y-2.5 my-2">
            {/* Split 1: Debt */}
            <div className="p-2.5 rounded-xl bg-stone-800/80 border border-rose-500/20 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span className="text-xs font-semibold text-stone-300">Bank Debt Payoff ({splitRule.debtPayoffPercent}%)</span>
              </div>
              <span className="text-xs font-black font-display text-rose-300">
                {sym}{sampleSplit.debt.toLocaleString()}
              </span>
            </div>

            {/* Split 2: Savings */}
            <div className="p-2.5 rounded-xl bg-stone-800/80 border border-cyan-500/20 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span className="text-xs font-semibold text-stone-300">House Vault ({splitRule.savingsTargetPercent}%)</span>
              </div>
              <span className="text-xs font-black font-display text-cyan-300">
                {sym}{sampleSplit.savings.toLocaleString()}
              </span>
            </div>

            {/* Split 3: Tax */}
            <div className="p-2.5 rounded-xl bg-stone-800/80 border border-amber-500/20 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-xs font-semibold text-stone-300">Tax & Gear Reserve ({splitRule.businessTaxReservePercent}%)</span>
              </div>
              <span className="text-xs font-black font-display text-amber-300">
                {sym}{sampleSplit.tax.toLocaleString()}
              </span>
            </div>

            {/* Split 4: Safe Pocket */}
            <div className="p-2.5 rounded-xl bg-stone-800/80 border border-emerald-500/20 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-xs font-semibold text-stone-300">Safe Pocket ({splitRule.safePocketPercent}%)</span>
              </div>
              <span className="text-xs font-black font-display text-emerald-300">
                {sym}{sampleSplit.safe.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="p-3 bg-stone-900/60 rounded-xl border border-stone-800 text-[11px] text-stone-400 leading-relaxed">
            💡 <strong className="text-stone-300">Tip:</strong> When a client wire hits, clicking <span className="text-emerald-400 font-semibold">"Collect & Split"</span> automatically updates your highest-APR credit card and top savings goal in 1 click.
          </div>
        </div>
      </div>

      {/* Bottom Section: 2 Columns (Top Debt Target & Top Savings Goals) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Debt Priorities */}
        <div className="bg-stone-850 border border-stone-700/70 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold font-display text-white flex items-center space-x-2">
              <Landmark className="w-5 h-5 text-rose-400" />
              <span>Priority Bank Debt Avalanche</span>
            </h2>
            <button
              onClick={() => onNavigate('debt')}
              className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center space-x-1"
            >
              <span>Manage debts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {debts.map((debt, index) => {
              const progress = debt.originalBalance > 0
                ? Math.round(((debt.originalBalance - debt.currentBalance) / debt.originalBalance) * 100)
                : 100;
              return (
                <div key={debt.id} className="p-3.5 bg-stone-800/60 border border-stone-700/50 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold flex items-center justify-center">
                        #{index + 1}
                      </span>
                      <span className="text-sm font-bold text-white">{debt.bankName}</span>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-rose-500/15 text-rose-300 border border-rose-500/20">
                      {debt.interestRateApr}% APR
                    </span>
                  </div>

                  <div className="w-full bg-stone-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${progress}%` }} />
                  </div>

                  <div className="flex items-center justify-between text-xs text-stone-400">
                    <span>Balance: <strong className="text-white">{sym}{debt.currentBalance.toLocaleString()}</strong></span>
                    <span className="text-emerald-400 font-medium">{progress}% cleared</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Savings Vaults */}
        <div className="bg-stone-850 border border-stone-700/70 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold font-display text-white flex items-center space-x-2">
              <Vault className="w-5 h-5 text-cyan-400" />
              <span>Family Savings Vaults</span>
            </h2>
            <button
              onClick={() => onNavigate('targets')}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
            >
              <span>Manage vaults</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {targets.slice(0, 3).map((target) => {
              const progress = target.targetAmount > 0
                ? Math.min(100, Math.round((target.currentSavedAmount / target.targetAmount) * 100))
                : 0;
              return (
                <div key={target.id} className="p-3.5 bg-stone-800/60 border border-stone-700/50 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">{target.title}</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-cyan-500/15 text-cyan-300 border border-cyan-500/20">
                      {target.deadline}
                    </span>
                  </div>

                  <div className="w-full bg-stone-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${progress}%` }} />
                  </div>

                  <div className="flex items-center justify-between text-xs text-stone-400">
                    <span>Saved: <strong className="text-white">{sym}{target.currentSavedAmount.toLocaleString()}</strong> of {sym}{target.targetAmount.toLocaleString()}</span>
                    <span className="text-cyan-300 font-medium">{progress}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
