import {
  HouseholdProfile,
  FreelanceProject,
  BankDebt,
  SavingsTarget,
  HouseholdExpense,
  WindfallSplitRule
} from '../types';

export const DEFAULT_PROFILE: HouseholdProfile = {
  currencySymbol: 'lei',
  currencyCode: 'RON',
  husbandName: 'Haytham (Videograf)',
  wifeName: 'Cati (IT Support)',
  wifeMonthlySalary: 6500.0,
  husbandEstMonthlyGross: 12500.0,
  emergencyFundMonthsGoal: 6,
  language: 'ro',
  themePreset: 'emerald',
  themeMode: 'dark'
};

export const DEFAULT_SPLIT_RULE: WindfallSplitRule = {
  debtPayoffPercent: 35,
  savingsTargetPercent: 35,
  businessTaxReservePercent: 15,
  safePocketPercent: 15
};

export const DEFAULT_PROJECTS: FreelanceProject[] = [
  {
    id: 'proj-1',
    clientName: 'Apex Media Agency',
    projectTitle: 'Spot Publicitar Video Brand 4K',
    category: 'COMMERCIAL',
    totalFee: 8500.0,
    depositReceived: 4000.0,
    invoiceNumber: 'INV-2026-081',
    dueDate: 'Vinerea Viitoare',
    status: 'INVOICED',
    clientPhone: '+40 722 123 456',
    clientEmail: 'contabilitate@apexagency.ro',
    notes: 'Colorizare finalizată. Se așteaptă plata restului de 4.500 lei.'
  },
  {
    id: 'proj-2',
    clientName: 'Nuntă Radu & Andreea',
    projectTitle: 'Pachet Cinematic Video Nuntă + Dronă',
    category: 'EVENT_WEDDING',
    totalFee: 7500.0,
    depositReceived: 3500.0,
    invoiceNumber: 'INV-2026-079',
    dueDate: 'Sfârșitul Lunii',
    status: 'INVOICED',
    clientPhone: '+40 733 987 654',
    clientEmail: 'andreea.radu.nunta@gmail.com',
    notes: 'Materialele brute și teaserul predate. Rest de încasat 4.000 lei la predarea finală.'
  },
  {
    id: 'proj-3',
    clientName: 'TechSummit România',
    projectTitle: 'Filmări Conferință 3 Zile & Recaps',
    category: 'CORPORATE',
    totalFee: 6000.0,
    depositReceived: 0.0,
    invoiceNumber: 'INV-2026-068',
    dueDate: 'Depășit termenul (10 zile)',
    status: 'OVERDUE',
    clientPhone: '+40 744 555 777',
    clientEmail: 'financiar@techsummit.ro',
    notes: 'Termenul de plată a fost 15 zile. Necesită mesaj de reamintire WhatsApp!'
  },
  {
    id: 'proj-4',
    clientName: 'Resort Cazare Transilvania',
    projectTitle: 'Pachet 6x Reels Promovare Turism',
    category: 'COMMERCIAL',
    totalFee: 4200.0,
    depositReceived: 2100.0,
    invoiceNumber: 'INV-2026-085',
    dueDate: 'În 2 Săptămâni',
    status: 'IN_PROGRESS',
    clientPhone: '+40 755 302 118',
    clientEmail: 'marketing@resort-transilvania.ro',
    notes: 'Filmările au fost realizate. Se lucrează la montaj.'
  },
  {
    id: 'proj-5',
    clientName: 'Brand Haine UrbanStyle',
    projectTitle: 'Lookbook Teaser Toamnă',
    category: 'COMMERCIAL',
    totalFee: 3800.0,
    depositReceived: 3800.0,
    invoiceNumber: 'INV-2026-072',
    dueDate: 'Achitat',
    status: 'COLLECTED',
    clientPhone: '+40 766 778 992',
    clientEmail: 'office@urbanstyle.ro',
    notes: 'Plătit integral prin virament bancar.'
  }
];

