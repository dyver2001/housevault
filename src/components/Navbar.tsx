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
  ArrowUpDown,
  Check,
  X,
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
  onOpenInstall?: () => void;
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
  isSyncConnected,
  currentUser,
  onOpenAuth,
  onOpenActivityFeed,
  onOpenScanner
}) => {
  const lang: Language = (profile.language as Language) || 'ro';
  const t = translations[lang] || translations.ro;
  const [isFloatingMenuOpen, setIsFloatingMenuOpen] = useState(false);
  const floatingMenuRef = useRef<HTMLDivElement>(null);

  // Close floating menu safely
  const closeFloatingMenu = () => {
    setIsFloatingMenuOpen(false);
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (floatingMenuRef.current && !floatingMenuRef.current.contains(event.target as Node)) {
        closeFloatingMenu();
      }
    };
    if (isFloatingMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isFloatingMenuOpen]);

  // Handle phone Back button (Android & Mobile browsers) to dismiss floating menu
  useEffect(() => {
    if (isFloatingMenuOpen) {
      window.history.pushState({ floatingMenu: true }, '');
      const handlePopState = () => {
        setIsFloatingMenuOpen(false);
      };
      window.addEventListener('popstate', handlePopState);
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [isFloatingMenuOpen]);

  const allTabs = [
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

  // 4 Primary tabs shown in the Revolut floating dock
  const primaryDockTabs = [
    { id: 'dashboard' as TabType, label: 'Home', icon: LayoutDashboard },
    { id: 'freelance' as TabType, label: 'Încasări', icon: Coins, badge: uncollectedCount > 0 ? uncollectedCount : undefined },
    { id: 'budget' as TabType, label: 'Buget', icon: Receipt },
    { id: 'debt' as TabType, label: 'Datorii', icon: Landmark },
  ];

  return (
    <>
      {/* Top Header Bar */}
      <header
        className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-xl border-b border-stone-800/80 transition-all w-full"
        style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 8px)' }}
      >
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
            {/* Left: Revolut Profile Avatar & Brand */}
            <div className="flex items-center space-x-2.5 flex-shrink-0">
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
                <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-stone-900 ${isSyncConnected ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              </button>

              <div className="flex items-center space-x-1.5 cursor-pointer" onClick={() => onSelectTab('dashboard')}>
                <span className="font-display font-black text-lg sm:text-xl tracking-tight text-white">HouseVault</span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-stone-800 text-emerald-400 border border-stone-700/80">
                  {profile.currencyCode}
                </span>
              </div>
            </div>

            {/* Desktop Navigation Tabs */}
            <nav className="hidden lg:flex items-center space-x-1">
              {allTabs.map((t) => {
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

              <button
                onClick={onOpenActivityFeed}
                className="w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-full bg-stone-800/90 hover:bg-stone-750 border border-stone-700/70 text-stone-300 hover:text-amber-400 flex items-center justify-center transition cursor-pointer relative flex-shrink-0 active:scale-95 shadow-sm"
                title={lang === 'ro' ? 'Activitate Live în Cuplu' : 'Couple Activity Feed'}
              >
                <Bell className="w-4 h-4" />
                <span className="w-2 h-2 rounded-full bg-amber-400 absolute top-1.5 right-1.5 ring-2 ring-stone-900" />
              </button>

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
      </header>

      {/* Backdrop for Floating Popup Menu */}
      {isFloatingMenuOpen && (
        <div
          className="fixed inset-0 z-45 bg-black/60 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={closeFloatingMenu}
          onTouchStart={closeFloatingMenu}
        />
      )}

      {/* Floating Revolut-Style Popup Menu (Only shows secondary options) */}
      {isFloatingMenuOpen && (
        <div
          ref={floatingMenuRef}
          className="fixed bottom-20 left-3 right-3 sm:left-6 sm:right-6 z-50 rounded-3xl bg-stone-900/98 backdrop-blur-3xl border border-stone-750/90 shadow-2xl p-2.5 space-y-1 lg:hidden animate-in fade-in slide-in-from-bottom-5 duration-200"
          style={{ maxHeight: 'calc(100vh - 160px)', overflowY: 'auto' }}
        >
          {/* Header of Floating Menu with Close Button */}
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-stone-800/80 mb-1">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
              Meniu Secțiuni & Utilități
            </span>
            <button
              onClick={closeFloatingMenu}
              className="p-1 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition cursor-pointer"
              title="Închide Meniul"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 1. Savings Targets / Obiective Economii */}
          <button
            onClick={() => {
              onSelectTab('targets');
              closeFloatingMenu();
            }}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
              currentTab === 'targets'
                ? 'bg-stone-800 text-white shadow-sm border border-stone-700'
                : 'text-stone-300 hover:bg-stone-800/60 hover:text-white'
            }`}
          >
            <div className="flex items-center space-x-3.5">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${currentTab === 'targets' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-stone-800 text-stone-400'}`}>
                <Vault className="w-4.5 h-4.5" />
              </div>
              <span className={currentTab === 'targets' ? 'font-bold text-white' : 'font-medium text-stone-200'}>
                {t.tabs.targets}
              </span>
            </div>
            {currentTab === 'targets' && <Check className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* 2. Cash Flow Calendar / Calendar Plăți */}
          <button
            onClick={() => {
              onSelectTab('calendar');
              closeFloatingMenu();
            }}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
              currentTab === 'calendar'
                ? 'bg-stone-800 text-white shadow-sm border border-stone-700'
                : 'text-stone-300 hover:bg-stone-800/60 hover:text-white'
            }`}
          >
            <div className="flex items-center space-x-3.5">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${currentTab === 'calendar' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-stone-800 text-stone-400'}`}>
                <Calendar className="w-4.5 h-4.5" />
              </div>
              <span className={currentTab === 'calendar' ? 'font-bold text-white' : 'font-medium text-stone-200'}>
                {lang === 'ro' ? 'Calendar Plăți & Cash Flow' : 'Bills & Cash Flow Calendar'}
              </span>
            </div>
            {currentTab === 'calendar' && <Check className="w-4 h-4 text-emerald-400" />}
          </button>

          <div className="h-px bg-stone-800/80 my-1.5 mx-2" />

          {/* 3. AI Receipt Scanner Quick Access */}
          {onOpenScanner && (
            <button
              onClick={() => {
                closeFloatingMenu();
                onOpenScanner();
              }}
              className="w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-medium text-stone-300 hover:bg-stone-800/60 hover:text-white transition-all cursor-pointer"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-8 h-8 rounded-xl bg-stone-800 text-cyan-400 flex items-center justify-center">
                  <Camera className="w-4.5 h-4.5" />
                </div>
                <span>{lang === 'ro' ? 'Scaner Bonuri AI' : 'Scan Receipt AI'}</span>
              </div>
            </button>
          )}

          {/* 4. Settings & Household Config */}
          <button
            onClick={() => {
              closeFloatingMenu();
              onOpenSettings();
            }}
            className="w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-medium text-stone-300 hover:bg-stone-800/60 hover:text-white transition-all cursor-pointer"
          >
            <div className="flex items-center space-x-3.5">
              <div className="w-8 h-8 rounded-xl bg-stone-800 text-stone-400 flex items-center justify-center">
                <Settings className="w-4.5 h-4.5" />
              </div>
              <span>{lang === 'ro' ? 'Setări & Sincronizare Cuplu' : 'Settings & Couple Sync'}</span>
            </div>
          </button>

          {/* 5. User Account */}
          {onOpenAuth && (
            <button
              onClick={() => {
                closeFloatingMenu();
                onOpenAuth();
              }}
              className="w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-medium text-stone-300 hover:bg-stone-800/60 hover:text-white transition-all cursor-pointer"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-8 h-8 rounded-xl bg-stone-800 text-emerald-400 flex items-center justify-center">
                  <User className="w-4.5 h-4.5" />
                </div>
                <span>{currentUser ? `${currentUser.name} (${currentUser.email})` : (lang === 'ro' ? 'Autentificare Cont' : 'Account Login')}</span>
              </div>
            </button>
          )}
        </div>
      )}

      {/* Floating Revolut Bottom Navigation Pill Dock (Image 2 Style) */}
      <nav
        className="fixed bottom-4 left-3 right-3 sm:left-6 sm:right-6 z-45 bg-stone-900/95 backdrop-blur-2xl border border-stone-750/80 rounded-full p-1.5 lg:hidden flex items-center justify-around shadow-2xl shadow-black/80"
        style={{ marginBottom: 'max(env(safe-area-inset-bottom, 0px), 0px)' }}
      >
        {primaryDockTabs.map((t) => {
          const Icon = t.icon;
          const isActive = currentTab === t.id && !isFloatingMenuOpen;
          return (
            <button
              key={t.id}
              onClick={() => {
                onSelectTab(t.id);
                closeFloatingMenu();
              }}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-full transition-all cursor-pointer relative ${
                isActive
                  ? 'bg-stone-800 text-white shadow-sm border border-stone-700/80'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-400' : 'text-stone-400'}`} />
                {t.badge !== undefined && (
                  <span className="absolute -top-1 -right-2 px-1 rounded-full text-[9px] font-bold bg-amber-500 text-stone-950">
                    {t.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] tracking-tight mt-0.5 truncate ${isActive ? 'font-bold text-white' : 'font-medium'}`}>
                {t.label}
              </span>
            </button>
          );
        })}

        {/* Floating Menu Toggle Button (Toggles open/close cleanly) */}
        <button
          onClick={() => setIsFloatingMenuOpen(!isFloatingMenuOpen)}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-full transition-all cursor-pointer relative ${
            isFloatingMenuOpen || (currentTab !== 'dashboard' && currentTab !== 'freelance' && currentTab !== 'budget' && currentTab !== 'debt')
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
              : 'text-stone-400 hover:text-stone-200'
          }`}
          title="Toate Secțiunile"
        >
          <ArrowUpDown className={`w-5 h-5 transition-transform duration-200 ${isFloatingMenuOpen ? 'rotate-180 text-emerald-400' : 'text-stone-400'}`} />
          <span className="text-[10px] tracking-tight mt-0.5 font-semibold truncate">
            Meniu
          </span>
        </button>
      </nav>
    </>
  );
};
