import React, { useState, useRef } from 'react';
import { Camera, Upload, Sparkles, Check, AlertCircle, RefreshCw, X, Receipt } from 'lucide-react';
import { ExpenseCategory, HouseholdExpense } from '../types';

interface ReceiptScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddExpense: (expense: HouseholdExpense) => void;
  currencySymbol?: string;
  lang?: string;
}

export const ReceiptScannerModal: React.FC<ReceiptScannerModalProps> = ({
  isOpen,
  onClose,
  onAddExpense,
  currencySymbol = 'lei',
  lang = 'ro'
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Parsed fields
  const [merchant, setMerchant] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('GROCERIES');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [hasScanned, setHasScanned] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

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
        setMerchant(data.result.merchantName || 'Magazin Scanat');
        setAmount(String(data.result.totalAmount || 0));
        if (data.result.suggestedCategory) setCategory(data.result.suggestedCategory);
        if (data.result.date) setDate(data.result.date);
        setHasScanned(true);
      } else {
        setError(data.error || 'Nu am putut citi bonul.');
      }
    } catch (err: any) {
      setError(err?.message || 'Eroare la scanare');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveExpense = () => {
    const parsedAmount = parseFloat(amount);
    if (!merchant.trim() || isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Introduceți un comerciant și o sumă validă.');
      return;
    }

    const newExpense: HouseholdExpense = {
      id: `exp-${Date.now()}`,
      title: `${merchant.trim()} (Scanat)`,
      amount: parsedAmount,
      category: category,
      isFixed: false,
      assignedPayer: 'WIFE_SALARY'
    };

    onAddExpense(newExpense);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-stone-900 border border-stone-700 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-stone-950 font-black shadow-lg shadow-cyan-500/20">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black font-display text-white">
                {lang === 'ro' ? 'Scaner Inteligent Bonuri & Facturi' : 'AI Receipt & Invoice Scanner'}
              </h2>
              <p className="text-xs text-stone-400">Powered by Gemini Multimodal Vision</p>
            </div>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-white p-1 text-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload / Camera Drop Area */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />

        {!imagePreview ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-stone-700 hover:border-emerald-500/60 rounded-2xl p-8 flex flex-col items-center justify-center space-y-3 bg-stone-850/50 hover:bg-stone-850 cursor-pointer transition"
          >
            <div className="w-14 h-14 rounded-2xl bg-stone-800 flex items-center justify-center text-emerald-400">
              <Upload className="w-7 h-7" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-white">
                {lang === 'ro' ? 'Fă o poză sau alege un bon' : 'Take a photo or upload receipt'}
              </p>
              <p className="text-xs text-stone-400 mt-1">
                {lang === 'ro' ? 'Lidl, Kaufland, F64, Emag, Benzinărie, Utilități' : 'Supermarket, Gear, Gas, Utilities'}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Image Preview Thumbnail */}
            <div className="relative rounded-2xl overflow-hidden bg-stone-950 border border-stone-800 max-h-48 flex items-center justify-center">
              <img src={imagePreview} alt="Receipt preview" className="object-contain max-h-48 w-full opacity-80" />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute right-3 bottom-3 px-3 py-1.5 rounded-xl bg-stone-900/90 text-white text-xs font-bold border border-stone-700 hover:bg-stone-800 cursor-pointer"
              >
                🔄 {lang === 'ro' ? 'Altă poză' : 'Retake'}
              </button>
            </div>

            {loading && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center space-x-3 text-emerald-300 text-xs animate-pulse">
                <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
                <span>{lang === 'ro' ? 'Gemini AI citește comerciantul, sumele și TVA-ul...' : 'Gemini AI is reading receipt amounts...'}</span>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Extracted Form Inputs */}
            {hasScanned && (
              <div className="space-y-3 bg-stone-850 p-4 rounded-2xl border border-stone-750">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-400">
                  <Sparkles className="w-4 h-4" />
                  <span>{lang === 'ro' ? 'Date Extrase Automat:' : 'Auto-Extracted Data:'}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-stone-400 block mb-1">
                      {lang === 'ro' ? 'Comerciant / Magazin' : 'Merchant'}
                    </label>
                    <input
                      type="text"
                      value={merchant}
                      onChange={(e) => setMerchant(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-stone-400 block mb-1">
                      {lang === 'ro' ? 'Total Plătit' : 'Total Amount'} ({currencySymbol})
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-sm text-white font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-stone-400 block mb-1">
                      {lang === 'ro' ? 'Categorie Cheltuială' : 'Category'}
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="GROCERIES">Alimente & Supermarket</option>
                      <option value="UTILITIES">Utilități & Facturi</option>
                      <option value="TRANSPORT">Transport & Combustibil</option>
                      <option value="VIDEO_SOFTWARE">Echipament & Software Video</option>
                      <option value="FAMILY_LEISURE">Timp Liber & Ieșiri</option>
                      <option value="HEALTH">Sănătate & Farmacie</option>
                      <option value="HOUSING">Locuință & Întreținere</option>
                      <option value="MISC">Diverse</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-stone-400 block mb-1">Data</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSaveExpense}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition cursor-pointer flex items-center justify-center space-x-2"
                >
                  <Check className="w-4 h-4" />
                  <span>{lang === 'ro' ? 'Salvează în Bugetul Familiei' : 'Save to Household Budget'}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
