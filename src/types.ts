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
  language?: string;
  themePreset?: string;
  themeMode?: string;
}

export interface ActivityItem {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: 'husband' | 'wife';
  type: 'PROJECT_COLLECTED' | 'EXPENSE_PAID' | 'DEBT_REDUCED' | 'TARGET_DEPOSIT' | 'PROFILE_UPDATED';
  title: string;
  amount?: number;
  reactions: Record<string, number>;
}

export interface GearItem {
  id: string;
  name: string;
  cost: number;
  purchasedDate: string;
  feePerShoot: number;
  shootsCompleted: number;
  notes?: string;
}

export interface ReceiptItemLine {
  name: string;
  price: number;
}

export interface ReceiptScanResult {
  merchantName: string;
  totalAmount: number;
  currency: string;
  date: string;
  suggestedCategory: ExpenseCategory;
  itemizedList?: ReceiptItemLine[];
  items?: string[];
  rawSummary?: string;
}

export interface CashPocketsBalance {
  wifeSalaryBalance: number;
  freelanceBufferBalance: number;
  sharedPoolBalance: number;
}

export type SupermarketId =
  | 'LIDL'
  | 'KAUFLAND'
  | 'CARREFOUR'
  | 'MEGA_IMAGE'
  | 'PENNY'
  | 'AUCHAN';

export type GroceryCategory =
  | 'DAIRY'
  | 'MEAT_FISH'
  | 'FRUITS_VEGGIES'
  | 'BAKERY'
  | 'PANTRY'
  | 'CLEANING'
  | 'BEVERAGES'
  | 'SNACKS';

export type GroceryQualityPreference = 'CHEAPEST' | 'BEST_VALUE' | 'PREMIUM';

export interface StorePriceInfo {
  price: number;
  promo?: boolean;
  qualityScore: number; // 1 to 5 stars
  brandName?: string;
}

export type GroceryCuisineType = 'MOROCCAN' | 'ROMANIAN' | 'UNIVERSAL';

export interface GroceryCatalogItem {
  id: string;
  name: string;
  category: GroceryCategory;
  defaultUnit: string; // 'kg', 'L', 'buc', 'pachet', '500g'
  stores: Partial<Record<SupermarketId, StorePriceInfo>>;
  cuisine?: GroceryCuisineType;
  culturalTag?: string;
  notes?: string;
}

export interface ShoppingListItem {
  id: string;
  catalogItemId?: string;
  name: string;
  category: GroceryCategory;
  quantity: number;
  unit: string;
  isChecked: boolean;
  preferredStoreOverride?: SupermarketId;
  notes?: string;
}

export interface GroceryTripLog {
  id: string;
  date: string;
  storeName: string;
  totalSpent: number;
  itemCount: number;
  payer: ExpensePayer;
}

