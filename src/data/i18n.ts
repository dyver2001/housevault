export type Language = 'ro' | 'en';

export interface Translations {
  appTitle: string;
  tagline: string;
  tabs: {
    dashboard: string;
    freelance: string;
    budget: string;
    groceries: string;
    debt: string;
    targets: string;
    ai: string;
  };
  actions: {
    getOnPhone: string;
    settings: string;
    logGig: string;
    addExpense: string;
    addDebt: string;
    addVault: string;
    collect: string;
    exportJson: string;
    importJson: string;
    resetDefaults: string;
    save: string;
    cancel: string;
  };
  dashboard: {
    engineTitle: string;
    engineDesc: string;
    uncollectedInflow: string;
    gigsAwaiting: string;
    steadySalary: string;
    fixedCoverage: string;
    monthlySurplus: string;
    bankDebt: string;
    paidOff: string;
    savingsVaults: string;
    totalGoal: string;
    goldenRule: string;
    debtPaydown: string;
    houseVault: string;
    taxGear: string;
    safePocket: string;
  };
  settings: {
    title: string;
    subtitle: string;
    language: string;
    currency: string;
    themePalette: string;
    themeMode: string;
    coupleProfile: string;
    windfallSplit: string;
    dataPortability: string;
  };
}

export const translations: Record<Language, Translations> = {
  ro: {
    appTitle: "HouseVault",
    tagline: "Elena susține cheltuielile fixe. Alex accelerează averea familiei.",
    tabs: {
      dashboard: "Tablou de Bord",
      freelance: "Încasări Freelance",
      budget: "Buget Familie",
      groceries: "🛒 Cumpărături & Prețuri",
      debt: "Achitare Datorii",
      targets: "Seifuri Economii",
      ai: "Consilier AI"
    },
    actions: {
      getOnPhone: "Instalează pe Telefon",
      settings: "Setări & Sincronizare",
      logGig: "Adaugă Proiect",
      addExpense: "Adaugă Cheltuială",
      addDebt: "Adaugă Datorie",
      addVault: "Seif Nou",
      collect: "Încasează & Împarte",
      exportJson: "Exportă JSON",
      importJson: "Importă Date",
      resetDefaults: "Resetează la Valori Implicite",
      save: "Salvează Modificările",
      cancel: "Anulează"
    },
    dashboard: {
      engineTitle: "Motor Financiar de Familie",
      engineDesc: "Salariul stabil IT al Elenei acoperă 100% din nevoile de bază, iar încasările din videografie ale lui Alex lichidează datoriile bancare și umplu seifurile pentru casă.",
      uncollectedInflow: "Încasări în Așteptare",
      gigsAwaiting: "proiecte de încasat",
      steadySalary: "Salariu Fix de Bază",
      fixedCoverage: "acoperire costuri fixe",
      monthlySurplus: "surplus lunar garantat",
      bankDebt: "Datorii Bancare",
      paidOff: "achitat din sold",
      savingsVaults: "Seifuri Economii",
      totalGoal: "Obiectiv total",
      goldenRule: "Regula de Aur a Împărțirii (35/35/15/15)",
      debtPaydown: "Achitare Datorii",
      houseVault: "Seif Avans Casă",
      taxGear: "Taxe & Echipamente",
      safePocket: "Bani de Buzunar"
    },
    settings: {
      title: "Setări & Personalizare",
      subtitle: "Personalizează moneda, paleta de culori, limba și regulile de împărțire",
      language: "Limbă / Language",
      currency: "Monedă Națională",
      themePalette: "Paletă de Culori",
      themeMode: "Mod Afișare (Temă)",
      coupleProfile: "Profil & Venituri Cuplu",
      windfallSplit: "Regula de Distribuire a Încasărilor (Windfall Split)",
      dataPortability: "Backup & Sincronizare pe Telefoane"
    }
  },
  en: {
    appTitle: "HouseVault",
    tagline: "Elena anchors bills. Alex accelerates wealth.",
    tabs: {
      dashboard: "Dashboard",
      freelance: "Freelance Cash",
      budget: "House Budget",
      groceries: "🛒 Groceries & Prices",
      debt: "Bank Debts",
      targets: "Savings Vaults",
      ai: "AI Coach"
    },
    actions: {
      getOnPhone: "Get on Phone",
      settings: "Settings & Sync",
      logGig: "Log New Gig",
      addExpense: "Add Bill",
      addDebt: "Add Bank Debt",
      addVault: "New Savings Vault",
      collect: "Collect & Split",
      exportJson: "Export JSON",
      importJson: "Import Backup",
      resetDefaults: "Reset to Defaults",
      save: "Save Changes",
      cancel: "Cancel"
    },
    dashboard: {
      engineTitle: "Couple Financial Engine",
      engineDesc: "Elena's IT salary guarantees fixed survival costs, leaving freelance windfalls to annihilate debt and fund your house vault.",
      uncollectedInflow: "Uncollected Inflow",
      gigsAwaiting: "gigs awaiting payment",
      steadySalary: "Steady Salary Anchor",
      fixedCoverage: "coverage of fixed bills",
      monthlySurplus: "monthly surplus",
      bankDebt: "Bank Debt",
      paidOff: "paid off",
      savingsVaults: "Savings Vaults",
      totalGoal: "Total goal",
      goldenRule: "Golden Windfall Rule (35/35/15/15)",
      debtPaydown: "Debt Paydown",
      houseVault: "House Vault",
      taxGear: "Tax & Gear Reserve",
      safePocket: "Safe-to-Spend Pocket"
    },
    settings: {
      title: "Settings & Customization",
      subtitle: "Customize currency, color palettes, language, and windfall rules",
      language: "Language / Limbă",
      currency: "National Currency",
      themePalette: "Color Theme Palette",
      themeMode: "Display Mode",
      coupleProfile: "Couple Profile & Incomes",
      windfallSplit: "Windfall Allocation Rule",
      dataPortability: "Data Backup & Portability"
    }
  }
};
