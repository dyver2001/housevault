import React, { useState } from 'react';
import { Camera, Calculator, Plus, Trash2, CheckCircle2, TrendingUp, ShieldAlert, X } from 'lucide-react';
import { GearItem } from '../types';

interface GearTaxToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currencySymbol?: string;
  lang?: string;
}

export const GearTaxToolsModal: React.FC<GearTaxToolsModalProps> = ({
  isOpen,
  onClose,
  currencySymbol = 'lei',
  lang = 'ro'
}) => {
  const [activeTab, setActiveTab] = useState<'GEAR' | 'TAX'>('GEAR');

  // Gear State
  const [gearList, setGearList] = useState<GearItem[]>([
    {
      id: 'g-1',
      name: 'Sony FX3 Cinema Camera + Cage',
      cost: 18500,
      purchasedDate: '2025-05-10',
      feePerShoot: 1200,
      shootsCompleted: 14,
      notes: 'Camera principală reclame & evenimente'
    },
    {
      id: 'g-2',
      name: 'DJI Mavic 3 Pro Cine Drone',
      cost: 9500,
      purchasedDate: '2025-08-15',
      feePerShoot: 800,
      shootsCompleted: 12,
      notes: 'Cadre aeriene 4K 10-bit'
    },
    {
      id: 'g-3',
      name: 'Sony GM 24-70mm f/2.8 II Lens',
      cost: 11000,
      purchasedDate: '2025-11-01',
      feePerShoot: 600,
      shootsCompleted: 18,
      notes: 'Obiectivul universal de bază'
    }
  ]);

  const [newGearName, setNewGearName] = useState('');
  const [newGearCost, setNewGearCost] = useState('');
  const [newGearFee, setNewGearFee] = useState('');

  // Tax Calculator State (Romania PFA / SRL)
  const [annualRevenue, setAnnualRevenue] = useState(144000); // e.g. 12,000 lei/mo * 12
  const [annualExpenses, setAnnualExpenses] = useState(25000);
  const [taxStructure, setTaxStructure] = useState<'SRL_MICRO_1' | 'PFA_REAL'>('SRL_MICRO_1');

  if (!isOpen) return null;

  const handleAddGear = (e: React.FormEvent) => {
    e.preventDefault();
    const cost = parseFloat(newGearCost);
    const fee = parseFloat(newGearFee) || 500;
    if (!newGearName.trim() || isNaN(cost) || cost <= 0) return;

    const item: GearItem = {
      id: `gear-${Date.now()}`,
      name: newGearName.trim(),
      cost: cost,
      purchasedDate: new Date().toISOString().split('T')[0],
      feePerShoot: fee,
      shootsCompleted: 0
    };

    setGearList([item, ...gearList]);
    setNewGearName('');
    setNewGearCost('');
    setNewGearFee('');
  };

  const handleIncrementShoot = (gearId: string) => {
    setGearList(
      gearList.map((g) => (g.id === gearId ? { ...g, shootsCompleted: g.shootsCompleted + 1 } : g))
    );
  };

  const handleDeleteGear = (gearId: string) => {
    setGearList(gearList.filter((g) => g.id !== gearId));
  };

  // Romanian Tax Calculations (2026 Brackets: Salariul Minim Brut = 3700 lei)
  const minWage = 3700;
  const casCap24 = 24 * minWage; // 88,800
  const casTax = 0.25 * casCap24; // 22,200 max CAS
  const cassTax = 0.10 * Math.min(annualRevenue - annualExpenses, 60 * minWage); // CASS 10%

  let estimatedAnnualTax = 0;
  let taxDescription = '';

  if (taxStructure === 'SRL_MICRO_1') {
    // 1% micro tax on revenue + 8% dividend tax on profit after corporate tax
    const microTax = annualRevenue * 0.01;
    const grossProfit = annualRevenue - annualExpenses - microTax;
    const dividendTax = grossProfit * 0.08;
    estimatedAnnualTax = microTax + dividendTax;
    taxDescription = 'SRL Micro (1% pe venit + 8% impozit pe dividende)';
  } else {
    // PFA Sistem Real (10% impozit venit net + CAS + CASS)
    const netIncome = Math.max(0, annualRevenue - annualExpenses);
    const incomeTax = (netIncome - casTax - cassTax) * 0.10;
    estimatedAnnualTax = incomeTax + casTax + cassTax;
    taxDescription = 'PFA Sistem Real (10% impozit venit + CAS 25% + CASS 10%)';
  }

  const monthlyTaxReserve = Math.round(estimatedAnnualTax / 12);
  const taxPercentage = Math.round((estimatedAnnualTax / (annualRevenue || 1)) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-stone-900 border border-stone-700 rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-rose-500 flex items-center justify-center text-stone-950 font-black shadow-lg shadow-amber-500/20">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black font-display text-white">
                {lang === 'ro' ? 'Haytham Pro • Gear ROI & Calculator Taxe' : 'Videography Gear ROI & Tax Buffer'}
              </h2>
              <p className="text-xs text-stone-400">Video Equipment Payback & Romanian Tax Optimization</p>
            </div>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-white p-1 text-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-stone-850 p-1 rounded-xl border border-stone-750">
          <button
            type="button"
            onClick={() => setActiveTab('GEAR')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'GEAR' ? 'bg-amber-500 text-stone-950 shadow' : 'text-stone-400 hover:text-white'
            }`}
          >
            🎥 {lang === 'ro' ? 'Amortizare Echipamente (Gear ROI)' : 'Gear ROI Tracker'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('TAX')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'TAX' ? 'bg-emerald-500 text-stone-950 shadow' : 'text-stone-400 hover:text-white'
            }`}
          >
            🏛️ {lang === 'ro' ? 'Calculator Taxe PFA / SRL (15% Buffer)' : 'Romania Tax Estimator'}
          </button>
        </div>

        {/* TAB 1: GEAR ROI TRACKER */}
        {activeTab === 'GEAR' && (
          <div className="space-y-4">
            {/* Add Gear Form */}
            <form onSubmit={handleAddGear} className="bg-stone-850 p-3.5 rounded-2xl border border-stone-750 space-y-3">
              <span className="text-xs font-bold text-amber-400 block">
                ➕ {lang === 'ro' ? 'Adaugă Echipament Nou (Cameră, Obiectiv, Dronă):' : 'Add New Video Gear:'}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <input
                  type="text"
                  placeholder="ex: Sony A7SIII sau Gimbal RS3"
                  value={newGearName}
                  onChange={(e) => setNewGearName(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white focus:outline-none focus:border-amber-500"
                  required
                />
                <input
                  type="number"
                  placeholder={`Preț Achiziție (${currencySymbol})`}
                  value={newGearCost}
                  onChange={(e) => setNewGearCost(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white focus:outline-none focus:border-amber-500"
                  required
                />
                <div className="flex space-x-1.5">
                  <input
                    type="number"
                    placeholder={`Tarif/Film (${currencySymbol})`}
                    value={newGearFee}
                    onChange={(e) => setNewGearFee(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow transition cursor-pointer"
                  >
                    Adaugă
                  </button>
                </div>
              </div>
            </form>

            {/* Gear List with Payoff Progress */}
            <div className="space-y-3">
              {gearList.map((gear) => {
                const totalEarned = gear.shootsCompleted * gear.feePerShoot;
                const shootsNeeded = Math.ceil(gear.cost / (gear.feePerShoot || 1));
                const percent = Math.min(100, Math.round((totalEarned / (gear.cost || 1)) * 100));
                const isPaidOff = totalEarned >= gear.cost;
                const profitGenerated = Math.max(0, totalEarned - gear.cost);

                return (
                  <div
                    key={gear.id}
                    className={`p-4 rounded-2xl border space-y-2.5 ${
                      isPaidOff ? 'bg-emerald-950/20 border-emerald-500/40' : 'bg-stone-850 border-stone-750'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-white block">{gear.name}</span>
                        <span className="text-[11px] text-stone-400">
                          Cost: {gear.cost.toLocaleString()} {currencySymbol} • Tarif alocat: {gear.feePerShoot} {currencySymbol}/filmare
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {isPaidOff ? (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                            ✅ AMORTIZAT (+{profitGenerated.toLocaleString()} {currencySymbol} Profit)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold">
                            {gear.shootsCompleted} / {shootsNeeded} Filmări
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteGear(gear.id)}
                          className="text-stone-500 hover:text-rose-400 text-xs p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-stone-900 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${isPaidOff ? 'bg-emerald-400' : 'bg-amber-400'}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-[11px] text-stone-400">
                        Încasat din echipament: <strong className="text-white">{totalEarned.toLocaleString()} {currencySymbol}</strong> ({percent}%)
                      </span>
                      <button
                        type="button"
                        onClick={() => handleIncrementShoot(gear.id)}
                        className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-[11px] font-bold border border-stone-700 transition cursor-pointer"
                      >
                        +1 Filmare Finalizată 🎬
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: ROMANIAN TAX ESTIMATOR */}
        {activeTab === 'TAX' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-stone-850 border border-stone-750 space-y-3">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                🏛️ Configurare Venituri & Structură Fiscală (România 2026):
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-stone-400 block mb-1">
                    Încasări Anuale Estimate ({currencySymbol})
                  </label>
                  <input
                    type="number"
                    value={annualRevenue}
                    onChange={(e) => setAnnualRevenue(parseFloat(e.target.value) || 0)}
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-sm text-white font-bold focus:outline-none focus:border-emerald-500"
                  />
                  <span className="text-[10px] text-stone-500">~{Math.round(annualRevenue / 12).toLocaleString()} {currencySymbol}/lună</span>
                </div>

                <div>
                  <label className="text-[11px] text-stone-400 block mb-1">
                    Cheltuieli Deducibile Anuale ({currencySymbol})
                  </label>
                  <input
                    type="number"
                    value={annualExpenses}
                    onChange={(e) => setAnnualExpenses(parseFloat(e.target.value) || 0)}
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-sm text-white font-bold focus:outline-none focus:border-emerald-500"
                  />
                  <span className="text-[10px] text-stone-500">Echipamente, combustibil, software</span>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-stone-400 block mb-1">Formă Juridică</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTaxStructure('SRL_MICRO_1')}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition cursor-pointer text-left ${
                      taxStructure === 'SRL_MICRO_1'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-stone-900 border-stone-750 text-stone-400'
                    }`}
                  >
                    🏢 SRL Micro (1% + 8%)
                    <span className="block text-[10px] font-normal text-stone-400 mt-0.5">Recomandat pentru videografi cu cifră de afaceri peste 80k lei</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTaxStructure('PFA_REAL')}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition cursor-pointer text-left ${
                      taxStructure === 'PFA_REAL'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-stone-900 border-stone-750 text-stone-400'
                    }`}
                  >
                    👤 PFA Sistem Real (10% + CAS/CASS)
                    <span className="block text-[10px] font-normal text-stone-400 mt-0.5">Deducere directă pentru echipamente & investiții</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Calculated Tax Summary Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-stone-850 to-stone-900 border border-emerald-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{taxDescription}</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Cota Reală: {taxPercentage}%
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-xl bg-stone-900/80 border border-stone-800">
                  <span className="text-[11px] text-stone-400 block">Total Taxe Anuale</span>
                  <span className="text-base font-black text-rose-400 font-mono">
                    {estimatedAnnualTax.toLocaleString()} {currencySymbol}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-stone-900/80 border border-stone-800">
                  <span className="text-[11px] text-stone-400 block">Rezervă Lunar Recomandată (15%)</span>
                  <span className="text-base font-black text-emerald-400 font-mono">
                    {monthlyTaxReserve.toLocaleString()} {currencySymbol} / lună
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-stone-400 leading-relaxed pt-1">
                💡 <strong>Sfat HouseVault</strong>: La fiecare factură încasată de Haytham, regula de <strong>15% Tax Reserve</strong> acoperă perfect această sumă fără niciun stres la declarația unică sau bilanț!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
