import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Navbar, TabType } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { FreelanceCollectorView } from './components/FreelanceCollectorView';
import { HouseholdBudgetView } from './components/HouseholdBudgetView';
import { BankDebtView } from './components/BankDebtView';
import { SavingsTargetsView } from './components/SavingsTargetsView';
import { CashFlowCalendarView } from './components/CashFlowCalendarView';
import { AiAdvisorView } from './components/AiAdvisorView';
import { GroceryOptimizerView } from './components/GroceryOptimizerView';
import { CollectPaymentModal } from './components/CollectPaymentModal';
import { SettingsShareModal } from './components/SettingsShareModal';
import { ProjectFormModal } from './components/ProjectFormModal';
import { DebtFormModal } from './components/DebtFormModal';
import { TargetFormModal } from './components/TargetFormModal';
import { ExpenseFormModal } from './components/ExpenseFormModal';
import { InstallPhoneModal } from './components/InstallPhoneModal';
import { AuthModal } from './components/AuthModal';
import { ActivityFeedModal } from './components/ActivityFeedModal';
import { ReceiptScannerModal } from './components/ReceiptScannerModal';
import { MonthlyReportModal } from './components/MonthlyReportModal';
import { GearTaxToolsModal } from './components/GearTaxToolsModal';

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
  loadGroceryList,
  saveGroceryList,
  loadGroceryCatalog,
  saveGroceryCatalog,
  loadActivities,
  saveActivities,
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
  AuthUser,
  getStoredUser,
  checkAuthMe,
  logoutAccount
} from './data/authService';
import {
  HouseholdProfile,
  FreelanceProject,
  BankDebt,
  SavingsTarget,
  HouseholdExpense,
  WindfallSplitRule,
  ActivityItem,
  GroceryCatalogItem,
  ShoppingListItem,
  CashPocketsBalance
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
  const [groceryList, setGroceryList] = useState<ShoppingListItem[]>(loadGroceryList);
  const [activities, setActivities] = useState<ActivityItem[]>(loadActivities);

  useEffect(() => {
    saveActivities(activities);
  }, [activities]);

  // Live Cash Pockets & Account Balances Calculation
  const wifeSalaryBalance = useMemo(() => {
    const wifeSpent = expenses
      .filter((e) => e.assignedPayer === 'WIFE_SALARY')
      .reduce((s, e) => s + e.amount, 0);
    return Math.max(0, profile.wifeMonthlySalary - wifeSpent);
  }, [profile.wifeMonthlySalary, expenses]);

  const freelanceBufferBalance = useMemo(() => {
    const totalCollected = projects.reduce((s, p) => s + (p.depositReceived || 0), 0);
    const safePocketPool = totalCollected * (splitRule.safePocketPercent / 100);
    const freelanceSpent = expenses
      .filter((e) => e.assignedPayer === 'FREELANCE_BUFFER')
      .reduce((s, e) => s + e.amount, 0);
    return Math.max(0, safePocketPool - freelanceSpent);
  }, [projects, splitRule, expenses]);

  const sharedPoolBalance = useMemo(() => {
    const sharedSpent = expenses
      .filter((e) => e.assignedPayer === 'SHARED_POOL')
      .reduce((s, e) => s + e.amount, 0);
    const combinedAvailable = wifeSalaryBalance + freelanceBufferBalance;
    return Math.max(0, combinedAvailable - sharedSpent);
  }, [wifeSalaryBalance, freelanceBufferBalance, expenses]);

  const cashBalances: CashPocketsBalance = useMemo(() => ({
    wifeSalaryBalance,
    freelanceBufferBalance,
    sharedPoolBalance
  }), [wifeSalaryBalance, freelanceBufferBalance, sharedPoolBalance]);

  // Authentication State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(getStoredUser);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  // Modals state
  const [isActivityFeedOpen, setIsActivityFeedOpen] = useState(false);
  const [isReceiptScannerOpen, setIsReceiptScannerOpen] = useState(false);
  const [isMonthlyReportOpen, setIsMonthlyReportOpen] = useState(false);
  const [isGearTaxOpen, setIsGearTaxOpen] = useState(false);

  // Cloud Sync State
  const [syncCode, setSyncCode] = useState<string | null>(getStoredVaultCode);
  const [isSyncConnected, setIsSyncConnected] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const isInternalUpdate = useRef<boolean>(false);

  // Check auth on mount
  useEffect(() => {
    checkAuthMe().then((res) => {
      if (res.success && res.user) {
        setCurrentUser(res.user);
        if (res.user.vaultCode) {
          setSyncCode(res.user.vaultCode);
          setStoredVaultCode(res.user.vaultCode);
        }
        if (res.vault?.data) {
          applyRemoteSnapshot(res.vault.data);
        }
      }
    });
  }, []);

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
    saveSplitRule(splitRule);
  }, [splitRule]);

  useEffect(() => {
    saveGroceryList(groceryList);
  }, [groceryList]);

  useEffect(() => {
    saveGroceryCatalog(groceryCatalog);
  }, [groceryCatalog]);

  // Apply a remote snapshot received from cloud
  const applyRemoteSnapshot = (data: any) => {
    isInternalUpdate.current = true;
    if (data.profile) setProfile(data.profile);
    if (data.projects) setProjects(data.projects);
    if (data.debts) setDebts(data.debts);
    if (data.targets) setTargets(data.targets);
    if (data.expenses) setExpenses(data.expenses);
    if (data.splitRule) setSplitRule(data.splitRule);
    if (data.activities) setActivities(data.activities);
    if (data.groceryList) setGroceryList(data.groceryList);
    if (data.groceryCatalog) setGroceryCatalog(data.groceryCatalog);
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
    activities?: ActivityItem[];
    groceryList?: ShoppingListItem[];
    groceryCatalog?: GroceryCatalogItem[];
  }) => {
    if (!syncCode || isInternalUpdate.current) return;
    const fullData = {
      profile: override?.profile || profile,
      projects: override?.projects || projects,
      debts: override?.debts || debts,
      targets: override?.targets || targets,
      expenses: override?.expenses || expenses,
      splitRule: override?.splitRule || splitRule,
      activities: override?.activities || activities,
      groceryList: override?.groceryList || groceryList,
      groceryCatalog: override?.groceryCatalog || groceryCatalog
    };
    pushCloudVault(syncCode, fullData, `${profile.husbandName} & ${profile.wifeName}`).then((res) => {
      if (res.success && res.vault) {
        setLastSyncTime(res.vault.lastUpdated || new Date().toISOString());
      }
    });
  };

  // Activity Logger Helper
  const logActivity = (title: string, type: ActivityItem['type'], amount?: number) => {
    const isHusband = currentUser?.name?.toLowerCase().includes('haytham') ?? true;
    const newActivity: ActivityItem = {
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorName: isHusband ? profile.husbandName.split(' ')[0] : profile.wifeName.split(' ')[0],
      actorRole: isHusband ? 'husband' : 'wife',
      type: type,
      title: title,
      amount: amount,
      reactions: {}
    };

    const updated = [newActivity, ...activities].slice(0, 30);
    setActivities(updated);
    pushCurrentStateToCloud({ activities: updated });
  };

  // Emoji Reaction Handler
  const handleReactToActivity = async (activityId: string, emoji: string) => {
    let currentList = activities;
    if (currentList.length === 0) {
      currentList = [
        {
          id: 'act-1',
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          actorName: profile.husbandName.split(' ')[0],
          actorRole: 'husband',
          type: 'PROJECT_COLLECTED',
          title: 'A încasat 4.500 lei pentru Proiectul Commercial Video Shoot',
          amount: 4500,
          reactions: { '🎉': 3, '❤️': 2, '🚀': 1 }
        },
        {
          id: 'act-2',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          actorName: profile.wifeName.split(' ')[0],
          actorRole: 'wife',
          type: 'EXPENSE_PAID',
          title: 'A bifat factura de Utilități & Curent (380 lei)',
          amount: 380,
          reactions: { '✅': 2, '❤️': 1 }
        }
      ];
    }

    const updated = currentList.map((a) => {
      if (a.id === activityId) {
        const reacts = { ...(a.reactions || {}) };
        reacts[emoji] = (reacts[emoji] || 0) + 1;
        return { ...a, reactions: reacts };
      }
      return a;
    });
    setActivities(updated);
    pushCurrentStateToCloud({ activities: updated });

    if (syncCode) {
      try {
        await fetch(`/api/sync/${syncCode}/react`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            activityId,
            emoji,
            actorName: currentUser?.name || profile.husbandName
          })
        });
      } catch (e) {
        // ignore
      }
    }
  };

  const handleDeleteActivity = (activityId: string) => {
    const updated = activities.filter((a) => a.id !== activityId);
    setActivities(updated);
    pushCurrentStateToCloud({ activities: updated });
  };

  const handleClearAllActivities = () => {
    setActivities([]);
    pushCurrentStateToCloud({ activities: [] });
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
    setProjects((prev) => {
      const idx = prev.findIndex((p) => p.id === project.id);
      const nextProjects = idx >= 0 ? prev.map((p) => (p.id === project.id ? project : p)) : [project, ...prev];
      pushCurrentStateToCloud({ projects: nextProjects });
      return nextProjects;
    });
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects((prev) => {
      const nextProjects = prev.filter((p) => p.id !== projectId);
      pushCurrentStateToCloud({ projects: nextProjects });
      return nextProjects;
    });
  };

  // Debt handlers
  const handleSaveDebt = (debt: BankDebt) => {
    setDebts((prev) => {
      const idx = prev.findIndex((d) => d.id === debt.id);
      const nextDebts = idx >= 0 ? prev.map((d) => (d.id === debt.id ? debt : d)) : [...prev, debt];
      pushCurrentStateToCloud({ debts: nextDebts });
      return nextDebts;
    });
  };

  const handleDeleteDebt = (debtId: string) => {
    setDebts((prev) => {
      const nextDebts = prev.filter((d) => d.id !== debtId);
      pushCurrentStateToCloud({ debts: nextDebts });
      return nextDebts;
    });
  };

  const handleMakeDebtPayment = (debtId: string, amount: number) => {
    setDebts((prev) => {
      const nextDebts = prev.map((d) => {
        if (d.id === debtId) {
          const newBal = Math.max(0, d.currentBalance - amount);
          return { ...d, currentBalance: newBal };
        }
        return d;
      });
      pushCurrentStateToCloud({ debts: nextDebts });
      return nextDebts;
    });
  };

  // Target handlers
  const handleSaveTarget = (target: SavingsTarget) => {
    setTargets((prev) => {
      const idx = prev.findIndex((t) => t.id === target.id);
      const nextTargets = idx >= 0 ? prev.map((t) => (t.id === target.id ? target : t)) : [...prev, target];
      pushCurrentStateToCloud({ targets: nextTargets });
      return nextTargets;
    });
  };

  const handleDeleteTarget = (targetId: string) => {
    setTargets((prev) => {
      const nextTargets = prev.filter((t) => t.id !== targetId);
      pushCurrentStateToCloud({ targets: nextTargets });
      return nextTargets;
    });
  };

  const handleDepositToTarget = (targetId: string, amount: number) => {
    setTargets((prev) => {
      const nextTargets = prev.map((t) => {
        if (t.id === targetId) {
          return { ...t, currentSavedAmount: t.currentSavedAmount + amount };
        }
        return t;
      });
      pushCurrentStateToCloud({ targets: nextTargets });
      return nextTargets;
    });
  };

  // Expense handlers
  const handleSaveExpense = (expense: HouseholdExpense) => {
    setExpenses((prev) => {
      const idx = prev.findIndex((e) => e.id === expense.id);
      const nextExpenses = idx >= 0 ? prev.map((e) => (e.id === expense.id ? expense : e)) : [...prev, expense];
      pushCurrentStateToCloud({ expenses: nextExpenses });
      return nextExpenses;
    });
  };

  const handleDeleteExpense = (expenseId: string) => {
    setExpenses((prev) => {
      const nextExpenses = prev.filter((e) => e.id !== expenseId);
      pushCurrentStateToCloud({ expenses: nextExpenses });
      return nextExpenses;
    });
  };

  // Grocery Handlers
  const handleUpdateGroceryList = (nextList: ShoppingListItem[]) => {
    setGroceryList(nextList);
    saveGroceryList(nextList);
    pushCurrentStateToCloud({ groceryList: nextList });
  };

  const handleUpdateGroceryCatalog = (nextCatalog: GroceryCatalogItem[]) => {
    setGroceryCatalog(nextCatalog);
    saveGroceryCatalog(nextCatalog);
    pushCurrentStateToCloud({ groceryCatalog: nextCatalog });
  };

  const handleAddDirectExpense = (expenseData: Omit<HouseholdExpense, 'id'>) => {
    const newExpense: HouseholdExpense = {
      ...expenseData,
      id: 'exp-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4)
    };
    const nextExpenses = [newExpense, ...expenses];
    setExpenses(nextExpenses);
    saveExpenses(nextExpenses);
    pushCurrentStateToCloud({ expenses: nextExpenses });

    const newAct: ActivityItem = {
      id: 'act-' + Date.now(),
      timestamp: new Date().toISOString(),
      actorName: currentUser?.name || profile.husbandName,
      actorRole: currentUser?.role || 'husband',
      type: 'EXPENSE_PAID',
      title: `${newExpense.title} (${newExpense.amount.toFixed(2)} ${profile.currencySymbol})`,
      amount: newExpense.amount,
      reactions: { '🛒': 1, '👍': 1 }
    };
    logActivityLocallyAndSync(newAct);
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
        currentUser={currentUser}
        onOpenAuth={() => setShowAuthModal(true)}
        onLogout={() => {
          logoutAccount();
          setCurrentUser(null);
        }}
        onOpenActivityFeed={() => setIsActivityFeedOpen(true)}
        onOpenScanner={() => setIsReceiptScannerOpen(true)}
      />

      {/* Main Tab View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-28 lg:pb-8">
        {currentTab === 'dashboard' && (
          <DashboardView
            profile={profile}
            projects={projects}
            debts={debts}
            targets={targets}
            expenses={expenses}
            splitRule={splitRule}
            syncCode={syncCode}
            onNavigate={setCurrentTab}
            onOpenCollectModal={(project) => setCollectProject(project)}
            onOpenNewProject={() => setEditingProject(null)}
            onOpenNewExpense={() => setEditingExpense(null)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenScanner={() => setIsReceiptScannerOpen(true)}
            onOpenReport={() => setIsMonthlyReportOpen(true)}
            onOpenGearTax={() => setIsGearTaxOpen(true)}
            onOpenActivityFeed={() => setIsActivityFeedOpen(true)}
            onDepositMoreTarget={(targetId) => {
              const target = targets.find((t) => t.id === targetId);
              if (target) setEditingTarget(target);
            }}
          />
        )}

        {currentTab === 'freelance' && (
          <FreelanceCollectorView
            projects={projects}
            profile={profile}
            onOpenNewProject={() => setEditingProject(null)}
            onEditProject={(p) => setEditingProject(p)}
            onDeleteProject={handleDeleteProject}
            onOpenCollectModal={(p) => setCollectProject(p)}
          />
        )}

        {currentTab === 'budget' && (
          <HouseholdBudgetView
            expenses={expenses}
            profile={profile}
            onOpenNewExpense={() => setEditingExpense(null)}
            onOpenScanner={() => setIsReceiptScannerOpen(true)}
            onEditExpense={(e) => setEditingExpense(e)}
            onDeleteExpense={handleDeleteExpense}
          />
        )}

        {currentTab === 'groceries' && (
          <GroceryOptimizerView
            profile={profile}
            shoppingList={groceryList}
            onUpdateShoppingList={handleUpdateGroceryList}
            groceryCatalog={groceryCatalog}
            onUpdateGroceryCatalog={handleUpdateGroceryCatalog}
            onAddExpense={handleAddDirectExpense}
            cashBalances={cashBalances}
            onOpenReceiptScanner={() => setIsReceiptScannerOpen(true)}
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
            onDepositToTarget={handleDepositToTarget}
          />
        )}

        {currentTab === 'calendar' && (
          <CashFlowCalendarView
            profile={profile}
            projects={projects}
            debts={debts}
            expenses={expenses}
            currencySymbol={profile.currencySymbol}
            lang={profile.language || 'ro'}
            onPayDebt={handleMakeDebtPayment}
            onCollectProject={(id, amt) => handleConfirmCollection(id, amt, false)}
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

      {/* Couple Activity Feed Modal */}
      <ActivityFeedModal
        isOpen={isActivityFeedOpen}
        onClose={() => setIsActivityFeedOpen(false)}
        activities={activities}
        onReact={handleReactToActivity}
        onDeleteActivity={handleDeleteActivity}
        onClearAllActivities={handleClearAllActivities}
        currencySymbol={profile.currencySymbol}
        lang={profile.language || 'ro'}
      />

      {/* AI Receipt Scanner Modal */}
      <ReceiptScannerModal
        isOpen={isReceiptScannerOpen}
        onClose={() => setIsReceiptScannerOpen(false)}
        cashBalances={cashBalances}
        wifeName={profile.wifeName}
        husbandName={profile.husbandName}
        onAddExpense={(exp) => {
          handleSaveExpense(exp);
          logActivity(`A adăugat cheltuiala scanată: ${exp.title} (${exp.amount} ${profile.currencySymbol})`, 'EXPENSE_PAID', exp.amount);
        }}
        currencySymbol={profile.currencySymbol}
        lang={profile.language || 'ro'}
      />

      {/* Monthly Report Statement Modal */}
      <MonthlyReportModal
        isOpen={isMonthlyReportOpen}
        onClose={() => setIsMonthlyReportOpen(false)}
        profile={profile}
        projects={projects}
        debts={debts}
        targets={targets}
        expenses={expenses}
        currencySymbol={profile.currencySymbol}
        lang={profile.language || 'ro'}
      />

      {/* Haytham Pro Gear ROI & Tax Buffer Modal */}
      <GearTaxToolsModal
        isOpen={isGearTaxOpen}
        onClose={() => setIsGearTaxOpen(false)}
        currencySymbol={profile.currencySymbol}
        lang={profile.language || 'ro'}
      />

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
          cashBalances={cashBalances}
          onClose={() => setEditingExpense(undefined)}
          onSave={handleSaveExpense}
        />
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={(user, vaultData) => {
          setCurrentUser(user);
          if (user.vaultCode) {
            setSyncCode(user.vaultCode);
            setStoredVaultCode(user.vaultCode);
          }
          if (vaultData) {
            applyRemoteSnapshot(vaultData);
          }
        }}
        lang={profile.language || 'ro'}
      />
    </div>
  );
};
