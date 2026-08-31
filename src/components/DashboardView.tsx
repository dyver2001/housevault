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
  Plus,
  Camera,
  FileText,
  Calendar,
  Bell,
  ShoppingCart,
  Store
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
import { DreamHouseVisualizer } from './DreamHouseVisualizer';
import { EkgHeartbeatGlow } from './animations/EkgHeartbeatGlow';
import { VaultDoorIntroModal } from './animations/VaultDoorIntroModal';
import { soundFx } from '../utils/audioEffects';

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
  onOpenScanner?: () => void;
  onOpenReport?: () => void;
  onOpenGearTax?: () => void;
  onOpenActivityFeed?: () => void;
  onDepositMoreTarget?: (targetId: string) => void;
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
  onOpenNewExpense,
  onOpenSettings,
  onOpenScanner,
  onOpenReport,
  onOpenGearTax,
  onOpenActivityFeed,
  onDepositMoreTarget
}) => {
  const [isVaultDoorOpen, setIsVaultDoorOpen] = React.useState(false);
  const sym = profile?.currencySymbol || 'lei';

  // Uncollected freelance
  const uncollectedProjects = (projects || []).filter(
    (p) => p.status !== 'COLLECTED' && (p.totalFee - p.depositReceived) > 0
  );
  const totalUncollected = uncollectedProjects.reduce(
    (acc, p) => acc + (p.totalFee - p.depositReceived),
    0
  );

  // Debts
  const totalDebt = (debts || []).reduce((acc, d) => acc + d.currentBalance, 0);
  const originalDebt = (debts || []).reduce((acc, d) => acc + d.originalBalance, 0);
  const totalDebtPaid = Math.max(0, originalDebt - totalDebt);
  const debtProgressPercent =
    originalDebt > 0 ? Math.min(100, Math.round((totalDebtPaid / originalDebt) * 100)) : 100;

  // Savings Targets
  const totalSaved = (targets || []).reduce((acc, t) => acc + t.currentSavedAmount, 0);
  const totalTargetGoal = (targets || []).reduce((acc, t) => acc + t.targetAmount, 0);
  const savingsProgressPercent =
    totalTargetGoal > 0 ? Math.min(100, Math.round((totalSaved / totalTargetGoal) * 100)) : 0;

  // Expenses & Wife Salary
  const fixedExpenses = (expenses || [])
    .filter((e) => e.isFixed)
    .reduce((acc, e) => acc + e.amount, 0);

  const wifeSalary = profile?.wifeMonthlySalary || 0;
  const wifeSurplus = Math.max(0, wifeSalary - fixedExpenses);
  const salaryCoveragePercent =
    fixedExpenses > 0 ? Math.min(150, Math.round((wifeSalary / fixedExpenses) * 100)) : 100;

  // Financial runway = months we can survive on savings + surplus alone
  const monthlyBurn = fixedExpenses > 0 ? fixedExpenses : 1;
  const runwayMonths = fixedExpenses > 0
    ? (totalSaved / monthlyBurn + wifeSurplus / monthlyBurn).toFixed(1)
    : '∞';

  // Quick Windfall preview on $3,000 typical shoot payout
  const sampleGigAmount = totalUncollected > 0 ? totalUncollected : 3000;
  const sampleSplit = {
    debt: (sampleGigAmount * splitRule.debtPayoffPercent) / 100,
    savings: (sampleGigAmount * splitRule.savingsTargetPercent) / 100,
    tax: (sampleGigAmount * splitRule.businessTaxReservePercent) / 100,
    safe: (sampleGigAmount * splitRule.safePocketPercent) / 100
  };

  const husbandIncome = profile?.husbandEstMonthlyGross || 12500;
  const wifeAllowance = (profile?.wifeMonthlySalary || 0) + (profile?.wifeMealTicketsMonthly ?? 800);
  const totalHouseholdIncome = husbandIncome + wifeAllowance;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 👑 Ultra-Luxury Futuristic Family Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-900/95 via-stone-850/90 to-stone-950/95 border border-white/[0.1] p-6 sm:p-8 shadow-2xl backdrop-blur-3xl">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-cyan-500/20 border border-white/[0.12] text-amber-300 text-xs font-black shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
                <span>{profile.language === 'ro' ? '✨ Seif Financiar de Familie • VIP Suite' : '✨ Family Wealth Engine • VIP Suite'}</span>
              </div>

              {syncCode ? (
                <div
                  onClick={onOpenSettings}
                  className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold cursor-pointer hover:bg-emerald-500/25 transition shadow-sm"
                  title="Apasă pentru detalii sincronizare"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>🟢 {profile.language === 'ro' ? 'Sincronizat live cu' : 'Live synced with'} {profile.wifeName.split(' ')[0]} ({syncCode})</span>
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

            <div className="space-y-1">
              <h1 className="text-2xl sm:text-4xl font-display font-black text-white tracking-tight">
                {profile.wifeName.split(' ')[0]} Garantează Facturile. {profile.husbandName.split(' ')[0]} Crește Averea.
              </h1>
              <p className="text-stone-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
                Venitul combinat al familiei este de <strong className="text-white font-mono">{sym}{totalHouseholdIncome.toLocaleString()}/lună</strong>.
                Salariul stabil acoperă cheltuielile zilnice, lăsând proiectele video libere să umple seiful casei de vis!
              </p>
            </div>

            {/* Income Pillars Pill Badges */}
            <div className="flex flex-wrap gap-2 pt-1">
              <div className="px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-xs flex items-center gap-1.5">
                <span className="text-amber-400 font-bold">💼 {profile.husbandName.split(' ')[0]}:</span>
                <span className="font-mono font-black text-white">{sym}{husbandIncome.toLocaleString()}/lună</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs flex items-center gap-1.5">
                <span className="text-emerald-400 font-bold">💳 {profile.wifeName.split(' ')[0]} Salariu:</span>
                <span className="font-mono font-black text-white">{sym}{profile.wifeMonthlySalary.toLocaleString()}/lună</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-lime-500/15 border border-lime-500/30 text-xs flex items-center gap-1.5">
                <span className="text-lime-400 font-bold">🥗 Bonuri Masă:</span>
                <span className="font-mono font-black text-white">{sym}{(profile.wifeMealTicketsMonthly ?? 800).toLocaleString()}/lună</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5 items-center">
            <button
              type="button"
              onClick={() => {
                soundFx.playCashChime();
                setIsVaultDoorOpen(true);
              }}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-black text-xs shadow-lg transition-all cursor-pointer active:scale-95"
            >
              <Vault className="w-4 h-4 text-amber-400" />
              <span>🔓 Deschide Seiful 3D</span>
            </button>

            <button
              id="btn-dash-new-project"
              onClick={onOpenNewProject}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-stone-950 font-black text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>+ Încasează Proiect</span>
            </button>

            <button
              id="btn-dash-new-expense"
              onClick={onOpenNewExpense}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 font-bold text-xs transition-all cursor-pointer active:scale-95"
            >
              <Receipt className="w-4 h-4 text-emerald-400" />
              <span>+ Adaugă Factură</span>
            </button>
          </div>
        </div>
      </div>

      {/* 🚀 Quick Powerhouse Action Suite for Haytham & Cati */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        <button
          type="button"
          onClick={onOpenScanner}
          className="p-3 rounded-2xl bg-gradient-to-br from-stone-850 to-stone-900 border border-cyan-500/30 hover:border-cyan-500 text-left transition shadow-md group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
            <Camera className="w-4 h-4" />
          </div>
          <span className="text-xs font-black text-white block">
            {profile.language === 'ro' ? 'Scaner Bonuri AI' : 'AI Receipt Scanner'}
          </span>
          <span className="text-[10px] text-stone-400">
            {profile.language === 'ro' ? 'Pozează bonul în RON' : 'OCR Vision Import'}
          </span>
        </button>

        <button
          type="button"
          onClick={onOpenReport}
          className="p-3 rounded-2xl bg-gradient-to-br from-stone-850 to-stone-900 border border-emerald-500/30 hover:border-emerald-500 text-left transition shadow-md group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
            <FileText className="w-4 h-4" />
          </div>
          <span className="text-xs font-black text-white block">
            {profile.language === 'ro' ? 'Raport WhatsApp' : 'Monthly Report'}
          </span>
          <span className="text-[10px] text-stone-400">
            {profile.language === 'ro' ? '1-Click Sumar Cuplu' : 'WhatsApp Statement'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('groceries')}
          className="p-3 rounded-2xl bg-gradient-to-br from-stone-850 to-stone-900 border border-amber-500/30 hover:border-amber-400 text-left transition shadow-md group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
            <ShoppingCart className="w-4 h-4" />
          </div>
          <span className="text-xs font-black text-white block">
            {profile.language === 'ro' ? 'Magazine & Prețuri' : 'Grocery & Shops'}
          </span>
          <span className="text-[10px] text-stone-400">
            {profile.language === 'ro' ? 'Lidl, Kaufland, 🇲🇦🇷🇴 Coș' : 'Compare 6 Supermarkets'}
          </span>
        </button>

        <button
          type="button"
          onClick={onOpenGearTax}
          className="p-3 rounded-2xl bg-gradient-to-br from-stone-850 to-stone-900 border border-rose-500/30 hover:border-rose-500 text-left transition shadow-md group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-rose-500/15 text-rose-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-xs font-black text-white block">
            {profile.language === 'ro' ? 'Haytham Pro Gear' : 'Gear ROI & Tax'}
          </span>
          <span className="text-[10px] text-stone-400">
            {profile.language === 'ro' ? 'Amortizare & PFA/SRL' : 'Video Gear Payoff'}
          </span>
        </button>
      </div>

      {/* 4 Core Financial Pillar Cards with Joyful Jewel Gradients */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Haytham's Freelance Income */}
        <div
          onClick={() => onNavigate('freelance')}
          className="bg-gradient-to-br from-stone-900/90 via-stone-850/80 to-amber-950/20 hover:from-stone-850 hover:to-amber-900/30 border border-amber-500/30 hover:border-amber-400/60 rounded-3xl p-5 shadow-xl hover:shadow-amber-500/10 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-amber-400">
              {profile.language === 'ro' ? `Venit Freelance ${profile.husbandName.split(' ')[0]}` : `${profile.husbandName.split(' ')[0]}'s Income`}
            </span>
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform shadow-sm">
              <Coins className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight">
              {sym}{(profile.husbandEstMonthlyGross || 12500).toLocaleString()}
              <span className="text-xs text-stone-400 font-normal">/mo</span>
            </div>
            <p className="text-xs text-stone-400 mt-1 flex items-center space-x-1">
              <span className="font-semibold text-amber-300">{(projects || []).length} proiecte</span>
              <span>• {sym}{(projects || []).reduce((s, p) => s + (p.depositReceived || 0), 0).toLocaleString()} încasat</span>
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-stone-800/80 flex items-center justify-between text-xs text-stone-400 group-hover:text-amber-300 transition-colors">
            <span className="font-bold">{profile.language === 'ro' ? 'Vezi proiecte & încasări' : 'View projects & payouts'}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 2: Household Budget Anchor */}
        <div
          onClick={() => onNavigate('budget')}
          className="bg-gradient-to-br from-stone-900/90 via-stone-850/80 to-emerald-950/20 hover:from-stone-850 hover:to-emerald-900/30 border border-emerald-500/30 hover:border-emerald-400/60 rounded-3xl p-5 shadow-xl hover:shadow-emerald-500/10 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
              {profile.language === 'ro' ? `Salariu & Bonuri ${profile.wifeName.split(' ')[0]}` : 'Steady Salary Anchor'}
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform shadow-sm">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight">
              {sym}{profile.wifeMonthlySalary.toLocaleString()}
              <span className="text-xs text-lime-400 font-bold ml-1.5">+ {sym}{(profile.wifeMealTicketsMonthly ?? 800).toLocaleString()} bonuri</span>
            </div>
            <p className="text-xs text-stone-400 mt-1 flex items-center space-x-1">
              <span className="text-emerald-400 font-semibold">{salaryCoveragePercent}% acoperire</span>
              <span>din {sym}{fixedExpenses.toLocaleString()} facturi fixe</span>
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-stone-800/80 flex items-center justify-between text-xs text-stone-400 group-hover:text-emerald-300 transition-colors">
            <span className="font-bold">+{sym}{wifeSurplus.toLocaleString()} surplus lunar</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 3: Bank Debt Snowball */}
        <div
          onClick={() => onNavigate('debt')}
          className="bg-gradient-to-br from-stone-900/90 via-stone-850/80 to-rose-950/20 hover:from-stone-850 hover:to-rose-900/30 border border-rose-500/30 hover:border-rose-400/60 rounded-3xl p-5 shadow-xl hover:shadow-rose-500/10 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-rose-400">
              {profile.language === 'ro' ? 'Datorii Bancare' : 'Bank Debt'}
            </span>
            <div className="w-10 h-10 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform shadow-sm">
              <Landmark className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight">
              {sym}{totalDebt.toLocaleString()}
            </div>
            <div className="w-full bg-stone-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-rose-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${100 - debtProgressPercent}%` }}
              />
            </div>
            <p className="text-xs text-stone-400 mt-1.5 flex items-center justify-between">
              <span>{debts.length} conturi active</span>
              <span className="text-emerald-400 font-bold">{debtProgressPercent}% achitat</span>
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-stone-800/80 flex items-center justify-between text-xs text-stone-400 group-hover:text-rose-300 transition-colors">
            <span className="font-bold">{profile.language === 'ro' ? 'Strategie rambursare' : 'Avalanche payoff'}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 4: Savings Targets */}
        <div
          onClick={() => onNavigate('targets')}
          className="bg-gradient-to-br from-stone-900/90 via-stone-850/80 to-cyan-950/20 hover:from-stone-850 hover:to-cyan-900/30 border border-cyan-500/30 hover:border-cyan-400/60 rounded-3xl p-5 shadow-xl hover:shadow-cyan-500/10 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-cyan-400">
              {profile.language === 'ro' ? 'Seif & Obiective' : 'Savings Vaults'}
            </span>
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform shadow-sm">
              <Vault className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight">
              {sym}{totalSaved.toLocaleString()}
            </div>
            <div className="w-full bg-stone-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${savingsProgressPercent}%` }}
              />
            </div>
            <p className="text-xs text-stone-400 mt-1.5 flex items-center justify-between">
              <span>Țintă: {sym}{totalTargetGoal.toLocaleString()}</span>
              <span className="text-cyan-300 font-bold">{savingsProgressPercent}% acumulat</span>
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-stone-800/80 flex items-center justify-between text-xs text-stone-400 group-hover:text-cyan-300 transition-colors">
            <span className="font-bold">{profile.language === 'ro' ? 'Fonduri Casă & Familie' : 'House & Gear funds'}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* 💓 Live Financial Heartbeat EKG Pulse */}
      <div className="p-3 bg-stone-900/60 border border-stone-800/80 rounded-2xl flex items-center justify-between space-x-4">
        <div className="flex items-center space-x-2 pl-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-bold text-emerald-400 font-mono uppercase tracking-wider">
            Ritm Financiar Cuplu: {runwayMonths} Luni Siguranță
          </span>
        </div>
        <div className="flex-1 max-w-xs sm:max-w-md">
          <EkgHeartbeatGlow runwayMonths={parseFloat(runwayMonths) || 12} />
        </div>
      </div>

      {/* 🛒 Supermarket Price Optimizer & Cultural Groceries Hub (Haytham 🇲🇦 & Cati 🇷🇴) */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 border border-emerald-500/40 rounded-3xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-amber-500/20 border border-emerald-500/30 flex items-center justify-center text-2xl shadow-inner shrink-0">
            🛒
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm sm:text-base font-black text-white font-display">
                Optimizator Magazine & Meniu Mixt Marocan-Român 🇲🇦🇷🇴
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black">
                Lidl • Kaufland • Carrefour • Mega Image
              </span>
            </div>
            <p className="text-xs text-stone-300 mt-0.5">
              Compară prețurile reale, alege cel mai ieftin magazin și generează coșul de cumpărături pe banii disponibili (Couscous, Tagine, Telemea, Mămăliguță).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('groceries')}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-stone-950 font-black text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer flex items-center gap-1.5 active:scale-98"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Deschide Magazine & Coș</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 🏡 Interactive Dream House Construction Progress */}
      <DreamHouseVisualizer
        targets={targets}
        currencySymbol={sym}
        lang={profile.language || 'ro'}
        onDepositMore={onDepositMoreTarget}
      />

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

      {/* 3D Steel Mechanical Vault Door Intro Modal */}
      <VaultDoorIntroModal
        isOpen={isVaultDoorOpen}
        onClose={() => setIsVaultDoorOpen(false)}
        title={`${profile.husbandName.split(' ')[0]} & ${profile.wifeName.split(' ')[0]} • Seiful Familiei`}
        subtitle="Mecanismele seifului deblocate cu succes!"
      />
    </div>
  );
};
