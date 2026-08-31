import React from 'react';
import {
  LayoutDashboard,
  Coins,
  Receipt,
  Vault,
  Sparkles,
  Settings,
  User,
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
  | 'groceries'
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
  const isRo = lang === 'ro';
  const wifeShort = (profile.wifeName || 'Cati').split(' ')[0];
  const husbandShort = (profile.husbandName || 'Haytham').split(' ')[0];

  // 4 Crystal-Clear Luxury Portals
  const mainNavItems = [
    {
      id: 'dashboard' as TabType,
      label: isRo ? 'Acasă' : 'Home',
      icon: LayoutDashboard,
      color: 'from-amber-400 to-amber-600',
      activeText: 'text-amber-300'
    },
    {
      id: 'budget' as TabType,
      label: isRo ? 'Bani & Facturi' : 'Finances & Bills',
      icon: Receipt,
      color: 'from-emerald-400 to-teal-500',
      activeText: 'text-emerald-300'
    },
    {
      id: 'freelance' as TabType,
      label: isRo ? `Proiecte ${husbandShort}` : `${husbandShort} Freelance`,
      icon: Coins,
      badge: uncollectedCount > 0 ? uncollectedCount : undefined,
      badgeAlert: overdueCount > 0,
      color: 'from-amber-500 to-orange-500',
      activeText: 'text-amber-400'
    },
    {
      id: 'targets' as TabType,
      label: isRo ? 'Seif & Vise' : 'Vault & Dreams',
      icon: Vault,
      color: 'from-cyan-400 to-blue-500',
      activeText: 'text-cyan-300'
    }
  ];

  const isCurrentFinances = currentTab === 'budget' || currentTab === 'debt' || currentTab === 'groceries' || currentTab === 'calendar';

  return (
    <>
      {/* Top Header Bar with Glassmorphic Luxury Gradient */}
      <header
        className="sticky top-0 z-40 bg-stone-950/80 backdrop-blur-2xl border-b border-white/[0.08] transition-all w-full shadow-2xl"
        style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 8px)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18 gap-3">
            {/* Left: Brand Logo & Couple Presence */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              <button
                onClick={onOpenAuth}
                className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500/20 via-stone-900 to-emerald-500/20 border border-amber-500/30 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-amber-500/10 cursor-pointer hover:border-amber-400 active:scale-95 transition"
                title={currentUser ? `${currentUser.name} (${currentUser.email})` : 'Autentificare'}
              >
                {currentUser ? (
                  <span className="font-display font-black text-amber-300 text-sm">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <User className="w-5 h-5 text-amber-400" />
                )}
                <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-stone-950 ${isSyncConnected ? 'bg-emerald-400 shadow-sm shadow-emerald-400' : 'bg-amber-400'}`} />
              </button>

              <div
                className="flex flex-col cursor-pointer group"
                onClick={() => onSelectTab('dashboard')}
              >
                <div className="flex items-center space-x-1.5">
                  <span className="font-display font-black text-xl sm:text-2xl tracking-tight bg-gradient-to-r from-amber-200 via-amber-400 to-emerald-400 bg-clip-text text-transparent group-hover:opacity-90 transition">
                    HouseVault
                  </span>
                  <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    VIP
                  </span>
                </div>
                <span className="text-[10px] text-stone-400 font-semibold tracking-wide hidden sm:block">
                  {husbandShort} 💍 {wifeShort} • {profile.currencyCode || 'RON'}
                </span>
              </div>
            </div>

            {/* Desktop Navigation: 4 Clean Primary Luxury Portals */}
            <nav className="hidden lg:flex items-center space-x-1.5 bg-stone-900/60 p-1.5 rounded-2xl border border-white/[0.06] backdrop-blur-xl shadow-inner">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.id === 'budget' ? isCurrentFinances : currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    className={`relative flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-stone-850 to-stone-800 text-white shadow-md border border-white/[0.12] scale-[1.02]'
                        : 'text-stone-400 hover:text-stone-200 hover:bg-white/[0.03]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? item.activeText : 'text-stone-400'}`} />
                    <span>{item.label}</span>
                    {item.badge !== undefined && (
                      <span className="ml-1.5 px-2 py-0.5 text-xs font-black rounded-full bg-amber-500 text-stone-950 shadow-sm animate-pulse">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right Action Suite: AI Coach, Activity & Settings */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              {/* Joyful AI Strategist Button */}
              <button
                onClick={() => onSelectTab('ai')}
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-2xl font-bold text-xs transition shadow-lg cursor-pointer ${
                  currentTab === 'ai'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-purple-500/25 border border-purple-400/40'
                    : 'bg-gradient-to-r from-purple-500/15 to-indigo-500/15 hover:from-purple-500/25 hover:to-indigo-500/25 text-purple-300 border border-purple-500/30'
                }`}
                title="HouseVault AI Strategist"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-300 animate-spin-slow" />
                <span className="hidden sm:inline">AI Strategist</span>
              </button>

              {/* Sync Status Badge */}
              {syncCode ? (
                <button
                  onClick={onOpenSettings}
                  className="h-9 px-3 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 transition flex items-center space-x-1.5 text-xs font-bold cursor-pointer whitespace-nowrap shadow-sm"
                  title={isRo ? `Conectat cu ${wifeShort} (${syncCode})` : `Synced with ${wifeShort} (${syncCode})`}
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="font-mono text-emerald-300 text-[11px] font-black hidden sm:inline">{syncCode}</span>
                </button>
              ) : (
                <button
                  onClick={onOpenSettings}
                  className="h-9 px-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 transition flex items-center space-x-1 text-xs font-semibold cursor-pointer"
                  title={isRo ? 'Apasă pentru sincronizare' : 'Click to pair'}
                >
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-[11px] font-medium hidden sm:inline">Sincronizează</span>
                </button>
              )}

              {/* Activity Feed Button with love pulse */}
              {onOpenActivityFeed && (
                <button
                  onClick={onOpenActivityFeed}
                  className="w-9 h-9 rounded-2xl bg-stone-900/80 hover:bg-stone-800 border border-stone-750 text-stone-300 hover:text-amber-400 flex items-center justify-center transition cursor-pointer relative active:scale-95 shadow-sm"
                  title={isRo ? 'Activitate & Reacții Cuplu' : 'Couple Activity & Reactions'}
                >
                  <Bell className="w-4 h-4" />
                  <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-2 right-2 ring-2 ring-stone-950 animate-ping" />
                  <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-2 right-2 ring-2 ring-stone-950" />
                </button>
              )}

              {/* Settings Button */}
              <button
                onClick={onOpenSettings}
                className="w-9 h-9 rounded-2xl bg-stone-900/80 hover:bg-stone-800 border border-stone-750 text-stone-300 hover:text-white flex items-center justify-center transition cursor-pointer active:scale-95 shadow-sm"
                title={isRo ? 'Setări Familie' : 'Settings'}
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Floating Futuristic Bottom Navigation Dock for Mobile (Ultra-Clean 4 Portals + Center Joy Action) */}
      <nav
        className="fixed bottom-3 left-3 right-3 sm:left-6 sm:right-6 z-45 bg-stone-900/90 backdrop-blur-3xl border border-white/[0.1] rounded-3xl p-1.5 lg:hidden flex items-center justify-around shadow-2xl shadow-black/90"
        style={{ marginBottom: 'max(env(safe-area-inset-bottom, 0px), 0px)' }}
      >
        {mainNavItems.slice(0, 2).map((item) => {
          const Icon = item.icon;
          const isActive = item.id === 'budget' ? isCurrentFinances : currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-br from-white/[0.08] to-white/[0.02] text-white border border-white/[0.12] shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? item.activeText : 'text-stone-400'}`} />
              <span className={`text-[10px] tracking-tight mt-1 truncate ${isActive ? 'font-bold text-white' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}

        {/* Center Joy Action: Quick Scanner or AI Coach */}
        <div className="flex-shrink-0 px-1">
          <button
            type="button"
            onClick={onOpenScanner ? onOpenScanner : () => onSelectTab('ai')}
            className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-emerald-400 to-cyan-400 text-stone-950 font-bold flex items-center justify-center shadow-lg shadow-amber-500/20 active:scale-95 transition-transform cursor-pointer border-2 border-stone-950"
            title="Scanează Bon / Smart AI"
          >
            <Camera className="w-5 h-5 text-stone-950" />
          </button>
        </div>

        {mainNavItems.slice(2, 4).map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-br from-white/[0.08] to-white/[0.02] text-white border border-white/[0.12] shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? item.activeText : 'text-stone-400'}`} />
                {item.badge !== undefined && (
                  <span className="absolute -top-1 -right-2 px-1 rounded-full text-[9px] font-bold bg-amber-500 text-stone-950">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] tracking-tight mt-1 truncate ${isActive ? 'font-bold text-white' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
