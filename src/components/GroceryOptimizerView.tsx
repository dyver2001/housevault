import React, { useState, useMemo } from 'react';
import { ShoppingCart, Sparkles, Plus, Trash2, CheckCircle2, Circle, Store, Camera, Check, Filter, Layers, Receipt, Edit3, X, Star, ShoppingBag, Zap, Flame, Wallet, Coins, ArrowRight, TrendingDown, Globe2, Compass } from 'lucide-react';
import { SupermarketId, GroceryCatalogItem, ShoppingListItem, GroceryCategory, GroceryQualityPreference, GroceryCuisineType, HouseholdProfile, HouseholdExpense, ExpensePayer, CashPocketsBalance } from '../types';
import { SUPERMARKETS, GROCERY_CATEGORIES_CONFIG, QUICK_BUNDLES, SupermarketMetadata } from '../data/groceryData';

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
  const [currentLang, setCurrentLang] = useState<'ro' | 'en'>((profile.language as 'ro' | 'en') || 'ro');
  const isRo = currentLang === 'ro';

  const [activeSubTab, setActiveSubTab] = useState<'list' | 'budgetFitter' | 'bundles' | 'matrix'>('list');
  const [qualityPref, setQualityPref] = useState<GroceryQualityPreference>('BEST_VALUE');
  const [cuisineFilter, setCuisineFilter] = useState<GroceryCuisineType | 'ALL'>('ALL');
  const [inStoreMode, setInStoreMode] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [targetBudgetInput, setTargetBudgetInput] = useState<number>(150);
  const [budgetDiversityFocus, setBudgetDiversityFocus] = useState<'MIXED' | 'MOROCCAN' | 'ROMANIAN' | 'BUDGET'>('MIXED');

  const [isAddItemOpen, setIsAddItemOpen] = useState<boolean>(false);
  const [isLogExpenseOpen, setIsLogExpenseOpen] = useState<boolean>(false);

  const [newItemName, setNewItemName] = useState<string>('');
  const [newItemCategory, setNewItemCategory] = useState<GroceryCategory>('DAIRY');
  const [newItemQty, setNewItemQty] = useState<number>(1);
  const [newItemUnit, setNewItemUnit] = useState<string>('buc');

  const [logStoreName, setLogStoreName] = useState<string>('Lidl & Kaufland');
  const [logAmount, setLogAmount] = useState<number>(0);
  const [logPayer, setLogPayer] = useState<ExpensePayer>('WIFE_SALARY');
  const [logSuccessMessage, setLogSuccessMessage] = useState<string | null>(null);

  const wifeBal = Number(cashBalances?.wifeSalaryBalance) || 0;
  const husbandBal = Number(cashBalances?.freelanceBufferBalance) || 0;
  const sharedBal = Number(cashBalances?.sharedPoolBalance) || 0;
  const wifeShort = (profile.wifeName || 'Cati').split(' ')[0];
  const husbandShort = (profile.husbandName || 'Haytham').split(' ')[0];

  const catalogMap = useMemo(() => {
    const map = new Map<string, GroceryCatalogItem>();
    groceryCatalog.forEach((item) => map.set(item.id, item));
    return map;
  }, [groceryCatalog]);

  const getItemStoreRecommendation = (item: ShoppingListItem, pref: GroceryQualityPreference) => {
    let catItem = item.catalogItemId ? catalogMap.get(item.catalogItemId) : groceryCatalog.find((c) => c.name.toLowerCase().includes(item.name.toLowerCase()));
    if (!catItem || !catItem.stores) return null;
    const availableStores = Object.entries(catItem.stores) as [SupermarketId, { price: number; qualityScore: number; brandName?: string; promo?: boolean }][];
    if (availableStores.length === 0) return null;
    if (item.preferredStoreOverride && catItem.stores[item.preferredStoreOverride]) {
      return { storeId: item.preferredStoreOverride, ...catItem.stores[item.preferredStoreOverride]! };
    }
    if (pref === 'CHEAPEST') {
      const sorted = [...availableStores].sort((a, b) => a[1].price - b[1].price);
      return { storeId: sorted[0][0], ...sorted[0][1] };
    } else if (pref === 'PREMIUM') {
      const sorted = [...availableStores].sort((a, b) => (b[1].qualityScore !== a[1].qualityScore ? b[1].qualityScore - a[1].qualityScore : a[1].price - b[1].price));
      return { storeId: sorted[0][0], ...sorted[0][1] };
    } else {
      const candidates = availableStores.filter(([, data]) => data.qualityScore >= 4);
      if (candidates.length > 0) {
        const sorted = candidates.sort((a, b) => a[1].price - b[1].price);
        return { storeId: sorted[0][0], ...sorted[0][1] };
      }
      const sorted = [...availableStores].sort((a, b) => a[1].price - b[1].price);
      return { storeId: sorted[0][0], ...sorted[0][1] };
    }
  };

  const singleStoreLeaderboard = useMemo(() => {
    return SUPERMARKETS.map((store) => {
      let total = 0;
      let itemsAvailable = 0;
      shoppingList.forEach((item) => {
        let catItem = item.catalogItemId ? catalogMap.get(item.catalogItemId) : groceryCatalog.find((c) => c.name.toLowerCase().includes(item.name.toLowerCase()));
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

  const splitTripOptimization = useMemo(() => {
    if (shoppingList.length === 0) {
      return { store1: SUPERMARKETS[0], store2: SUPERMARKETS[1], store1Items: [], store2Items: [], totalCost: 0, savingsVsCheapestSingle: 0, savingsPercent: 0 };
    }
    const store1 = SUPERMARKETS.find((s) => s.id === 'LIDL') || SUPERMARKETS[0];
    const store2 = SUPERMARKETS.find((s) => s.id === 'KAUFLAND') || SUPERMARKETS[1];
    const store1Items: any[] = [];
    const store2Items: any[] = [];
    let splitTotal = 0;
    shoppingList.forEach((item) => {
      let catItem = item.catalogItemId ? catalogMap.get(item.catalogItemId) : groceryCatalog.find((c) => c.name.toLowerCase().includes(item.name.toLowerCase()));
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

  const budgetFitterPlan = useMemo(() => {
    const budget = Number(targetBudgetInput) || 150;
    let candidates = groceryCatalog.filter((item) => {
      if (budgetDiversityFocus === 'MOROCCAN') return item.cuisine === 'MOROCCAN' || item.cuisine === 'UNIVERSAL';
      if (budgetDiversityFocus === 'ROMANIAN') return item.cuisine === 'ROMANIAN' || item.cuisine === 'UNIVERSAL';
      if (budgetDiversityFocus === 'BUDGET') return item.category === 'DAIRY' || item.category === 'BAKERY' || item.category === 'PANTRY' || item.category === 'MEAT_FISH';
      return true;
    });
    const priorityWeights: Record<string, number> = {
      'g-piept-pui': 100, 'g-carne-vita-tagine': 95, 'g-oua-30': 90, 'g-couscous-500g': 85, 'g-malai-superior': 85, 'g-telemea-vaca-saramura': 80, 'g-naut-conserva': 75, 'g-smantana-20': 70, 'g-rosii-cherry': 65, 'g-ulei-masline-extra': 60, 'g-lapte-35': 55, 'g-ceai-gunpowder-menta': 50, 'g-bors-proaspat': 45, 'g-paine-toast-secara': 40, 'g-curmale-medjool': 35, 'g-masline-marinate': 30, 'g-muraturi-asortate': 25
    };
    candidates.sort((a, b) => (priorityWeights[b.id] || 10) - (priorityWeights[a.id] || 10));
    const selectedItems: any[] = [];
    let currentTotal = 0;
    for (const item of candidates) {
      const storeEntries = Object.entries(item.stores || {}) as [SupermarketId, { price: number }][];
      if (storeEntries.length === 0) continue;
      const best = storeEntries.sort((a, b) => a[1].price - b[1].price)[0];
      const price = best[1].price;
      if (currentTotal + price <= budget) {
        selectedItems.push({ catalogItem: item, bestStore: best[0], unitPrice: price, qty: 1, totalItemCost: price });
        currentTotal += price;
      }
    }
    const remainingCash = Math.max(0, budget - currentTotal);
    const moroccanCount = selectedItems.filter((i) => i.catalogItem.cuisine === 'MOROCCAN').length;
    const romanianCount = selectedItems.filter((i) => i.catalogItem.cuisine === 'ROMANIAN').length;
    return {
      items: selectedItems,
      totalCost: Math.round(currentTotal * 100) / 100,
      remainingCash: Math.round(remainingCash * 100) / 100,
      budget,
      moroccanCount,
      romanianCount
    };
  }, [groceryCatalog, targetBudgetInput, budgetDiversityFocus]);

  const handleToggleItemCheck = (id: string) => {
    onUpdateShoppingList(shoppingList.map((it) => (it.id === id ? { ...it, isChecked: !it.isChecked } : it)));
  };
  const handleUpdateItemQty = (id: string, newQty: number) => {
    if (newQty <= 0) { handleDeleteItem(id); return; }
    onUpdateShoppingList(shoppingList.map((it) => (it.id === id ? { ...it, quantity: newQty } : it)));
  };
  const handleDeleteItem = (id: string) => {
    onUpdateShoppingList(shoppingList.filter((it) => it.id !== id));
  };
  const handleClearCheckedItems = () => {
    onUpdateShoppingList(shoppingList.filter((it) => !it.isChecked));
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
    if (replace) { onUpdateShoppingList(newItems); } else { onUpdateShoppingList([...shoppingList, ...newItems]); }
    setActiveSubTab('list');
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
      title: (isRo ? 'Cumparaturi ' : 'Groceries ') + logStoreName,
      amount: logAmount,
      category: 'GROCERIES',
      isFixed: false,
      assignedPayer: logPayer
    });
    setLogSuccessMessage(isRo ? 'Bonul de ' + logAmount.toFixed(2) + ' ' + currency + ' a fost salvat si scazut din buget!' : 'Receipt for ' + logAmount.toFixed(2) + ' ' + currency + ' saved and deducted from budget!');
    setTimeout(() => { setLogSuccessMessage(null); setIsLogExpenseOpen(false); }, 1500);
  };

  const checkedCount = shoppingList.filter((it) => it.isChecked).length;
  const inStoreRunningTotal = useMemo(() => {
    return shoppingList.filter((it) => it.isChecked).reduce((sum, it) => {
      const rec = getItemStoreRecommendation(it, qualityPref);
      return sum + (rec?.price || 10) * it.quantity;
    }, 0);
  }, [shoppingList, qualityPref, catalogMap]);

  return (
    <div className='space-y-6' style={{ fontFamily: 'Helvetica, Arial, -apple-system, sans-serif' }}>
      {/* Header with EN/RO Toggle */}
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-stone-800 pb-5'>
        <div>
          <div className='flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-emerald-400'>
            <Sparkles className='w-4 h-4 text-emerald-400' />
            <span>{isRo ? 'Optimizator Supermarket & Meniu Mixt Maroc-Romania' : 'Smart Supermarket & Cultural Grocery Optimizer'}</span>
          </div>
          <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white mt-1.5 flex items-center gap-2.5'>
            <ShoppingCart className='w-7 h-7 text-emerald-400 shrink-0' />
            <span>{isRo ? 'Cumparaturi Inteligente & Preturi Reale' : 'Smart Groceries & Real-Store Prices'}</span>
          </h1>
          <p className='text-xs sm:text-sm text-stone-300 mt-1 max-w-2xl leading-relaxed'>
            {isRo ? 'Compara preturile reale intre Lidl, Kaufland, Carrefour, Mega Image, Penny si Auchan. Include selectie diversificata pentru Haytham (Maroc) si Cati (Romania).' : 'Compare live store prices across Lidl, Kaufland, Carrefour, Mega Image, Penny & Auchan. Tailored for Haytham (Morocco) & Cati (Romania).'}
          </p>
        </div>
        <div className='flex flex-wrap items-center gap-2'>
          <div className='flex items-center bg-stone-900 border border-stone-800 rounded-xl p-0.5'>
            <button type='button' onClick={() => setCurrentLang('ro')} className={'px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ' + (isRo ? 'bg-emerald-500 text-stone-950 shadow-sm' : 'text-stone-400 hover:text-white')}>RO</button>
            <button type='button' onClick={() => setCurrentLang('en')} className={'px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ' + (!isRo ? 'bg-emerald-500 text-stone-950 shadow-sm' : 'text-stone-400 hover:text-white')}>EN</button>
          </div>
          {onOpenReceiptScanner && (
            <button onClick={onOpenReceiptScanner} className='px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-750 text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition'>
              <Camera className='w-4 h-4 text-cyan-400' /><span>{isRo ? 'Scaneaza Bon / Galerie' : 'Scan Receipt / Gallery'}</span>
            </button>
          )}
          <button onClick={() => setInStoreMode(!inStoreMode)} className={'px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-md ' + (inStoreMode ? 'bg-emerald-500 text-stone-950 shadow-emerald-500/20' : 'bg-stone-800 text-stone-300 border border-stone-700 hover:bg-stone-750')}>
            <ShoppingBag className='w-4 h-4' /><span>{inStoreMode ? (isRo ? 'Mod Magazin Activ' : 'In-Store Mode On') : (isRo ? 'Mod Magazin' : 'In-Store Mode')}</span>
          </button>
        </div>
      </div>

      {/* Subtab Navigation Pills */}
      <div className='flex flex-wrap gap-2 border-b border-stone-800 pb-3'>
        <button onClick={() => setActiveSubTab('list')} className={'px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ' + (activeSubTab === 'list' ? 'bg-emerald-500 text-stone-950 shadow-md shadow-emerald-500/20' : 'bg-stone-900 text-stone-400 hover:text-white border border-stone-800')}><ShoppingCart className='w-4 h-4' /><span>{isRo ? 'Lista Mea & Economii (' + shoppingList.length + ')' : 'My List & Savings (' + shoppingList.length + ')'}</span></button>
        <button onClick={() => setActiveSubTab('budgetFitter')} className={'px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ' + (activeSubTab === 'budgetFitter' ? 'bg-gradient-to-r from-amber-500 to-emerald-500 text-stone-950 shadow-md font-bold' : 'bg-stone-900 text-amber-400 hover:text-amber-300 border border-amber-500/30')}><Coins className='w-4 h-4' /><span>{isRo ? 'Cos pe Bugetul Meu (Maroc & Romania)' : 'Smart Budget Fitter (Morocco & Romania)'}</span></button>
        <button onClick={() => setActiveSubTab('bundles')} className={'px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ' + (activeSubTab === 'bundles' ? 'bg-emerald-500 text-stone-950 shadow-md' : 'bg-stone-900 text-stone-400 hover:text-white border border-stone-800')}><Flame className='w-4 h-4 text-amber-400' /><span>{isRo ? 'Pachete & Meniuri Culturale' : 'Cultural Meal Bundles'}</span></button>
        <button onClick={() => setActiveSubTab('matrix')} className={'px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ' + (activeSubTab === 'matrix' ? 'bg-emerald-500 text-stone-950 shadow-md' : 'bg-stone-900 text-stone-400 hover:text-white border border-stone-800')}><Layers className='w-4 h-4' /><span>{isRo ? 'Matrice Preturi 6 Magazine' : '6-Store Price Matrix'}</span></button>
      </div>

      {/* SUBTAB 1: SHOPPING LIST */}
      {activeSubTab === 'list' && (
        <div className='space-y-6'>
          <div className='bg-stone-900 p-4 rounded-2xl border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3'>
            <div className='flex items-center gap-2.5'><Compass className='w-5 h-5 text-emerald-400 shrink-0' /><div><h3 className='text-sm font-bold text-white'>{isRo ? 'Strategie Optimizare Pret vs. Calitate' : 'Optimization Strategy: Price vs. Quality'}</h3><p className='text-xs text-stone-400'>{isRo ? 'Alege daca doresti costul minim absolut sau cel mai bun raport calitate/pret' : 'Choose between lowest cost or best quality-to-price ratio'}</p></div></div>
            <div className='flex flex-wrap gap-1.5'>
              <button onClick={() => setQualityPref('CHEAPEST')} className={'px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ' + (qualityPref === 'CHEAPEST' ? 'bg-amber-500 text-stone-950 shadow-sm font-bold' : 'bg-stone-800 text-stone-400 hover:text-white')}>Pret Minim</button>
              <button onClick={() => setQualityPref('BEST_VALUE')} className={'px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ' + (qualityPref === 'BEST_VALUE' ? 'bg-emerald-500 text-stone-950 shadow-sm font-bold' : 'bg-stone-800 text-stone-400 hover:text-white')}>Calitate/Pret Optim</button>
              <button onClick={() => setQualityPref('PREMIUM')} className={'px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ' + (qualityPref === 'PREMIUM' ? 'bg-cyan-500 text-stone-950 shadow-sm font-bold' : 'bg-stone-800 text-stone-400 hover:text-white')}>Bio & Premium</button>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='p-5 rounded-3xl bg-stone-900 border border-stone-800 shadow-xl space-y-3'>
              <div className='flex items-center justify-between'><span className='text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5'><Store className='w-4 h-4' />{isRo ? 'Campion 1 Singur Magazin' : '1-Stop Store Champion'}</span><span className='text-xs text-stone-400'>{isRo ? 'O singura oprire rapida' : 'Quick single stop'}</span></div>
              {singleStoreLeaderboard.length > 0 && (
                <div>
                  <div className='flex items-baseline justify-between'><span className='text-xl font-bold text-white'>{singleStoreLeaderboard[0].store.name}</span><span className='text-2xl font-black text-emerald-400 font-mono'>{singleStoreLeaderboard[0].totalEstimatedCost.toFixed(2)} {currency}</span></div>
                  <p className='text-xs text-stone-300 mt-1 leading-relaxed'>{isRo ? singleStoreLeaderboard[0].store.specialtyRo : singleStoreLeaderboard[0].store.specialtyEn}</p>
                  <div className='mt-3 pt-2 border-t border-stone-800 space-y-1.5'>
                    <div className='text-[10px] text-stone-400 uppercase font-bold tracking-wider'>{isRo ? 'Clasament 6 magazine:' : '6-Store Leaderboard:'}</div>
                    <div className='grid grid-cols-3 sm:grid-cols-6 gap-1.5 text-center'>
                      {singleStoreLeaderboard.map((item, i) => (
                        <div key={item.store.id} className='p-1.5 bg-stone-950 rounded-xl border border-stone-800 text-[10px]'><div className='font-bold text-stone-300 truncate'>#{i + 1} {item.store.name}</div><div className='font-mono text-emerald-400 font-bold'>{item.totalEstimatedCost.toFixed(0)} {currency}</div></div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className='p-5 rounded-3xl bg-gradient-to-br from-emerald-950/40 via-stone-900 to-stone-900 border border-emerald-500/40 shadow-xl space-y-3'>
              <div className='flex items-center justify-between'><span className='text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5'><Zap className='w-4 h-4 text-emerald-400' />{isRo ? 'Split-Cart Saver (2 Magazine)' : 'Split-Cart Saver (2 Stores)'}</span>{splitTripOptimization.savingsVsCheapestSingle > 0 && (<span className='px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold'>{isRo ? 'Economisesti ' + splitTripOptimization.savingsVsCheapestSingle.toFixed(2) + ' ' + currency + ' (' + splitTripOptimization.savingsPercent + '%)' : 'Save ' + splitTripOptimization.savingsVsCheapestSingle.toFixed(2) + ' ' + currency + ' (' + splitTripOptimization.savingsPercent + '%)'}</span>)}</div>
              <div className='flex items-baseline justify-between'><span className='text-lg sm:text-xl font-bold text-white'>{splitTripOptimization.store1.name} + {splitTripOptimization.store2.name}</span><span className='text-2xl font-black text-emerald-400 font-mono'>{splitTripOptimization.totalCost.toFixed(2)} {currency}</span></div>
              <div className='grid grid-cols-2 gap-2 text-xs pt-1'>
                <div className='p-2.5 rounded-2xl bg-stone-950/80 border border-stone-800'><div className='font-bold text-blue-400'>{splitTripOptimization.store1.name} ({splitTripOptimization.store1Items.length} {isRo ? 'articole' : 'items'})</div><div className='text-[10px] text-stone-400 mt-0.5'>{isRo ? 'Lactate, Camara si Paine' : 'Dairy, Pantry & Bread'}</div></div>
                <div className='p-2.5 rounded-2xl bg-stone-950/80 border border-stone-800'><div className='font-bold text-red-400'>{splitTripOptimization.store2.name} ({splitTripOptimization.store2Items.length} {isRo ? 'articole' : 'items'})</div><div className='text-[10px] text-stone-400 mt-0.5'>{isRo ? 'Carne Proaspata, Vita si Legume' : 'Fresh Meat, Beef & Veggies'}</div></div>
              </div>
              <button onClick={() => { setLogStoreName(splitTripOptimization.store1.name + ' & ' + splitTripOptimization.store2.name); setLogAmount(splitTripOptimization.totalCost); setIsLogExpenseOpen(true); }} className='w-full mt-2 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs shadow-md cursor-pointer transition flex items-center justify-center gap-1.5 active:scale-98'><Wallet className='w-3.5 h-3.5' /><span>{isRo ? 'Inregistreaza Cumparaturile in Buget' : 'Log Groceries to Household Budget'}</span></button>
            </div>
          </div>

          {/* ACTIVE SHOPPING LIST TABLE - 100% BOXED & RESPONSIVE */}
          <div className='bg-stone-900 rounded-3xl border border-stone-800 p-4 sm:p-6 space-y-4 shadow-xl overflow-hidden'>
            <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3'>
              <div className='flex items-center gap-2.5'><span className='text-lg font-bold text-white'>{isRo ? 'Articole in Lista (' + shoppingList.length + ')' : 'Shopping List Items (' + shoppingList.length + ')'}</span>{checkedCount > 0 && (<span className='text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold'>{isRo ? checkedCount + ' bifate in magazin' : checkedCount + ' checked in store'}</span>)}</div>
              <div className='flex items-center gap-2'>
                <button onClick={() => setIsAddItemOpen(true)} className='px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs flex items-center gap-1 cursor-pointer transition shadow-md'><Plus className='w-3.5 h-3.5' /><span>{isRo ? 'Adauga Produs' : 'Add Item'}</span></button>
                {checkedCount > 0 && (<button onClick={handleClearCheckedItems} className='px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-300 text-xs font-semibold cursor-pointer transition'>{isRo ? 'Sterge Bifatele' : 'Clear Checked'}</button>)}
              </div>
            </div>

            {shoppingList.length === 0 ? (
              <div className='py-12 text-center text-stone-500 space-y-3'>
                <ShoppingCart className='w-12 h-12 mx-auto text-stone-600' />
                <p className='text-base font-bold text-stone-300'>{isRo ? 'Lista ta de cumparaturi este goala.' : 'Your shopping list is currently empty.'}</p>
                <p className='text-xs text-stone-400 max-w-md mx-auto'>{isRo ? 'Alege un pachet cultural sau foloseste "Cos pe Bugetul Meu" pentru a genera alimentele potrivite banilor tai!' : 'Choose a cultural bundle or use "Smart Budget Fitter" to generate a basket tailored to your budget!'}</p>
                <button onClick={() => setActiveSubTab('budgetFitter')} className='px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 text-stone-950 font-bold text-xs cursor-pointer shadow-md'>{isRo ? 'Genereaza Cos in Bugetul Meu' : 'Generate Basket from My Budget'}</button>
              </div>
            ) : (
              <div className='space-y-3'>
                {shoppingList.map((item) => {
                  const rec = getItemStoreRecommendation(item, qualityPref);
                  const storeMeta = rec ? SUPERMARKETS.find((s) => s.id === rec.storeId) : null;
                  const itemCost = (rec?.price || 0) * item.quantity;
                  const catItem = item.catalogItemId ? catalogMap.get(item.catalogItemId) : null;
                  return (
                    <div key={item.id} className={'w-full p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 overflow-hidden ' + (item.isChecked ? 'bg-stone-950/60 border-stone-800/80 opacity-60' : 'bg-stone-850 border-stone-750 hover:border-stone-650')}>
                      <div className='flex items-start sm:items-center gap-3 min-w-0 flex-1'>
                        <button type='button' onClick={() => handleToggleItemCheck(item.id)} className='cursor-pointer text-stone-400 hover:text-emerald-400 transition mt-0.5 sm:mt-0 shrink-0'>{item.isChecked ? (<CheckCircle2 className='w-5 h-5 text-emerald-400' />) : (<Circle className='w-5 h-5' />)}</button>
                        <div className='min-w-0 flex-1'><div className='flex items-center gap-2 flex-wrap'><span className={'text-sm sm:text-base font-bold truncate ' + (item.isChecked ? 'line-through text-stone-400' : 'text-white')}>{item.name}</span>{catItem?.culturalTag && (<span className='px-2 py-0.5 rounded-lg text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0'>{catItem.culturalTag}</span>)}</div>{rec?.brandName && (<span className='text-xs text-stone-400 block mt-0.5 truncate'>{rec.brandName}</span>)}</div>
                      </div>
                      <div className='flex items-center justify-between md:justify-end gap-2.5 sm:gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-stone-800'>
                        {storeMeta && rec && (<div className='shrink-0'><span className={'px-2.5 py-1 rounded-xl text-[11px] font-bold border inline-flex items-center gap-1 ' + storeMeta.badgeBg}><span>{storeMeta.icon}</span><span className='hidden sm:inline'>{storeMeta.name}</span><span className='font-mono text-white'>({rec.price.toFixed(2)})</span></span></div>)}
                        <div className='flex items-center bg-stone-900 border border-stone-750 rounded-xl px-2 py-1 gap-1.5 shrink-0'>
                          <button type='button' onClick={() => handleUpdateItemQty(item.id, item.quantity - 1)} className='text-stone-400 hover:text-white text-xs font-bold cursor-pointer px-1'>-</button>
                          <span className='text-xs font-mono font-bold text-white min-w-[35px] text-center'>{item.quantity} {item.unit}</span>
                          <button type='button' onClick={() => handleUpdateItemQty(item.id, item.quantity + 1)} className='text-stone-400 hover:text-white text-xs font-bold cursor-pointer px-1'>+</button>
                        </div>
                        <div className='text-right min-w-[65px] shrink-0'><span className='text-sm sm:text-base font-mono font-black text-emerald-400'>{itemCost.toFixed(2)} {currency}</span></div>
                        <button type='button' onClick={() => handleDeleteItem(item.id)} className='w-8 h-8 rounded-xl bg-stone-900/80 hover:bg-rose-500/20 border border-stone-750 hover:border-rose-500/40 text-stone-400 hover:text-rose-400 flex items-center justify-center cursor-pointer transition shrink-0' title={isRo ? 'Sterge din lista' : 'Delete item'}><Trash2 className='w-4 h-4' /></button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 2: SMART BUDGET FITTER */}
      {activeSubTab === 'budgetFitter' && (
        <div className='space-y-6 animate-in fade-in duration-200'>
          <div className='bg-gradient-to-br from-stone-900 via-stone-850 to-stone-900 p-6 sm:p-7 rounded-3xl border border-amber-500/30 shadow-2xl space-y-4'>
            <div className='flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-amber-400'><Coins className='w-4 h-4' /><span>{isRo ? 'Optimizare pe Banii Disponibili (Haytham & Cati)' : 'Budget-Fit Engine (Haytham & Cati)'}</span></div>
            <h2 className='text-2xl sm:text-3xl font-bold tracking-tight text-white'>{isRo ? 'Cati bani ai disponibili pentru cumparaturi?' : 'How much grocery cash do you have available?'}</h2>
            <p className='text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed'>{isRo ? 'Introdu suma exacta de bani pe care o ai in buzunar sau in cont. Algoritmul genereaza un cos echilibrat de mancare marocana si romaneasca care se incadreaza strict sub bugetul tau, fara sa depasesti niciun leu!' : 'Enter your exact available grocery budget. The engine generates an optimal Moroccan and Romanian basket strictly below your budget!'}</p>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2'>
              <div><label className='text-xs font-bold text-stone-400 block mb-1'>{isRo ? 'Bugetul Tau (' + currency + ')' : 'Your Budget (' + currency + ')'}</label><input type='number' step='5' min='20' value={targetBudgetInput} onChange={(e) => setTargetBudgetInput(parseFloat(e.target.value) || 0)} className='w-full bg-stone-950 border border-amber-500/50 rounded-2xl px-4 py-2.5 text-lg font-black text-amber-400 font-mono focus:outline-none focus:border-amber-400 shadow-inner' /></div>
              <div><label className='text-xs font-bold text-stone-400 block mb-1'>{isRo ? 'Preselecteaza Rapid' : 'Quick Presets'}</label><div className='flex gap-1.5 flex-wrap'>{[75, 100, 150, 200, 300].map((amt) => (<button key={amt} type='button' onClick={() => setTargetBudgetInput(amt)} className={'px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition ' + (targetBudgetInput === amt ? 'bg-amber-500 text-stone-950 font-black' : 'bg-stone-800 text-stone-300 hover:bg-stone-750')}>{amt} {currency}</button>))}</div></div>
              <div className='sm:col-span-2'><label className='text-xs font-bold text-stone-400 block mb-1'>{isRo ? 'Foloseste Soldul Conturilor Curente' : 'Use Current Account Balances'}</label><div className='flex gap-2 flex-wrap'><button type='button' onClick={() => setTargetBudgetInput(Math.min(300, Math.floor(wifeBal)))} className='px-3.5 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold hover:bg-emerald-500/25 cursor-pointer'>Salariu {wifeShort}: {wifeBal.toFixed(0)} {currency}</button><button type='button' onClick={() => setTargetBudgetInput(Math.min(300, Math.floor(husbandBal)))} className='px-3.5 py-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold hover:bg-amber-500/25 cursor-pointer'>Buffer {husbandShort}: {husbandBal.toFixed(0)} {currency}</button></div></div>
            </div>
            <div className='pt-3 border-t border-stone-800'><label className='text-xs font-bold text-stone-300 block mb-2'>{isRo ? 'Preferinta Culturala Meniu:' : 'Cultural Menu Preference:'}</label>
              <div className='grid grid-cols-1 sm:grid-cols-4 gap-2.5'>
                <button type='button' onClick={() => setBudgetDiversityFocus('MIXED')} className={'p-3.5 rounded-2xl border text-left transition cursor-pointer ' + (budgetDiversityFocus === 'MIXED' ? 'bg-gradient-to-r from-amber-500/20 to-emerald-500/20 border-emerald-500 text-white ring-1 ring-emerald-500/50 shadow-md' : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200')}><div className='text-xs font-bold'>{isRo ? 'Mixt Maroc & Romania' : 'Morocco & Romania Mix'}</div><div className='text-[10px] text-stone-400 mt-1'>{isRo ? 'Armonie perfecta intre ambele bucatarii' : 'Perfect harmony between cuisines'}</div></button>
                <button type='button' onClick={() => setBudgetDiversityFocus('MOROCCAN')} className={'p-3.5 rounded-2xl border text-left transition cursor-pointer ' + (budgetDiversityFocus === 'MOROCCAN' ? 'bg-amber-500/20 border-amber-500 text-white ring-1 ring-amber-500/50 shadow-md' : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200')}><div className='text-xs font-bold'>{isRo ? 'Autentic Marocan' : 'Authentic Moroccan'}</div><div className='text-[10px] text-stone-400 mt-1'>{isRo ? 'Couscous, vita tagine, naut si harissa' : 'Couscous, beef tagine, chickpeas'}</div></button>
                <button type='button' onClick={() => setBudgetDiversityFocus('ROMANIAN')} className={'p-3.5 rounded-2xl border text-left transition cursor-pointer ' + (budgetDiversityFocus === 'ROMANIAN' ? 'bg-cyan-500/20 border-cyan-500 text-white ring-1 ring-cyan-500/50 shadow-md' : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200')}><div className='text-xs font-bold'>{isRo ? 'Autentic Romanesc' : 'Authentic Romanian'}</div><div className='text-[10px] text-stone-400 mt-1'>{isRo ? 'Mamaliguta, telemea, smantana si bors' : 'Polenta, telemea cheese, sour cream'}</div></button>
                <button type='button' onClick={() => setBudgetDiversityFocus('BUDGET')} className={'p-3.5 rounded-2xl border text-left transition cursor-pointer ' + (budgetDiversityFocus === 'BUDGET' ? 'bg-emerald-500/20 border-emerald-500 text-white ring-1 ring-emerald-500/50 shadow-md' : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200')}><div className='text-xs font-bold'>{isRo ? 'Esential Economic' : 'Essential Budget'}</div><div className='text-[10px] text-stone-400 mt-1'>{isRo ? 'Alimente de baza la pret minim' : 'Basic staples at lowest prices'}</div></button>
              </div>
            </div>
          </div>

          <div className='p-6 rounded-3xl bg-stone-900 border border-stone-800 shadow-xl space-y-4'>
            <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-4'>
              <div><span className='text-xs font-bold text-amber-400 uppercase tracking-wider block'>{isRo ? 'Cos Generat Automat pentru ' + budgetFitterPlan.budget + ' ' + currency : 'Auto-Generated Basket for ' + budgetFitterPlan.budget + ' ' + currency}</span><div className='flex items-center gap-2.5 mt-1'><span className='text-xl font-bold text-white'>{budgetFitterPlan.items.length} {isRo ? 'Alimente Esentiale Selectate' : 'Essential Items Selected'}</span><span className='text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold'>{budgetFitterPlan.moroccanCount} Marocane • {budgetFitterPlan.romanianCount} Romanesti</span></div></div>
              <div className='flex items-center gap-4 bg-stone-950 p-3 rounded-2xl border border-stone-800'>
                <div><span className='text-[10px] text-stone-400 uppercase font-bold tracking-wider block'>{isRo ? 'Cost Total Cos' : 'Total Basket Cost'}</span><span className='text-lg font-black text-emerald-400 font-mono'>{budgetFitterPlan.totalCost.toFixed(2)} {currency}</span></div>
                <div className='w-px h-8 bg-stone-800' />
                <div><span className='text-[10px] text-stone-400 uppercase font-bold tracking-wider block'>{isRo ? 'Rest Ramas in Buzunar' : 'Spare Change Left'}</span><span className='text-lg font-black text-cyan-400 font-mono'>+{budgetFitterPlan.remainingCash.toFixed(2)} {currency}</span></div>
              </div>
            </div>

            <div className='space-y-2'>
              {budgetFitterPlan.items.map((bItem, idx) => {
                const storeMeta = SUPERMARKETS.find((s) => s.id === bItem.bestStore);
                return (
                  <div key={idx} className='p-3 sm:p-3.5 rounded-2xl bg-stone-850 border border-stone-750 flex items-center justify-between gap-3 text-xs overflow-hidden'>
                    <div className='flex items-center gap-2.5 min-w-0 flex-1'><span className='w-6 h-6 rounded-full bg-stone-800 text-stone-300 font-bold flex items-center justify-center text-[10px] shrink-0'>#{idx + 1}</span><div className='min-w-0 flex-1'><span className='font-bold text-white block text-sm truncate'>{bItem.catalogItem.name}</span>{bItem.catalogItem.culturalTag && (<span className='text-[11px] text-amber-400 font-bold truncate block'>{bItem.catalogItem.culturalTag}</span>)}</div></div>
                    <div className='flex items-center gap-2.5 shrink-0'>{storeMeta && (<span className={'px-2.5 py-1 rounded-xl text-xs font-bold border ' + storeMeta.badgeBg}>{storeMeta.name}</span>)}<span className='font-mono font-black text-emerald-400 min-w-[65px] text-right text-sm'>{bItem.unitPrice.toFixed(2)} {currency}</span></div>
                  </div>
                );
              })}
            </div>

            <div className='pt-3 border-t border-stone-800 flex flex-col sm:flex-row gap-3'>
              <button type='button' onClick={() => handleApplyBudgetPlanToList(true)} className='flex-1 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-stone-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition cursor-pointer flex items-center justify-center gap-2 active:scale-98'><Check className='w-4 h-4' /><span>{isRo ? 'Inlocuieste Lista Mea cu Acest Cos (' + budgetFitterPlan.totalCost.toFixed(2) + ' ' + currency + ')' : 'Replace My List with this Basket (' + budgetFitterPlan.totalCost.toFixed(2) + ' ' + currency + ')'}</span></button>
              <button type='button' onClick={() => handleApplyBudgetPlanToList(false)} className='py-3 px-5 rounded-2xl bg-stone-800 hover:bg-stone-750 text-white font-bold text-xs transition cursor-pointer'>{isRo ? 'Adauga la Lista Existenta' : 'Append to Current List'}</button>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: CULTURAL QUICK BUNDLES */}
      {activeSubTab === 'bundles' && (
        <div className='space-y-4 animate-in fade-in duration-200'>
          <div className='bg-stone-900 p-5 sm:p-6 rounded-3xl border border-stone-800'><h3 className='text-base sm:text-lg font-bold text-white flex items-center gap-2'><Flame className='w-5 h-5 text-amber-400' /><span>{isRo ? 'Pachete Culturale Preconfigurate (Haytham & Cati)' : 'Preconfigured Cultural Meal Bundles (Haytham & Cati)'}</span></h3><p className='text-xs sm:text-sm text-stone-400 mt-1'>{isRo ? 'Adauga un set complet de ingrediente traditionale marocane si romanesti cu un singur click direct in lista ta.' : 'Add a full set of authentic Moroccan & Romanian staple ingredients with a single tap.'}</p></div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {QUICK_BUNDLES.map((bundle) => (
              <div key={bundle.id} className='p-5 sm:p-6 rounded-3xl bg-stone-900 border border-stone-800 hover:border-emerald-500/40 shadow-xl flex flex-col justify-between transition-all'>
                <div>
                  <div className='flex items-center justify-between'><span className='text-3xl'>{bundle.icon}</span><span className='px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold'>{isRo ? bundle.badgeRo : bundle.culture}</span></div>
                  <h4 className='font-bold text-white text-lg mt-2.5'>{isRo ? bundle.titleRo : bundle.titleEn}</h4>
                  <p className='text-xs sm:text-sm text-stone-300 mt-1.5 leading-relaxed'>{isRo ? bundle.descriptionRo : bundle.descriptionEn}</p>
                  <div className='mt-4 pt-3 border-t border-stone-800'><span className='text-xs font-bold text-stone-400 block mb-2'>{isRo ? 'Contine ' + bundle.items.length + ' produse esentiale:' : 'Contains ' + bundle.items.length + ' essential items:'}</span>
                    <ul className='space-y-2 text-xs text-stone-300'>{bundle.items.map((bItem) => { const cat = catalogMap.get(bItem.catalogId); return (<li key={bItem.catalogId} className='flex items-center justify-between'><span>• {cat?.name || bItem.catalogId}</span><span className='text-stone-400 font-mono font-bold'>x{bItem.quantity}</span></li>); })}</ul>
                  </div>
                </div>
                <button onClick={() => handleApplyBundle(bundle)} className='mt-6 w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-stone-950 text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition cursor-pointer active:scale-98'><Plus className='w-4 h-4' /><span>{isRo ? 'Adauga Acest Pachet in Lista' : 'Add Bundle to Shopping List'}</span></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 4: 6-STORE PRICE MATRIX */}
      {activeSubTab === 'matrix' && (
        <div className='space-y-4 animate-in fade-in duration-200'>
          <div className='bg-stone-900 p-4 rounded-3xl border border-stone-800 space-y-3'>
            <div className='flex flex-col sm:flex-row gap-3'>
              <input type='text' placeholder={isRo ? 'Cauta in catalog (couscous, vita, telemea, lapte...)' : 'Search catalog (couscous, beef, cheese, milk...)'} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className='flex-1 bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500' />
              <div className='flex gap-1.5 flex-wrap'>
                <button type='button' onClick={() => setCuisineFilter('ALL')} className={'px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer transition ' + (cuisineFilter === 'ALL' ? 'bg-emerald-500 text-stone-950 font-black' : 'bg-stone-800 text-stone-300')}>{isRo ? 'Toate' : 'All'}</button>
                <button type='button' onClick={() => setCuisineFilter('MOROCCAN')} className={'px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer transition ' + (cuisineFilter === 'MOROCCAN' ? 'bg-amber-500 text-stone-950 font-black' : 'bg-stone-800 text-amber-400')}>{isRo ? 'Maroc' : 'Morocco'}</button>
                <button type='button' onClick={() => setCuisineFilter('ROMANIAN')} className={'px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer transition ' + (cuisineFilter === 'ROMANIAN' ? 'bg-cyan-500 text-stone-950 font-black' : 'bg-stone-800 text-cyan-400')}>{isRo ? 'Romania' : 'Romania'}</button>
              </div>
            </div>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {groceryCatalog.filter((item) => { if (cuisineFilter !== 'ALL' && item.cuisine !== cuisineFilter) return false; if (searchQuery.trim() && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false; return true; }).map((catItem) => {
              const storeEntries = Object.entries(catItem.stores || {}) as [SupermarketId, { price: number; qualityScore: number; brandName?: string }][];
              const lowestStore = storeEntries.length > 0 ? storeEntries.sort((a, b) => a[1].price - b[1].price)[0] : null;
              return (
                <div key={catItem.id} className='p-5 rounded-3xl bg-stone-900 border border-stone-800 shadow-lg flex flex-col justify-between space-y-3'>
                  <div>
                    <div className='flex items-center justify-between mb-1.5'><span className='text-[10px] font-bold text-stone-400 uppercase tracking-wider'>{catItem.category}</span>{catItem.culturalTag && (<span className='text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-md border border-amber-500/20'>{catItem.culturalTag}</span>)}</div>
                    <h4 className='font-bold text-white text-base leading-snug'>{catItem.name}</h4>
                    <div className='mt-3.5 space-y-1.5 text-xs'>
                      {SUPERMARKETS.map((st) => {
                        const pInfo = catItem.stores[st.id];
                        const isLowest = lowestStore && lowestStore[0] === st.id;
                        return (
                          <div key={st.id} className={'flex items-center justify-between p-2 rounded-xl ' + (isLowest ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold' : 'bg-stone-950/60 text-stone-300')}><div className='flex items-center gap-2'><span>{st.icon}</span><span>{st.name}</span></div><div>{pInfo ? (<span className='font-mono'>{pInfo.price.toFixed(2)} {currency}</span>) : (<span className='text-stone-600'>--</span>)}</div></div>
                        );
                      })}
                    </div>
                  </div>
                  <div className='pt-3 border-t border-stone-800 flex items-center justify-between'><span className='text-xs text-stone-400'>{isRo ? 'Minim: ' : 'Lowest: '}<strong className='text-emerald-400 font-mono'>{lowestStore ? lowestStore[1].price.toFixed(2) + ' ' + currency : '--'}</strong></span><button type='button' onClick={() => handleAddCatalogItemToList(catItem)} className='px-3.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-750 text-emerald-400 text-xs font-bold flex items-center gap-1 cursor-pointer transition'><Plus className='w-3.5 h-3.5' /><span>{isRo ? 'In Lista' : 'Add'}</span></button></div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* FLOATING IN-STORE SHOPPING MODE BOTTOM BAR */}
      {inStoreMode && (
        <div className='fixed bottom-4 left-4 right-4 max-w-lg mx-auto z-40 bg-stone-900/95 backdrop-blur-md border border-emerald-500/50 p-4 rounded-3xl shadow-2xl flex items-center justify-between animate-in slide-in-from-bottom'>
          <div><span className='text-[10px] font-black uppercase text-emerald-400 tracking-wider block'>{isRo ? 'In Magazin • Progres: ' + checkedCount + ' / ' + shoppingList.length : 'In-Store Mode • ' + checkedCount + ' / ' + shoppingList.length}</span><div className='flex items-baseline gap-2'><span className='text-xl font-black text-white font-mono'>{inStoreRunningTotal.toFixed(2)} {currency}</span><span className='text-[11px] text-stone-400'>{isRo ? 'total bifat in cos' : 'total in cart'}</span></div></div>
          <button type='button' onClick={() => { setLogStoreName('Lidl & Kaufland'); setLogAmount(inStoreRunningTotal); setIsLogExpenseOpen(true); }} className='px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-xs shadow-lg shadow-emerald-500/25 cursor-pointer transition active:scale-98'>{isRo ? 'Incheie & Salveaza Bon' : 'Finish & Log Receipt'}</button>
        </div>
      )}

      {/* MODAL 1: ADD MANUAL ITEM */}
      {isAddItemOpen && (
        <div className='fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-sm flex items-center justify-center p-4'>
          <div className='bg-stone-900 border border-stone-700 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl'>
            <div className='flex items-center justify-between border-b border-stone-800 pb-3'><h3 className='text-lg font-bold text-white'>{isRo ? 'Adauga Produs in Lista' : 'Add Item to Shopping List'}</h3><button onClick={() => setIsAddItemOpen(false)} className='text-stone-400 hover:text-white cursor-pointer'><X className='w-5 h-5' /></button></div>
            <form onSubmit={handleAddNewManualItem} className='space-y-3.5'>
              <div><label className='text-xs font-bold text-stone-400 block mb-1'>{isRo ? 'Nume Produs' : 'Product Name'}</label><input type='text' required placeholder={isRo ? 'ex: Couscous, Lapte, Piept pui, Telemea' : 'e.g., Couscous, Milk, Chicken, Cheese'} value={newItemName} onChange={(e) => setNewItemName(e.target.value)} className='w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500' /></div>
              <div className='grid grid-cols-2 gap-3'>
                <div><label className='text-xs font-bold text-stone-400 block mb-1'>{isRo ? 'Cantitate' : 'Quantity'}</label><input type='number' step='0.5' min='0.5' value={newItemQty} onChange={(e) => setNewItemQty(parseFloat(e.target.value) || 1)} className='w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-white font-mono font-bold focus:outline-none focus:border-emerald-500' /></div>
                <div><label className='text-xs font-bold text-stone-400 block mb-1'>{isRo ? 'Unitate' : 'Unit'}</label><select value={newItemUnit} onChange={(e) => setNewItemUnit(e.target.value)} className='w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500'><option value='buc'>{isRo ? 'buc (bucati)' : 'pcs (pieces)'}</option><option value='kg'>{isRo ? 'kg (kilograme)' : 'kg (kilograms)'}</option><option value='L'>{isRo ? 'L (litri)' : 'L (liters)'}</option><option value='pachet'>{isRo ? 'pachet' : 'pack'}</option></select></div>
              </div>
              <div><label className='text-xs font-bold text-stone-400 block mb-1'>{isRo ? 'Categorie' : 'Category'}</label>
                <select value={newItemCategory} onChange={(e) => setNewItemCategory(e.target.value as GroceryCategory)} className='w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500'>
                  <option value='DAIRY'>{isRo ? 'Lactate & Oua' : 'Dairy & Eggs'}</option><option value='MEAT_FISH'>{isRo ? 'Carne & Peste' : 'Meat & Fish'}</option><option value='FRUITS_VEGGIES'>{isRo ? 'Fructe & Legume' : 'Produce & Veggies'}</option><option value='BAKERY'>{isRo ? 'Paine & Brutarii' : 'Bakery & Bread'}</option><option value='PANTRY'>{isRo ? 'Camara & Uleiuri' : 'Pantry & Oils'}</option><option value='CLEANING'>{isRo ? 'Curatenie & Menaj' : 'Cleaning & Home'}</option><option value='BEVERAGES'>{isRo ? 'Bauturi & Ceai' : 'Beverages & Tea'}</option><option value='SNACKS'>{isRo ? 'Gustari & Dulciuri' : 'Snacks & Sweets'}</option>
                </select>
              </div>
              <div className='pt-2 flex gap-2'><button type='button' onClick={() => setIsAddItemOpen(false)} className='flex-1 py-2.5 rounded-xl bg-stone-800 text-stone-300 font-semibold text-xs hover:bg-stone-750 cursor-pointer'>{isRo ? 'Anuleaza' : 'Cancel'}</button><button type='submit' className='flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs shadow-md shadow-emerald-500/20 cursor-pointer'>{isRo ? 'Adauga in Lista' : 'Add to List'}</button></div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: LOG EXPENSE */}
      {isLogExpenseOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-stone-950/85 backdrop-blur-sm p-4 animate-in fade-in'>
          <div className='bg-stone-900 border border-stone-750 rounded-3xl p-6 max-w-md w-full shadow-2xl'>
            <div className='flex items-center justify-between mb-4 border-b border-stone-800 pb-3'><h3 className='text-lg font-bold text-white flex items-center gap-2'><Wallet className='w-5 h-5 text-emerald-400' /><span>{isRo ? 'Inregistreaza Bonul in Bugetul Familiei' : 'Log Receipt into Household Budget'}</span></h3><button onClick={() => setIsLogExpenseOpen(false)} className='text-stone-400 hover:text-white p-1 cursor-pointer'><X className='w-5 h-5' /></button></div>
            {logSuccessMessage ? (
              <div className='p-6 text-center text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/30 rounded-2xl animate-in zoom-in'><CheckCircle2 className='w-12 h-12 mx-auto mb-2 text-emerald-400' /><span>{logSuccessMessage}</span></div>
            ) : (
              <form onSubmit={handleConfirmLogExpense} className='space-y-4'>
                <div><label className='text-xs font-bold text-stone-400 block mb-1'>{isRo ? 'Descriere / Magazine' : 'Store / Description'}</label><input type='text' required value={logStoreName} onChange={(e) => setLogStoreName(e.target.value)} className='w-full px-3.5 py-2 text-xs bg-stone-950 border border-stone-800 rounded-xl text-white focus:outline-none focus:border-emerald-500' /></div>
                <div><label className='text-xs font-bold text-stone-400 block mb-1'>{isRo ? 'Suma Reala Cheltuita (' + currency + ')' : 'Total Amount (' + currency + ')'}</label><input type='number' step='0.01' min='1' required value={logAmount} onChange={(e) => setLogAmount(parseFloat(e.target.value) || 0)} className='w-full px-3.5 py-2 text-sm bg-stone-950 border border-stone-800 rounded-xl text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500' /></div>
                <div><label className='text-xs font-bold text-stone-400 block mb-1'>{isRo ? 'Sursa Plata / Responsabil' : 'Payment Account'}</label>
                  <select value={logPayer} onChange={(e) => setLogPayer(e.target.value as ExpensePayer)} className='w-full px-3.5 py-2 text-xs bg-stone-950 border border-stone-800 rounded-xl text-white focus:outline-none focus:border-emerald-500'>
                    <option value='WIFE_SALARY'>Salariu {wifeShort} ({isRo ? 'Disponibil' : 'Available'}: {wifeBal.toFixed(2)} {currency})</option>
                    <option value='FREELANCE_BUFFER'>Buffer Freelance {husbandShort} ({isRo ? 'Disponibil' : 'Available'}: {husbandBal.toFixed(2)} {currency})</option>
                    <option value='SHARED_POOL'>{isRo ? 'Fond Comun' : 'Shared Pool'} ({isRo ? 'Disponibil' : 'Available'}: {sharedBal.toFixed(2)} {currency})</option>
                  </select>
                </div>
                {(() => {
                  const currentBal = logPayer === 'WIFE_SALARY' ? wifeBal : logPayer === 'FREELANCE_BUFFER' ? husbandBal : sharedBal;
                  const isInsufficient = currentBal <= 0 || currentBal < logAmount;
                  const remaining = currentBal - logAmount;
                  return (
                    <>
                      <div className='p-3 bg-stone-950 rounded-xl border border-stone-800 text-xs space-y-1.5'>
                        <div className='flex justify-between text-stone-400'><span>{isRo ? 'Sold disponibil in cont:' : 'Current balance in account:'}</span><span className='font-mono font-bold text-white'>{currentBal.toFixed(2)} {currency}</span></div>
                        <div className='flex justify-between text-rose-400'><span>{isRo ? 'Valoare cumparaturi:' : 'Expense amount:'}</span><span className='font-mono font-bold'>-{logAmount.toFixed(2)} {currency}</span></div>
                        <div className='h-px bg-stone-800 my-1' /><div className='flex justify-between font-bold'><span className='text-stone-300'>{isRo ? 'Sold ramas:' : 'Remaining balance:'}</span><span className={'font-mono ' + (remaining < 0 ? 'text-rose-400 font-black' : 'text-emerald-400')}>{remaining.toFixed(2)} {currency}</span></div>
                      </div>
                      {isInsufficient && (<div className='p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs animate-pulse'><strong className='block font-bold text-rose-300'>âš ï¸ {isRo ? 'FONDURI INSUFICIENTE' : 'INSUFFICIENT FUNDS'}</strong><span>{isRo ? 'Contul selectat are soldul ' + currentBal.toFixed(2) + ' ' + currency + '. Nu poti introduce cumparaturile fara fonduri suficiente!' : 'Selected account has ' + currentBal.toFixed(2) + ' ' + currency + '. You cannot log this expense without sufficient funds!'}</span></div>)}
                    </>
                  );
                })()}
                <div className='pt-2 flex items-center justify-end gap-3'>
                  <button type='button' onClick={() => setIsLogExpenseOpen(false)} className='px-4 py-2 rounded-xl text-xs font-semibold text-stone-400 hover:text-white cursor-pointer'>{isRo ? 'Anuleaza' : 'Cancel'}</button>
                  <button type='submit' disabled={(logPayer === 'WIFE_SALARY' ? wifeBal : logPayer === 'FREELANCE_BUFFER' ? husbandBal : sharedBal) < logAmount} className={'px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg transition cursor-pointer ' + ((logPayer === 'WIFE_SALARY' ? wifeBal : logPayer === 'FREELANCE_BUFFER' ? husbandBal : sharedBal) < logAmount ? 'bg-stone-800 text-stone-500 border border-stone-700 cursor-not-allowed opacity-60' : 'bg-emerald-500 hover:bg-emerald-400 text-stone-950 shadow-emerald-500/20 active:scale-98')}>
                    {(logPayer === 'WIFE_SALARY' ? wifeBal : logPayer === 'FREELANCE_BUFFER' ? husbandBal : sharedBal) < logAmount ? (isRo ? 'Sold Insuficient â€” Blocat' : '0 Balance â€” Blocked') : (isRo ? 'Salveaza & Scade din Buget' : 'Save & Deduct from Budget')}
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
