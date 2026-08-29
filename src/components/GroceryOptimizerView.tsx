import React, { useState, useMemo, useEffect } from 'react';
import {
  ShoppingCart,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Store,
  Camera,
  Check,
  Filter,
  Layers,
  Receipt,
  Edit3,
  X,
  Star,
  ShoppingBag,
  Zap,
  Flame,
  Wallet,
  Coins,
  ArrowRight,
  TrendingDown,
  Globe2,
  Compass,
  Video,
  Play,
  ExternalLink,
  ChefHat,
  Clock,
  Users,
  Search,
  BookOpen,
  Bookmark,
  RefreshCw,
  AlertCircle,
  Key,
  Calendar,
  Package,
  Coffee,
  Sparkle,
  ArrowDownRight,
  TrendingUp,
  Sliders
} from 'lucide-react';
import {
  SupermarketId,
  GroceryCatalogItem,
  ShoppingListItem,
  GroceryCategory,
  GroceryQualityPreference,
  GroceryCuisineType,
  HouseholdProfile,
  HouseholdExpense,
  ExpensePayer,
  CashPocketsBalance,
  SavedRecipeReel,
  RecipeIngredient,
  ReceiptPurchaseRecord,
  BillAnalysisSuggestion,
  StockUpPlanDuration
} from '../types';
import {
  SUPERMARKETS,
  GROCERY_CATEGORIES_CONFIG,
  QUICK_BUNDLES,
  DEFAULT_SAVED_RECIPES,
  DEFAULT_PURCHASE_HISTORY,
  SupermarketMetadata
} from '../data/groceryData';
import {
  loadSavedRecipes,
  saveSavedRecipes,
  loadPurchaseHistory,
  savePurchaseHistory
} from '../data/storage';

interface GroceryOptimizerViewProps {
  profile: HouseholdProfile;
  shoppingList: ShoppingListItem[];
  onUpdateShoppingList: (items: ShoppingListItem[]) => void;
  groceryCatalog: GroceryCatalogItem[];
  onUpdateGroceryCatalog: (catalog: GroceryCatalogItem[]) => void;
  onAddExpense: (expense: Omit<HouseholdExpense, 'id'>) => void;
  cashBalances: CashPocketsBalance;
  onOpenReceiptScanner?: () => void;
}