export const DEFAULT_DEBTS: BankDebt[] = [
  {
    id: 'debt-1',
    bankName: 'Card Credit Banca Transilvania',
    debtType: 'CREDIT_CARD',
    currentBalance: 7500.0,
    originalBalance: 12000.0,
    interestRateApr: 21.5,
    minMonthlyPayment: 350.0,
    targetMonthlyPayment: 1200.0,
    dueDayOfMonth: 18,
    notes: 'Cea mai mare dobândă! Prima țintă pentru lichidare rapidă din încasări.'
  },
  {
    id: 'debt-2',
    bankName: 'Credit Echipament Foto-Video',
    debtType: 'EQUIPMENT_LOAN',
    currentBalance: 14500.0,
    originalBalance: 22000.0,
    interestRateApr: 9.2,
    minMonthlyPayment: 650.0,
    targetMonthlyPayment: 1000.0,
    dueDayOfMonth: 5,
    notes: 'Rate pentru camera video cinema și obiective.'
  },
  {
    id: 'debt-3',
    bankName: 'Descoperire de Cont (Overdraft)',
    debtType: 'OVERDRAFT',
    currentBalance: 2800.0,
    originalBalance: 5000.0,
    interestRateApr: 16.0,
    minMonthlyPayment: 200.0,
    targetMonthlyPayment: 600.0,
    dueDayOfMonth: 25,
    notes: 'Linie de credit utilizată în sezonul rece.'
  }
];

export const DEFAULT_TARGETS: SavingsTarget[] = [
  {
    id: 'target-1',
    title: 'Avans Casă / Apartament Nou',
    targetAmount: 120000.0,
    currentSavedAmount: 32000.0,
    priority: 'CRITICAL',
    category: 'Locuință Familie',
    deadline: 'Dec 2027',
    iconName: 'home'
  },
  {
    id: 'target-2',
    title: 'Fond Siguranță 6 Luni',
    targetAmount: 40000.0,
    currentSavedAmount: 14000.0,
    priority: 'CRITICAL',
    category: 'Siguranță',
    deadline: 'Iun 2027',
    iconName: 'shield'
  },
  {
    id: 'target-3',
    title: 'Cameră Sony FX3 + Obiective GM',
    targetAmount: 25000.0,
    currentSavedAmount: 11000.0,
    priority: 'MEDIUM',
    category: 'Echipamente Video',
    deadline: 'Nov 2026',
    iconName: 'camera'
  },
  {
    id: 'target-4',
    title: 'Vacanță Familie de Vară',
    targetAmount: 9000.0,
    currentSavedAmount: 4500.0,
    priority: 'FLEXIBLE',
    category: 'Timp Liber & Familie',
    deadline: 'Aug 2027',
    iconName: 'airplane'
  }
];

export const DEFAULT_EXPENSES: HouseholdExpense[] = [
  {
    id: 'exp-1',
    title: 'Chirie Apartament',
    amount: 2400.0,
    category: 'HOUSING',
    isFixed: true,
    assignedPayer: 'WIFE_SALARY'
  },
  {
    id: 'exp-2',
    title: 'Cumpărături & Mâncare Familie',
    amount: 1800.0,
    category: 'GROCERIES',
    isFixed: true,
    assignedPayer: 'WIFE_SALARY'
  },
  {
    id: 'exp-3',
    title: 'Întreținere, Curent, Gaze & Apă',
    amount: 550.0,
    category: 'UTILITIES',
    isFixed: true,
    assignedPayer: 'WIFE_SALARY'
  },
  {
    id: 'exp-4',
    title: 'Internet Fibră & 2x Abonamente Mobile',
    amount: 180.0,
    category: 'INTERNET_PHONE',
    isFixed: true,
    assignedPayer: 'WIFE_SALARY'
  },
  {
    id: 'exp-5',
    title: 'Asigurare Sănătate & Farmacie',
    amount: 350.0,
    category: 'HEALTH',
    isFixed: true,
    assignedPayer: 'WIFE_SALARY'
  },
  {
    id: 'exp-6',
    title: 'Combustibil & Transport',
    amount: 450.0,
    category: 'TRANSPORT',
    isFixed: true,
    assignedPayer: 'WIFE_SALARY'
  },
  {
    id: 'exp-7',
    title: 'Abonamente Adobe CC & Stocare Cloud',
    amount: 280.0,
    category: 'VIDEO_SOFTWARE',
    isFixed: true,
    assignedPayer: 'FREELANCE_BUFFER'
  },
  {
    id: 'exp-8',
    title: 'Ieșiri în Oraș & Recreere Familie',
    amount: 500.0,
    category: 'FAMILY_LEISURE',
    isFixed: false,
    assignedPayer: 'FREELANCE_BUFFER'
  }
];
