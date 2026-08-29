import React, { useState, useRef, useMemo } from 'react';
import {
  Camera,
  Image as ImageIcon,
  Upload,
  Sparkles,
  Check,
  AlertCircle,
  RefreshCw,
  X,
  Receipt,
  Plus,
  Trash2,
  Wallet,
  ShieldAlert,
  FolderOpen
} from 'lucide-react';
import {
  ExpenseCategory,
  HouseholdExpense,
  ExpensePayer,
  CashPocketsBalance,
  ReceiptItemLine
} from '../types';

interface ReceiptScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddExpense: (expense: HouseholdExpense) => void;
  cashBalances: CashPocketsBalance;
  currencySymbol?: string;
  lang?: string;
  wifeName?: string;
  husbandName?: string;
}

export const ReceiptScannerModal: React.FC<ReceiptScannerModalProps> = ({
  isOpen,
  onClose,
  onAddExpense,
  cashBalances,
  currencySymbol = 'lei',
  lang = 'ro',
  wifeName = 'Cati (IT Support)',
  husbandName = 'Haytham (Videograf)'
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Parsed / Editable receipt state
  const [merchant, setMerchant] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('GROCERIES');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [itemizedList, setItemizedList] = useState<ReceiptItemLine[]>([]);
  const [assignedPayer, setAssignedPayer] = useState<ExpensePayer>('WIFE_SALARY');
  const [hasScanned, setHasScanned] = useState(false);

  // Quick add item in receipt breakdown
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');

  // Refs for Camera and Gallery file pickers
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  // Calculate live total from itemized lines
  const totalAmount = useMemo(() => {
    if (itemizedList.length === 0) return 0;
    return itemizedList.reduce((sum, it) => sum + (Number(it.price) || 0), 0);
  }, [itemizedList]);

  // Selected payer's live available balance
  const selectedPayerBalance = useMemo(() => {
    switch (assignedPayer) {
      case 'WIFE_SALARY':
        return cashBalances.wifeSalaryBalance;
      case 'FREELANCE_BUFFER':
        return cashBalances.freelanceBufferBalance;
      case 'SHARED_POOL':
        return cashBalances.sharedPoolBalance;
      default:
        return 0;
    }
  }, [assignedPayer, cashBalances]);

  // Check if broke or insufficient balance
  const isBalanceInsufficient = selectedPayerBalance <= 0 || selectedPayerBalance < totalAmount;
  const remainingBalanceAfterBill = selectedPayerBalance - totalAmount;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const base64 = evt.target?.result as string;
      if (base64) {
        setImagePreview(base64);
        scanReceipt(base64, file.type || 'image/jpeg');
      }
    };
    reader.readAsDataURL(file);
    // Reset inputs so user can pick the same file again if desired
    e.target.value = '';
  };

  const scanReceipt = async (base64: string, mimeType: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/scan-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64, mimeType })
      });
      const data = await res.json();
      if (data.success && data.result) {
        const r = data.result;
        setMerchant(r.merchantName || 'Lidl Romania');
        if (r.suggestedCategory) setCategory(r.suggestedCategory);
        if (r.date) setDate(r.date);

        if (Array.isArray(r.itemizedList) && r.itemizedList.length > 0) {
          setItemizedList(r.itemizedList);
        } else if (Array.isArray(r.items) && r.items.length > 0) {
          const splitAmount = Math.round(((r.totalAmount || 100) / r.items.length) * 100) / 100;
          setItemizedList(r.items.map((name: string) => ({ name, price: splitAmount })));
        } else {
          setItemizedList([
            { name: 'Produse alimentare & menaj', price: Number(r.totalAmount) || 100 }
          ]);
        }

        setHasScanned(true);
      } else {
        setError(data.error || 'Nu am putut citi bonul.');
      }
    } catch (err: any) {
      setError(err?.message || 'Eroare la scanarea bonului');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateItemPrice = (index: number, newPrice: number) => {
    const updated = [...itemizedList];
    updated[index].price = Math.max(0, newPrice);
    setItemizedList(updated);
  };

  const handleUpdateItemName = (index: number, newName: string) => {
    const updated = [...itemizedList];
    updated[index].name = newName;
    setItemizedList(updated);
  };

  const handleDeleteItem = (index: number) => {
    setItemizedList(itemizedList.filter((_, i) => i !== index));
  };

  const handleAddNewItem = () => {
    if (!newItemName.trim()) return;
    const priceVal = parseFloat(newItemPrice) || 0;
    setItemizedList([...itemizedList, { name: newItemName.trim(), price: priceVal }]);
    setNewItemName('');
    setNewItemPrice('');
  };

  const handleSaveExpense = () => {
    if (totalAmount <= 0) {
      setError('Suma totala a bonului trebuie sa fie mai mare de 0.');
      return;
    }

    if (isBalanceInsufficient) {
      setError('Fonduri insuficiente in contul selectat. Nu poti introduce o cheltuiala daca soldul este 0 sau insuficient!');
      return;
    }

    const newExpense: HouseholdExpense = {
      id: `exp-${Date.now()}`,
      title: `${merchant.trim() || 'Cumparaturi'} (Scanat)`,
      amount: Math.round(totalAmount * 100) / 100,
      category: category,
      isFixed: false,
      assignedPayer: assignedPayer
    };

    onAddExpense(newExpense);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-stone-900 border border-stone-700 rounded-3xl max-w-xl w-full p-5 sm:p-6 space-y-5 shadow-2xl overflow-y-auto max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-stone-950 font-black shadow-lg shadow-emerald-500/20">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black font-display text-white">
                  Scaner & Defalcare Bon Fiscal
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-black">
                  📸 Cameră + 🖼️ Galerie
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                Extrage fiecare produs în lei și scade automat suma din soldul de bani
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-white p-1 text-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload / Camera / Gallery Selection Area */}
        {!imagePreview ? (
          <div className="space-y-4">
            <div className="text-center">
              <span className="text-xs font-bold text-stone-200">
                Alege cum dorești să încarci bonul:
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Option 1: Live Camera via Native Label */}
              <label
                htmlFor="camera-receipt-file-input"
                className="group border-2 border-emerald-500/60 hover:border-emerald-400 bg-gradient-to-b from-stone-850 to-stone-900 hover:from-emerald-950/40 hover:to-stone-900 rounded-3xl p-6 flex flex-col items-center justify-center space-y-3 shadow-lg hover:shadow-emerald-500/20 cursor-pointer transition-all active:scale-98 text-center"
              >
                <input
                  id="camera-receipt-file-input"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 group-hover:bg-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner transition-all">
                  <Camera className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm font-black text-white group-hover:text-emerald-300">
                    📸 Fă Poză cu Camera
                  </p>
                  <p className="text-[11px] text-stone-400 mt-1">
                    Deschide camera telefonului în timp real
                  </p>
                </div>
              </label>

              {/* Option 2: Photo Gallery / Screenshots via Native Label */}
              <label
                htmlFor="gallery-receipt-file-input"
                className="group border-2 border-cyan-500/60 hover:border-cyan-400 bg-gradient-to-b from-stone-850 to-stone-900 hover:from-cyan-950/40 hover:to-stone-900 rounded-3xl p-6 flex flex-col items-center justify-center space-y-3 shadow-lg hover:shadow-cyan-500/20 cursor-pointer transition-all active:scale-98 text-center"
              >
                <input
                  id="gallery-receipt-file-input"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/heic,image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 group-hover:bg-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-inner transition-all">
                  <ImageIcon className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm font-black text-white group-hover:text-cyan-300">
                    🖼️ Alege din Galerie / Poze
                  </p>
                  <p className="text-[11px] text-stone-400 mt-1">
                    Screenshots bon, poze salvate sau fișiere
                  </p>
                </div>
              </label>
            </div>

            <div className="text-center pt-1">
              <span className="text-[11px] text-stone-400">
                Suportă bonuri de la Lidl, Kaufland, Carrefour, Mega Image, Penny, Auchan, benzinării, facturi etc.
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Image Preview & Dual Retake Options */}
            <div className="relative rounded-2xl overflow-hidden bg-stone-950 border border-stone-800 max-h-44 flex items-center justify-center">
              <img src={imagePreview} alt="Screenshot bon" className="object-contain max-h-44 w-full opacity-85" />
              
              <div className="absolute right-2 bottom-2 flex items-center gap-1.5 bg-stone-900/95 backdrop-blur-md p-1.5 rounded-2xl border border-stone-750 shadow-xl">
                <label
                  htmlFor="retake-camera-input"
                  className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition"
                  title="Fă altă poză cu camera"
                >
                  <input
                    id="retake-camera-input"
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Camera className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Cameră</span>
                </label>

                <label
                  htmlFor="retake-gallery-input"
                  className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition"
                  title="Alege din galerie"
                >
                  <input
                    id="retake-gallery-input"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/heic,image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Galerie</span>
                </label>
              </div>
            </div>

            {loading && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center space-x-3 text-emerald-300 text-xs animate-pulse">
                <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
                <span>Gemini AI identifica magazinul si calculeaza pretul fiecarui aliment...</span>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* STEP 2: ITEMIZED LINE-BY-LINE BREAKDOWN */}
            {hasScanned && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-stone-850 p-3.5 rounded-2xl border border-stone-750">
                  <div>
                    <label className="text-[11px] font-bold text-stone-400 block mb-1">Comerciant / Magazin</label>
                    <input
                      type="text"
                      value={merchant}
                      onChange={(e) => setMerchant(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-1.5 text-xs text-white font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-stone-400 block mb-1">Categorie Buget</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="GROCERIES">Alimente & Supermarket</option>
                      <option value="UTILITIES">Utilitati & Facturi</option>
                      <option value="TRANSPORT">Transport & Combustibil</option>
                      <option value="VIDEO_SOFTWARE">Echipament & Productie Video</option>
                      <option value="FAMILY_LEISURE">Timp Liber & Iesiri</option>
                      <option value="HEALTH">Sanatate & Farmacie</option>
                      <option value="HOUSING">Locuinta & ÃŽntretinere</option>
                      <option value="MISC">Diverse</option>
                    </select>
                  </div>
                </div>

                {/* Itemized List Container */}
                <div className="space-y-2 bg-stone-850 p-4 rounded-2xl border border-stone-750">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-black uppercase text-emerald-400 tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      Articole Extrase de pe Bon ({itemizedList.length})
                    </span>
                    <span className="text-xs font-bold text-white font-mono">
                      Total: <span className="text-emerald-400 text-sm font-black">{totalAmount.toFixed(2)} {currencySymbol}</span>
                    </span>
                  </div>

                  {/* List of items */}
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {itemizedList.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-2 p-2 rounded-xl bg-stone-900/90 border border-stone-800 text-xs"
                      >
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => handleUpdateItemName(idx, e.target.value)}
                          className="flex-1 bg-transparent text-white font-medium focus:outline-none"
                        />
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={item.price}
                            onChange={(e) => handleUpdateItemPrice(idx, parseFloat(e.target.value) || 0)}
                            className="w-20 px-2 py-0.5 bg-stone-950 border border-stone-700 rounded-lg text-emerald-400 font-mono font-bold text-right focus:outline-none focus:border-emerald-500"
                          />
                          <span className="text-stone-400 text-[10px]">{currencySymbol}</span>
                          <button
                            type="button"
                            onClick={() => handleDeleteItem(idx)}
                            className="text-stone-500 hover:text-rose-400 p-1 cursor-pointer"
                            title="Sterge randul"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add manual item line */}
                  <div className="flex items-center gap-2 pt-2 border-t border-stone-800">
                    <input
                      type="text"
                      placeholder="Adauga alt produs de pe bon..."
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-stone-900 border border-stone-750 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none"
                    />
                    <input
                      type="number"
                      placeholder="Pret"
                      step="0.01"
                      value={newItemPrice}
                      onChange={(e) => setNewItemPrice(e.target.value)}
                      className="w-20 px-2 py-1.5 bg-stone-900 border border-stone-750 rounded-xl text-xs text-white font-mono text-right focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddNewItem}
                      className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Adauga
                    </button>
                  </div>
                </div>

                {/* STEP 3: CASH SOURCE DEDUCTION & ZERO-BALANCE (BROKE) CHECK */}
                <div className="space-y-3 bg-stone-850 p-4 rounded-2xl border border-stone-750">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
                      <Wallet className="w-3.5 h-3.5 text-amber-400" />
                      Din ce bani se scade acest bon?
                    </span>
                    <span className="text-[11px] text-stone-400">Alege contul sursa</span>
                  </div>

                  {/* Cash Source Selector Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {/* Option 1: Wife IT Salary */}
                    <button
                      type="button"
                      onClick={() => setAssignedPayer('WIFE_SALARY')}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        assignedPayer === 'WIFE_SALARY'
                          ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-sm ring-1 ring-emerald-500/40'
                          : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      <div className="text-[11px] font-bold truncate">Salariu {wifeName.split(' ')[0]}</div>
                      <div className="text-xs font-mono font-black mt-1 text-emerald-400">
                        {cashBalances.wifeSalaryBalance.toFixed(2)} {currencySymbol}
                      </div>
                      <div className="text-[9px] text-stone-400">Disponibil</div>
                    </button>

                    {/* Option 2: Freelance Buffer */}
                    <button
                      type="button"
                      onClick={() => setAssignedPayer('FREELANCE_BUFFER')}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        assignedPayer === 'FREELANCE_BUFFER'
                          ? 'bg-amber-500/20 border-amber-500 text-white shadow-sm ring-1 ring-amber-500/40'
                          : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      <div className="text-[11px] font-bold truncate">Buffer {husbandName.split(' ')[0]}</div>
                      <div className="text-xs font-mono font-black mt-1 text-amber-400">
                        {cashBalances.freelanceBufferBalance.toFixed(2)} {currencySymbol}
                      </div>
                      <div className="text-[9px] text-stone-400">Disponibil</div>
                    </button>

                    {/* Option 3: Shared Pool */}
                    <button
                      type="button"
                      onClick={() => setAssignedPayer('SHARED_POOL')}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        assignedPayer === 'SHARED_POOL'
                          ? 'bg-cyan-500/20 border-cyan-500 text-white shadow-sm ring-1 ring-cyan-500/40'
                          : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      <div className="text-[11px] font-bold truncate">Fond Comun</div>
                      <div className="text-xs font-mono font-black mt-1 text-cyan-400">
                        {cashBalances.sharedPoolBalance.toFixed(2)} {currencySymbol}
                      </div>
                      <div className="text-[9px] text-stone-400">Disponibil</div>
                    </button>
                  </div>

                  {/* Live Visual Reduction Box */}
                  <div className="p-3 bg-stone-900 rounded-xl border border-stone-800 text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-stone-300">
                      <span>Sold disponibil inainte de bon:</span>
                      <span className="font-mono font-bold">{selectedPayerBalance.toFixed(2)} {currencySymbol}</span>
                    </div>
                    <div className="flex items-center justify-between text-rose-400">
                      <span>Valoare bon de scazut:</span>
                      <span className="font-mono font-bold">-{totalAmount.toFixed(2)} {currencySymbol}</span>
                    </div>
                    <div className="h-px bg-stone-800 my-1" />
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-stone-200">Sold ramas dupa introducere:</span>
                      <span
                        className={`font-mono text-sm ${
                          remainingBalanceAfterBill < 0 ? 'text-rose-400 font-black' : 'text-emerald-400'
                        }`}
                      >
                        {remainingBalanceAfterBill.toFixed(2)} {currencySymbol}
                      </span>
                    </div>
                  </div>

                  {/* ZERO BALANCE / BROKE WARNING BANNER */}
                  {isBalanceInsufficient && (
                    <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/50 text-rose-200 text-xs flex items-start gap-2.5 animate-pulse">
                      <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block font-bold text-rose-300">
                          âš ï¸ FONDURI INSUFICIENTE (Sold: {selectedPayerBalance.toFixed(2)} {currencySymbol})
                        </strong>
                        <span>
                          Acest cont nu are destui bani pentru a acoperi bonul de {totalAmount.toFixed(2)} {currencySymbol}. Alege un cont cu sold disponibil sau incaseaza proiecte freelance inainte de a introduce cheltuiala!
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Final Action Button with Broke Lockout */}
                <button
                  type="button"
                  disabled={isBalanceInsufficient || totalAmount <= 0}
                  onClick={handleSaveExpense}
                  className={`w-full py-3 rounded-2xl font-bold text-xs shadow-lg transition flex items-center justify-center space-x-2 ${
                    isBalanceInsufficient || totalAmount <= 0
                      ? 'bg-stone-800 text-stone-500 border border-stone-700 cursor-not-allowed opacity-60'
                      : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-stone-950 shadow-emerald-500/20 cursor-pointer active:scale-98'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>
                    {isBalanceInsufficient
                      ? 'Sold 0 / Insuficient — Blocat'
                      : `Confirma & Scade ${totalAmount.toFixed(2)} ${currencySymbol} din Sold`}
                  </span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
