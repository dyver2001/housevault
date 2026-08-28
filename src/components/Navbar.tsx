import React from 'react';
import {
  LayoutDashboard,
  Coins,
  Receipt,
  Landmark,
  Vault,
  Sparkles,
  Settings,
  ShieldCheck,
  Smartphone,
  User,
  LogOut
} from 'lucide-react';
import { HouseholdProfile } from '../types';
import { translations, Language } from '../data/i18n';
import { AuthUser } from '../data/authService';

export type TabType =
  | 'dashboard'
  | 'freelance'
  | 'budget'
  | 'debt'
  | 'targets'
  | 'ai';

interface NavbarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  profile: HouseholdProfile;
  onOpenSettings: () => void;
  onOpenInstall: () => void;
  uncollectedCount: number;
  overdueCount: number;
  syncCode?: string | null;
  isSyncConnected?: boolean;
  currentUser?: AuthUser | null;
  onOpenAuth?: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  profile,
  onOpenSettings,
  onOpenInstall,
  uncollectedCount,
  overdueCount,
  syncCode,
  isSyncConnected,
  currentUser,
  onOpenAuth,
  onLogout
}) => {
  const lang: Language = (profile.language as Language) || 'ro';
  const t = translations[lang] || translations.ro;

  const tabs = [
    {
      id: 'dashboard' as TabType,
      label: t.tabs.dashboard,
      icon: LayoutDashboard,
    },
    {
      id: 'freelance' as TabType,
      label: t.tabs.freelance,
      icon: Coins,
      badge: uncollectedCount > 0 ? uncollectedCount : undefined,
      badgeAlert: overdueCount > 0
    },
    {
      id: 'budget' as TabType,
      label: t.tabs.budget,
      icon: Receipt,
    },
    {
      id: 'debt' as TabType,
      label: t.tabs.debt,
      icon: Landmark,
    },
    {
      id: 'targets' as TabType,
      label: t.tabs.targets,
      icon: Vault,
    },
    {
      id: 'ai' as TabType,
      label: t.tabs.ai,
      icon: Sparkles,
      highlight: true
    }
  ];

  return (
    <header
      className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-md border-b border-stone-800 transition-all"
      style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 12px)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-1">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo & Couple Tag */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-amber-500/10">
              <ShieldCheck className="w-6 h-6 text-stone-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-display font-extrabold text-xl tracking-tight text-white">HouseVault</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {profile.currencyCode} ({profile.currencySymbol})
                </span>
              </div>
              <p className="text-xs text-stone-400 hidden sm:block">
                {profile.husbandName} & {profile.wifeName}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center space-x-1">
            {tabs.map((t) => {
              const Icon = t.icon;
              const isActive = currentTab === t.id;
              return (
                <button
                  key={t.id}
                  id={`nav-tab-${t.id}`}
                  onClick={() => onSelectTab(t.id)}
                  className={`relative flex items-center space-x-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? t.highlight
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-stone-800 text-white shadow-sm border border-stone-700'
                      : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? (t.highlight ? 'text-amber-400' : 'text-emerald-400') : 'text-stone-400'}`} />
                  <span>{t.label}</span>
                  {t.badge !== undefined && (
                    <span
                      className={`ml-1.5 px-1.5 py-0.5 text-xs font-bold rounded-full ${
                        t.badgeAlert
                          ? 'bg-rose-500 text-white animate-pulse'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {t.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action: Cloud Sync Status, Install on Phone & Settings */}
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            {syncCode ? (
              <button
                onClick={onOpenSettings}
                className="px-2.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 transition flex items-center space-x-1.5 text-xs font-bold shadow-sm cursor-pointer"
                title={lang === 'ro' ? `Conectat Live cu ${profile.wifeName.split(' ')[0]}` : `Connected Live with ${profile.wifeName.split(' ')[0]}`}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="hidden sm:inline">{lang === 'ro' ? 'Conectat' : 'Live'}</span>
                <span className="font-mono text-emerald-200">{syncCode}</span>
              </button>
            ) : (
              <button
                onClick={onOpenSettings}
                className="px-2.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 transition flex items-center space-x-1.5 text-xs font-semibold cursor-pointer"
                title={lang === 'ro' ? 'Apasă pentru a sincroniza cu partenerul' : 'Click to pair with partner'}
              >
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="hidden sm:inline">{lang === 'ro' ? 'Neconectat' : 'Offline'}</span>
                <span className="sm:hidden font-bold">{lang === 'ro' ? 'Seif' : 'Sync'}</span>
              </button>
            )}

            {currentUser ? (
              <button
                onClick={onOpenAuth}
                className="px-2.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-750 border border-stone-700 text-stone-200 transition flex items-center space-x-1.5 text-xs font-bold cursor-pointer"
                title={`${currentUser.name} (${currentUser.email})`}
              >
                <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">
                  👤
                </span>
                <span className="hidden sm:inline">{currentUser.name.split(' ')[0]}</span>
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-2.5 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 transition flex items-center space-x-1.5 text-xs font-semibold cursor-pointer"
                title="Autentificare Cont"
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{lang === 'ro' ? 'Cont' : 'Account'}</span>
              </button>
            )}

            <button
              id="btn-open-install"
              onClick={onOpenInstall}
              className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 transition flex items-center space-x-1.5 text-xs font-semibold cursor-pointer"
              title="Install on iPhone or Android"
            >
              <Smartphone className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">{t.actions.getOnPhone}</span>
            </button>
            <button
              id="btn-open-settings"
              onClick={onOpenSettings}
              className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition flex items-center space-x-2 text-sm font-medium border border-transparent hover:border-stone-700 cursor-pointer"
              title="Settings, Couple Profile & Backup"
            >
              <Settings className="w-5 h-5" />
              <span className="hidden md:inline">{t.actions.settings}</span>
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex lg:hidden overflow-x-auto py-2 space-x-1.5 border-t border-stone-800/60 no-scrollbar">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = currentTab === t.id;
            return (
              <button
                key={t.id}
                id={`mobile-tab-${t.id}`}
                onClick={() => onSelectTab(t.id)}
                className={`flex-shrink-0 flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                    : 'text-stone-400 bg-stone-800/40 hover:bg-stone-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
                {t.badge !== undefined && (
                  <span className={`px-1 rounded-full text-[10px] ${t.badgeAlert ? 'bg-rose-500 text-white' : 'bg-stone-700 text-amber-300'}`}>
                    {t.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
