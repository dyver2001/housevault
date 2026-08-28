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
  LogOut,
  Calendar,
  Bell,
  Camera
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
  onOpenInstall,
  uncollectedCount,
  overdueCount,
  syncCode,
  isSyncConnected,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenActivityFeed,
  onOpenScanner
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

  return (
    <header
      className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-xl border-b border-stone-800/80 transition-all w-full"
      style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 8px)' }}
    >
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
          {/* Left: Revolut-style Profile Avatar & Brand */}
          <div className="flex items-center space-x-2.5 flex-shrink-0">
            {/* User Profile Avatar with Live Status Dot */}
            <button
              onClick={onOpenAuth}
              className="relative w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500/20 to-stone-800 border border-emerald-500/40 flex items-center justify-center text-emerald-300 font-bold text-xs shadow-sm cursor-pointer hover:border-emerald-400 active:scale-95 transition flex-shrink-0"
              title={currentUser ? `${currentUser.name} (${currentUser.email})` : 'Autentificare'}
            >
              {currentUser ? (
                <span>{currentUser.name.charAt(0).toUpperCase()}</span>
              ) : (
                <User className="w-4 h-4 text-emerald-400" />
              )}
              {/* Online/Sync Dot */}
              <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-stone-900 ${isSyncConnected ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            </button>

            {/* Brand Title */}
            <div className="flex items-center cursor-pointer" onClick={() => onSelectTab('dashboard')}>
              <span className="font-display font-black text-lg tracking-tight text-white">HouseVault</span>
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

          {/* Right Action Toolbar (Revolut Style) */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0">
            {/* Live Sync Pill */}
            {syncCode ? (
              <button
                onClick={onOpenSettings}
                className="h-8 sm:h-9 px-2.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 transition flex items-center space-x-1.5 text-xs font-bold shadow-sm cursor-pointer whitespace-nowrap flex-shrink-0"
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
                className="h-8 sm:h-9 px-2.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 transition flex items-center space-x-1 text-xs font-semibold cursor-pointer whitespace-nowrap flex-shrink-0"
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
      </div>

      {/* Modern 0-Swipe Fixed Bottom Navigation Bar for Mobile */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 bg-stone-900/98 backdrop-blur-xl border-t border-stone-800 px-1 py-1 lg:hidden flex items-center justify-around shadow-2xl"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 6px)' }}
      >
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = currentTab === t.id;
          return (
            <button
              key={t.id}
              id={`mobile-nav-${t.id}`}
              onClick={() => onSelectTab(t.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 px-0.5 rounded-xl transition-all cursor-pointer relative ${
                isActive
                  ? t.highlight
                    ? 'text-amber-400 bg-amber-500/10'
                    : 'text-emerald-400 bg-emerald-500/10'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? (t.highlight ? 'text-amber-400' : 'text-emerald-400') : 'text-stone-400'}`} />
                {t.badge !== undefined && (
                  <span className="absolute -top-1 -right-2 px-1 rounded-full text-[9px] font-bold bg-amber-500 text-stone-950">
                    {t.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] tracking-tight mt-0.5 max-w-[50px] truncate ${isActive ? 'font-bold' : 'font-medium'}`}>
                {t.label}
              </span>
            </button>
          );
        })}
      </nav>
    </header>
  );
};
