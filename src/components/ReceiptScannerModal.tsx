import React, { useState, useRef, useMemo, useEffect } from 'react';
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
  Key,
  ExternalLink,
  Edit3
} from 'lucide-react';
import { ExpenseCategory, HouseholdExpense, ExpensePayer, CashPocketsBalance, ReceiptItemLine } from '../types';

interface ReceiptScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddExpense: (expense: HouseholdExpense) => void;
  cashBalances?: CashPocketsBalance;
  currencySymbol?: string;
  lang?: string;
  wifeName?: string;
  husbandName?: string;
}

export const ReceiptScannerModal: React.FC<ReceiptScannerModalProps> = ({
  isOpen,
  onClose,
  onAddExpense,
  cashBalances = { wifeSalaryBalance: 3200, freelanceBufferBalance: 1500, sharedPoolBalance: 500 },
  currencySymbol = 'lei',
  lang = 'ro',
  wifeName = 'Cati',
  husbandName = 'Haytham'
}) => {
  const isRo = lang === 'ro';
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [merchant, setMerchant] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('GROCERIES');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [itemizedList, setItemizedList] = useState<ReceiptItemLine[]>([]);
  const [assignedPayer, setAssignedPayer] = useState<ExpensePayer>('WIFE_SALARY');
  const [hasScanned, setHasScanned] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');

  // Gemini API Key state
  const [apiKey, setApiKey] = useState<string>('');
  const [showKeyInput, setShowKeyInput] = useState<boolean>(false);
  const [keySavedMessage, setKeySavedMessage] = useState<boolean>(false);

  useEffect(() => {
    const saved = localStorage.getItem('housevault_gemini_key') || localStorage.getItem('gemini_api_key') || '';
    setApiKey(saved);
    if (!saved) {
      setShowKeyInput(true);
    }
  }, []);

  const handleSaveApiKey = () => {
    const cleanKey = apiKey.trim();
    if (cleanKey) {
      localStorage.setItem('housevault_gemini_key', cleanKey);
      setKeySavedMessage(true);
      setTimeout(() => setKeySavedMessage(false), 3000);
      setShowKeyInput(false);
      setError(null);
      if (imagePreview) {
        scanReceipt(imagePreview, 'image/jpeg', cleanKey);
      }
    }
  };

  const wifeBal = Number(cashBalances?.wifeSalaryBalance) || 0;
  const wifeTicketsBal = Number(cashBalances?.wifeMealTicketsBalance) || 0;
  const husbandBal = Number(cashBalances?.freelanceBufferBalance) || 0;
  const sharedBal = Number(cashBalances?.sharedPoolBalance) || 0;
  const wifeShort = (wifeName || 'Cati').split(' ')[0];
  const husbandShort = (husbandName || 'Haytham').split(' ')[0];

  const totalAmount = useMemo(() => {
    if (!itemizedList || itemizedList.length === 0) return 0;
    return itemizedList.reduce((sum, it) => sum + (Number(it?.price) || 0), 0);
  }, [itemizedList]);

  const selectedPayerBalance = useMemo(() => {
    switch (assignedPayer) {
      case 'WIFE_SALARY': return wifeBal;
      case 'WIFE_MEAL_TICKETS': return wifeTicketsBal;
      case 'FREELANCE_BUFFER': return husbandBal;
      case 'SHARED_POOL': return sharedBal;
      default: return 0;
    }
  }, [assignedPayer, wifeBal, wifeTicketsBal, husbandBal, sharedBal]);

  const isBalanceInsufficient = selectedPayerBalance <= 0 || selectedPayerBalance < totalAmount;
  const remainingBalanceAfterBill = selectedPayerBalance - totalAmount;

  if (!isOpen) return null;

  const optimizeImageForOCR = (file: File): Promise<{ base64: string; mimeType: string }> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const MAX_DIM = 2048;
          let width = img.width;
          let height = img.height;
          if (width > MAX_DIM || height > MAX_DIM) {
            if (width > height) {
              height = Math.round((height * MAX_DIM) / width);
              width = MAX_DIM;
            } else {
              width = Math.round((width * MAX_DIM) / height);
              height = MAX_DIM;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressed = canvas.toDataURL('image/jpeg', 0.90);
            resolve({ base64: compressed, mimeType: 'image/jpeg' });
          } else {
            resolve({ base64: e.target?.result as string, mimeType: file.type || 'image/jpeg' });
          }
        };
        img.onerror = () => {
          resolve({ base64: e.target?.result as string, mimeType: file.type || 'image/jpeg' });
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setLoading(true);
      const { base64, mimeType } = await optimizeImageForOCR(file);
      setImagePreview(base64);
      scanReceipt(base64, mimeType);
    } catch (err: any) {
      setError(err?.message || 'Eroare la procesarea imaginii');
      setLoading(false);
    }
    e.target.value = '';
  };

  const scanReceipt = async (base64: string, mimeType: string, overrideKey?: string) => {
    setLoading(true);
    setError(null);
    try {
      const activeKey = overrideKey || apiKey || localStorage.getItem('housevault_gemini_key') || '';
      const res = await fetch('/api/ai/scan-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64, mimeType, customApiKey: activeKey })
      });
      const data = await res.json();
      if (data.success && data.result) {
        const r = data.result;
        setMerchant(r.merchantName || 'Supermarket România');
        if (r.suggestedCategory) setCategory(r.suggestedCategory);
        if (r.date) setDate(r.date);
        if (Array.isArray(r.itemizedList) && r.itemizedList.length > 0) {
          setItemizedList(r.itemizedList);
        } else if (Array.isArray(r.items) && r.items.length > 0) {
          const splitAmount = Math.round(((Number(r.totalAmount) || 100) / r.items.length) * 100) / 100;
          setItemizedList(r.items.map((name: string) => ({ name, price: splitAmount })));
        } else {
          setItemizedList([{ name: isRo ? 'Cumpărături alimentare' : 'Groceries', price: Number(r.totalAmount) || 100 }]);
        }
        setHasScanned(true);
      } else {
        setError(data.error || (isRo ? 'Nu am putut citi bonul. Te rugăm să verifici cheia Gemini API.' : 'Could not scan receipt. Please check your Gemini API key.'));
        setShowKeyInput(true);
      }
    } catch (err: any) {
      setError(err?.message || (isRo ? 'Eroare la scanarea bonului' : 'Error scanning receipt'));
      setShowKeyInput(true);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateItemPrice = (index: number, newPrice: number) => {
    const updated = [...itemizedList];
    if (updated[index]) {
      updated[index].price = Math.max(0, newPrice);
      setItemizedList(updated);
    }
  };

  const handleUpdateItemName = (index: number, newName: string) => {
    const updated = [...itemizedList];
    if (updated[index]) {
      updated[index].name = newName;
      setItemizedList(updated);
    }
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
      setError(isRo ? 'Suma totală a bonului trebuie să fie mai mare de 0.' : 'Total amount must be greater than 0.');
      return;
    }
    const newExpense: HouseholdExpense = {
      id: 'exp-' + Date.now(),
      title: (merchant.trim() || (isRo ? 'Cumpărături' : 'Groceries')) + ' (' + (isRo ? 'Scanat' : 'Scanned') + ')',
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
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-stone-950 font-bold shadow-lg shadow-emerald-500/20">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">
                  {isRo ? 'Scaner & Defalcare Bon Fiscal' : 'AI Receipt Scanner & Breakdown'}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold">
                  Camera + Galerie
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                {isRo ? 'Citește fiecare produs din bon și scade automat din cont' : 'Extracts itemized products & deducts from your live cash'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-white p-1 text-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* API Key Banner / Settings */}
        <div className="p-3 rounded-2xl bg-stone-850 border border-stone-750 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Key className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-white">Motor AI Vision (Google Gemini)</span>
            </div>
            <button
              type="button"
              onClick={() => setShowKeyInput(!showKeyInput)}
              className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold cursor-pointer underline"
            >
              {apiKey ? (showKeyInput ? 'Ascunde Cheia' : 'Modifică Cheia API') : '🔑 Introdu Cheia API'}
            </button>
          </div>

          {showKeyInput && (
            <div className="space-y-2 pt-1">
              <p className="text-stone-300 text-[11px]">
                Pentru a citi bonul în timp real, introdu cheia ta gratuită din Google AI Studio:
              </p>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="flex-1 px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-white font-mono text-xs focus:border-amber-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleSaveApiKey}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs cursor-pointer shadow-md"
                >
                  Salvează Cheia
                </button>
              </div>
              <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1">
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:underline flex items-center gap-1"
                >
                  <span>Generează cheie gratuită pe Google AI Studio</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                {keySavedMessage && <span className="text-emerald-400 font-bold">✅ Cheie salvată cu succes!</span>}
              </div>
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold block">Eroare OCR:</span>
              <p className="text-[11px] leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        {/* Upload State */}
        {!imagePreview ? (
          <div className="space-y-4">
            <div className="text-center">
              <span className="text-xs font-bold text-stone-200">
                {isRo ? 'Alege cum dorești să încarci bonul:' : 'Choose how to upload your receipt:'}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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
                  <p className="text-sm font-bold text-white group-hover:text-emerald-300">
                    📸 {isRo ? 'Fă Poză cu Camera' : 'Take Photo with Camera'}
                  </p>
                  <p className="text-[11px] text-stone-400 mt-1">
                    {isRo ? 'Deschide camera telefonului în timp real' : 'Opens live phone camera'}
                  </p>
                </div>
              </label>

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
                  <p className="text-sm font-bold text-white group-hover:text-cyan-300">
                    🖼️ {isRo ? 'Alege din Galerie / Poze' : 'Choose from Gallery / Photos'}
                  </p>
                  <p className="text-[11px] text-stone-400 mt-1">
                    {isRo ? 'Screenshots bon, poze salvate sau fișiere' : 'Receipt screenshots & saved images'}
                  </p>
                </div>
              </label>
            </div>
            <div className="text-center pt-1">
              <span className="text-[11px] text-stone-400">
                {isRo
                  ? 'Suportă bonuri de la Auchan, Lidl, Kaufland, Carrefour, Mega Image, Penny, Profi etc.'
                  : 'Supports receipts from Auchan, Lidl, Kaufland, Carrefour, Mega Image, Penny, gas stations & bills'}
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Image Preview Thumbnail */}
            <div className="relative rounded-2xl overflow-hidden bg-stone-950 border border-stone-800 max-h-44 flex items-center justify-center">
              <img src={imagePreview} alt="Receipt preview" className="object-contain max-h-44 w-full opacity-85" />
              <div className="absolute right-2 bottom-2 flex items-center gap-1.5 bg-stone-900/95 backdrop-blur-md p-1.5 rounded-2xl border border-stone-750 shadow-xl">
                <label
                  htmlFor="retake-camera-input"
                  className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition"
                >
                  <input id="retake-camera-input" type="file" accept="image/*" capture="environment" onChange={handleFileChange} className="hidden" />
                  <Camera className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isRo ? 'Camera' : 'Camera'}</span>
                </label>
                <label
                  htmlFor="retake-gallery-input"
                  className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition"
                >
                  <input id="retake-gallery-input" type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/*" onChange={handleFileChange} className="hidden" />
                  <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{isRo ? 'Galerie' : 'Gallery'}</span>
                </label>
              </div>
            </div>

            {loading && (
              <div className="p-6 rounded-2xl bg-stone-850 border border-stone-750 flex flex-col items-center justify-center space-y-3">
                <RefreshCw className="w-8 h-8 text-amber-400 animate-spin" />
                <p className="text-sm font-bold text-white">
                  {isRo ? 'AI Vision analizează fiecare rând de pe bon...' : 'AI Vision analyzing receipt lines...'}
                </p>
                <p className="text-xs text-stone-400">
                  {isRo ? 'Identificăm magazinul, produsele și prețurile exacte' : 'Extracting store, items, quantities and prices'}
                </p>
              </div>
            )}

            {!loading && (
              <div className="space-y-4">
                {/* Store Name & Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">
                      {isRo ? 'Comerciant / Magazin' : 'Merchant / Store'}
                    </label>
                    <input
                      type="text"
                      value={merchant}
                      onChange={(e) => setMerchant(e.target.value)}
                      placeholder="Auchan, Lidl, Kaufland..."
                      className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-white text-xs font-bold focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">
                      {isRo ? 'Data Cumpărăturii' : 'Purchase Date'}
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-white text-xs focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Itemized Products List */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider">
                      {isRo ? `Produse Recunoscute (${itemizedList.length}):` : `Scanned Products (${itemizedList.length}):`}
                    </label>
                    <span className="text-xs text-stone-400 font-mono">
                      Total: <strong className="text-emerald-400 text-sm">{totalAmount.toFixed(2)} {currencySymbol}</strong>
                    </span>
                  </div>

                  <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                    {itemizedList.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-stone-800/90 border border-stone-750">
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => handleUpdateItemName(idx, e.target.value)}
                          className="flex-1 bg-transparent text-white text-xs font-medium focus:outline-none focus:text-amber-300"
                        />
                        <div className="flex items-center gap-1 shrink-0">
                          <input
                            type="number"
                            step="0.01"
                            value={item.price}
                            onChange={(e) => handleUpdateItemPrice(idx, parseFloat(e.target.value) || 0)}
                            className="w-20 px-2 py-1 rounded-lg bg-stone-900 border border-stone-700 text-right text-emerald-300 font-mono font-bold text-xs focus:border-emerald-500 focus:outline-none"
                          />
                          <span className="text-xs text-stone-400">{currencySymbol}</span>
                          <button
                            type="button"
                            onClick={() => handleDeleteItem(idx)}
                            className="p-1 text-stone-400 hover:text-rose-400 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {itemizedList.length === 0 && (
                      <div className="p-4 text-center text-stone-400 text-xs bg-stone-800/40 rounded-xl border border-stone-800">
                        Nu au fost detectate produse. Adaugă manual sau reîncearcă scanarea.
                      </div>
                    )}
                  </div>

                  {/* Add New Custom Item Input */}
                  <div className="flex gap-2 pt-1">
                    <input
                      type="text"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      placeholder="+ Nume produs..."
                      className="flex-1 px-3 py-1.5 rounded-xl bg-stone-800 border border-stone-700 text-white text-xs focus:outline-none"
                    />
                    <input
                      type="number"
                      step="0.01"
                      value={newItemPrice}
                      onChange={(e) => setNewItemPrice(e.target.value)}
                      placeholder="Preț..."
                      className="w-20 px-2 py-1.5 rounded-xl bg-stone-800 border border-stone-700 text-white font-mono text-xs focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddNewItem}
                      className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-750 text-emerald-400 border border-emerald-500/30 text-xs font-bold cursor-pointer"
                    >
                      + Adaugă
                    </button>
                  </div>
                </div>

                {/* Assigned Payer Selector */}
                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1.5">
                    {isRo ? 'Din ce cont scazi banii pentru acest bon?' : 'Which account pays for this receipt?'}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setAssignedPayer('WIFE_SALARY')}
                      className={`p-2.5 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                        assignedPayer === 'WIFE_SALARY'
                          ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-md'
                          : 'bg-stone-800/80 border-stone-700/60 text-stone-300 hover:border-stone-500'
                      }`}
                    >
                      <span className="text-xs font-bold">💳 Salariu {wifeShort}</span>
                      <span className="text-[10px] font-mono text-emerald-300 mt-0.5">
                        Sold: {wifeBal.toFixed(2)} {currencySymbol}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAssignedPayer('WIFE_MEAL_TICKETS')}
                      className={`p-2.5 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                        assignedPayer === 'WIFE_MEAL_TICKETS'
                          ? 'bg-lime-500/20 border-lime-500 text-white shadow-md'
                          : 'bg-stone-800/80 border-stone-700/60 text-stone-300 hover:border-stone-500'
                      }`}
                    >
                      <span className="text-xs font-bold">🥗 Bonuri Masă (Edenred)</span>
                      <span className="text-[10px] font-mono text-lime-300 mt-0.5">
                        Sold: {wifeTicketsBal.toFixed(2)} {currencySymbol}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAssignedPayer('FREELANCE_BUFFER')}
                      className={`p-2.5 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                        assignedPayer === 'FREELANCE_BUFFER'
                          ? 'bg-amber-500/20 border-amber-500 text-white shadow-md'
                          : 'bg-stone-800/80 border-stone-700/60 text-stone-300 hover:border-stone-500'
                      }`}
                    >
                      <span className="text-xs font-bold">💼 Buffer Freelance</span>
                      <span className="text-[10px] font-mono text-amber-300 mt-0.5">
                        Sold: {husbandBal.toFixed(2)} {currencySymbol}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAssignedPayer('SHARED_POOL')}
                      className={`p-2.5 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                        assignedPayer === 'SHARED_POOL'
                          ? 'bg-cyan-500/20 border-cyan-500 text-white shadow-md'
                          : 'bg-stone-800/80 border-stone-700/60 text-stone-300 hover:border-stone-500'
                      }`}
                    >
                      <span className="text-xs font-bold">🏡 Fond Comun Familie</span>
                      <span className="text-[10px] font-mono text-cyan-300 mt-0.5">
                        Sold: {sharedBal.toFixed(2)} {currencySymbol}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Live Balance Deduction Preview */}
                <div className="p-3 bg-stone-950 rounded-2xl border border-stone-800 text-xs space-y-1">
                  <div className="flex justify-between text-stone-400">
                    <span>Sold în contul ales:</span>
                    <span className="font-mono font-bold text-white">{selectedPayerBalance.toFixed(2)} {currencySymbol}</span>
                  </div>
                  <div className="flex justify-between text-rose-400 font-bold">
                    <span>Total bon scanat:</span>
                    <span className="font-mono">-{totalAmount.toFixed(2)} {currencySymbol}</span>
                  </div>
                  <div className="flex justify-between font-bold pt-1 border-t border-stone-800">
                    <span className="text-stone-300">Sold rămas după bon:</span>
                    <span className={`font-mono ${remainingBalanceAfterBill < 0 ? 'text-amber-400 font-bold' : 'text-emerald-400'}`}>
                      {remainingBalanceAfterBill.toFixed(2)} {currencySymbol}
                    </span>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setImagePreview(null)}
                    className="flex-1 py-3 rounded-2xl bg-stone-800 hover:bg-stone-750 text-stone-300 font-bold text-xs cursor-pointer"
                  >
                    Rescanează Alt Bon
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveExpense}
                    disabled={totalAmount <= 0}
                    className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-stone-950 font-black text-xs shadow-lg shadow-emerald-500/20 active:scale-98 transition-all cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Înregistrează Bonul ({totalAmount.toFixed(2)} {currencySymbol})</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
