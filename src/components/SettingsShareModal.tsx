import React, { useState } from 'react';
import {
  Settings,
  Download,
  Upload,
  RefreshCw,
  CheckCircle2,
  Users,
  Percent,
  Smartphone,
  Palette,
  Globe,
  Link,
  Copy,
  Check,
  Radio,
  Unlink,
  RotateCw
} from 'lucide-react';
import { HouseholdProfile, WindfallSplitRule } from '../types';
import { translations, Language } from '../data/i18n';

interface SettingsShareModalProps {
  profile: HouseholdProfile;
  splitRule: WindfallSplitRule;
  onClose: () => void;
  onOpenInstall?: () => void;
  onSaveProfile: (profile: HouseholdProfile) => void;
  onSaveSplitRule: (rule: WindfallSplitRule) => void;
  onExportJson: () => void;
  onImportJson: (jsonStr: string) => void;
  onResetDefaults: () => void;
  // Cloud Sync Props
  syncCode: string | null;
  isSyncConnected: boolean;
  lastSyncTime: string | null;
  onGenerateSyncCode: () => Promise<void>;
  onJoinSyncCode: (code: string) => Promise<boolean>;
  onDisconnectSync: () => void;
  onManualSync: () => Promise<void>;
}

export const SettingsShareModal: React.FC<SettingsShareModalProps> = ({
  profile,
  splitRule,
  onClose,
  onOpenInstall,
  onSaveProfile,
  onSaveSplitRule,
  onExportJson,
  onImportJson,
  onResetDefaults,
  syncCode,
  isSyncConnected,
  lastSyncTime,
  onGenerateSyncCode,
  onJoinSyncCode,
  onDisconnectSync,
  onManualSync
}) => {
  const [profileForm, setProfileForm] = useState<HouseholdProfile>({
    ...profile,
    language: profile.language || 'ro',
    themePreset: profile.themePreset || 'emerald',
    themeMode: profile.themeMode || 'dark'
  });
  const [splitForm, setSplitForm] = useState<WindfallSplitRule>({ ...splitRule });
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [joinCodeInput, setJoinCodeInput] = useState<string>('');
  const [syncLoading, setSyncLoading] = useState<boolean>(false);
  const [codeCopied, setCodeCopied] = useState<boolean>(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const lang: Language = (profileForm.language as Language) || 'ro';
  const t = translations[lang] || translations.ro;

  const colorThemes = [
    { id: 'emerald', label: 'Emerald Forest', color: '#10b981', border: 'border-emerald-500' },
    { id: 'amber', label: 'Amber Gold', color: '#f59e0b', border: 'border-amber-500' },
    { id: 'cyan', label: 'Sapphire Cyan', color: '#06b6d4', border: 'border-cyan-500' },
    { id: 'rose', label: 'Ruby Rose', color: '#f43f5e', border: 'border-rose-500' },
    { id: 'purple', label: 'Amethyst Purple', color: '#a855f7', border: 'border-purple-500' },
    { id: 'sunset', label: 'Sunset Orange', color: '#f97316', border: 'border-orange-500' },
    { id: 'obsidian', label: 'Obsidian Black', color: '#090a0f', border: 'border-stone-500' }
  ];

  const quickCurrencies = [
    { code: 'RON', symbol: 'lei', label: 'RON (lei) 🇷🇴' },
    { code: 'EUR', symbol: '€', label: 'EUR (€) 🇪🇺' },
    { code: 'USD', symbol: '$', label: 'USD ($) 🇺🇸' },
    { code: 'GBP', symbol: '£', label: 'GBP (£) 🇬🇧' }
  ];

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(profileForm);
    onSaveSplitRule(splitForm);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleCopyCode = () => {
    if (!syncCode) return;
    navigator.clipboard.writeText(syncCode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2500);
  };

  const handleCreateRoom = async () => {
    setSyncLoading(true);
    try {
      await onGenerateSyncCode();
      setSyncMessage(lang === 'ro' ? 'Seif Cloud creat cu succes!' : 'Cloud Vault created!');
      setTimeout(() => setSyncMessage(null), 3000);
    } catch (err: any) {
      setSyncMessage(err?.message || 'Error');
    } finally {
      setSyncLoading(false);
    }
  };

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCodeInput.trim()) return;
    setSyncLoading(true);
    try {
      const ok = await onJoinSyncCode(joinCodeInput.trim());
      if (ok) {
        setSyncMessage(lang === 'ro' ? 'Conectat cu succes la Seiful comun!' : 'Connected to shared Vault!');
        setJoinCodeInput('');
      } else {
        setSyncMessage(lang === 'ro' ? 'Cod invalid. Verificați codul introdus.' : 'Invalid code.');
      }
      setTimeout(() => setSyncMessage(null), 3500);
    } finally {
      setSyncLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      if (content) {
        onImportJson(content);
        setImportStatus(lang === 'ro' ? 'Date importate cu succes!' : 'Backup loaded successfully!');
        setTimeout(() => setImportStatus(null), 3000);
      }
    };
    reader.readAsText(file);
  };

  const totalSplitPercent =
    splitForm.debtPayoffPercent +
    splitForm.savingsTargetPercent +
    splitForm.businessTaxReservePercent +
    splitForm.safePocketPercent;

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-stone-900 border border-stone-700 rounded-3xl max-w-2xl w-full p-6 sm:p-7 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black font-display text-white">{t.settings.title}</h2>
              <p className="text-xs text-stone-400">{t.settings.subtitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-white text-lg p-1 cursor-pointer">
            ✕
          </button>
        </div>

        {/* --- SECTION 1: REAL-TIME COUPLE CLOUD SYNC --- */}
        <div className="space-y-3 bg-gradient-to-br from-emerald-950/40 via-stone-850 to-cyan-950/30 p-4 sm:p-5 rounded-2xl border border-emerald-500/30">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-2">
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>{lang === 'ro' ? 'Sincronizare Live în Cuplu (Cloud Sync)' : 'Real-Time Couple Cloud Sync'}</span>
            </h3>
            {syncCode ? (
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>{lang === 'ro' ? 'Conectat' : 'Active'}</span>
              </span>
            ) : (
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-stone-800 text-stone-400 border border-stone-700">
                {lang === 'ro' ? 'Mod Local (Offline)' : 'Offline Local Mode'}
              </span>
            )}
          </div>

          <p className="text-xs text-stone-300 leading-relaxed">
            {lang === 'ro'
              ? 'Conectați telefonul lui Alex cu al Elenei. Orice proiect încasat, plată de datorie sau depunere la seif se actualizează instant pe ambele telefoane în timp real.'
              : 'Sync Alex and Elena in real time. Invoices, debt payments, and house vault deposits appear instantly on both devices without manual file exports.'}
          </p>

          {syncCode ? (
            /* Active Sync Room Card */
            <div className="bg-stone-900/90 border border-emerald-500/30 rounded-xl p-3.5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[11px] text-stone-400 block">{lang === 'ro' ? 'Cod Seif Cuplu Activ:' : 'Active Shared Vault Code:'}</span>
                  <span className="text-lg font-mono font-black text-emerald-400 tracking-wider">{syncCode}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-750 border border-stone-700 text-stone-200 text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
                  >
                    {codeCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-stone-400" />}
                    <span>{codeCopied ? (lang === 'ro' ? 'Copiat!' : 'Copied!') : (lang === 'ro' ? 'Copiază Codul' : 'Copy Code')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={onManualSync}
                    disabled={syncLoading}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
                  >
                    <RotateCw className={`w-3.5 h-3.5 ${syncLoading ? 'animate-spin' : ''}`} />
                    <span>{lang === 'ro' ? 'Sincronizează' : 'Sync Now'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(lang === 'ro' ? 'Vreți să deconectați sincronizarea de pe acest dispozitiv?' : 'Disconnect cloud sync on this device?')) {
                        onDisconnectSync();
                      }
                    }}
                    className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/40 border border-rose-500/20 transition cursor-pointer"
                    title={lang === 'ro' ? 'Deconectează Seiful' : 'Disconnect'}
                  >
                    <Unlink className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {lastSyncTime && (
                <p className="text-[11px] text-stone-400">
                  {lang === 'ro' ? `Ultima sincronizare: ${new Date(lastSyncTime).toLocaleTimeString()}` : `Last synced: ${new Date(lastSyncTime).toLocaleTimeString()}`}
                </p>
              )}
            </div>
          ) : (
            /* Pair with Partner Form */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="bg-stone-900/80 p-3.5 rounded-xl border border-stone-700/80 flex flex-col justify-between space-y-2.5">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center space-x-1.5">
                    <Link className="w-3.5 h-3.5 text-amber-400" />
                    <span>{lang === 'ro' ? 'Opțiunea 1: Creează Seif Nou' : 'Option 1: Create Shared Vault'}</span>
                  </h4>
                  <p className="text-[11px] text-stone-400 mt-1">
                    {lang === 'ro' ? 'Generează un cod securizat pentru voi doi și partajează-l pe WhatsApp.' : 'Generate a secure code for both of you and share it with your partner.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCreateRoom}
                  disabled={syncLoading}
                  className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow transition cursor-pointer"
                >
                  {syncLoading ? '...' : (lang === 'ro' ? 'Generează Cod Seif Cuplu' : 'Create Vault Room')}
                </button>
              </div>

              <form onSubmit={handleJoinRoom} className="bg-stone-900/80 p-3.5 rounded-xl border border-stone-700/80 flex flex-col justify-between space-y-2.5">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center space-x-1.5">
                    <Radio className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{lang === 'ro' ? 'Opțiunea 2: Conectare la Cod' : 'Option 2: Join Partner Vault'}</span>
                  </h4>
                  <p className="text-[11px] text-stone-400 mt-1">
                    {lang === 'ro' ? 'Introduceți codul primit de la soț/soție (ex: HV-8821):' : 'Enter the sync code received from your partner:'}
                  </p>
                </div>

                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="ex: HV-8821"
                    value={joinCodeInput}
                    onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                    className="flex-1 px-3 py-1.5 rounded-xl bg-stone-950 border border-stone-700 text-white font-mono text-xs focus:border-cyan-500 focus:outline-none uppercase"
                  />
                  <button
                    type="submit"
                    disabled={syncLoading || !joinCodeInput.trim()}
                    className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-stone-950 font-bold text-xs shadow transition cursor-pointer"
                  >
                    {syncLoading ? '...' : (lang === 'ro' ? 'Conectează' : 'Join')}
                  </button>
                </div>
              </form>
            </div>
          )}

          {syncMessage && (
            <p className="text-xs text-amber-300 font-semibold bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
              {syncMessage}
            </p>
          )}
        </div>

        <form onSubmit={handleSaveAll} className="space-y-6">
          {/* Section: Language & Currency Freedom */}
          <div className="space-y-3 bg-stone-850 p-4 rounded-2xl border border-stone-700/60">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-1.5">
              <Globe className="w-4 h-4" />
              <span>{t.settings.language} & {t.settings.currency}</span>
            </h3>

            <div className="space-y-3">
              {/* Language Selection */}
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">{t.settings.language}</label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setProfileForm({ ...profileForm, language: 'ro' })}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer ${
                      profileForm.language === 'ro'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-sm'
                        : 'bg-stone-900 border-stone-700 text-stone-400 hover:text-white'
                    }`}
                  >
                    <span>🇷🇴 Română (România)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setProfileForm({ ...profileForm, language: 'en' })}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer ${
                      profileForm.language === 'en'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-sm'
                        : 'bg-stone-900 border-stone-700 text-stone-400 hover:text-white'
                    }`}
                  >
                    <span>🇬🇧 English (Global)</span>
                  </button>
                </div>
              </div>

              {/* Currency Quick Buttons */}
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">{t.settings.currency}</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {quickCurrencies.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => setProfileForm({ ...profileForm, currencyCode: c.code, currencySymbol: c.symbol })}
                      className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer ${
                        profileForm.currencyCode === c.code
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-sm'
                          : 'bg-stone-900 border-stone-700 text-stone-400 hover:text-white'
                      }`}
                    >
                      <span>{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section: Color Theme Freedom */}
          <div className="space-y-3 bg-stone-850 p-4 rounded-2xl border border-stone-700/60">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center space-x-1.5">
              <Palette className="w-4 h-4" />
              <span>{t.settings.themePalette}</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {colorThemes.map((theme) => {
                const isSelected = (profileForm.themePreset || 'emerald') === theme.id;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => setProfileForm({ ...profileForm, themePreset: theme.id as any })}
                    className={`p-2.5 rounded-xl border text-left transition flex items-center space-x-2.5 cursor-pointer ${
                      isSelected
                        ? `${theme.border} bg-stone-800 shadow-sm`
                        : 'border-stone-700/70 bg-stone-900 hover:bg-stone-800'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full shrink-0 border border-stone-700"
                      style={{ backgroundColor: theme.color }}
                    />
                    <span className={`text-xs font-semibold ${isSelected ? 'text-white font-bold' : 'text-stone-300'}`}>
                      {theme.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: Couple Details */}
          <div className="space-y-3 bg-stone-850 p-4 rounded-2xl border border-stone-700/60">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
              <Users className="w-4 h-4" />
              <span>{t.settings.coupleProfile}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  {lang === 'ro' ? 'Nume Soț / Freelancer' : 'Freelancer Name / Job'}
                </label>
                <input
                  type="text"
                  value={profileForm.husbandName}
                  onChange={(e) => setProfileForm({ ...profileForm, husbandName: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-white text-xs focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  {lang === 'ro' ? 'Nume Soție / Salariu Stabil' : 'Steady Salary Partner Name'}
                </label>
                <input
                  type="text"
                  value={profileForm.wifeName}
                  onChange={(e) => setProfileForm({ ...profileForm, wifeName: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-white text-xs focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  {lang === 'ro' ? `Salariu Fix Lunar Soție (${profileForm.currencySymbol})` : `Wife Monthly Net Salary (${profileForm.currencySymbol})`}
                </label>
                <input
                  type="number"
                  step="any"
                  value={profileForm.wifeMonthlySalary}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, wifeMonthlySalary: parseFloat(e.target.value) || 0 })
                  }
                  required
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-white text-xs focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  {lang === 'ro' ? `Încasări Estimate Freelance Soț (${profileForm.currencySymbol})` : `Husband Est. Monthly Gross (${profileForm.currencySymbol})`}
                </label>
                <input
                  type="number"
                  step="any"
                  value={profileForm.husbandEstMonthlyGross}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, husbandEstMonthlyGross: parseFloat(e.target.value) || 0 })
                  }
                  required
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-amber-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section: Windfall Split Customizer */}
          <div className="space-y-3 bg-stone-850 p-4 rounded-2xl border border-stone-700/60">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Percent className="w-4 h-4" />
                <span>{t.settings.windfallSplit}</span>
              </h3>
              <span className={`text-xs font-bold ${totalSplitPercent === 100 ? 'text-emerald-400' : 'text-rose-400'}`}>
                Total: {totalSplitPercent}% {totalSplitPercent !== 100 && '(Trebuie să fie 100%)'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] text-stone-300 mb-1">
                  {lang === 'ro' ? 'Achitare Datorii %' : 'Debt Payoff %'}
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={splitForm.debtPayoffPercent}
                  onChange={(e) =>
                    setSplitForm({ ...splitForm, debtPayoffPercent: parseInt(e.target.value, 10) || 0 })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-rose-500/30 text-white text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] text-stone-300 mb-1">
                  {lang === 'ro' ? 'Seifuri Casă %' : 'House Savings %'}
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={splitForm.savingsTargetPercent}
                  onChange={(e) =>
                    setSplitForm({ ...splitForm, savingsTargetPercent: parseInt(e.target.value, 10) || 0 })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-cyan-500/30 text-white text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] text-stone-300 mb-1">
                  {lang === 'ro' ? 'Taxe & Gear %' : 'Tax & Gear %'}
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={splitForm.businessTaxReservePercent}
                  onChange={(e) =>
                    setSplitForm({ ...splitForm, businessTaxReservePercent: parseInt(e.target.value, 10) || 0 })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-amber-500/30 text-white text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] text-stone-300 mb-1">
                  {lang === 'ro' ? 'Bani Buzunar %' : 'Safe Pocket %'}
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={splitForm.safePocketPercent}
                  onChange={(e) =>
                    setSplitForm({ ...splitForm, safePocketPercent: parseInt(e.target.value, 10) || 0 })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-emerald-500/30 text-white text-xs focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            {saveSuccess && (
              <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>{lang === 'ro' ? 'Setări salvate!' : 'Profile updated!'}</span>
              </span>
            )}
            <button
              type="submit"
              disabled={totalSplitPercent !== 100}
              className="ml-auto px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-stone-950 font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              {t.actions.save}
            </button>
          </div>
        </form>

        {/* Section: Data Backup & Reset */}
        <div className="pt-4 border-t border-stone-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
              {t.settings.dataPortability}
            </h3>
            {onOpenInstall && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenInstall();
                }}
                className="px-3 py-1 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center space-x-1.5 cursor-pointer"
              >
                <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.actions.getOnPhone}</span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onExportJson}
              className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-200 border border-stone-700 text-xs font-semibold flex items-center space-x-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>{t.actions.exportJson}</span>
            </button>

            <label className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-200 border border-stone-700 text-xs font-semibold flex items-center space-x-2 cursor-pointer">
              <Upload className="w-4 h-4 text-cyan-400" />
              <span>{t.actions.importJson}</span>
              <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
            </label>

            <button
              type="button"
              onClick={() => {
                if (window.confirm(lang === 'ro' ? 'Resetați toate datele la valorile implicite în RON?' : 'Reset all records to default sample data?')) {
                  onResetDefaults();
                  onClose();
                }
              }}
              className="px-3.5 py-2 rounded-xl bg-stone-850 hover:bg-rose-950 text-rose-300 border border-rose-500/20 text-xs font-semibold flex items-center space-x-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-rose-400" />
              <span>{t.actions.resetDefaults}</span>
            </button>
          </div>

          {importStatus && (
            <p className="text-xs text-emerald-400 font-semibold">{importStatus}</p>
          )}
        </div>
      </div>
    </div>
  );
};
