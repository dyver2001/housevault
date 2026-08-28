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
      className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-md border-b border-stone-800 transition-all"
      style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 12px)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-1">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo & Vault Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectTab('dashboard')}>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-amber-500/10">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-stone-950 stroke-[2.5]" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-display font-black text-lg sm:text-xl tracking-tight text-white">HouseVault</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {profile.currencyCode}
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
          <div className="flex items-center space-x-1 sm:space-x-1.5 flex-shrink-0">
            {/* AI Receipt Scanner Quick Button */}
            <button
              onClick={onOpenScanner}
              className="p-2 rounded-xl text-stone-400 hover:text-cyan-400 hover:bg-stone-800 transition flex items-center cursor-pointer"
              title={lang === 'ro' ? 'Scaner Bonuri AI' : 'Scan Receipt AI'}
            >
              <Camera className="w-4 h-4" />
            </button>

            {/* Couple Activity Feed Bell */}
            <button
              onClick={onOpenActivityFeed}
              className="relative p-2 rounded-xl text-stone-400 hover:text-amber-400 hover:bg-stone-800 transition flex items-center cursor-pointer"
              title={lang === 'ro' ? 'Activitate Live în Cuplu' : 'Couple Activity Feed'}
            >
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-amber-400 absolute top-1.5 right-1.5" />
            </button>

            {/* Cloud Sync Status */}
            {syncCode ? (
              <button
                onClick={onOpenSettings}
                className="px-2 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 transition flex items-center space-x-1 text-xs font-bold shadow-sm cursor-pointer"
                title={lang === 'ro' ? `Conectat Live (${syncCode})` : `Live Synced (${syncCode})`}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-mono text-emerald-200 text-[11px]">{syncCode}</span>
              </button>
            ) : (
              <button
                onClick={onOpenSettings}
                className="px-2 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 transition flex items-center space-x-1 text-xs font-semibold cursor-pointer"
                title={lang === 'ro' ? 'Apasă pentru sincronizare' : 'Click to pair'}
              >
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-[11px] font-medium hidden sm:inline">{lang === 'ro' ? 'Offline' : 'Offline'}</span>
              </button>
            )}

            {/* User Account / Profile */}
            {currentUser ? (
              <button
                onClick={onOpenAuth}
                className="px-2 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-750 border border-stone-700 text-stone-200 transition flex items-center space-x-1 text-xs font-bold cursor-pointer"
                title={`${currentUser.name} (${currentUser.email})`}
              >
                <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">
                  👤
                </span>
                <span className="hidden sm:inline text-[11px]">{currentUser.name.split(' ')[0]}</span>
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-2 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-750 border border-stone-700 text-stone-300 transition flex items-center space-x-1 text-xs font-medium cursor-pointer"
                title="Autentificare Cont"
              >
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline text-[11px]">{lang === 'ro' ? 'Login' : 'Login'}</span>
              </button>
            )}

            {/* Settings Button */}
            <button
              id="btn-open-settings"
              onClick={onOpenSettings}
              className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition flex items-center text-sm font-medium border border-transparent hover:border-stone-700 cursor-pointer"
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
