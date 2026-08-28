import React, { useState } from 'react';
import {
  Lock,
  Mail,
  User,
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { loginAccount, registerAccount, AuthUser } from '../data/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: AuthUser, vaultData?: any) => void;
  lang?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  lang = 'ro'
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('Haytham');
  const [role, setRole] = useState<'husband' | 'wife'>('husband');
  const [vaultCode, setVaultCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleQuickPreset = (preset: 'haytham' | 'cati') => {
    if (preset === 'haytham') {
      setEmail('haytham@housevault.app');
      setName('Haytham (Videograf)');
      setRole('husband');
    } else {
      setEmail('cati@housevault.app');
      setName('Cati (IT Support)');
      setRole('wife');
    }
    setPassword('housevault2026');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError(lang === 'ro' ? 'Completați emailul și parola.' : 'Please enter email and password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (mode === 'login') {
        const res = await loginAccount(email.trim(), password);
        if (res.success && res.user) {
          onAuthSuccess(res.user, res.vault?.data);
          onClose();
        } else {
          setError(res.error || (lang === 'ro' ? 'Autentificare eșuată.' : 'Login failed.'));
        }
      } else {
        const res = await registerAccount(email.trim(), password, name.trim(), role, vaultCode.trim() || undefined);
        if (res.success && res.user) {
          onAuthSuccess(res.user, res.vault?.data);
          onClose();
        } else {
          setError(res.error || (lang === 'ro' ? 'Înregistrare eșuată.' : 'Registration failed.'));
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Eroare de conexiune.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-stone-900 border border-stone-700 rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-5 shadow-2xl relative overflow-hidden">
        {/* Decorative ambient gradient */}
        <div className="absolute -right-16 -top-16 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-emerald-500 flex items-center justify-center text-stone-950 font-black shadow-lg shadow-emerald-500/20">
              <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-lg font-black font-display text-white">HouseVault Accounts</h2>
              <p className="text-xs text-stone-400">Haytham & Cati Shared Cloud Vault</p>
            </div>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-white text-lg p-1 cursor-pointer">
            ✕
          </button>
        </div>

        {/* 1-Tap Quick Partner Fill */}
        <div className="bg-stone-850 p-3 rounded-2xl border border-stone-750 space-y-2">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
            {lang === 'ro' ? '⚡ Autentificare Rapidă Partener:' : '⚡ Quick Partner Login:'}
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickPreset('haytham')}
              className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-750 border border-stone-700 hover:border-amber-500/50 text-left transition cursor-pointer group"
            >
              <div className="text-xs font-bold text-amber-400 flex items-center justify-between">
                <span>Haytham</span>
                <span className="text-[10px] opacity-0 group-hover:opacity-100 transition">▶</span>
              </div>
              <div className="text-[10px] text-stone-400">Videograf</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickPreset('cati')}
              className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-750 border border-stone-700 hover:border-emerald-500/50 text-left transition cursor-pointer group"
            >
              <div className="text-xs font-bold text-emerald-400 flex items-center justify-between">
                <span>Cati</span>
                <span className="text-[10px] opacity-0 group-hover:opacity-100 transition">▶</span>
              </div>
              <div className="text-[10px] text-stone-400">IT Support</div>
            </button>
          </div>
        </div>

        {/* Tab Switcher: Login vs Register */}
        <div className="flex bg-stone-800/80 p-1 rounded-xl border border-stone-700">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
              mode === 'login'
                ? 'bg-emerald-500 text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            {lang === 'ro' ? 'Autentificare' : 'Log In'}
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(null); }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
              mode === 'register'
                ? 'bg-emerald-500 text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            {lang === 'ro' ? 'Creare Cont' : 'Register'}
          </button>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <div>
              <label className="text-xs text-stone-400 block mb-1">
                {lang === 'ro' ? 'Nume Utilizator / Rol' : 'Display Name / Partner'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ex: Haytham (Videograf) sau Cati (IT)"
                  className="w-full bg-stone-850 border border-stone-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs text-stone-400 block mb-1">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="haytham@housevault.app"
                className="w-full bg-stone-850 border border-stone-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-stone-400 block mb-1">
              {lang === 'ro' ? 'Parolă' : 'Password'}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-stone-850 border border-stone-700 rounded-xl pl-9 pr-10 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="text-xs text-stone-400 block mb-1">
                {lang === 'ro' ? 'Cod Seif Cuplu (Opțional)' : 'Joint Vault Code (Optional)'}
              </label>
              <input
                type="text"
                value={vaultCode}
                onChange={(e) => setVaultCode(e.target.value.toUpperCase())}
                placeholder="ex: HV-8821 (sau lăsați gol pentru seif nou)"
                className="w-full bg-stone-850 border border-stone-700 rounded-xl px-3 py-2 text-sm text-white font-mono uppercase focus:outline-none focus:border-emerald-500"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition cursor-pointer flex items-center justify-center space-x-2"
          >
            <span>{loading ? '...' : (mode === 'login' ? (lang === 'ro' ? 'Intră în Cont' : 'Sign In') : (lang === 'ro' ? 'Creează Contul' : 'Create Account'))}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Offline / Guest Mode Fallback */}
        <div className="pt-2 text-center border-t border-stone-800">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-stone-400 hover:text-stone-200 transition cursor-pointer"
          >
            {lang === 'ro' ? 'Continuă în modul Local / Oaspete ➔' : 'Continue in Local / Guest Mode ➔'}
          </button>
        </div>
      </div>
    </div>
  );
};
