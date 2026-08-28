import React, { useState, useEffect, useRef } from 'react';
import { Navbar, TabType } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { FreelanceCollectorView } from './components/FreelanceCollectorView';
import { HouseholdBudgetView } from './components/HouseholdBudgetView';
import { BankDebtView } from './components/BankDebtView';
import { SavingsTargetsView } from './components/SavingsTargetsView';
import { AiAdvisorView } from './components/AiAdvisorView';
import { CollectPaymentModal } from './components/CollectPaymentModal';
import { SettingsShareModal } from './components/SettingsShareModal';
import { ProjectFormModal } from './components/ProjectFormModal';
import { DebtFormModal } from './components/DebtFormModal';
import { TargetFormModal } from './components/TargetFormModal';
import { ExpenseFormModal } from './components/ExpenseFormModal';
import { InstallPhoneModal } from './components/InstallPhoneModal';

import {
  loadProfile,
  saveProfile,
  loadProjects,
  saveProjects,
  loadDebts,
  saveDebts,
  loadTargets,
  saveTargets,
  loadExpenses,
  saveExpenses,
  loadSplitRule,
  saveSplitRule,
  resetAllToDefaults,
  exportBackupJson,
  importBackupJson
} from './data/storage';
import {
  getStoredVaultCode,
  setStoredVaultCode,
  createCloudVault,
  joinCloudVault,
  pushCloudVault,
  fetchCloudVault,
  subscribeToLiveVault
} from './data/syncService';
import {
  HouseholdProfile,
  FreelanceProject,
  BankDebt,
  SavingsTarget,
  HouseholdExpense,
  WindfallSplitRule
} from './types';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');

  // Core Data States
  const [profile, setProfile] = useState<HouseholdProfile>(loadProfile);
  const [projects, setProjects] = useState<FreelanceProject[]>(loadProjects);
  const [debts, setDebts] = useState<BankDebt[]>(loadDebts);
  const [targets, setTargets] = useState<SavingsTarget[]>(loadTargets);
  const [expenses, setExpenses] = useState<HouseholdExpense[]>(loadExpenses);
  const [splitRule, setSplitRule] = useState<WindfallSplitRule>(loadSplitRule);

  // Cloud Sync State
  const [syncCode, setSyncCode] = useState<string | null>(getStoredVaultCode);
  const [isSyncConnected, setIsSyncConnected] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const isInternalUpdate = useRef<boolean>(false);

  // Modals state
  const [collectProject, setCollectProject] = useState<FreelanceProject | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isInstallOpen, setIsInstallOpen] = useState<boolean>(false);
  const [editingProject, setEditingProject] = useState<FreelanceProject | null | undefined>(undefined);
  const [editingDebt, setEditingDebt] = useState<BankDebt | null | undefined>(undefined);
  const [editingTarget, setEditingTarget] = useState<SavingsTarget | null | undefined>(undefined);
  const [editingExpense, setEditingExpense] = useState<HouseholdExpense | null | undefined>(undefined);

  // Synchronize state with LocalStorage
  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  useEffect(() => {
    saveProjects(projects);
  }, [projects]);

  useEffect(() => {
    saveDebts(debts);
  }, [debts]);

  useEffect(() => {
    saveTargets(targets);
  }, [targets]);

  useEffect(() => {
    saveExpenses(expenses);
  }, [expenses]);

  useEffect(() => {
    saveSplitRule(splitRule);
  }, [splitRule]);

  // Apply a remote snapshot received from cloud
  const applyRemoteSnapshot = (data: any) => {
    isInternalUpdate.current = true;
    if (data.profile) setProfile(data.profile);
    if (data.projects) setProjects(data.projects);
    if (data.debts) setDebts(data.debts);
    if (data.targets) setTargets(data.targets);
    if (data.expenses) setExpenses(data.expenses);
    if (data.splitRule) setSplitRule(data.splitRule);
    setTimeout(() => {
      isInternalUpdate.current = false;
    }, 300);
  };

  // Push local updates to Cloud Vault (Real-time Broadcast)
  const pushCurrentStateToCloud = (override?: {
    profile?: HouseholdProfile;
    projects?: FreelanceProject[];
    debts?: BankDebt[];
    targets?: SavingsTarget[];
    expenses?: HouseholdExpense[];
    splitRule?: WindfallSplitRule;
  }) => {
    if (!syncCode || isInternalUpdate.current) return;
    const fullData = {
      profile: override?.profile || profile,
      projects: override?.projects || projects,
      debts: override?.debts || debts,
      targets: override?.targets || targets,
      expenses: override?.expenses || expenses,
      splitRule: override?.splitRule || splitRule
    };
    pushCloudVault(syncCode, fullData, `${profile.husbandName} & ${profile.wifeName}`).then((res) => {
      if (res.success && res.vault) {
        setLastSyncTime(res.vault.lastUpdated || new Date().toISOString());
      }
    });
  };

  // Subscribe to Live Cloud Vault when syncCode is present
  useEffect(() => {
    if (!syncCode) {
      setIsSyncConnected(false);
      return;
    }

    setIsSyncConnected(true);

    // Initial fetch to get latest
    fetchCloudVault(syncCode).then((res) => {
      if (res.success && res.vault?.data) {
        applyRemoteSnapshot(res.vault.data);
        setLastSyncTime(res.vault.lastUpdated || new Date().toISOString());
      }
    });

    const unsubscribe = subscribeToLiveVault(syncCode, (vault) => {
      if (vault?.data) {
        applyRemoteSnapshot(vault.data);
        setLastSyncTime(vault.lastUpdated || new Date().toISOString());
      }
    });

    return () => unsubscribe();
  }, [syncCode]);

  // Project handlers
  const handleSaveProject = (project: FreelanceProject) => {
    let nextProjects: FreelanceProject[];
    setProjects((prev) => {
      const idx = prev.findIndex((p) => p.id === project.id);
      if (idx >= 0) {
        nextProjects = [...prev];
        nextProjects[idx] = project;
      } else {
        nextProjects = [project, ...prev];
      }
      return nextProjects;
    });
    pushCurrentStateToCloud({ projects: nextProjects! });
  };

  const handleDeleteProject = (projectId: string) => {
    const nextProjects = projects.filter((p) => p.id !== projectId);
    setProjects(nextProjects);
    pushCurrentStateToCloud({ projects: nextProjects });
  };

  // Debt handlers
  const handleSaveDebt = (debt: BankDebt) => {
    let nextDebts: BankDebt[];
    setDebts((prev) => {
      const idx = prev.findIndex((d) => d.id === debt.id);
      if (idx >= 0) {
        nextDebts = [...prev];
        nextDebts[idx] = debt;
      } else {
        nextDebts = [...prev, debt];
      }
      return nextDebts;
    });
    pushCurrentStateToCloud({ debts: nextDebts! });
  };

  const handleDeleteDebt = (debtId: string) => {
    const nextDebts = debts.filter((d) => d.id !== debtId);
    setDebts(nextDebts);
    pushCurrentStateToCloud({ debts: nextDebts });
  };

  const handleMakeDebtPayment = (debtId: string, amount: number) => {
    const nextDebts = debts.map((d) => {
      if (d.id === debtId) {
        const newBal = Math.max(0, d.currentBalance - amount);
        return { ...d, currentBalance: newBal };
      }
      return d;
    });
    setDebts(nextDebts);
    pushCurrentStateToCloud({ debts: nextDebts });
  };

  // Target handlers
  const handleSaveTarget = (target: SavingsTarget) => {
    let nextTargets: SavingsTarget[];
    setTargets((prev) => {
      const idx = prev.findIndex((t) => t.id === target.id);
      if (idx >= 0) {
        nextTargets = [...prev];
        nextTargets[idx] = target;
      } else {
        nextTargets = [...prev, target];
      }
      return nextTargets;
    });
    pushCurrentStateToCloud({ targets: nextTargets! });
  };

  const handleDeleteTarget = (targetId: string) => {
    const nextTargets = targets.filter((t) => t.id !== targetId);
    setTargets(nextTargets);
    pushCurrentStateToCloud({ targets: nextTargets });
  };

  const handleDepositToTarget = (targetId: string, amount: number) => {
    const nextTargets = targets.map((t) => {
      if (t.id === targetId) {
        return { ...t, currentSavedAmount: t.currentSavedAmount + amount };
      }
      return t;
    });
    setTargets(nextTargets);
    pushCurrentStateToCloud({ targets: nextTargets });
  };

  // Expense handlers
  const handleSaveExpense = (expense: HouseholdExpense) => {
    let nextExpenses: HouseholdExpense[];
    setExpenses((prev) => {
      const idx = prev.findIndex((e) => e.id === expense.id);
      if (idx >= 0) {
        nextExpenses = [...prev];
        nextExpenses[idx] = expense;
      } else {
        nextExpenses = [...prev, expense];
      }
      return nextExpenses;
    });
    pushCurrentStateToCloud({ expenses: nextExpenses! });
  };

  const handleDeleteExpense = (expenseId: string) => {
    const nextExpenses = expenses.filter((e) => e.id !== expenseId);
    setExpenses(nextExpenses);
    pushCurrentStateToCloud({ expenses: nextExpenses });
  };

  // Collect Inflow & Apply Windfall Split Rule
  const handleConfirmCollection = (
    projectId: string,
    collectedAmount: number,
    autoSplit: boolean
  ) => {
    let nextProjects = projects.map((p) => {
      if (p.id === projectId) {
        const newDeposit = Math.min(p.totalFee, p.depositReceived + collectedAmount);
        const newStatus = newDeposit >= p.totalFee ? 'COLLECTED' : p.status;
        return { ...p, depositReceived: newDeposit, status: newStatus as any };
      }
      return p;
    });

    let nextDebts = debts;
    let nextTargets = targets;

    if (autoSplit && collectedAmount > 0) {
      const debtAmount = collectedAmount * (splitRule.debtPayoffPercent / 100);
      const savingsAmount = collectedAmount * (splitRule.savingsTargetPercent / 100);

      // Apply to top priority bank debt (highest APR)
      if (debtAmount > 0 && debts.length > 0) {
        const sortedDebts = [...debts].sort(
          (a, b) => b.interestRateApr - a.interestRateApr
        );
        const topDebtId = sortedDebts[0].id;
        nextDebts = debts.map((d) => {
          if (d.id === topDebtId) {
            return {
              ...d,
              currentBalance: Math.max(0, d.currentBalance - debtAmount)
            };
          }
          return d;
        });
      }

      // Apply to top savings target
      if (savingsAmount > 0 && targets.length > 0) {
        const topTargetId = targets[0].id;
        nextTargets = targets.map((t) => {
          if (t.id === topTargetId) {
            return {
              ...t,
              currentSavedAmount: t.currentSavedAmount + savingsAmount
            };
          }
          return t;
        });
      }
    }

    setProjects(nextProjects);
    setDebts(nextDebts);
    setTargets(nextTargets);
    setCollectProject(null);

    pushCurrentStateToCloud({
      projects: nextProjects,
      debts: nextDebts,
      targets: nextTargets
    });
  };

  // Cloud Sync Actions
  const handleGenerateSyncCode = async () => {
    const res = await createCloudVault(
      { profile, projects, debts, targets, expenses, splitRule },
      undefined,
      `${profile.husbandName} & ${profile.wifeName}`
    );
    if (res.success && res.vaultCode) {
      setSyncCode(res.vaultCode);
      setStoredVaultCode(res.vaultCode);
      setLastSyncTime(new Date().toISOString());
    }
  };

  const handleJoinSyncCode = async (code: string): Promise<boolean> => {
    const res = await joinCloudVault(code);
    if (res.success && res.vault?.data) {
      setSyncCode(res.vaultCode || code);
      setStoredVaultCode(res.vaultCode || code);
      applyRemoteSnapshot(res.vault.data);
      setLastSyncTime(res.vault.lastUpdated || new Date().toISOString());
      return true;
    }
    return false;
  };

  const handleDisconnectSync = () => {
    setSyncCode(null);
    setStoredVaultCode(null);
    setIsSyncConnected(false);
  };

  const handleManualSync = async () => {
    if (!syncCode) return;
    const res = await fetchCloudVault(syncCode);
    if (res.success && res.vault?.data) {
      applyRemoteSnapshot(res.vault.data);
      setLastSyncTime(res.vault.lastUpdated || new Date().toISOString());
    }
  };

  // Backup handlers
  const handleExportJson = () => {
    exportBackupJson(profile, projects, debts, targets, expenses, splitRule);
  };

  const handleImportJson = (jsonString: string) => {
    const success = importBackupJson(jsonString);
    if (success) {
      setProfile(loadProfile());
      setProjects(loadProjects());
      setDebts(loadDebts());
      setTargets(loadTargets());
      setExpenses(loadExpenses());
      setSplitRule(loadSplitRule());
      pushCurrentStateToCloud();
    }
  };

  const handleResetDefaults = () => {
    resetAllToDefaults();
    setProfile(loadProfile());
    setProjects(loadProjects());
    setDebts(loadDebts());
    setTargets(loadTargets());
    setExpenses(loadExpenses());
    setSplitRule(loadSplitRule());
    pushCurrentStateToCloud();
  };

  const uncollectedCount = projects.filter((p) => !p.depositReceived || p.depositReceived < p.totalFee).length;
  const overdueCount = projects.filter((p) => p.status === 'OVERDUE').length;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-500 selection:text-stone-950">
      {/* Top Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        profile={profile}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenInstall={() => setIsInstallOpen(true)}
        uncollectedCount={uncollectedCount}
        overdueCount={overdueCount}
        syncCode={syncCode}
        isSyncConnected={isSyncConnected}
      />

      {/* Main Tab View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentTab === 'dashboard' && (
          <DashboardView
            profile={profile}
            projects={projects}
            debts={debts}
            targets={targets}
            expenses={expenses}
            splitRule={splitRule}
            onSelectTab={setCurrentTab}
            onOpenCollect={(project) => setCollectProject(project)}
            onOpenNewGig={() => setEditingProject(null)}
          />
        )}

        {currentTab === 'freelance' && (
          <FreelanceCollectorView
            projects={projects}
            profile={profile}
            onOpenNewGig={() => setEditingProject(null)}
            onEditGig={(p) => setEditingProject(p)}
            onDeleteGig={handleDeleteProject}
            onCollectPayment={(p) => setCollectProject(p)}
          />
        )}

        {currentTab === 'budget' && (
          <HouseholdBudgetView
            expenses={expenses}
            profile={profile}
            onOpenNewExpense={() => setEditingExpense(null)}
            onEditExpense={(e) => setEditingExpense(e)}
            onDeleteExpense={handleDeleteExpense}
          />
        )}

        {currentTab === 'debt' && (
          <BankDebtView
            debts={debts}
            profile={profile}
            onOpenNewDebt={() => setEditingDebt(null)}
            onEditDebt={(d) => setEditingDebt(d)}
            onDeleteDebt={handleDeleteDebt}
            onMakePayment={handleMakeDebtPayment}
          />
        )}

        {currentTab === 'targets' && (
          <SavingsTargetsView
            targets={targets}
            profile={profile}
            onOpenNewTarget={() => setEditingTarget(null)}
            onEditTarget={(t) => setEditingTarget(t)}
            onDeleteTarget={handleDeleteTarget}
            onDeposit={handleDepositToTarget}
          />
        )}

        {currentTab === 'ai' && (
          <AiAdvisorView
            profile={profile}
            projects={projects}
            debts={debts}
            targets={targets}
            expenses={expenses}
          />
        )}
      </main>

      {/* Footer */}
      <footer
        className="border-t border-stone-800/80 py-6 text-center text-xs text-stone-400"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 24px)' }}
      >
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>HouseVault • Steady Foundation & Accelerated Wealth Engine</span>
          <span>{profile.husbandName} & {profile.wifeName}</span>
        </div>
      </footer>

      {/* Collect & Auto-Split Modal */}
      {collectProject && (
        <CollectPaymentModal
          project={collectProject}
          profile={profile}
          debts={debts}
          targets={targets}
          splitRule={splitRule}
          onClose={() => setCollectProject(null)}
          onConfirmCollection={handleConfirmCollection}
        />
      )}

      {/* Settings & Sync Modal */}
      {isSettingsOpen && (
        <SettingsShareModal
          profile={profile}
          splitRule={splitRule}
          onClose={() => setIsSettingsOpen(false)}
          onOpenInstall={() => setIsInstallOpen(true)}
          onSaveProfile={(p) => {
            setProfile(p);
            pushCurrentStateToCloud({ profile: p });
          }}
          onSaveSplitRule={(s) => {
            setSplitRule(s);
            pushCurrentStateToCloud({ splitRule: s });
          }}
          onExportJson={handleExportJson}
          onImportJson={handleImportJson}
          onResetDefaults={handleResetDefaults}
          syncCode={syncCode}
          isSyncConnected={isSyncConnected}
          lastSyncTime={lastSyncTime}
          onGenerateSyncCode={handleGenerateSyncCode}
          onJoinSyncCode={handleJoinSyncCode}
          onDisconnectSync={handleDisconnectSync}
          onManualSync={handleManualSync}
        />
      )}

      {/* Install on Phone Modal */}
      {isInstallOpen && (
        <InstallPhoneModal onClose={() => setIsInstallOpen(false)} />
      )}

      {/* Project Form Modal */}
      {editingProject !== undefined && (
        <ProjectFormModal
          initialData={editingProject}
          profile={profile}
          onClose={() => setEditingProject(undefined)}
          onSave={handleSaveProject}
        />
      )}

      {/* Debt Form Modal */}
      {editingDebt !== undefined && (
        <DebtFormModal
          initialData={editingDebt}
          profile={profile}
          onClose={() => setEditingDebt(undefined)}
          onSave={handleSaveDebt}
        />
      )}

      {/* Target Form Modal */}
      {editingTarget !== undefined && (
        <TargetFormModal
          initialData={editingTarget}
          profile={profile}
          onClose={() => setEditingTarget(undefined)}
          onSave={handleSaveTarget}
        />
      )}

      {/* Expense Form Modal */}
      {editingExpense !== undefined && (
        <ExpenseFormModal
          initialData={editingExpense}
          profile={profile}
          onClose={() => setEditingExpense(undefined)}
          onSave={handleSaveExpense}
        />
      )}
    </div>
  );
};