export const GroceryOptimizerView: React.FC<GroceryOptimizerViewProps> = ({
  profile,
  shoppingList,
  onUpdateShoppingList,
  groceryCatalog,
  onUpdateGroceryCatalog,
  onAddExpense,
  cashBalances,
  onOpenReceiptScanner
}) => {
  const currency = profile.currencySymbol || 'lei';

  // Language state (defaults to profile.language or 'ro')
  const [currentLang, setCurrentLang] = useState<'ro' | 'en'>((profile.language as 'ro' | 'en') || 'ro');
  const isRo = currentLang === 'ro';

  // Subtabs: list | stockup | billAnalyzer | reels | budgetFitter | bundles | matrix
  const [activeSubTab, setActiveSubTab] = useState<
    'list' | 'stockup' | 'billAnalyzer' | 'reels' | 'budgetFitter' | 'bundles' | 'matrix'
  >('list');
  const [qualityPref, setQualityPref] = useState<GroceryQualityPreference>('BEST_VALUE');
  const [cuisineFilter, setCuisineFilter] = useState<GroceryCuisineType | 'ALL'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<GroceryCategory | 'ALL'>('ALL');
  const [inStoreMode, setInStoreMode] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 15 & 30 Days Stock-Up State
  const [stockUpDuration, setStockUpDuration] = useState<StockUpPlanDuration>('DAYS_15');
  const [stockUpCategoryScope, setStockUpCategoryScope] = useState<'ALL' | 'FOOD' | 'SNACKS_DRINKS' | 'CLEANING'>('ALL');

  // Purchase History & AI Bill Analyzer State
  const [purchaseHistory, setPurchaseHistory] = useState<ReceiptPurchaseRecord[]>(loadPurchaseHistory);
  const [selectedReceiptForAnalysis, setSelectedReceiptForAnalysis] = useState<string | null>(null);

  // Smart Budget Fitter State
  const [targetBudgetInput, setTargetBudgetInput] = useState<number>(150);
  const [budgetDiversityFocus, setBudgetDiversityFocus] = useState<GroceryCuisineType | 'MIXED' | 'BUDGET'>('MIXED');

  // Reel & Recipe Extractor State
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipeReel[]>(loadSavedRecipes);
  const [reelUrlInput, setReelUrlInput] = useState<string>('');
  const [recipeNotesInput, setRecipeNotesInput] = useState<string>('');
  const [geminiApiKeyInput, setGeminiApiKeyInput] = useState<string>(() => localStorage.getItem('housevault_gemini_key') || '');
  const [showApiKeyModal, setShowApiKeyModal] = useState<boolean>(false);
  const [isExtractingReel, setIsExtractingReel] = useState<boolean>(false);
  const [extractedRecipe, setExtractedRecipe] = useState<SavedRecipeReel | null>(null);
  const [reelExtractError, setReelExtractError] = useState<string | null>(null);
  const [recipeCuisineFilter, setRecipeCuisineFilter] = useState<GroceryCuisineType | 'ALL'>('ALL');
  const [recipeSearchQuery, setRecipeSearchQuery] = useState<string>('');

  // Modals state
  const [isAddItemOpen, setIsAddItemOpen] = useState<boolean>(false);
  const [isLogExpenseOpen, setIsLogExpenseOpen] = useState<boolean>(false);

  // New item form
  const [newItemName, setNewItemName] = useState<string>('');
  const [newItemCategory, setNewItemCategory] = useState<GroceryCategory>('DAIRY');
  const [newItemQty, setNewItemQty] = useState<number>(1);
  const [newItemUnit, setNewItemUnit] = useState<string>('buc');

  // Log expense form
  const [logStoreName, setLogStoreName] = useState<string>('Lidl & Kaufland');
  const [logAmount, setLogAmount] = useState<number>(0);
  const [logPayer, setLogPayer] = useState<ExpensePayer>('WIFE_SALARY');
  const [logSuccessMessage, setLogSuccessMessage] = useState<string | null>(null);

  const wifeBal = Number(cashBalances?.wifeSalaryBalance) || 0;
  const husbandBal = Number(cashBalances?.freelanceBufferBalance) || 0;
  const sharedBal = Number(cashBalances?.sharedPoolBalance) || 0;

  const wifeShort = (profile.wifeName || 'Cati').split(' ')[0];
  const husbandShort = (profile.husbandName || 'Haytham').split(' ')[0];

  useEffect(() => {
    saveSavedRecipes(savedRecipes);
  }, [savedRecipes]);

  useEffect(() => {
    savePurchaseHistory(purchaseHistory);
  }, [purchaseHistory]);

  const catalogMap = useMemo(() => {
    const map = new Map<string, GroceryCatalogItem>();
    groceryCatalog.forEach((item) => map.set(item.id, item));
    return map;
  }, [groceryCatalog]);

  const getItemStoreRecommendation = (
    item: ShoppingListItem,
    pref: GroceryQualityPreference
  ): { storeId: SupermarketId; price: number; qualityScore: number; brandName?: string; promo?: boolean } | null => {
    let catItem: GroceryCatalogItem | undefined;
    if (item.catalogItemId) {
      catItem = catalogMap.get(item.catalogItemId);
    } else {
      catItem = groceryCatalog.find((c) => c.name.toLowerCase().includes(item.name.toLowerCase()));
    }

    if (!catItem || !catItem.stores) return null;

    const availableStores = Object.entries(catItem.stores) as [
      SupermarketId,
      { price: number; qualityScore: number; brandName?: string; promo?: boolean }
    ][];
    if (availableStores.length === 0) return null;

    if (item.preferredStoreOverride && catItem.stores[item.preferredStoreOverride]) {
      return { storeId: item.preferredStoreOverride, ...catItem.stores[item.preferredStoreOverride]! };
    }

    if (pref === 'CHEAPEST') {
      const sorted = [...availableStores].sort((a, b) => a[1].price - b[1].price);
      return { storeId: sorted[0][0], ...sorted[0][1] };
    } else if (pref === 'PREMIUM') {
      const sorted = [...availableStores].sort((a, b) => {
        if (b[1].qualityScore !== a[1].qualityScore) return b[1].qualityScore - a[1].qualityScore;
        return a[1].price - b[1].price;
      });
      return { storeId: sorted[0][0], ...sorted[0][1] };
    } else {
      // BEST_VALUE
      const candidates = availableStores.filter(([, data]) => data.qualityScore >= 4);
      if (candidates.length > 0) {
        const sorted = candidates.sort((a, b) => a[1].price - b[1].price);
        return { storeId: sorted[0][0], ...sorted[0][1] };
      }
      const sorted = [...availableStores].sort((a, b) => a[1].price - b[1].price);
      return { storeId: sorted[0][0], ...sorted[0][1] };
    }
  };

  // Store rankings for total 1-store trip
  const singleStoreLeaderboard = useMemo(() => {
    return SUPERMARKETS.map((store) => {
      let total = 0;
      let itemsAvailable = 0;

      shoppingList.forEach((item) => {
        let catItem = item.catalogItemId
          ? catalogMap.get(item.catalogItemId)
          : groceryCatalog.find((c) => c.name.toLowerCase().includes(item.name.toLowerCase()));
        if (catItem && catItem.stores[store.id]) {
          total += catItem.stores[store.id]!.price * item.quantity;
          itemsAvailable++;
        } else {
          const rec = getItemStoreRecommendation(item, qualityPref);
          if (rec) total += rec.price * item.quantity;
        }
      });

      return {
        store,
        totalEstimatedCost: Math.round(total * 100) / 100,
        coverageRate: shoppingList.length > 0 ? Math.round((itemsAvailable / shoppingList.length) * 100) : 100
      };
    }).sort((a, b) => a.totalEstimatedCost - b.totalEstimatedCost);
  }, [shoppingList, groceryCatalog, catalogMap, qualityPref]);

  // Split Trip 2-Store Optimizer
  const splitTripOptimization = useMemo(() => {
    if (shoppingList.length === 0) {
      return { store1: SUPERMARKETS[0], store2: SUPERMARKETS[1], store1Items: [], store2Items: [], totalCost: 0, savingsVsCheapestSingle: 0, savingsPercent: 0 };
    }

    const store1 = SUPERMARKETS.find((s) => s.id === 'LIDL') || SUPERMARKETS[0];
    const store2 = SUPERMARKETS.find((s) => s.id === 'KAUFLAND') || SUPERMARKETS[1];

    const store1Items: { item: ShoppingListItem; price: number; brandName?: string }[] = [];
    const store2Items: { item: ShoppingListItem; price: number; brandName?: string }[] = [];
    let splitTotal = 0;

    shoppingList.forEach((item) => {
      let catItem = item.catalogItemId
        ? catalogMap.get(item.catalogItemId)
        : groceryCatalog.find((c) => c.name.toLowerCase().includes(item.name.toLowerCase()));
      const p1 = catItem?.stores[store1.id];
      const p2 = catItem?.stores[store2.id];

      if (p1 && p2) {
        if (p1.price <= p2.price) {
          store1Items.push({ item, price: p1.price, brandName: p1.brandName });
          splitTotal += p1.price * item.quantity;
        } else {
          store2Items.push({ item, price: p2.price, brandName: p2.brandName });
          splitTotal += p2.price * item.quantity;
        }
      } else if (p1) {
        store1Items.push({ item, price: p1.price, brandName: p1.brandName });
        splitTotal += p1.price * item.quantity;
      } else if (p2) {
        store2Items.push({ item, price: p2.price, brandName: p2.brandName });
        splitTotal += p2.price * item.quantity;
      } else {
        const rec = getItemStoreRecommendation(item, qualityPref);
        const cost = (rec?.price || 10) * item.quantity;
        store1Items.push({ item, price: rec?.price || 10, brandName: rec?.brandName });
        splitTotal += cost;
      }
    });

    const cheapestSingleCost = singleStoreLeaderboard[0]?.totalEstimatedCost || splitTotal;
    const savings = Math.max(0, cheapestSingleCost - splitTotal);
    const savingsPercent = cheapestSingleCost > 0 ? Math.round((savings / cheapestSingleCost) * 100) : 0;

    return {
      store1,
      store2,
      store1Items,
      store2Items,
      totalCost: Math.round(splitTotal * 100) / 100,
      savingsVsCheapestSingle: Math.round(savings * 100) / 100,
      savingsPercent
    };
  }, [shoppingList, groceryCatalog, catalogMap, qualityPref, singleStoreLeaderboard]);

  // 15 & 30 DAYS STOCK-UP PLANNER ENGINE
  const stockUpPlan = useMemo(() => {
    const is30Days = stockUpDuration === 'DAYS_30';
    const multiplier = is30Days ? 2 : 1;

    // Base stock items definitions
    const baseItems: {
      catalogId: string;
      name: string;
      category: GroceryCategory;
      baseQty: number;
      unit: string;
      scope: 'FOOD' | 'SNACKS_DRINKS' | 'CLEANING';
    }[] = [
      // MEAT & PROTEIN
      { catalogId: 'g-piept-pui', name: 'Piept de Pui Dezosat (1kg)', category: 'MEAT_FISH', baseQty: 2, unit: 'kg', scope: 'FOOD' },
      { catalogId: 'g-carne-vita-tagine', name: 'Pulpă de Vită Fragedă (1kg)', category: 'MEAT_FISH', baseQty: 1.5, unit: 'kg', scope: 'FOOD' },
      // DAIRY
      { catalogId: 'g-lapte-35', name: 'Lapte Proaspăt 3.5% (1L)', category: 'DAIRY', baseQty: 4, unit: 'L', scope: 'FOOD' },
      { catalogId: 'g-oua-30', name: 'Ouă Proaspete (Cofraj 30 bucăți)', category: 'DAIRY', baseQty: 1, unit: 'pachet', scope: 'FOOD' },
      { catalogId: 'g-telemea-vaca-saramura', name: 'Telemea de Vacă în Saramură (400g)', category: 'DAIRY', baseQty: 2, unit: 'buc', scope: 'FOOD' },
      // PANTRY
      { catalogId: 'g-ulei-masline-extra', name: 'Ulei de Măsline Extra Virgin (1L)', category: 'PANTRY', baseQty: 1, unit: 'L', scope: 'FOOD' },
      { catalogId: 'g-spaghetti-bronzo', name: 'Spaghetti Barilla (500g)', category: 'PANTRY', baseQty: 2, unit: 'pachet', scope: 'FOOD' },
      { catalogId: 'g-couscous-500g', name: 'Couscous Dari Tradițional (1kg)', category: 'PANTRY', baseQty: 1, unit: 'kg', scope: 'FOOD' },
      { catalogId: 'g-naut-conserva', name: 'Năut Boabe Conservă (400g)', category: 'PANTRY', baseQty: 3, unit: 'buc', scope: 'FOOD' },
      // SNACKS & SWEETS
      { catalogId: 'g-chips-lays', name: 'Chipsuri Rumene Lays / Chio Paprika (140g)', category: 'SNACKS', baseQty: 2, unit: 'pachet', scope: 'SNACKS_DRINKS' },
      { catalogId: 'g-alune-alesto', name: 'Arahide / Caju Prăjite Alesto (200g)', category: 'SNACKS', baseQty: 2, unit: 'pachet', scope: 'SNACKS_DRINKS' },
      { catalogId: 'g-ciocolata-milka', name: 'Ciocolată Fină Milka cu Lapte (100g)', category: 'SNACKS', baseQty: 3, unit: 'buc', scope: 'SNACKS_DRINKS' },
      { catalogId: 'g-croissant-7days', name: 'Croissant 7Days Max Multipack (5 buc)', category: 'SNACKS', baseQty: 1, unit: 'pachet', scope: 'SNACKS_DRINKS' },
      // BEVERAGES
      { catalogId: 'g-apa-minerala-borsec', name: 'Apă Minerală Borsec (Bax 6x2L)', category: 'BEVERAGES', baseQty: 2, unit: 'pachet', scope: 'SNACKS_DRINKS' },
      { catalogId: 'g-apa-plata-bucovina', name: 'Apă Plată Bucovina (Bax 6x2L)', category: 'BEVERAGES', baseQty: 2, unit: 'pachet', scope: 'SNACKS_DRINKS' },
      { catalogId: 'g-suc-portocale-100', name: 'Suc Natural Portocale 100% (1L)', category: 'BEVERAGES', baseQty: 2, unit: 'L', scope: 'SNACKS_DRINKS' },
      { catalogId: 'g-cafea-lavazza-500g', name: 'Cafea Măcinată Lavazza / Tchibo (500g)', category: 'BEVERAGES', baseQty: 1, unit: 'pachet', scope: 'SNACKS_DRINKS' },
      // CLEANING & HOUSEHOLD
      { catalogId: 'g-detergent-ariel-capsule', name: 'Detergent Rufe Capsule Ariel (35-40 spălări)', category: 'CLEANING', baseQty: 1, unit: 'pachet', scope: 'CLEANING' },
      { catalogId: 'g-balsam-lenor', name: 'Balsam Rufe Parfumat Lenor (1.7L)', category: 'CLEANING', baseQty: 1, unit: 'buc', scope: 'CLEANING' },
      { catalogId: 'g-detergent-vase-fairy', name: 'Detergent Lichid Vase Fairy Max (900ml)', category: 'CLEANING', baseQty: 1, unit: 'buc', scope: 'CLEANING' },
      { catalogId: 'g-hartie-igienica-zewa', name: 'Hârtie Igienică Zewa Deluxe (10 role)', category: 'CLEANING', baseQty: 1, unit: 'pachet', scope: 'CLEANING' },
      { catalogId: 'g-prosoape-bucatarie', name: 'Prosoape Bucătărie Absorbante (2 role mari)', category: 'CLEANING', baseQty: 1, unit: 'pachet', scope: 'CLEANING' },
      { catalogId: 'g-saci-menajeri-60l', name: 'Saci Menajeri Rezistenți cu Șnur 60L (20 buc)', category: 'CLEANING', baseQty: 1, unit: 'buc', scope: 'CLEANING' }
    ];

    const filteredItems = baseItems.filter((it) => {
      if (stockUpCategoryScope === 'ALL') return true;
      return it.scope === stockUpCategoryScope;
    });

    let totalBestCost = 0;
    let totalSupermarketStandardCost = 0;

    const computedItems = filteredItems.map((item) => {
      const catItem = catalogMap.get(item.catalogId);
      const totalQty = item.baseQty * multiplier;

      let bestStoreId: SupermarketId = 'PENNY';
      let bestUnitPrice = 10;
      let highestUnitPrice = 12;
      let brandName = '';

      if (catItem?.stores) {
        const storeEntries = Object.entries(catItem.stores) as [SupermarketId, { price: number; brandName?: string }][];
        if (storeEntries.length > 0) {
          const sorted = [...storeEntries].sort((a, b) => a[1].price - b[1].price);
          bestStoreId = sorted[0][0];
          bestUnitPrice = sorted[0][1].price;
          brandName = sorted[0][1].brandName || '';
          highestUnitPrice = sorted[sorted.length - 1][1].price;
        }
      }

      const totalItemCost = bestUnitPrice * totalQty;
      const standardCost = highestUnitPrice * totalQty;

      totalBestCost += totalItemCost;
      totalSupermarketStandardCost += standardCost;

      return {
        ...item,
        quantity: totalQty,
        bestStoreId,
        unitPrice: bestUnitPrice,
        totalCost: Math.round(totalItemCost * 100) / 100,
        brandName
      };
    });

    const totalSaved = Math.max(0, totalSupermarketStandardCost - totalBestCost);

    return {
      items: computedItems,
      totalCost: Math.round(totalBestCost * 100) / 100,
      standardCost: Math.round(totalSupermarketStandardCost * 100) / 100,
      totalSaved: Math.round(totalSaved * 100) / 100,
      savingsPercent: totalSupermarketStandardCost > 0 ? Math.round((totalSaved / totalSupermarketStandardCost) * 100) : 0,
      durationDays: is30Days ? 30 : 15
    };
  }, [stockUpDuration, stockUpCategoryScope, catalogMap]);

  // AI BILL ANALYZER & CHEAPER ALTERNATIVES ENGINE
  const billAnalysisResults = useMemo(() => {
    const suggestions: BillAnalysisSuggestion[] = [];
    let totalPotentialSavings = 0;

    // Analyze past purchase receipts
    purchaseHistory.forEach((receipt) => {
      receipt.items.forEach((item, idx) => {
        // Find matching item in catalog
        const match = groceryCatalog.find(
          (c) =>
            c.name.toLowerCase().includes(item.name.toLowerCase()) ||
            item.name.toLowerCase().includes(c.name.toLowerCase())
        );

        if (match && match.stores) {
          const storeEntries = Object.entries(match.stores) as [SupermarketId, { price: number; brandName?: string }][];
          const sortedStores = storeEntries.sort((a, b) => a[1].price - b[1].price);
          const cheapestStore = sortedStores[0];

          if (cheapestStore && cheapestStore[1].price < item.price) {
            const diff = item.price - cheapestStore[1].price;
            const savingPercent = Math.round((diff / item.price) * 100);

            if (diff >= 0.5) {
              totalPotentialSavings += diff * (item.quantity || 1);
              suggestions.push({
                id: 'sugg-' + receipt.id + '-' + idx,
                originalItemName: item.name,
                originalPrice: item.price,
                originalStore: receipt.storeId,
                cheaperAlternativeName: match.name + (cheapestStore[1].brandName ? ` (${cheapestStore[1].brandName})` : ''),
                cheaperPrice: cheapestStore[1].price,
                cheaperStore: cheapestStore[0],
                savingsRon: Math.round(diff * 100) / 100,
                savingsPercent: savingPercent,
                category: item.category || match.category,
                rationale: isRo
                  ? `Înlocuind cu ${cheapestStore[1].brandName || 'marca proprie'} de la ${cheapestStore[0]}, economisești ${diff.toFixed(2)} ${currency} per bucată!`
                  : `Switching to ${cheapestStore[0]} private label saves ${diff.toFixed(2)} ${currency} per item!`
              });
            }
          }
        }
      });
    });

    return {
      suggestions,
      totalPotentialSavings: Math.round(totalPotentialSavings * 100) / 100
    };
  }, [purchaseHistory, groceryCatalog, isRo, currency]);

  // SMART BUDGET FITTER ENGINE
  const budgetFitterPlan = useMemo(() => {
    const budget = Number(targetBudgetInput) || 150;

    let candidates = groceryCatalog.filter((item) => {
      if (budgetDiversityFocus === 'BUDGET')
        return (
          item.category === 'DAIRY' ||
          item.category === 'BAKERY' ||
          item.category === 'PANTRY' ||
          item.category === 'MEAT_FISH'
        );
      if (budgetDiversityFocus === 'MIXED') return true;
      return item.cuisine === budgetDiversityFocus || item.cuisine === 'UNIVERSAL';
    });

    const priorityWeights: Record<string, number> = {
      'g-piept-pui': 100,
      'g-carne-vita-tagine': 95,
      'g-orez-bomba-paella': 95,
      'g-spaghetti-bronzo': 90,
      'g-carne-angus-burger': 90,
      'g-carnati-bratwurst': 90,
      'g-oua-30': 90,
      'g-couscous-500g': 85,
      'g-malai-superior': 85,
      'g-telemea-vaca-saramura': 80,
      'g-naut-conserva': 75,
      'g-parmigiano-reggiano': 75,
      'g-smantana-20': 70,
      'g-cheddar-burger': 70,
      'g-rosii-cherry': 65,
      'g-ulei-masline-extra': 60,
      'g-lapte-35': 55
    };

    candidates.sort((a, b) => (priorityWeights[b.id] || 10) - (priorityWeights[a.id] || 10));

    const selectedItems: {
      catalogItem: GroceryCatalogItem;
      bestStore: SupermarketId;
      unitPrice: number;
      qty: number;
      totalItemCost: number;
    }[] = [];
    let currentTotal = 0;

    for (const item of candidates) {
      const storeEntries = Object.entries(item.stores || {}) as [SupermarketId, { price: number }][];
      if (storeEntries.length === 0) continue;
      const sortedStores = storeEntries.sort((a, b) => a[1].price - b[1].price);
      const best = sortedStores[0];
      const price = best[1].price;

      if (currentTotal + price <= budget) {
        selectedItems.push({
          catalogItem: item,
          bestStore: best[0],
          unitPrice: price,
          qty: 1,
          totalItemCost: price
        });
        currentTotal += price;
      }
    }

    const remainingCash = Math.max(0, budget - currentTotal);

    return {
      items: selectedItems,
      totalCost: Math.round(currentTotal * 100) / 100,
      remainingCash: Math.round(remainingCash * 100) / 100,
      budget
    };
  }, [groceryCatalog, targetBudgetInput, budgetDiversityFocus]);

  // Handlers
  const handleToggleItemCheck = (id: string) => {
    const updated = shoppingList.map((it) => (it.id === id ? { ...it, isChecked: !it.isChecked } : it));
    onUpdateShoppingList(updated);
  };

  const handleUpdateItemQty = (id: string, newQty: number) => {
    if (newQty <= 0) {
      handleDeleteItem(id);
      return;
    }
    const updated = shoppingList.map((it) => (it.id === id ? { ...it, quantity: newQty } : it));
    onUpdateShoppingList(updated);
  };

  const handleDeleteItem = (id: string) => {
    onUpdateShoppingList(shoppingList.filter((it) => it.id !== id));
  };

  const handleClearCheckedItems = () => {
    onUpdateShoppingList(shoppingList.filter((it) => !it.isChecked));
  };

  const handleApplyStockUpPlanToList = (replace: boolean) => {
    const newItems: ShoppingListItem[] = stockUpPlan.items.map((sItem, idx) => ({
      id: 'item-stockup-' + Date.now() + '-' + idx,
      catalogItemId: sItem.catalogId,
      name: sItem.name,
      category: sItem.category,
      quantity: sItem.quantity,
      unit: sItem.unit,
      isChecked: false,
      preferredStoreOverride: sItem.bestStoreId,
      notes: isRo ? `Aprovizionare ${stockUpPlan.durationDays} Zile` : `${stockUpPlan.durationDays}-Day Stock-Up`
    }));

    if (replace) {
      onUpdateShoppingList(newItems);
    } else {
      onUpdateShoppingList([...shoppingList, ...newItems]);
    }
    setActiveSubTab('list');
  };

  const handleApplyCheaperAlternativesToList = () => {
    const newItems: ShoppingListItem[] = billAnalysisResults.suggestions.map((sug, idx) => ({
      id: 'item-sugg-' + Date.now() + '-' + idx,
      name: sug.cheaperAlternativeName,
      category: sug.category,
      quantity: 1,
      unit: 'buc',
      isChecked: false,
      preferredStoreOverride: sug.cheaperStore,
      notes: isRo ? `Economie: -${sug.savingsRon} lei vs ${sug.originalStore}` : `Save: -${sug.savingsRon} vs ${sug.originalStore}`
    }));

    onUpdateShoppingList([...shoppingList, ...newItems]);
    setActiveSubTab('list');
  };

  const handleApplyBundle = (bundle: typeof QUICK_BUNDLES[0]) => {
    const newItems: ShoppingListItem[] = bundle.items.map((bItem, idx) => {
      const cat = catalogMap.get(bItem.catalogId);
      return {
        id: 'item-bundle-' + Date.now() + '-' + idx,
        catalogItemId: bItem.catalogId,
        name: cat?.name || bItem.catalogId,
        category: cat?.category || 'PANTRY',
        quantity: bItem.quantity,
        unit: cat?.defaultUnit || 'buc',
        isChecked: false
      };
    });
    onUpdateShoppingList([...shoppingList, ...newItems]);
    setActiveSubTab('list');
  };

  const handleApplyBudgetPlanToList = (replace: boolean) => {
    const newItems: ShoppingListItem[] = budgetFitterPlan.items.map((bItem, idx) => ({
      id: 'item-budget-' + Date.now() + '-' + idx,
      catalogItemId: bItem.catalogItem.id,
      name: bItem.catalogItem.name,
      category: bItem.catalogItem.category,
      quantity: bItem.qty,
      unit: bItem.catalogItem.defaultUnit || 'buc',
      isChecked: false,
      preferredStoreOverride: bItem.bestStore
    }));

    if (replace) {
      onUpdateShoppingList(newItems);
    } else {
      onUpdateShoppingList([...shoppingList, ...newItems]);
    }
    setActiveSubTab('list');
  };

  // Reel & Recipe AI Extractor
  const executeExtract = async (urlStr: string, notesStr: string) => {
    setIsExtractingReel(true);
    setReelExtractError(null);
    setExtractedRecipe(null);

    try {
      const res = await fetch('/api/ai/parse-recipe-reel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: urlStr.trim(),
          rawText: notesStr.trim(),
          apiKey: geminiApiKeyInput.trim()
        })
      });

      const data = await res.json();
      if (data.success && data.recipe) {
        const r = data.recipe;
        const newRec: SavedRecipeReel = {
          id: 'recipe-' + Date.now(),
          title: r.title || 'Rețetă Video Personalizată',
          videoUrl: r.videoUrl || urlStr.trim() || 'https://facebook.com',
          cuisine: r.cuisine || 'UNIVERSAL',
          description: r.description || 'Rețetă extrasă cu succes.',
          servings: r.servings || 4,
          prepTimeMinutes: r.prepTimeMinutes || 30,
          instructionsSummary: r.instructionsSummary || '',
          totalEstimatedCost: Number(r.totalEstimatedCost) || 50,
          createdAt: new Date().toISOString(),
          ingredients: Array.isArray(r.ingredients)
            ? r.ingredients.map((ing: any) => ({
                name: ing.name,
                quantity: ing.quantity || 1,
                unit: ing.unit || 'buc',
                category: ing.category || 'PANTRY',
                suggestedStoreId: ing.suggestedStoreId || 'LIDL',
                estimatedPrice: Number(ing.estimatedPrice) || 8.5
              }))
            : []
        };
        setExtractedRecipe(newRec);
      } else {
        setReelExtractError(data.error || (isRo ? 'Nu s-a putut extrage rețeta.' : 'Could not parse recipe.'));
      }
    } catch (err: any) {
      setReelExtractError(err?.message || (isRo ? 'Eroare conexiune AI.' : 'AI connection error.'));
    } finally {
      setIsExtractingReel(false);
    }
  };

  const handleExtractRecipeFromReel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reelUrlInput.trim() && !recipeNotesInput.trim()) return;
    executeExtract(reelUrlInput, recipeNotesInput);
  };

  const handleQuickMoroccanDishClick = (dishNameDarija: string) => {
    setRecipeNotesInput(dishNameDarija);
    executeExtract(reelUrlInput || 'https://facebook.com/reel', dishNameDarija);
  };

  const handleSaveExtractedRecipe = () => {
    if (!extractedRecipe) return;
    setSavedRecipes([extractedRecipe, ...savedRecipes]);
    setExtractedRecipe(null);
    setReelUrlInput('');
    setRecipeNotesInput('');
  };

  const handleAddRecipeIngredientsToList = (recipe: SavedRecipeReel) => {
    const newItems: ShoppingListItem[] = recipe.ingredients.map((ing, idx) => ({
      id: 'item-recipe-' + Date.now() + '-' + idx,
      name: ing.name,
      category: ing.category || 'PANTRY',
      quantity: ing.quantity || 1,
      unit: ing.unit || 'buc',
      isChecked: false,
      preferredStoreOverride: ing.suggestedStoreId,
      notes: isRo ? 'Rețetă: ' + recipe.title : 'Recipe: ' + recipe.title
    }));

    onUpdateShoppingList([...shoppingList, ...newItems]);
    setActiveSubTab('list');
  };

  const handleDeleteSavedRecipe = (id: string) => {
    setSavedRecipes(savedRecipes.filter((r) => r.id !== id));
  };

  const handleAddCatalogItemToList = (catItem: GroceryCatalogItem) => {
    const newItem: ShoppingListItem = {
      id: 'item-' + Date.now(),
      catalogItemId: catItem.id,
      name: catItem.name,
      category: catItem.category,
      quantity: 1,
      unit: catItem.defaultUnit,
      isChecked: false
    };
    onUpdateShoppingList([...shoppingList, newItem]);
  };

  const handleAddNewManualItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const newItem: ShoppingListItem = {
      id: 'item-manual-' + Date.now(),
      name: newItemName.trim(),
      category: newItemCategory,
      quantity: newItemQty,
      unit: newItemUnit,
      isChecked: false
    };

    onUpdateShoppingList([...shoppingList, newItem]);
    setNewItemName('');
    setNewItemQty(1);
    setIsAddItemOpen(false);
  };

  const handleConfirmLogExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (logAmount <= 0) return;

    onAddExpense({
      title: (isRo ? 'Cumpărături ' : 'Groceries ') + logStoreName,
      amount: logAmount,
      category: 'GROCERIES',
      isFixed: false,
      assignedPayer: logPayer
    });

    // Also add to purchaseHistory
    const newRecord: ReceiptPurchaseRecord = {
      id: 'rec-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      storeId: 'LIDL',
      storeName: logStoreName,
      totalSpent: logAmount,
      payer: logPayer,
      items: shoppingList.map((it) => ({
        name: it.name,
        price: getItemStoreRecommendation(it, qualityPref)?.price || 10,
        quantity: it.quantity,
        unit: it.unit,
        category: it.category
      }))
    };
    setPurchaseHistory([newRecord, ...purchaseHistory]);

    setLogSuccessMessage(
      isRo
        ? 'Bonul de ' + logAmount.toFixed(2) + ' ' + currency + ' a fost salvat și scăzut din buget!'
        : 'Receipt for ' + logAmount.toFixed(2) + ' ' + currency + ' saved and deducted from budget!'
    );
    setTimeout(() => {
      setLogSuccessMessage(null);
      setIsLogExpenseOpen(false);
    }, 1500);
  };

  const checkedCount = shoppingList.filter((it) => it.isChecked).length;
  const inStoreRunningTotal = useMemo(() => {
    return shoppingList
      .filter((it) => it.isChecked)
      .reduce((sum, it) => {
        const rec = getItemStoreRecommendation(it, qualityPref);
        return sum + (rec?.price || 10) * it.quantity;
      }, 0);
  }, [shoppingList, qualityPref, catalogMap]);

  const getCuisineBadge = (c: GroceryCuisineType) => {
    switch (c) {
      case 'SPANISH':
        return { label: 'Spaniol', flag: '🇪🇸', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
      case 'ITALIAN':
        return { label: 'Italian', flag: '🇮🇹', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
      case 'AMERICAN':
        return { label: 'American', flag: '🇺🇸', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' };
      case 'GERMAN':
        return { label: 'German', flag: '🇩🇪', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' };
      case 'MOROCCAN':
        return { label: 'Marocan', flag: '🇲🇦', color: 'bg-red-500/20 text-red-300 border-red-500/30' };
      case 'ROMANIAN':
        return { label: 'Românesc', flag: '🇷🇴', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' };
      default:
        return { label: 'Internațional', flag: '🌍', color: 'bg-stone-800 text-stone-300 border-stone-700' };
    }
  };

  return (
    <div className="space-y-6" style={{ fontFamily: 'Helvetica, Arial, -apple-system, sans-serif' }}>
      {/* Header & Language Switcher */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>
              {isRo
                ? 'Supermarket AI • Mâncare, Gustări, Băuturi, Dulciuri & Menaj'
                : 'Smart Supermarket AI • Food, Snacks, Drinks, Sweets & Home'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white mt-1.5 flex items-center gap-2.5">
            <ShoppingCart className="w-7 h-7 text-emerald-400 shrink-0" />
            <span>{isRo ? 'Cumpărături Inteligente & AI Plan 15/30 Zile' : 'Smart Groceries & 15/30 Day Stock-Up'}</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-2xl leading-relaxed">
            {isRo
              ? 'Planifică cumpărăturile pentru 15 sau 30 de zile, analizează bonurile anterioare pentru alternative ieftine și extrage rețete din Reels video în Darija marocană sau orice limbă!'
              : 'Stock up for 15 or 30 days, analyze past receipts for cheap alternatives, and extract recipe reels in Moroccan Darija!'}
          </p>
        </div>

        {/* Action Buttons & Language Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowApiKeyModal(true)}
            className="px-3 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition shadow-md"
            title="Set Gemini AI Key"
          >
            <Key className="w-3.5 h-3.5" />
            <span>{geminiApiKeyInput ? 'Gemini AI ✓' : isRo ? 'Setează Cheie AI' : 'Set AI Key'}</span>
          </button>

          <div className="flex items-center bg-stone-900 border border-stone-800 rounded-xl p-0.5">
            <button
              type="button"
              onClick={() => setCurrentLang('ro')}
              className={
                'px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ' +
                (isRo ? 'bg-emerald-500 text-stone-950 shadow-sm' : 'text-stone-400 hover:text-white')
              }
            >
              RO
            </button>
            <button
              type="button"
              onClick={() => setCurrentLang('en')}
              className={
                'px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ' +
                (!isRo ? 'bg-emerald-500 text-stone-950 shadow-sm' : 'text-stone-400 hover:text-white')
              }
            >
              EN
            </button>
          </div>

          {onOpenReceiptScanner && (
            <button
              onClick={onOpenReceiptScanner}
              className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-750 text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition"
            >
              <Camera className="w-4 h-4 text-cyan-400" />
              <span>{isRo ? 'Scanează Bon / Galerie' : 'Scan Receipt / Gallery'}</span>
            </button>
          )}

          <button
            onClick={() => setInStoreMode(!inStoreMode)}
            className={
              'px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-md ' +
              (inStoreMode
                ? 'bg-emerald-500 text-stone-950 shadow-emerald-500/20'
                : 'bg-stone-800 text-stone-300 border border-stone-700 hover:bg-stone-750')
            }
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{inStoreMode ? (isRo ? 'Mod Magazin Activ' : 'In-Store Mode On') : isRo ? 'Mod Magazin' : 'In-Store Mode'}</span>
          </button>
        </div>
      </div>

      {/* Subtab Navigation Pills */}
      <div className="flex flex-wrap gap-2 border-b border-stone-800 pb-3">
        <button
          onClick={() => setActiveSubTab('list')}
          className={
            'px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ' +
            (activeSubTab === 'list'
              ? 'bg-emerald-500 text-stone-950 shadow-md shadow-emerald-500/20'
              : 'bg-stone-900 text-stone-400 hover:text-white border border-stone-800')
          }
        >
          <ShoppingCart className="w-4 h-4" />
          <span>{isRo ? 'Lista Mea (' + shoppingList.length + ')' : 'My List (' + shoppingList.length + ')'}</span>
        </button>

        {/* SUBTAB: 15 / 30 DAYS STOCK-UP */}
        <button
          onClick={() => setActiveSubTab('stockup')}
          className={
            'px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ' +
            (activeSubTab === 'stockup'
              ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-stone-950 shadow-md font-black ring-1 ring-emerald-400'
              : 'bg-stone-900 text-teal-300 hover:text-teal-200 border border-teal-500/30')
          }
        >
          <Package className="w-4 h-4 text-teal-400" />
          <span>{isRo ? '🗓️ Aprovizionare 15 / 30 Zile' : '🗓️ 15 / 30 Day Stock-Up'}</span>
        </button>

        {/* SUBTAB: AI BILL ANALYZER */}
        <button
          onClick={() => setActiveSubTab('billAnalyzer')}
          className={
            'px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ' +
            (activeSubTab === 'billAnalyzer'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 shadow-md font-black ring-1 ring-amber-400'
              : 'bg-stone-900 text-amber-300 hover:text-amber-200 border border-amber-500/30')
          }
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{isRo ? '🧠 AI Analiză Bonuri & Sugestii Ieftine' : '🧠 AI Bill Analyzer & Cheaper Swaps'}</span>
        </button>

        {/* SUBTAB: REELS */}
        <button
          onClick={() => setActiveSubTab('reels')}
          className={
            'px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ' +
            (activeSubTab === 'reels'
              ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md font-black ring-1 ring-pink-400'
              : 'bg-stone-900 text-pink-400 hover:text-pink-300 border border-pink-500/30')
          }
        >
          <Video className="w-4 h-4 text-pink-400" />
          <span>{isRo ? '🎬 Rețete din Reels & Darija (' + savedRecipes.length + ')' : '🎬 Reel Recipes & Darija (' + savedRecipes.length + ')'}</span>
        </button>

        {/* SUBTAB: BUDGET FITTER */}
        <button
          onClick={() => setActiveSubTab('budgetFitter')}
          className={
            'px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ' +
            (activeSubTab === 'budgetFitter'
              ? 'bg-emerald-500 text-stone-950 shadow-md font-bold'
              : 'bg-stone-900 text-stone-400 hover:text-white border border-stone-800')
          }
        >
          <Coins className="w-4 h-4" />
          <span>{isRo ? '💰 Coș pe Bugetul Meu' : '💰 Smart Budget Fitter'}</span>
        </button>

        {/* SUBTAB: BUNDLES */}
        <button
          onClick={() => setActiveSubTab('bundles')}
          className={
            'px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ' +
            (activeSubTab === 'bundles'
              ? 'bg-emerald-500 text-stone-950 shadow-md'
              : 'bg-stone-900 text-stone-400 hover:text-white border border-stone-800')
          }
        >
          <Flame className="w-4 h-4 text-amber-400" />
          <span>{isRo ? 'Meniuri Culturale (6 Bucătării)' : 'Cultural Menus'}</span>
        </button>

        {/* SUBTAB: MATRIX */}
        <button
          onClick={() => setActiveSubTab('matrix')}
          className={
            'px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ' +
            (activeSubTab === 'matrix'
              ? 'bg-emerald-500 text-stone-950 shadow-md'
              : 'bg-stone-900 text-stone-400 hover:text-white border border-stone-800')
          }
        >
          <Layers className="w-4 h-4" />
          <span>{isRo ? 'Matrice Prețuri 6 Magazine' : '6-Store Matrix'}</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SUBTAB: 15 / 30 DAYS STOCK-UP PLANNER (NEW) */}
      {/* ========================================================================= */}
      {activeSubTab === 'stockup' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-gradient-to-br from-stone-900 via-teal-950/30 to-stone-900 p-6 sm:p-7 rounded-3xl border border-teal-500/30 shadow-2xl space-y-4">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-teal-400">
              <Package className="w-4 h-4" />
              <span>{isRo ? 'Planificator Aprovizionare pe Termen Lung (15 sau 30 de Zile)' : 'Long-Term Stock-Up Planner (15 or 30 Days)'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {isRo ? 'Aprovizionare Completă pentru 15 sau 30 de Zile' : 'Complete 15 or 30-Day Household Stock-Up'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
              {isRo
                ? 'Nu mai pierde timpul cu drumuri zilnice la magazin! Calculează cantitățile exacte de alimente de bază, carne, lactate, baxuri de băuturi, gustări, dulciuri și produse de curățenie/menaj, optimizate la cele mai mici prețuri din supermarketurile românești.'
                : 'Save time and money! Calculate exact quantities of food staples, meat, dairy, bulk drinks, snacks, sweets, and cleaning essentials with cheapest store recommendations.'}
            </p>

            {/* Duration Selector & Scope Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Duration Buttons */}
              <div>
                <label className="text-xs font-bold text-teal-300 block mb-2">
                  🗓️ {isRo ? 'Perioadă de Aprovizionare:' : 'Stock-Up Duration:'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setStockUpDuration('DAYS_15')}
                    className={
                      'p-3 rounded-2xl border text-center transition cursor-pointer ' +
                      (stockUpDuration === 'DAYS_15'
                        ? 'bg-teal-500 text-stone-950 font-black border-teal-400 shadow-lg shadow-teal-500/20 ring-2 ring-teal-400/50'
                        : 'bg-stone-950 border-stone-800 text-stone-300 hover:border-teal-500/40')
                    }
                  >
                    <div className="text-base font-black">📅 15 Zile</div>
                    <div className="text-[11px] opacity-80 mt-0.5">{isRo ? 'Bi-Săptămânal (2 Săptămâni)' : 'Bi-Weekly (2 Weeks)'}</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStockUpDuration('DAYS_30')}
                    className={
                      'p-3 rounded-2xl border text-center transition cursor-pointer ' +
                      (stockUpDuration === 'DAYS_30'
                        ? 'bg-teal-500 text-stone-950 font-black border-teal-400 shadow-lg shadow-teal-500/20 ring-2 ring-teal-400/50'
                        : 'bg-stone-950 border-stone-800 text-stone-300 hover:border-teal-500/40')
                    }
                  >
                    <div className="text-base font-black">🗓️ 30 Zile</div>
                    <div className="text-[11px] opacity-80 mt-0.5">{isRo ? 'Coș Lunar Complet' : 'Full Monthly Basket'}</div>
                  </button>
                </div>
              </div>

              {/* Scope Filters */}
              <div>
                <label className="text-xs font-bold text-teal-300 block mb-2">
                  🛒 {isRo ? 'Categorii Incluse în Coș:' : 'Categories Included:'}
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'ALL', label: isRo ? 'Totul Inclus (Complet)' : 'All Inclusive' },
                    { id: 'FOOD', label: isRo ? 'Doar Mâncare & Cămară' : 'Food & Pantry Only' },
                    { id: 'SNACKS_DRINKS', label: isRo ? '🍿 Snacks, Sucuri & Dulciuri' : 'Snacks, Drinks & Sweets' },
                    { id: 'CLEANING', label: isRo ? '🧼 Curățenie & Menaj' : 'Cleaning & Household' }
                  ].map((sc) => (
                    <button
                      key={sc.id}
                      type="button"
                      onClick={() => setStockUpCategoryScope(sc.id as any)}
                      className={
                        'px-2.5 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer truncate ' +
                        (stockUpCategoryScope === sc.id
                          ? 'bg-stone-100 text-stone-950 border-white font-bold'
                          : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-white')
                      }
                    >
                      {sc.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Computed Stock-Up Summary & Action Banner */}
          <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
              <div>
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider block">
                  {isRo
                    ? `Coș de Aprovizionare Calculat (${stockUpPlan.durationDays} Zile • ${stockUpPlan.items.length} Articole)`
                    : `Calculated Stock-Up Plan (${stockUpPlan.durationDays} Days • ${stockUpPlan.items.length} Items)`}
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  {isRo ? 'Cost Total Estimat & Economii Supermarket' : 'Total Est. Cost & Supermarket Savings'}
                </h3>
              </div>

              <div className="flex items-center gap-4 bg-stone-950 p-3.5 rounded-2xl border border-stone-800 shrink-0">
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider block">
                    {isRo ? 'Total Coș Optimizat' : 'Total Optimized'}
                  </span>
                  <span className="text-2xl font-black text-emerald-400 font-mono">
                    {stockUpPlan.totalCost.toFixed(2)} {currency}
                  </span>
                </div>
                <div className="w-px h-8 bg-stone-800" />
                <div>
                  <span className="text-[10px] text-teal-400 uppercase font-bold tracking-wider block">
                    {isRo ? 'Economisești vs Magazine Scumpe' : 'You Save'}
                  </span>
                  <span className="text-lg font-black text-teal-300 font-mono">
                    -{stockUpPlan.totalSaved.toFixed(2)} {currency} ({stockUpPlan.savingsPercent}%)
                  </span>
                </div>
              </div>
            </div>

            {/* Item List with Store Badges */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {stockUpPlan.items.map((sItem, idx) => {
                const storeMeta = SUPERMARKETS.find((s) => s.id === sItem.bestStoreId);
                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-stone-850 border border-stone-750 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white truncate text-sm">{sItem.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-stone-400 text-[11px] mt-0.5">
                        <span className="font-mono font-bold text-emerald-400">
                          {sItem.quantity} {sItem.unit}
                        </span>
                        {sItem.brandName && <span className="truncate">({sItem.brandName})</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      {storeMeta && (
                        <span className={'px-2.5 py-1 rounded-xl text-xs font-bold border ' + storeMeta.badgeBg}>
                          {storeMeta.name}
                        </span>
                      )}
                      <span className="font-mono font-black text-emerald-400 text-sm min-w-[65px] text-right">
                        {sItem.totalCost.toFixed(2)} {currency}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Apply Button */}
            <div className="pt-3 border-t border-stone-800 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => handleApplyStockUpPlanToList(true)}
                className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-stone-950 font-bold text-xs shadow-lg shadow-teal-500/20 transition cursor-pointer flex items-center justify-center gap-2 active:scale-98"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>
                  {isRo
                    ? `Înlocuiește Lista Mea cu Coșul de ${stockUpPlan.durationDays} Zile (${stockUpPlan.totalCost.toFixed(2)} ${currency})`
                    : `Replace My List with ${stockUpPlan.durationDays}-Day Basket (${stockUpPlan.totalCost.toFixed(2)} ${currency})`}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleApplyStockUpPlanToList(false)}
                className="py-3.5 px-6 rounded-2xl bg-stone-800 hover:bg-stone-750 text-white font-bold text-xs transition cursor-pointer"
              >
                {isRo ? 'Adaugă la Lista Curentă' : 'Append to Current List'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB: AI BILL ANALYZER & CHEAPER ALTERNATIVES (NEW) */}
      {/* ========================================================================= */}
      {activeSubTab === 'billAnalyzer' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-gradient-to-br from-stone-900 via-amber-950/20 to-stone-900 p-6 sm:p-7 rounded-3xl border border-amber-500/30 shadow-2xl space-y-4">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-amber-400">
              <Sparkles className="w-4 h-4" />
              <span>{isRo ? 'AI Analiză Bonuri & Memorie Cumpărături' : 'AI Bill Analyzer & Purchase Memory'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {isRo ? 'Ce am cumpărat și cum economisim data viitoare?' : 'What we bought & cheaper alternatives for next trip'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
              {isRo
                ? 'AI-ul ține minte toate bonurile și cumpărăturile voastre anterioare, identifică produsele cumpărate scump și vă sugerează alternative identice calitativ la prețuri mult mai mici pentru următoarea tură de cumpărături!'
                : 'The AI remembers your past receipts, detects overpriced purchases, and suggests cheaper 1:1 alternatives for your next grocery trip!'}
            </p>

            {/* Savings highlight bar */}
            <div className="p-4 rounded-2xl bg-stone-950 border border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <TrendingDown className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-amber-400 block uppercase tracking-wider">
                    {isRo ? 'Economii Identificate pe Istoricul Bonurilor' : 'Total Potential Savings on Past Bills'}
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
                    +{billAnalysisResults.totalPotentialSavings.toFixed(2)} {currency} economie posibilă
                  </span>
                </div>
              </div>

              {billAnalysisResults.suggestions.length > 0 && (
                <button
                  type="button"
                  onClick={handleApplyCheaperAlternativesToList}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md cursor-pointer transition flex items-center justify-center gap-2 active:scale-98"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{isRo ? 'Adaugă Toate Alternativele Ieftine în Listă' : 'Add Cheap Swaps to List'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Suggestions List Table */}
          <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkle className="w-5 h-5 text-amber-400" />
              <span>{isRo ? 'Sugestii de Înlocuire Inteligentă (Produs cu Produs)' : 'Smart Item Swaps (Item-by-Item)'}</span>
            </h3>

            {billAnalysisResults.suggestions.length === 0 ? (
              <div className="py-8 text-center text-stone-500">
                <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-400 mb-2" />
                <p className="text-sm font-bold text-stone-300">
                  {isRo ? 'Toate cumpărăturile tale recente sunt deja la cel mai mic preț!' : 'All your recent purchases were at the lowest price!'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {billAnalysisResults.suggestions.map((sug) => {
                  const origStore = SUPERMARKETS.find((s) => s.id === sug.originalStore);
                  const cheapStore = SUPERMARKETS.find((s) => s.id === sug.cheaperStore);

                  return (
                    <div
                      key={sug.id}
                      className="p-4 rounded-2xl bg-stone-850 border border-stone-750 hover:border-amber-500/40 transition flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                    >
                      {/* Left: Original vs Cheaper */}
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="line-through text-stone-400 font-semibold">{sug.originalItemName}</span>
                          <span className="text-stone-500">→</span>
                          <span className="font-bold text-emerald-300">{sug.cheaperAlternativeName}</span>
                        </div>

                        <p className="text-[11px] text-stone-300 leading-relaxed">{sug.rationale}</p>
                      </div>

                      {/* Right: Store Comparison & Difference */}
                      <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-stone-800">
                        {/* Old Price */}
                        <div className="text-right">
                          <span className="text-[10px] text-stone-400 block">{origStore?.name || sug.originalStore}</span>
                          <span className="line-through text-stone-400 font-mono">{sug.originalPrice.toFixed(2)} {currency}</span>
                        </div>

                        {/* New Price */}
                        <div className="text-right">
                          <span className="text-[10px] text-emerald-400 block font-bold">{cheapStore?.name || sug.cheaperStore}</span>
                          <span className="text-base font-black text-emerald-400 font-mono">{sug.cheaperPrice.toFixed(2)} {currency}</span>
                        </div>

                        {/* Savings Badge */}
                        <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black">
                          -{sug.savingsRon.toFixed(2)} {currency}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Past Receipts History List */}
          <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Receipt className="w-5 h-5 text-cyan-400" />
              <span>{isRo ? 'Istoric Bonuri & Cumpărături Memorate' : 'Logged Purchase Bills History'}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {purchaseHistory.map((rec) => (
                <div
                  key={rec.id}
                  className="p-4 rounded-2xl bg-stone-850 border border-stone-750 space-y-2.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Store className="w-4 h-4 text-amber-400" />
                      <span className="font-bold text-white">{rec.storeName}</span>
                    </div>
                    <span className="text-stone-400 font-mono text-[11px]">{rec.date}</span>
                  </div>

                  <div className="flex items-baseline justify-between pt-1 border-t border-stone-800">
                    <span className="text-stone-400">{rec.items.length} {isRo ? 'articole cumpărate' : 'items'}</span>
                    <span className="text-base font-black text-emerald-400 font-mono">
                      {rec.totalSpent.toFixed(2)} {currency}
                    </span>
                  </div>

                  {/* Items preview */}
                  <div className="space-y-1 max-h-24 overflow-y-auto pr-1 text-[11px] text-stone-300">
                    {rec.items.map((it, i) => (
                      <div key={i} className="flex justify-between">
                        <span className="truncate flex-1">• {it.name}</span>
                        <span className="font-mono text-stone-400 ml-2">{(it.price || 0).toFixed(2)} {currency}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB: REELS & VIDEO RECIPE EXTRACTOR */}
      {/* ========================================================================= */}
      {activeSubTab === 'reels' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Reel Link Extractor Form */}
          <div className="bg-gradient-to-br from-stone-900 via-pink-950/20 to-stone-900 p-6 sm:p-7 rounded-3xl border border-pink-500/30 shadow-2xl space-y-4">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-pink-400">
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span>{isRo ? 'AI Reel & Video Recipe Extractor (Darija 🇲🇦 / RO / EN)' : 'AI Reel & Video Recipe Extractor (Darija 🇲🇦 / RO / EN)'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {isRo ? 'Ai văzut un Reel pe Facebook, Instagram sau TikTok?' : 'Found a cooking Reel on Facebook, Instagram or TikTok?'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
              {isRo
                ? 'Lipește link-ul video-ului sau apasă pe un preparat tradițional marocan în Darija. Sistemul extrage ingredientele și îți arată în ce magazin românesc (Lidl, Kaufland, Carrefour, Mega, Penny, Auchan) le găsești cel mai ieftin!'
                : 'Paste the video URL or click a Moroccan Darija dish below. The engine extracts ingredients and matches the cheapest Romanian supermarket!'}
            </p>

            {/* Moroccan Darija Quick Dish Selection Pills */}
            <div className="pt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-red-400 block mb-2">
                🇲🇦 {isRo ? 'Alegere Rapidă Bucătărie Tradițională Marocană (Darija):' : 'Quick Moroccan Traditional Dishes (Darija):'}
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: '🍖 Tajine Lhm b lbarqoq (طاجين اللحم بالبرقوق)', query: 'tajine lhm b lbarqoq w louz' },
                  { label: '🍗 Djaj M\'hammer (دجاج محمر بالزيتون)', query: 'djaj mhammer b zitoun w daghmira' },
                  { label: '🍲 Harira Fassia (الحريرة المغربية)', query: 'harira fassia maghribia b hommos w 3des' },
                  { label: '🥘 Kefta b Maticha (طاجين الكفتة بمطيشة)', query: 'tajine kefta b maticha w lbid' },
                  { label: '🥟 Pastilla Djaj (بسطيلة الدجاج)', query: 'pastilla poulet djaj w louz' },
                  { label: '🐟 Hout Charmoula (طاجين الحوت)', query: 'tajine hout b chermoula w khodra' },
                  { label: '🌾 Couscous 7 Khodari (كسكس بالسبع خضار)', query: 'couscous 7 khodari b lhm' },
                  { label: '🫓 Msemen M\'3amar (المسمن معمر)', query: 'msemen m3amar b kefta w bsla' }
                ].map((item, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleQuickMoroccanDishClick(item.query)}
                    className="px-3 py-1.5 rounded-xl bg-stone-950 hover:bg-red-500/20 border border-stone-800 hover:border-red-500/40 text-stone-300 hover:text-red-300 text-xs font-semibold cursor-pointer transition active:scale-98"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleExtractRecipeFromReel} className="space-y-3.5 pt-2">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                    <Video className="w-4 h-4 text-pink-400" />
                  </div>
                  <input
                    type="url"
                    placeholder={isRo ? 'Lipește link Facebook Reel / Instagram / TikTok / YouTube...' : 'Paste Facebook Reel / Instagram / TikTok / YouTube link...'}
                    value={reelUrlInput}
                    onChange={(e) => setReelUrlInput(e.target.value)}
                    className="w-full bg-stone-950 border border-pink-500/40 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-pink-400 shadow-inner"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isExtractingReel || (!reelUrlInput.trim() && !recipeNotesInput.trim())}
                  className={
                    'px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition cursor-pointer active:scale-98 shrink-0 ' +
                    (isExtractingReel || (!reelUrlInput.trim() && !recipeNotesInput.trim())
                      ? 'bg-stone-800 text-stone-500 border border-stone-700 cursor-not-allowed opacity-60'
                      : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white shadow-pink-500/25')
                  }
                >
                  {isExtractingReel ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{isRo ? 'Analiză AI în Curs...' : 'AI Analyzing...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>{isRo ? 'Extrage & Potrivește Magazine' : 'Extract & Match Stores'}</span>
                    </>
                  )}
                </button>
              </div>

              <div>
                <input
                  type="text"
                  placeholder={isRo ? 'Descriere sau ingrediente din video (Darija / Arabă / Română / Engleză / Franceză)...' : 'Recipe description or ingredients (Darija / Arabic / Romanian / English / French)...'}
                  value={recipeNotesInput}
                  onChange={(e) => setRecipeNotesInput(e.target.value)}
                  className="w-full bg-stone-950/80 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-300 placeholder-stone-600 focus:outline-none focus:border-pink-500/50"
                />
              </div>
            </form>

            {reelExtractError && (
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{reelExtractError}</span>
              </div>
            )}
          </div>

          {/* AI Extracted Recipe Result Card */}
          {extractedRecipe && (
            <div className="p-6 rounded-3xl bg-stone-900 border-2 border-pink-500/60 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-pink-500/20 text-pink-300 border border-pink-500/40 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      {isRo ? 'Rețetă Extrasă din Video' : 'Extracted from Video'}
                    </span>
                    {(() => {
                      const b = getCuisineBadge(extractedRecipe.cuisine);
                      return (
                        <span className={'px-2.5 py-0.5 rounded-full text-xs font-bold border ' + b.color}>
                          {b.flag} {b.label}
                        </span>
                      );
                    })()}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mt-1.5">{extractedRecipe.title}</h3>
                  <p className="text-xs text-stone-300 mt-1 leading-relaxed">{extractedRecipe.description}</p>
                </div>

                <div className="flex items-center gap-3 bg-stone-950 p-3 rounded-2xl border border-stone-800 shrink-0">
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider block">
                      {isRo ? 'Cost Total Estimat' : 'Total Est. Cost'}
                    </span>
                    <span className="text-xl font-black text-emerald-400 font-mono">
                      {extractedRecipe.totalEstimatedCost.toFixed(2)} {currency}
                    </span>
                  </div>
                  {extractedRecipe.videoUrl && (
                    <a
                      href={extractedRecipe.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 border border-pink-500/40 text-xs font-bold flex items-center gap-1.5 transition"
                    >
                      <Play className="w-3.5 h-3.5 fill-pink-400" />
                      <span>{isRo ? 'Vezi Video' : 'Watch Reel'}</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Instructions summary */}
              {extractedRecipe.instructionsSummary && (
                <div className="p-3.5 rounded-2xl bg-stone-950/70 border border-stone-800 text-xs text-stone-300 space-y-1">
                  <span className="font-bold text-pink-300 block">👨‍🍳 {isRo ? 'Pași de Gătire Rapizi:' : 'Quick Cooking Steps:'}</span>
                  <p className="leading-relaxed">{extractedRecipe.instructionsSummary}</p>
                </div>
              )}

              {/* Ingredient Store Breakdown */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                  🛒 {isRo ? 'Ingrediente & Recomandare Magazine Românești:' : 'Ingredients & Store Recommendations:'} ({extractedRecipe.ingredients.length})
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {extractedRecipe.ingredients.map((ing, idx) => {
                    const storeMeta = SUPERMARKETS.find((s) => s.id === ing.suggestedStoreId);
                    return (
                      <div
                        key={idx}
                        className="p-3 rounded-2xl bg-stone-850 border border-stone-750 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="min-w-0 flex-1">
                          <span className="font-bold text-white block truncate">{ing.name}</span>
                          <span className="text-[10px] text-stone-400 font-mono">
                            {ing.quantity} {ing.unit}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {storeMeta && (
                            <span className={'px-2.5 py-1 rounded-xl text-[11px] font-bold border ' + storeMeta.badgeBg}>
                              {storeMeta.name}
                            </span>
                          )}
                          <span className="font-mono font-black text-emerald-400">
                            {(ing.estimatedPrice || 0).toFixed(2)} {currency}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-stone-800 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => handleAddRecipeIngredientsToList(extractedRecipe)}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-stone-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition cursor-pointer flex items-center justify-center gap-2 active:scale-98"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{isRo ? 'Adaugă Toate Ingredientele în Lista Mea' : 'Add All Ingredients to Shopping List'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveExtractedRecipe}
                  className="py-3 px-5 rounded-2xl bg-stone-800 hover:bg-stone-750 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <Bookmark className="w-4 h-4 text-pink-400" />
                  <span>{isRo ? 'Salvează în Colecție' : 'Save to Recipe Book'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Saved Recipe Book Gallery */}
          <div className="space-y-4 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-pink-400" />
                  <span>{isRo ? 'Cartea Noastră de Rețete & Reels Salvate' : 'Our Saved Recipes & Reels Collection'}</span>
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  {isRo
                    ? 'Rețete spaniole, italiene, americane, germane, marocane și românești gata de gătit.'
                    : 'Spanish, Italian, American, German, Moroccan and Romanian recipes ready to cook.'}
                </p>
              </div>

              {/* Cuisine Filter Tabs */}
              <div className="flex flex-wrap gap-1.5">
                {(['ALL', 'SPANISH', 'ITALIAN', 'AMERICAN', 'GERMAN', 'MOROCCAN', 'ROMANIAN'] as (GroceryCuisineType | 'ALL')[]).map((c) => {
                  const b = c === 'ALL' ? { label: isRo ? 'Toate' : 'All', flag: '🌍' } : getCuisineBadge(c);
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setRecipeCuisineFilter(c)}
                      className={
                        'px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ' +
                        (recipeCuisineFilter === c
                          ? 'bg-pink-500 text-white shadow-sm font-black'
                          : 'bg-stone-900 text-stone-400 hover:text-white border border-stone-800')
                      }
                    >
                      {b.flag} {b.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Recipe Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedRecipes
                .filter((rec) => {
                  if (recipeCuisineFilter !== 'ALL' && rec.cuisine !== recipeCuisineFilter) return false;
                  if (recipeSearchQuery.trim() && !rec.title.toLowerCase().includes(recipeSearchQuery.toLowerCase())) return false;
                  return true;
                })
                .map((recipe) => {
                  const b = getCuisineBadge(recipe.cuisine);
                  return (
                    <div
                      key={recipe.id}
                      className="p-5 rounded-3xl bg-stone-900 border border-stone-800 hover:border-pink-500/40 shadow-xl flex flex-col justify-between space-y-4 transition-all"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className={'px-2.5 py-0.5 rounded-full text-[11px] font-bold border ' + b.color}>
                            {b.flag} {b.label}
                          </span>
                          <div className="flex items-center gap-1.5 text-stone-400 text-xs">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{recipe.prepTimeMinutes || 30} min</span>
                          </div>
                        </div>

                        <h4 className="font-bold text-white text-base mt-2.5 leading-snug">{recipe.title}</h4>
                        {recipe.description && (
                          <p className="text-xs text-stone-300 mt-1.5 line-clamp-2 leading-relaxed">{recipe.description}</p>
                        )}

                        {/* Ingredients Preview */}
                        <div className="mt-3 pt-3 border-t border-stone-800 space-y-1.5">
                          <div className="flex items-center justify-between text-[11px] font-bold text-stone-400">
                            <span>{isRo ? 'Ingrediente:' : 'Ingredients:'} ({recipe.ingredients.length})</span>
                            <span className="font-mono text-emerald-400 font-bold">
                              ~{recipe.totalEstimatedCost.toFixed(2)} {currency}
                            </span>
                          </div>
                          <div className="space-y-1 max-h-28 overflow-y-auto pr-1 text-xs">
                            {recipe.ingredients.slice(0, 4).map((ing, i) => {
                              const storeMeta = SUPERMARKETS.find((s) => s.id === ing.suggestedStoreId);
                              return (
                                <div key={i} className="flex items-center justify-between text-stone-300 text-[11px]">
                                  <span className="truncate flex-1">• {ing.name}</span>
                                  {storeMeta && (
                                    <span className="text-[10px] text-stone-400 font-mono ml-2">
                                      [{storeMeta.name}]
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                            {recipe.ingredients.length > 4 && (
                              <span className="text-[10px] text-stone-500 italic block">
                                + încă {recipe.ingredients.length - 4} ingrediente...
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-stone-800 space-y-2">
                        {recipe.videoUrl && (
                          <a
                            href={recipe.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-2 rounded-xl bg-stone-950 hover:bg-stone-850 text-pink-300 border border-pink-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>{isRo ? 'Deschide Video / Reel' : 'Open Video / Reel'}</span>
                          </a>
                        )}

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleAddRecipeIngredientsToList(recipe)}
                            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-stone-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition cursor-pointer flex items-center justify-center gap-1.5 active:scale-98"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>{isRo ? 'Cumpără Ingrediente' : 'Add to Cart'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteSavedRecipe(recipe.id)}
                            className="w-9 h-9 rounded-xl bg-stone-950 hover:bg-rose-500/20 border border-stone-800 hover:border-rose-500/40 text-stone-500 hover:text-rose-400 flex items-center justify-center cursor-pointer transition"
                            title={isRo ? 'Șterge rețeta' : 'Delete recipe'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 1: SHOPPING LIST & DUAL STRATEGY ENGINE */}
      {/* ========================================================================= */}
      {activeSubTab === 'list' && (
        <div className="space-y-6">
          {/* Strategy Mode Switcher */}
          <div className="bg-stone-900 p-4 rounded-2xl border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Compass className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-white">
                  {isRo ? 'Strategie Optimizare Preț vs. Calitate' : 'Optimization Strategy: Price vs. Quality'}
                </h3>
                <p className="text-xs text-stone-400">
                  {isRo ? 'Alege dacă dorești costul minim absolut sau cel mai bun raport calitate/preț' : 'Choose between lowest cost or best quality-to-price ratio'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setQualityPref('CHEAPEST')}
                className={
                  'px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ' +
                  (qualityPref === 'CHEAPEST' ? 'bg-amber-500 text-stone-950 shadow-sm font-black' : 'bg-stone-800 text-stone-400 hover:text-white')
                }
              >
                <Coins className="w-3.5 h-3.5" />
                <span>{isRo ? 'Preț Minim' : 'Cheapest'}</span>
              </button>
              <button
                onClick={() => setQualityPref('BEST_VALUE')}
                className={
                  'px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ' +
                  (qualityPref === 'BEST_VALUE' ? 'bg-emerald-500 text-stone-950 shadow-sm font-black' : 'bg-stone-800 text-stone-400 hover:text-white')
                }
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isRo ? 'Calitate/Preț Optim' : 'Best Value'}</span>
              </button>
              <button
                onClick={() => setQualityPref('PREMIUM')}
                className={
                  'px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ' +
                  (qualityPref === 'PREMIUM' ? 'bg-cyan-500 text-stone-950 shadow-sm font-black' : 'bg-stone-800 text-stone-400 hover:text-white')
                }
              >
                <Star className="w-3.5 h-3.5" />
                <span>{isRo ? 'Bio & Premium' : 'Bio & Premium'}</span>
              </button>
            </div>
          </div>

          {/* DUAL COMPARISON CARDS: 1-STOP CHAMPION vs. SMART SPLIT-CART SAVER */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card 1: 1-Stop Store Champion */}
            <div className="p-5 rounded-3xl bg-stone-900 border border-stone-800 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <Store className="w-4 h-4" />
                  {isRo ? 'Campion 1 Singur Magazin' : '1-Stop Store Champion'}
                </span>
                <span className="text-xs text-stone-400">{isRo ? 'O singură oprire rapidă' : 'Quick single stop'}</span>
              </div>

              {singleStoreLeaderboard.length > 0 && (
                <div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xl font-bold text-white">
                      {singleStoreLeaderboard[0].store.name}
                    </span>
                    <span className="text-2xl font-black text-emerald-400 font-mono">
                      {singleStoreLeaderboard[0].totalEstimatedCost.toFixed(2)} {currency}
                    </span>
                  </div>
                  <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                    {isRo ? singleStoreLeaderboard[0].store.specialtyRo : singleStoreLeaderboard[0].store.specialtyEn}
                  </p>

                  <div className="mt-3 pt-2 border-t border-stone-800 space-y-1.5">
                    <div className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">
                      {isRo ? 'Clasament 6 magazine:' : '6-Store Leaderboard:'}
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 text-center">
                      {singleStoreLeaderboard.map((item, i) => (
                        <div key={item.store.id} className="p-1.5 bg-stone-950 rounded-xl border border-stone-800 text-[10px]">
                          <div className="font-bold text-stone-300 truncate">#{i + 1} {item.store.name}</div>
                          <div className="font-mono text-emerald-400 font-bold">{item.totalEstimatedCost.toFixed(0)} {currency}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Card 2: Smart Split-Cart 2-Store Saver */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-950/40 via-stone-900 to-stone-900 border border-emerald-500/40 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  {isRo ? 'Split-Cart Saver (2 Magazine)' : 'Split-Cart Saver (2 Stores)'}
                </span>
                {splitTripOptimization.savingsVsCheapestSingle > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                    {isRo
                      ? 'Economisești ' + splitTripOptimization.savingsVsCheapestSingle.toFixed(2) + ' ' + currency + ' (' + splitTripOptimization.savingsPercent + '%)'
                      : 'Save ' + splitTripOptimization.savingsVsCheapestSingle.toFixed(2) + ' ' + currency + ' (' + splitTripOptimization.savingsPercent + '%)'}
                  </span>
                )}
              </div>

              <div className="flex items-baseline justify-between">
                <span className="text-lg sm:text-xl font-bold text-white">
                  {splitTripOptimization.store1.name} + {splitTripOptimization.store2.name}
                </span>
                <span className="text-2xl font-black text-emerald-400 font-mono">
                  {splitTripOptimization.totalCost.toFixed(2)} {currency}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="p-2.5 rounded-2xl bg-stone-950/80 border border-stone-800">
                  <div className="font-bold text-blue-400">{splitTripOptimization.store1.name} ({splitTripOptimization.store1Items.length} {isRo ? 'articole' : 'items'})</div>
                  <div className="text-[10px] text-stone-400 mt-0.5">{isRo ? 'Lactate, Cămară și Pâine' : 'Dairy, Pantry & Bread'}</div>
                </div>
                <div className="p-2.5 rounded-2xl bg-stone-950/80 border border-stone-800">
                  <div className="font-bold text-red-400">{splitTripOptimization.store2.name} ({splitTripOptimization.store2Items.length} {isRo ? 'articole' : 'items'})</div>
                  <div className="text-[10px] text-stone-400 mt-0.5">{isRo ? 'Carne Proaspătă, Vită și Legume' : 'Fresh Meat, Beef & Veggies'}</div>
                </div>
              </div>

              <button
                onClick={() => {
                  setLogStoreName(splitTripOptimization.store1.name + ' & ' + splitTripOptimization.store2.name);
                  setLogAmount(splitTripOptimization.totalCost);
                  setIsLogExpenseOpen(true);
                }}
                className="w-full mt-2 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs shadow-md cursor-pointer transition flex items-center justify-center gap-1.5 active:scale-98"
              >
                <Wallet className="w-3.5 h-3.5" />
                <span>{isRo ? 'Înregistrează Cumpărăturile în Buget' : 'Log Groceries to Household Budget'}</span>
              </button>
            </div>
          </div>

          {/* ACTIVE SHOPPING LIST TABLE - 100% BOXED & RESPONSIVE */}
          <div className="bg-stone-900 rounded-3xl border border-stone-800 p-4 sm:p-6 space-y-4 shadow-xl overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-lg font-bold text-white">
                  {isRo ? 'Articole în Listă (' + shoppingList.length + ')' : 'Shopping List Items (' + shoppingList.length + ')'}
                </span>
                {checkedCount > 0 && (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                    {isRo ? checkedCount + ' bifate în magazin' : checkedCount + ' checked in store'}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddItemOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs flex items-center gap-1 cursor-pointer transition shadow-md"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isRo ? 'Adaugă Produs' : 'Add Item'}</span>
                </button>
                {checkedCount > 0 && (
                  <button
                    onClick={handleClearCheckedItems}
                    className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-300 text-xs font-semibold cursor-pointer transition"
                  >
                    {isRo ? 'Șterge Bifatele' : 'Clear Checked'}
                  </button>
                )}
              </div>
            </div>

            {shoppingList.length === 0 ? (
              <div className="py-12 text-center text-stone-500 space-y-3">
                <ShoppingCart className="w-12 h-12 mx-auto text-stone-600" />
                <p className="text-base font-bold text-stone-300">
                  {isRo ? 'Lista ta de cumpărături este goală.' : 'Your shopping list is currently empty.'}
                </p>
                <p className="text-xs text-stone-400 max-w-md mx-auto">
                  {isRo
                    ? 'Alege un plan de aprovizionare pentru 15/30 de zile, o rețetă din Reels sau generează un coș pe buget!'
                    : 'Choose a 15/30-day stock up plan, a reel recipe or generate a basket on your budget!'}
                </p>
                <div className="flex justify-center gap-2 pt-2 flex-wrap">
                  <button
                    onClick={() => setActiveSubTab('stockup')}
                    className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-stone-950 font-bold text-xs cursor-pointer shadow-md"
                  >
                    🗓️ {isRo ? 'Aprovizionare 15 / 30 Zile' : '15 / 30 Day Stock-Up'}
                  </button>
                  <button
                    onClick={() => setActiveSubTab('reels')}
                    className="px-4 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-400 text-white font-bold text-xs cursor-pointer shadow-md"
                  >
                    🎬 {isRo ? 'Vezi Rețete din Reels' : 'View Reel Recipes'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {shoppingList.map((item) => {
                  const rec = getItemStoreRecommendation(item, qualityPref);
                  const storeMeta = rec ? SUPERMARKETS.find((s) => s.id === rec.storeId) : null;
                  const itemCost = (rec?.price || 0) * item.quantity;
                  const catItem = item.catalogItemId ? catalogMap.get(item.catalogItemId) : null;

                  return (
                    <div
                      key={item.id}
                      className={
                        'w-full p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 overflow-hidden ' +
                        (item.isChecked
                          ? 'bg-stone-950/60 border-stone-800/80 opacity-60'
                          : 'bg-stone-850 border-stone-750 hover:border-stone-650')
                      }
                    >
                      {/* Left: Checkbox & Item Details */}
                      <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                        <button
                          type="button"
                          onClick={() => handleToggleItemCheck(item.id)}
                          className="cursor-pointer text-stone-400 hover:text-emerald-400 transition mt-0.5 sm:mt-0 shrink-0"
                        >
                          {item.isChecked ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <Circle className="w-5 h-5" />
                          )}
                        </button>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={'text-sm sm:text-base font-bold truncate ' + (item.isChecked ? 'line-through text-stone-400' : 'text-white')}>
                              {item.name}
                            </span>
                            {catItem?.culturalTag && (
                              <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                                {catItem.culturalTag}
                              </span>
                            )}
                            {item.notes && (
                              <span className="px-2 py-0.5 rounded-lg text-[10px] font-medium bg-stone-800 text-stone-300 border border-stone-700 shrink-0">
                                {item.notes}
                              </span>
                            )}
                          </div>
                          {rec?.brandName && (
                            <span className="text-xs text-stone-400 block mt-0.5 truncate">{rec.brandName}</span>
                          )}
                        </div>
                      </div>

                      {/* Right: Store Badge, Quantity, Price & Trash */}
                      <div className="flex items-center justify-between md:justify-end gap-2.5 sm:gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-stone-800">
                        {/* Store Badge */}
                        {storeMeta && rec && (
                          <div className="shrink-0">
                            <span className={'px-2.5 py-1 rounded-xl text-[11px] font-bold border inline-flex items-center gap-1 ' + storeMeta.badgeBg}>
                              <span>{storeMeta.icon}</span>
                              <span className="hidden sm:inline">{storeMeta.name}</span>
                              <span className="font-mono text-white">({rec.price.toFixed(2)})</span>
                            </span>
                          </div>
                        )}

                        {/* Quantity controls */}
                        <div className="flex items-center bg-stone-900 border border-stone-750 rounded-xl px-2 py-1 gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleUpdateItemQty(item.id, item.quantity - 1)}
                            className="text-stone-400 hover:text-white text-xs font-bold cursor-pointer px-1"
                          >
                            -
                          </button>
                          <span className="text-xs font-mono font-bold text-white min-w-[35px] text-center">
                            {item.quantity} {item.unit}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUpdateItemQty(item.id, item.quantity + 1)}
                            className="text-stone-400 hover:text-white text-xs font-bold cursor-pointer px-1"
                          >
                            +
                          </button>
                        </div>

                        {/* Total Cost for this row */}
                        <div className="text-right min-w-[65px] shrink-0">
                          <span className="text-sm sm:text-base font-mono font-black text-emerald-400">
                            {itemCost.toFixed(2)} {currency}
                          </span>
                        </div>

                        {/* Trash button */}
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(item.id)}
                          className="w-8 h-8 rounded-xl bg-stone-900/80 hover:bg-rose-500/20 border border-stone-750 hover:border-rose-500/40 text-stone-400 hover:text-rose-400 flex items-center justify-center cursor-pointer transition shrink-0"
                          title={isRo ? 'Șterge din listă' : 'Delete item'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 2: SMART BUDGET FITTER */}
      {/* ========================================================================= */}
      {activeSubTab === 'budgetFitter' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-gradient-to-br from-stone-900 via-stone-850 to-stone-900 p-6 sm:p-7 rounded-3xl border border-amber-500/30 shadow-2xl space-y-4">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-amber-400">
              <Coins className="w-4 h-4" />
              <span>{isRo ? 'Optimizare pe Banii Disponibili' : 'Budget-Fit Engine'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {isRo ? 'Câți bani ai disponibili pentru cumpărături?' : 'How much grocery cash do you have available?'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
              {isRo
                ? 'Introdu suma exactă de bani. Algoritmul generează un coș echilibrat de mâncare adaptat bucătăriilor voastre preferate care se încadrează strict sub bugetul tău!'
                : 'Enter your available budget. The engine generates an optimal basket strictly below your budget!'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              <div>
                <label className="text-xs font-bold text-stone-400 block mb-1">
                  {isRo ? 'Bugetul Tău (' + currency + ')' : 'Your Budget (' + currency + ')'}
                </label>
                <input
                  type="number"
                  step="5"
                  min="20"
                  value={targetBudgetInput}
                  onChange={(e) => setTargetBudgetInput(parseFloat(e.target.value) || 0)}
                  className="w-full bg-stone-950 border border-amber-500/50 rounded-2xl px-4 py-2.5 text-lg font-black text-amber-400 font-mono focus:outline-none focus:border-amber-400 shadow-inner"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-400 block mb-1">
                  {isRo ? 'Preselectează Rapid' : 'Quick Presets'}
                </label>
                <div className="flex gap-1.5 flex-wrap">
                  {[75, 100, 150, 200, 300].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setTargetBudgetInput(amt)}
                      className={
                        'px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition ' +
                        (targetBudgetInput === amt ? 'bg-amber-500 text-stone-950 font-black' : 'bg-stone-800 text-stone-300 hover:bg-stone-750')
                      }
                    >
                      {amt} {currency}
                    </button>
                  ))}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-stone-400 block mb-1">
                  {isRo ? 'Folosește Soldul Conturilor Curente' : 'Use Current Account Balances'}
                </label>
                <div className="flex gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setTargetBudgetInput(Math.min(300, Math.floor(wifeBal)))}
                    className="px-3.5 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold hover:bg-emerald-500/25 cursor-pointer"
                  >
                    Salariu {wifeShort}: {wifeBal.toFixed(0)} {currency}
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetBudgetInput(Math.min(300, Math.floor(husbandBal)))}
                    className="px-3.5 py-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold hover:bg-amber-500/25 cursor-pointer"
                  >
                    Buffer {husbandShort}: {husbandBal.toFixed(0)} {currency}
                  </button>
                </div>
              </div>
            </div>

            {/* Cultural Diversity Focus Selector */}
            <div className="pt-3 border-t border-stone-800">
              <label className="text-xs font-bold text-stone-300 block mb-2">
                {isRo ? 'Preferință Bucătărie Meniu:' : 'Cuisine Preference:'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                {[
                  { id: 'MIXED', label: 'Mixt', flag: '🌍' },
                  { id: 'SPANISH', label: 'Spaniol', flag: '🇪🇸' },
                  { id: 'ITALIAN', label: 'Italian', flag: '🇮🇹' },
                  { id: 'AMERICAN', label: 'American', flag: '🇺🇸' },
                  { id: 'GERMAN', label: 'German', flag: '🇩🇪' },
                  { id: 'MOROCCAN', label: 'Marocan', flag: '🇲🇦' },
                  { id: 'ROMANIAN', label: 'Românesc', flag: '🇷🇴' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setBudgetDiversityFocus(item.id as any)}
                    className={
                      'p-2.5 rounded-2xl border text-center transition cursor-pointer ' +
                      (budgetDiversityFocus === item.id
                        ? 'bg-gradient-to-r from-amber-500/20 to-emerald-500/20 border-emerald-500 text-white ring-1 ring-emerald-500/50 shadow-md font-bold'
                        : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200')
                    }
                  >
                    <div className="text-base">{item.flag}</div>
                    <div className="text-[11px] mt-0.5 truncate">{item.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Generated Budget Items Table */}
          <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-4">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                  {isRo ? 'Coș Generat Automat pentru ' + budgetFitterPlan.budget + ' ' + currency : 'Auto-Generated Basket for ' + budgetFitterPlan.budget + ' ' + currency}
                </span>
                <div className="flex items-center gap-2.5 mt-1">
                  <span className="text-xl font-bold text-white">
                    {budgetFitterPlan.items.length} {isRo ? 'Alimente Esențiale Selectate' : 'Essential Items Selected'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-stone-950 p-3 rounded-2xl border border-stone-800">
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider block">
                    {isRo ? 'Cost Total Coș' : 'Total Basket Cost'}
                  </span>
                  <span className="text-lg font-black text-emerald-400 font-mono">
                    {budgetFitterPlan.totalCost.toFixed(2)} {currency}
                  </span>
                </div>
                <div className="w-px h-8 bg-stone-800" />
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider block">
                    {isRo ? 'Rest Rămas' : 'Spare Change Left'}
                  </span>
                  <span className="text-lg font-black text-cyan-400 font-mono">
                    +{budgetFitterPlan.remainingCash.toFixed(2)} {currency}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {budgetFitterPlan.items.map((bItem, idx) => {
                const storeMeta = SUPERMARKETS.find((s) => s.id === bItem.bestStore);
                return (
                  <div
                    key={idx}
                    className="p-3 sm:p-3.5 rounded-2xl bg-stone-850 border border-stone-750 flex items-center justify-between gap-3 text-xs overflow-hidden"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <span className="w-6 h-6 rounded-full bg-stone-800 text-stone-300 font-bold flex items-center justify-center text-[10px] shrink-0">
                        #{idx + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <span className="font-bold text-white block text-sm truncate">{bItem.catalogItem.name}</span>
                        {bItem.catalogItem.culturalTag && (
                          <span className="text-[11px] text-amber-400 font-bold truncate block">{bItem.catalogItem.culturalTag}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      {storeMeta && (
                        <span className={'px-2.5 py-1 rounded-xl text-xs font-bold border ' + storeMeta.badgeBg}>
                          {storeMeta.name}
                        </span>
                      )}
                      <span className="font-mono font-black text-emerald-400 min-w-[65px] text-right text-sm">
                        {bItem.unitPrice.toFixed(2)} {currency}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-stone-800 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => handleApplyBudgetPlanToList(true)}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-stone-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition cursor-pointer flex items-center justify-center gap-2 active:scale-98"
              >
                <Check className="w-4 h-4" />
                <span>
                  {isRo
                    ? 'Înlocuiește Lista Mea cu Acest Coș (' + budgetFitterPlan.totalCost.toFixed(2) + ' ' + currency + ')'
                    : 'Replace My List with this Basket (' + budgetFitterPlan.totalCost.toFixed(2) + ' ' + currency + ')'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleApplyBudgetPlanToList(false)}
                className="py-3 px-5 rounded-2xl bg-stone-800 hover:bg-stone-750 text-white font-bold text-xs transition cursor-pointer"
              >
                {isRo ? 'Adaugă la Lista Existentă' : 'Append to Current List'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 3: CULTURAL QUICK BUNDLES (6 CUISINES) */}
      {/* ========================================================================= */}
      {activeSubTab === 'bundles' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="bg-stone-900 p-5 sm:p-6 rounded-3xl border border-stone-800">
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400" />
              <span>{isRo ? 'Pachete & Meniuri Culturale (6 Bucătării Internaționale)' : 'Cultural Meal Bundles (6 International Cuisines)'}</span>
            </h3>
            <p className="text-xs sm:text-sm text-stone-400 mt-1">
              {isRo
                ? 'Adaugă un set complet de ingrediente pentru Paella Spaniolă, Carbonara Italiană, Smash Burger American, Bratwurst German, Tajine Marocan sau Mămăliguță Românească cu un singur click!'
                : 'Add a full set of authentic Spanish, Italian, American, German, Moroccan or Romanian staple ingredients with a single tap.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {QUICK_BUNDLES.map((bundle) => (
              <div
                key={bundle.id}
                className="p-5 sm:p-6 rounded-3xl bg-stone-900 border border-stone-800 hover:border-emerald-500/40 shadow-xl flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{bundle.icon}</span>
                    <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold">
                      {isRo ? bundle.badgeRo : bundle.cuisine}
                    </span>
                  </div>

                  <h4 className="font-bold text-white text-lg mt-2.5">{isRo ? bundle.titleRo : bundle.titleEn}</h4>
                  <p className="text-xs sm:text-sm text-stone-300 mt-1.5 leading-relaxed">{isRo ? bundle.descriptionRo : bundle.descriptionEn}</p>

                  <div className="mt-4 pt-3 border-t border-stone-800">
                    <span className="text-xs font-bold text-stone-400 block mb-2">
                      {isRo ? 'Conține ' + bundle.items.length + ' produse esențiale:' : 'Contains ' + bundle.items.length + ' essential items:'}
                    </span>
                    <ul className="space-y-1.5 text-xs text-stone-300">
                      {bundle.items.map((bItem) => {
                        const cat = catalogMap.get(bItem.catalogId);
                        return (
                          <li key={bItem.catalogId} className="flex items-center justify-between">
                            <span className="truncate flex-1">• {cat?.name || bItem.catalogId}</span>
                            <span className="text-stone-400 font-mono font-bold ml-2">x{bItem.quantity}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>

                <button
                  onClick={() => handleApplyBundle(bundle)}
                  className="mt-6 w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-stone-950 text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition cursor-pointer active:scale-98"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isRo ? 'Adaugă Acest Pachet în Listă' : 'Add Bundle to Shopping List'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 4: 6-STORE PRICE MATRIX */}
      {/* ========================================================================= */}
      {activeSubTab === 'matrix' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="bg-stone-900 p-4 rounded-3xl border border-stone-800 space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder={isRo ? 'Caută în catalog (chipsuri, ciocolată, lenor, ariel, borsec, cafea, paella, burger...)' : 'Search catalog (chips, chocolate, lenor, ariel, water, coffee, paella...)'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500"
              />

              {/* Category Filter Pills */}
              <div className="flex gap-1.5 flex-wrap">
                {(['ALL', 'DAIRY', 'MEAT_FISH', 'PANTRY', 'SNACKS', 'BEVERAGES', 'CLEANING'] as (GroceryCategory | 'ALL')[]).map((cat) => {
                  const cfg = cat === 'ALL' ? { labelRo: 'Toate', icon: '🌍' } : GROCERY_CATEGORIES_CONFIG[cat];
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategoryFilter(cat)}
                      className={
                        'px-2.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition flex items-center gap-1 ' +
                        (categoryFilter === cat ? 'bg-emerald-500 text-stone-950 font-black' : 'bg-stone-800 text-stone-300')
                      }
                    >
                      <span>{cfg.icon}</span>
                      <span className="hidden sm:inline">{cfg.labelRo}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groceryCatalog
              .filter((item) => {
                if (cuisineFilter !== 'ALL' && item.cuisine !== cuisineFilter) return false;
                if (categoryFilter !== 'ALL' && item.category !== categoryFilter) return false;
                if (searchQuery.trim() && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
                return true;
              })
              .map((catItem) => {
                const storeEntries = Object.entries(catItem.stores || {}) as [SupermarketId, { price: number; qualityScore: number; brandName?: string }][];
                const lowestStore = storeEntries.length > 0 ? storeEntries.sort((a, b) => a[1].price - b[1].price)[0] : null;
                const b = catItem.cuisine ? getCuisineBadge(catItem.cuisine) : null;
                const catCfg = GROCERY_CATEGORIES_CONFIG[catItem.category];

                return (
                  <div
                    key={catItem.id}
                    className="p-5 rounded-3xl bg-stone-900 border border-stone-800 shadow-lg flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1">
                          <span>{catCfg?.icon}</span>
                          <span>{catCfg?.labelRo || catItem.category}</span>
                        </span>
                        {b && (
                          <span className={'text-[10px] font-bold px-2 py-0.5 rounded-md border ' + b.color}>
                            {b.flag} {b.label}
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-white text-base leading-snug">{catItem.name}</h4>

                      <div className="mt-3.5 space-y-1.5 text-xs">
                        {SUPERMARKETS.map((st) => {
                          const pInfo = catItem.stores[st.id];
                          const isLowest = lowestStore && lowestStore[0] === st.id;

                          return (
                            <div
                              key={st.id}
                              className={
                                'flex items-center justify-between p-2 rounded-xl ' +
                                (isLowest
                                  ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold'
                                  : 'bg-stone-950/60 text-stone-300')
                              }
                            >
                              <div className="flex items-center gap-2">
                                <span>{st.icon}</span>
                                <span>{st.name}</span>
                              </div>
                              <div>
                                {pInfo ? (
                                  <span className="font-mono">{pInfo.price.toFixed(2)} {currency}</span>
                                ) : (
                                  <span className="text-stone-600">--</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
                      <span className="text-xs text-stone-400">
                        {isRo ? 'Minim: ' : 'Lowest: '}
                        <strong className="text-emerald-400 font-mono">
                          {lowestStore ? lowestStore[1].price.toFixed(2) + ' ' + currency : '--'}
                        </strong>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAddCatalogItemToList(catItem)}
                        className="px-3.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-750 text-emerald-400 text-xs font-bold flex items-center gap-1 cursor-pointer transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{isRo ? 'În Listă' : 'Add'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* FLOATING IN-STORE SHOPPING MODE BOTTOM BAR */}
      {inStoreMode && (
        <div className="fixed bottom-4 left-4 right-4 max-w-lg mx-auto z-40 bg-stone-900/95 backdrop-blur-md border border-emerald-500/50 p-4 rounded-3xl shadow-2xl flex items-center justify-between animate-in slide-in-from-bottom">
          <div>
            <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider block">
              {isRo ? 'În Magazin • Progres: ' + checkedCount + ' / ' + shoppingList.length : 'In-Store Mode • ' + checkedCount + ' / ' + shoppingList.length}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-white font-mono">
                {inStoreRunningTotal.toFixed(2)} {currency}
              </span>
              <span className="text-[11px] text-stone-400">{isRo ? 'total bifat în coș' : 'total in cart'}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setLogStoreName('Lidl & Kaufland');
              setLogAmount(inStoreRunningTotal);
              setIsLogExpenseOpen(true);
            }}
            className="px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-xs shadow-lg shadow-emerald-500/25 cursor-pointer transition active:scale-98"
          >
            {isRo ? 'Încheie & Salvează Bon' : 'Finish & Log Receipt'}
          </button>
        </div>
      )}

      {/* MODAL: GEMINI API KEY CONFIG */}
      {showApiKeyModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-stone-900 border border-stone-750 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-400" />
                <span>{isRo ? 'Configurare Cheie Gemini AI' : 'Gemini AI Key Setup'}</span>
              </h3>
              <button onClick={() => setShowApiKeyModal(false)} className="text-stone-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed">
              {isRo
                ? 'Opțional: Dacă deții o cheie gratuită Google Gemini API, introdu-o aici pentru ca AI-ul să poată analiza transcrieri video și rețete complexe în orice limbă (Darija, Franceză, Arabă, Engleză).'
                : 'Optional: Enter your free Google Gemini API key to enable multilingual AI extraction of video reels.'}
            </p>

            <div>
              <label className="text-xs font-bold text-stone-400 block mb-1">
                Gemini API Key (Google AI Studio)
              </label>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={geminiApiKeyInput}
                onChange={(e) => setGeminiApiKeyInput(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  localStorage.setItem('housevault_gemini_key', geminiApiKeyInput.trim());
                  setShowApiKeyModal(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md cursor-pointer transition"
              >
                {isRo ? 'Salvează Cheia' : 'Save Key'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: ADD MANUAL ITEM */}
      {isAddItemOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-700 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="text-lg font-bold text-white">
                {isRo ? 'Adaugă Produs în Listă' : 'Add Item to Shopping List'}
              </h3>
              <button onClick={() => setIsAddItemOpen(false)} className="text-stone-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNewManualItem} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-stone-400 block mb-1">
                  {isRo ? 'Nume Produs' : 'Product Name'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={isRo ? 'ex: Chipsuri Lays, Ciocolată Milka, Detergent Ariel, Suc portocale' : 'e.g., Chips, Chocolate, Detergent, Juice'}
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-400 block mb-1">
                    {isRo ? 'Cantitate' : 'Quantity'}
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    value={newItemQty}
                    onChange={(e) => setNewItemQty(parseFloat(e.target.value) || 1)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-400 block mb-1">
                    {isRo ? 'Unitate' : 'Unit'}
                  </label>
                  <select
                    value={newItemUnit}
                    onChange={(e) => setNewItemUnit(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="buc">{isRo ? 'buc (bucăți)' : 'pcs (pieces)'}</option>
                    <option value="pachet">{isRo ? 'pachet / bax' : 'pack'}</option>
                    <option value="kg">{isRo ? 'kg (kilograme)' : 'kg'}</option>
                    <option value="L">{isRo ? 'L (litri)' : 'L'}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-400 block mb-1">
                  {isRo ? 'Categorie' : 'Category'}
                </label>
                <select
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value as GroceryCategory)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="DAIRY">{isRo ? 'Lactate & Ouă' : 'Dairy & Eggs'}</option>
                  <option value="MEAT_FISH">{isRo ? 'Carne & Pește' : 'Meat & Fish'}</option>
                  <option value="FRUITS_VEGGIES">{isRo ? 'Fructe & Legume' : 'Produce & Veggies'}</option>
                  <option value="BAKERY">{isRo ? 'Pâine & Brutărie' : 'Bakery & Bread'}</option>
                  <option value="PANTRY">{isRo ? 'Cămară & Uleiuri' : 'Pantry & Oils'}</option>
                  <option value="SNACKS">{isRo ? 'Snacks & Dulciuri' : 'Snacks & Sweets'}</option>
                  <option value="BEVERAGES">{isRo ? 'Băuturi & Sucuri' : 'Beverages & Drinks'}</option>
                  <option value="CLEANING">{isRo ? 'Curățenie & Menaj' : 'Cleaning & Home'}</option>
                </select>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddItemOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-stone-800 text-stone-300 font-semibold text-xs hover:bg-stone-750 cursor-pointer"
                >
                  {isRo ? 'Anulează' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs shadow-md shadow-emerald-500/20 cursor-pointer"
                >
                  {isRo ? 'Adaugă în Listă' : 'Add to List'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: LOG GROCERY EXPENSE TO HOUSEHOLD BUDGET */}
      {isLogExpenseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/85 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-stone-900 border border-stone-750 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-stone-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Wallet className="w-5 h-5 text-emerald-400" />
                <span>{isRo ? 'Înregistrează Bonul în Bugetul Familiei' : 'Log Receipt into Household Budget'}</span>
              </h3>
              <button
                onClick={() => setIsLogExpenseOpen(false)}
                className="text-stone-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {logSuccessMessage ? (
              <div className="p-6 text-center text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/30 rounded-2xl animate-in zoom-in">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-emerald-400" />
                <span>{logSuccessMessage}</span>
              </div>
            ) : (
              <form onSubmit={handleConfirmLogExpense} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-stone-400 block mb-1">
                    {isRo ? 'Descriere / Magazine' : 'Store / Description'}
                  </label>
                  <input
                    type="text"
                    required
                    value={logStoreName}
                    onChange={(e) => setLogStoreName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-stone-950 border border-stone-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-400 block mb-1">
                    {isRo ? 'Suma Reală Cheltuită (' + currency + ')' : 'Total Amount (' + currency + ')'}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    required
                    value={logAmount}
                    onChange={(e) => setLogAmount(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2 text-sm bg-stone-950 border border-stone-800 rounded-xl text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-400 block mb-1">
                    {isRo ? 'Sursa Plată / Responsabil' : 'Payment Account'}
                  </label>
                  <select
                    value={logPayer}
                    onChange={(e) => setLogPayer(e.target.value as ExpensePayer)}
                    className="w-full px-3.5 py-2 text-xs bg-stone-950 border border-stone-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="WIFE_SALARY">
                      Salariu {wifeShort} ({isRo ? 'Disponibil' : 'Available'}: {wifeBal.toFixed(2)} {currency})
                    </option>
                    <option value="FREELANCE_BUFFER">
                      Buffer Freelance {husbandShort} ({isRo ? 'Disponibil' : 'Available'}: {husbandBal.toFixed(2)} {currency})
                    </option>
                    <option value="SHARED_POOL">
                      {isRo ? 'Fond Comun' : 'Shared Pool'} ({isRo ? 'Disponibil' : 'Available'}: {sharedBal.toFixed(2)} {currency})
                    </option>
                  </select>
                </div>

                {/* Live Cash Reduction Preview */}
                {(() => {
                  const currentBal =
                    logPayer === 'WIFE_SALARY'
                      ? wifeBal
                      : logPayer === 'FREELANCE_BUFFER'
                      ? husbandBal
                      : sharedBal;
                  const isInsufficient = currentBal <= 0 || currentBal < logAmount;
                  const remaining = currentBal - logAmount;

                  return (
                    <>
                      <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 text-xs space-y-1.5">
                        <div className="flex justify-between text-stone-400">
                          <span>{isRo ? 'Sold disponibil în cont:' : 'Current balance in account:'}</span>
                          <span className="font-mono font-bold text-white">{currentBal.toFixed(2)} {currency}</span>
                        </div>
                        <div className="flex justify-between text-rose-400">
                          <span>{isRo ? 'Valoare cumpărături:' : 'Expense amount:'}</span>
                          <span className="font-mono font-bold">-{logAmount.toFixed(2)} {currency}</span>
                        </div>
                        <div className="h-px bg-stone-800 my-1" />
                        <div className="flex justify-between font-bold">
                          <span className="text-stone-300">{isRo ? 'Sold rămas:' : 'Remaining balance:'}</span>
                          <span className={'font-mono ' + (remaining < 0 ? 'text-rose-400 font-black' : 'text-emerald-400')}>
                            {remaining.toFixed(2)} {currency}
                          </span>
                        </div>
                      </div>

                      {isInsufficient && (
                        <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs animate-pulse">
                          <strong className="block font-bold text-rose-300">⚠️ {isRo ? 'FONDURI INSUFICIENTE' : 'INSUFFICIENT FUNDS'}</strong>
                          <span>
                            {isRo
                              ? 'Contul selectat are soldul ' + currentBal.toFixed(2) + ' ' + currency + '. Nu poți introduce cumpărăturile fără fonduri suficiente!'
                              : 'Selected account has ' + currentBal.toFixed(2) + ' ' + currency + '. You cannot log this expense without sufficient funds!'}
                          </span>
                        </div>
                      )}
                    </>
                  );
                })()}

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsLogExpenseOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-400 hover:text-white cursor-pointer"
                  >
                    {isRo ? 'Anulează' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={
                      (logPayer === 'WIFE_SALARY'
                        ? wifeBal
                        : logPayer === 'FREELANCE_BUFFER'
                        ? husbandBal
                        : sharedBal) < logAmount
                    }
                    className={
                      'px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg transition cursor-pointer ' +
                      ((logPayer === 'WIFE_SALARY'
                        ? wifeBal
                        : logPayer === 'FREELANCE_BUFFER'
                        ? husbandBal
                        : sharedBal) < logAmount
                        ? 'bg-stone-800 text-stone-500 border border-stone-700 cursor-not-allowed opacity-60'
                        : 'bg-emerald-500 hover:bg-emerald-400 text-stone-950 shadow-emerald-500/20 active:scale-98')
                    }
                  >
                    {(logPayer === 'WIFE_SALARY'
                      ? wifeBal
                      : logPayer === 'FREELANCE_BUFFER'
                      ? husbandBal
                      : sharedBal) < logAmount
                      ? isRo ? 'Sold Insuficient — Blocat' : '0 Balance — Blocked'
                      : isRo ? 'Salvează & Scade din Buget' : 'Save & Deduct from Budget'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
