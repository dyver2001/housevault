export type ProjectStatus =
  | 'PENDING_DEPOSIT'
  | 'IN_PROGRESS'
  | 'INVOICED'
  | 'OVERDUE'
  | 'COLLECTED';

export type ProjectCategory =
  | 'COMMERCIAL'
  | 'EVENT_WEDDING'
  | 'CORPORATE'
  | 'MUSIC_VIDEO'
  | 'POST_EDITING'
  | 'DRONE_PHOTO';

export interface FreelanceProject {
  id: string;
  clientName: string;
  projectTitle: string;
  category: ProjectCategory;
  totalFee: number;
  depositReceived: number;
  invoiceNumber: string;
  dueDate: string;
  status: ProjectStatus;
  clientPhone: string;
  clientEmail: string;
  notes: string;
}

export interface WindfallSplitRule {
  debtPayoffPercent: number; // default 35
  savingsTargetPercent: number; // default 35
  businessTaxReservePercent: number; // default 15
  safePocketPercent: number; // default 15
}

export type DebtType =
  | 'CREDIT_CARD'
  | 'PERSONAL_LOAN'
  | 'OVERDRAFT'
  | 'EQUIPMENT_LOAN';

export interface BankDebt {
  id: string;
  bankName: string;
  debtType: DebtType;
  currentBalance: number;
  originalBalance: number;
  interestRateApr: number;
  minMonthlyPayment: number;
  targetMonthlyPayment: number;
  dueDayOfMonth: number;
  notes: string;
}

export type TargetPriority = 'CRITICAL' | 'MEDIUM' | 'FLEXIBLE';

export interface SavingsTarget {
  id: string;
  title: string;
  targetAmount: number;
  currentSavedAmount: number;
  priority: TargetPriority;
  category: string;
  deadline: string;
  iconName: string;
}

export type ExpenseCategory =
  | 'HOUSING'
  | 'UTILITIES'
  | 'GROCERIES'
  | 'INTERNET_PHONE'
  | 'HEALTH'
  | 'TRANSPORT'
  | 'VIDEO_SOFTWARE'
  | 'FAMILY_LEISURE'
  | 'MISC';

export type ExpensePayer =
  | 'WIFE_SALARY'
  | 'FREELANCE_BUFFER'
  | 'SHARED_POOL';

export interface HouseholdExpense {
  id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  isFixed: boolean;
  assignedPayer: ExpensePayer;
}

export interface HouseholdProfile {
  currencySymbol: string;
  currencyCode: string;
  husbandName: string;
  wifeName: string;
  wifeMonthlySalary: number;
  husbandEstMonthlyGross: number;
  emergencyFundMonthsGoal: number;
  language?: 'ro' | 'en';
  themePreset?: 'emerald' | 'amber' | 'cyan' | 'rose' | 'purple' | 'sunset' | 'obsidian';
  themeMode?: 'dark' | 'light' | 'system';
}
