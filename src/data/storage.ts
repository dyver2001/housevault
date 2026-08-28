import {
  HouseholdProfile,
  FreelanceProject,
  BankDebt,
  SavingsTarget,
  HouseholdExpense,
  WindfallSplitRule
} from '../types';
import {
  DEFAULT_PROFILE,
  DEFAULT_PROJECTS,
  DEFAULT_DEBTS,
  DEFAULT_TARGETS,
  DEFAULT_EXPENSES,
  DEFAULT_SPLIT_RULE
} from './defaultData';

const KEYS = {
  PROFILE: 'housevault_profile',
  PROJECTS: 'housevault_projects',
  DEBTS: 'housevault_debts',
  TARGETS: 'housevault_targets',
  EXPENSES: 'housevault_expenses',
  SPLIT_RULE: 'housevault_split_rule'
};

export function loadProfile(): HouseholdProfile {
  try {
    const raw = localStorage.getItem(KEYS.PROFILE);
    return raw ? JSON.parse(raw) : DEFAULT_PROFILE;
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveProfile(profile: HouseholdProfile): void {
  localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
}

export function loadProjects(): FreelanceProject[] {
  try {
    const raw = localStorage.getItem(KEYS.PROJECTS);
    return raw ? JSON.parse(raw) : DEFAULT_PROJECTS;
  } catch {
    return DEFAULT_PROJECTS;
  }
}

export function saveProjects(projects: FreelanceProject[]): void {
  localStorage.setItem(KEYS.PROJECTS, JSON.stringify(projects));
}

export function loadDebts(): BankDebt[] {
  try {
    const raw = localStorage.getItem(KEYS.DEBTS);
    return raw ? JSON.parse(raw) : DEFAULT_DEBTS;
  } catch {
    return DEFAULT_DEBTS;
  }
}

export function saveDebts(debts: BankDebt[]): void {
  localStorage.setItem(KEYS.DEBTS, JSON.stringify(debts));
}

export function loadTargets(): SavingsTarget[] {
  try {
    const raw = localStorage.getItem(KEYS.TARGETS);
    return raw ? JSON.parse(raw) : DEFAULT_TARGETS;
  } catch {
    return DEFAULT_TARGETS;
  }
}

export function saveTargets(targets: SavingsTarget[]): void {
  localStorage.setItem(KEYS.TARGETS, JSON.stringify(targets));
}

export function loadExpenses(): HouseholdExpense[] {
  try {
    const raw = localStorage.getItem(KEYS.EXPENSES);
    return raw ? JSON.parse(raw) : DEFAULT_EXPENSES;
  } catch {
    return DEFAULT_EXPENSES;
  }
}

export function saveExpenses(expenses: HouseholdExpense[]): void {
  localStorage.setItem(KEYS.EXPENSES, JSON.stringify(expenses));
}

export function loadSplitRule(): WindfallSplitRule {
  try {
    const raw = localStorage.getItem(KEYS.SPLIT_RULE);
    return raw ? JSON.parse(raw) : DEFAULT_SPLIT_RULE;
  } catch {
    return DEFAULT_SPLIT_RULE;
  }
}

export function saveSplitRule(rule: WindfallSplitRule): void {
  localStorage.setItem(KEYS.SPLIT_RULE, JSON.stringify(rule));
}

export function resetAllToDefaults(): {
  profile: HouseholdProfile;
  projects: FreelanceProject[];
  debts: BankDebt[];
  targets: SavingsTarget[];
  expenses: HouseholdExpense[];
  splitRule: WindfallSplitRule;
} {
  saveProfile(DEFAULT_PROFILE);
  saveProjects(DEFAULT_PROJECTS);
  saveDebts(DEFAULT_DEBTS);
  saveTargets(DEFAULT_TARGETS);
  saveExpenses(DEFAULT_EXPENSES);
  saveSplitRule(DEFAULT_SPLIT_RULE);

  return {
    profile: DEFAULT_PROFILE,
    projects: DEFAULT_PROJECTS,
    debts: DEFAULT_DEBTS,
    targets: DEFAULT_TARGETS,
    expenses: DEFAULT_EXPENSES,
    splitRule: DEFAULT_SPLIT_RULE
  };
}

export function exportBackupJson(
  profile: HouseholdProfile,
  projects: FreelanceProject[],
  debts: BankDebt[],
  targets: SavingsTarget[],
  expenses: HouseholdExpense[],
  splitRule: WindfallSplitRule
): string {
  const data = {
    version: 1,
    exportedAt: new Date().toISOString(),
    profile,
    projects,
    debts,
    targets,
    expenses,
    splitRule
  };
  return JSON.stringify(data, null, 2);
}

export function importBackupJson(jsonString: string): {
  success: boolean;
  data?: {
    profile: HouseholdProfile;
    projects: FreelanceProject[];
    debts: BankDebt[];
    targets: SavingsTarget[];
    expenses: HouseholdExpense[];
    splitRule: WindfallSplitRule;
  };
  error?: string;
} {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== 'object') {
      return { success: false, error: 'Invalid JSON format' };
    }

    const profile = parsed.profile || DEFAULT_PROFILE;
    const projects = Array.isArray(parsed.projects) ? parsed.projects : DEFAULT_PROJECTS;
    const debts = Array.isArray(parsed.debts) ? parsed.debts : DEFAULT_DEBTS;
    const targets = Array.isArray(parsed.targets) ? parsed.targets : DEFAULT_TARGETS;
    const expenses = Array.isArray(parsed.expenses) ? parsed.expenses : DEFAULT_EXPENSES;
    const splitRule = parsed.splitRule || DEFAULT_SPLIT_RULE;

    saveProfile(profile);
    saveProjects(projects);
    saveDebts(debts);
    saveTargets(targets);
    saveExpenses(expenses);
    saveSplitRule(splitRule);

    return {
      success: true,
      data: { profile, projects, debts, targets, expenses, splitRule }
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to parse JSON file' };
  }
}
