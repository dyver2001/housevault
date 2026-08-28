import React, { useState, useRef, useEffect } from 'react';
import {
  LayoutDashboard,
  Coins,
  Receipt,
  Landmark,
  Vault,
  Sparkles,
  Settings,
  ShieldCheck,
  User,
  Calendar,
  Bell,
  ChevronDown,
  Check
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
  | 'calendar'
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
  onOpenActivityFeed?: () => void;
  onOpenScanner?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  profile,
  onOpenSettings,
  uncollectedCount,
  overdueCount,
  syncCode,
  currentUser,
  onOpenAuth,
  onOpenActivityFeed
}) => {
  const lang: Language = (profile.language as Language) || 'ro';
  const t = translations[lang] || translations.ro;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      id: 'calendar' as TabType,
      label: lang === 'ro' ? 'Calendar' : 'Calendar',
      icon: Calendar,
    },
    {
      id: 'ai' as TabType,
      label: t.tabs.ai,
      icon: Sparkles,
      highlight: true
    }
  ];

  const activeTabObj = tabs.find((t) => t.id === currentTab) || tabs[0];
  const ActiveIcon = activeTabObj.icon;

  return (
    <header
      className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-xl border-b border-stone-800 transition-all w-full"
      style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 10px)' }}
    >
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 pb-2">
        {/* Top Header Row */}
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
          {/* Logo & Brand with RON badge */}
          <div className="flex items-center space-x-2.5 cursor-pointer flex-shrink-0" onClick={() => onSelectTab('dashboard')}>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-emerald-600 flex items-center justify-center shadow-md shadow-amber-500/10 flex-shrink-0">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-stone-950 stroke-[2.5]" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-display font-black text-lg sm:text-xl tracking-tight text-white">HouseVault</span>
              <span className="text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {profile.currencyCode} ({profile.currencySymbol})
              </span>
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
                        t.badgeAlert ? 'bg-rose-500 text-white animate-pulse' : 'bg-amber-500 text-stone-950'
                      }`}
                    >
                      {t.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Toolbar */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0">
            {/* Live Sync Pill */}
            {syncCode ? (
              <button
                onClick={onOpenSettings}
                className="h-8.5 px-2.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 transition flex items-center space-x-1.5 text-xs font-bold shadow-sm cursor-pointer whitespace-nowrap flex-shrink-0"
                title={lang === 'ro' ? `Conectat Live (${syncCode})` : `Live Synced (${syncCode})`}
              >
                <span className="relative flex h-2 w-2 flex-shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-mono text-emerald-200 text-[11px] font-bold tracking-wide whitespace-nowrap">{syncCode}</span>
              </button>
            ) : (
              <button
                onClick={onOpenSettings}
                className="h-8.5 px-2.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 transition flex items-center space-x-1 text-xs font-semibold cursor-pointer whitespace-nowrap flex-shrink-0"
                title={lang === 'ro' ? 'Apasă pentru sincronizare' : 'Click to pair'}
              >
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
                <span className="text-[11px] font-medium hidden sm:inline whitespace-nowrap">Offline</span>
              </button>
            )}

            {/* Couple Activity Feed Bell */}
            <button
              onClick={onOpenActivityFeed}
              className="w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-full bg-stone-800/90 hover:bg-stone-750 border border-stone-700/70 text-stone-300 hover:text-amber-400 flex items-center justify-center transition cursor-pointer relative flex-shrink-0 active:scale-95 shadow-sm"
              title={lang === 'ro' ? 'Activitate Live în Cuplu' : 'Couple Activity Feed'}
            >
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-amber-400 absolute top-1.5 right-1.5 ring-2 ring-stone-900" />
            </button>

            {/* Profile Avatar */}
            <button
              onClick={onOpenAuth}
              className="w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-full bg-stone-800/90 hover:bg-stone-750 border border-stone-700/70 text-emerald-300 font-bold text-xs flex items-center justify-center transition cursor-pointer flex-shrink-0 active:scale-95 shadow-sm"
              title={currentUser ? `${currentUser.name}` : 'Login'}
            >
              {currentUser ? (
                <span>{currentUser.name.charAt(0).toUpperCase()}</span>
              ) : (
                <User className="w-4 h-4 text-emerald-400" />
              )}
            </button>

            {/* Settings Gear Button */}
            <button
              id="btn-open-settings"
              onClick={onOpenSettings}
              className="w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-full bg-stone-800/90 hover:bg-stone-750 border border-stone-700/70 text-stone-300 hover:text-white flex items-center justify-center transition cursor-pointer flex-shrink-0 active:scale-95 shadow-sm"
              title="Setări & Configurare"
            >
              <Settings className="w-4 h-4 text-stone-300" />
            </button>
          </div>
        </div>

        {/* Mobile Drop-Down Menu Selector */}
        <div className="lg:hidden relative mt-1" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-stone-800/90 hover:bg-stone-800 border border-stone-700/80 text-white shadow-sm transition-all active:scale-[0.99] cursor-pointer"
          >
            <div className="flex items-center space-x-2.5">
              <ActiveIcon className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-sm tracking-tight">{activeTabObj.label}</span>
              {activeTabObj.badge !== undefined && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-stone-950">
                  {activeTabObj.badge}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-1 text-stone-400 text-xs font-semibold">
              <span className="text-[11px] text-stone-400">Meniu</span>
              <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </div>
          </button>

          {/* Animated Drop-Down Menu Options */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1.5 z-50 rounded-2xl bg-stone-900/98 backdrop-blur-2xl border border-stone-700 shadow-2xl p-1.5 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
              {tabs.map((t) => {
                const Icon = t.icon;
                const isSelected = currentTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      onSelectTab(t.id);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        : 'text-stone-300 hover:bg-stone-800/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-stone-400'}`} />
                      <span className={isSelected ? 'font-bold' : 'font-medium'}>{t.label}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {t.badge !== undefined && (
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-stone-950">
                          {t.badge}
                        </span>
                      )}
                      {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
