import {
  HouseholdProfile,
  FreelanceProject,
  BankDebt,
  SavingsTarget,
  HouseholdExpense,
  WindfallSplitRule,
  GroceryCatalogItem,
  ShoppingListItem,
  SavedRecipeReel
} from '../types';
import {
  DEFAULT_PROFILE,
  DEFAULT_PROJECTS,
  DEFAULT_DEBTS,
  DEFAULT_TARGETS,
  DEFAULT_EXPENSES,
  DEFAULT_SPLIT_RULE
} from './defaultData';
import {
  DEFAULT_GROCERY_CATALOG,
  DEFAULT_SHOPPING_LIST,
  DEFAULT_SAVED_RECIPES
} from './groceryData';

const KEYS = {
  PROFILE: 'housevault_profile',
  PROJECTS: 'housevault_projects',
  DEBTS: 'housevault_debts',
  TARGETS: 'housevault_targets',
  EXPENSES: 'housevault_expenses',
  SPLIT_RULE: 'housevault_split_rule',
  GROCERY_LIST: 'housevault_grocery_list',
  GROCERY_CATALOG: 'housevault_grocery_catalog',
  SAVED_RECIPES: 'housevault_saved_recipes'
};

export function loadProfile(): HouseholdProfile {
  try {
    const raw = localStorage.getItem(KEYS.PROFILE);
    if (!raw) return DEFAULT_PROFILE;
    const parsed = JSON.parse(raw);
    if (parsed.husbandName?.includes('Alex')) {
      parsed.husbandName = 'Haytham (Videograf)';
    }
    if (parsed.wifeName?.includes('Elena')) {
      parsed.wifeName = 'Cati (IT Support)';
    }
    return parsed;
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
    if (!raw) return DEFAULT_TARGETS;
    const parsed: SavingsTarget[] = JSON.parse(raw);
    const hasSeatAteca = parsed.some(t => t.title.toLowerCase().includes('seat') || t.title.toLowerCase().includes('ateca'));
    if (!hasSeatAteca) {
      const updated = [DEFAULT_TARGETS[0], ...parsed];
      saveTargets(updated);
      return updated;
    }
    return parsed;
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

export function loadGroceryList(): ShoppingListItem[] {
  try {
    const raw = localStorage.getItem(KEYS.GROCERY_LIST);
    if (!raw) return DEFAULT_SHOPPING_LIST;
    const parsed = JSON.parse(raw);
    const hasCorrupted = JSON.stringify(parsed).includes('Ä') || JSON.stringify(parsed).includes('Ã');
    if (hasCorrupted) {
      saveGroceryList(DEFAULT_SHOPPING_LIST);
      return DEFAULT_SHOPPING_LIST;
    }
    return parsed;
  } catch {
    return DEFAULT_SHOPPING_LIST;
  }
}

export function saveGroceryList(items: ShoppingListItem[]): void {
  localStorage.setItem(KEYS.GROCERY_LIST, JSON.stringify(items));
}

export function loadGroceryCatalog(): GroceryCatalogItem[] {
  try {
    const raw = localStorage.getItem(KEYS.GROCERY_CATALOG);
    if (!raw) return DEFAULT_GROCERY_CATALOG;
    const parsed = JSON.parse(raw);
    const hasCorrupted = JSON.stringify(parsed).includes('Ä') || JSON.stringify(parsed).includes('Ã') || parsed.length < DEFAULT_GROCERY_CATALOG.length;
    if (hasCorrupted) {
      saveGroceryCatalog(DEFAULT_GROCERY_CATALOG);
      return DEFAULT_GROCERY_CATALOG;
    }
    return parsed;
  } catch {
    return DEFAULT_GROCERY_CATALOG;
  }
}

export function saveGroceryCatalog(catalog: GroceryCatalogItem[]): void {
  localStorage.setItem(KEYS.GROCERY_CATALOG, JSON.stringify(catalog));
}

export function loadSavedRecipes(): SavedRecipeReel[] {
  try {
    const raw = localStorage.getItem(KEYS.SAVED_RECIPES);
    if (!raw) return DEFAULT_SAVED_RECIPES;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_SAVED_RECIPES;
    return parsed;
  } catch {
    return DEFAULT_SAVED_RECIPES;
  }
}

export function saveSavedRecipes(recipes: SavedRecipeReel[]): void {
  localStorage.setItem(KEYS.SAVED_RECIPES, JSON.stringify(recipes));
}


export function resetAllToDefaults(): {
  profile: HouseholdProfile;
  projects: FreelanceProject[];
  debts: BankDebt[];
  targets: SavingsTarget[];
  expenses: HouseholdExpense[];
  splitRule: WindfallSplitRule;
  groceryList: ShoppingListItem[];
  groceryCatalog: GroceryCatalogItem[];
} {
  saveProfile(DEFAULT_PROFILE);
  saveProjects(DEFAULT_PROJECTS);
  saveDebts(DEFAULT_DEBTS);
  saveTargets(DEFAULT_TARGETS);
  saveExpenses(DEFAULT_EXPENSES);
  saveSplitRule(DEFAULT_SPLIT_RULE);
  saveGroceryList(DEFAULT_SHOPPING_LIST);
  saveGroceryCatalog(DEFAULT_GROCERY_CATALOG);

  return {
    profile: DEFAULT_PROFILE,
    projects: DEFAULT_PROJECTS,
    debts: DEFAULT_DEBTS,
    targets: DEFAULT_TARGETS,
    expenses: DEFAULT_EXPENSES,
    splitRule: DEFAULT_SPLIT_RULE,
    groceryList: DEFAULT_SHOPPING_LIST,
    groceryCatalog: DEFAULT_GROCERY_CATALOG
  };
}

export function exportBackupJson(
  profile: HouseholdProfile,
  projects: FreelanceProject[],
  debts: BankDebt[],
  targets: SavingsTarget[],
  expenses: HouseholdExpense[],
  splitRule: WindfallSplitRule,
  groceryList?: ShoppingListItem[],
  groceryCatalog?: GroceryCatalogItem[]
): string {
  const data = {
    version: 2,
    exportedAt: new Date().toISOString(),
    profile,
    projects,
    debts,
    targets,
    expenses,
    splitRule,
    groceryList: groceryList || loadGroceryList(),
    groceryCatalog: groceryCatalog || loadGroceryCatalog()
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
    groceryList?: ShoppingListItem[];
    groceryCatalog?: GroceryCatalogItem[];
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
    const groceryList = Array.isArray(parsed.groceryList) ? parsed.groceryList : DEFAULT_SHOPPING_LIST;
    const groceryCatalog = Array.isArray(parsed.groceryCatalog) ? parsed.groceryCatalog : DEFAULT_GROCERY_CATALOG;

    saveProfile(profile);
    saveProjects(projects);
    saveDebts(debts);
    saveTargets(targets);
    saveExpenses(expenses);
    saveSplitRule(splitRule);
    saveGroceryList(groceryList);
    saveGroceryCatalog(groceryCatalog);

    return {
      success: true,
      data: { profile, projects, debts, targets, expenses, splitRule, groceryList, groceryCatalog }
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to parse JSON file' };
  }
}
