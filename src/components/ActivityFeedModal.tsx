import React, { useState } from 'react';
import { Bell, Heart, Sparkles, Rocket, Flame, CheckCircle2, TrendingUp, DollarSign, X } from 'lucide-react';
import { ActivityItem } from '../types';

interface ActivityFeedModalProps {
  isOpen: boolean;
  onClose: () => void;
  activities: ActivityItem[];
  onReact: (activityId: string, emoji: string) => void;
  currencySymbol?: string;
  lang?: string;
}

export const ActivityFeedModal: React.FC<ActivityFeedModalProps> = ({
  isOpen,
  onClose,
  activities,
  onReact,
  currencySymbol = 'lei',
  lang = 'ro'
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'HAYTHAM' | 'CATI'>('ALL');

  if (!isOpen) return null;

  const defaultSampleActivities: ActivityItem[] = [
    {
      id: 'act-1',
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      actorName: 'Haytham',
      actorRole: 'husband',
      type: 'PROJECT_COLLECTED',
      title: 'A încasat 4.500 lei pentru Proiectul Commercial Video Shoot',
      amount: 4500,
      reactions: { '🎉': 3, '❤️': 2, '🚀': 1 }
    },
    {
      id: 'act-2',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      actorName: 'Cati',
      actorRole: 'wife',
      type: 'EXPENSE_PAID',
      title: 'A bifat factura de Utilități & Curent (380 lei)',
      amount: 380,
      reactions: { '✅': 2, '❤️': 1 }
    },
    {
      id: 'act-3',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      actorName: 'Haytham',
      actorRole: 'husband',
      type: 'TARGET_DEPOSIT',
      title: 'Depunere automată de 1.575 lei în Seiful Casei (35% Split)',
      amount: 1575,
      reactions: { '🏡': 4, '🔥': 2 }
    },
    {
      id: 'act-4',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      actorName: 'Cati',
      actorRole: 'wife',
      type: 'DEBT_REDUCED',
      title: 'Achitat 1.575 lei anticipat spre Cardul de Credit (DAE 24%)',
      amount: 1575,
      reactions: { '💪': 3, '🎉': 2 }
    }
  ];

  const items = activities.length > 0 ? activities : defaultSampleActivities;

  const filtered = items.filter((a) => {
    if (selectedFilter === 'HAYTHAM') return a.actorName.toLowerCase().includes('haytham');
    if (selectedFilter === 'CATI') return a.actorName.toLowerCase().includes('cati');
    return true;
  });

  const emojis = ['❤️', '🎉', '🚀', '💪', '🔥'];

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'PROJECT_COLLECTED':
        return { label: 'Încasare Proiect', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
      case 'EXPENSE_PAID':
        return { label: 'Factură Achitată', bg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' };
      case 'TARGET_DEPOSIT':
        return { label: 'Seif Casă', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
      case 'DEBT_REDUCED':
        return { label: 'Datorie Scăzută', bg: 'bg-purple-500/20 text-purple-300 border-purple-500/30' };
      default:
        return { label: 'Actualizare', bg: 'bg-stone-800 text-stone-300 border-stone-700' };
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-stone-900 border border-stone-700 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black font-display text-white">
                {lang === 'ro' ? 'Activitate Live în Cuplu' : 'Couple Activity Feed'}
              </h2>
              <p className="text-xs text-stone-400">Haytham & Cati Shared Timeline</p>
            </div>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-white p-1 text-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex space-x-2 bg-stone-850 p-1 rounded-xl border border-stone-750">
          <button
            type="button"
            onClick={() => setSelectedFilter('ALL')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              selectedFilter === 'ALL' ? 'bg-emerald-500 text-stone-950 shadow' : 'text-stone-400 hover:text-white'
            }`}
          >
            {lang === 'ro' ? 'Toate' : 'All'}
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('HAYTHAM')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              selectedFilter === 'HAYTHAM' ? 'bg-amber-500 text-stone-950 shadow' : 'text-stone-400 hover:text-white'
            }`}
          >
            Haytham 🎬
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('CATI')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              selectedFilter === 'CATI' ? 'bg-cyan-500 text-stone-950 shadow' : 'text-stone-400 hover:text-white'
            }`}
          >
            Cati 💻
          </button>
        </div>

        {/* Timeline List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {filtered.map((act) => {
            const badge = getTypeBadge(act.type);
            const isHaytham = act.actorName.toLowerCase().includes('haytham');

            return (
              <div
                key={act.id}
                className="p-3.5 rounded-2xl bg-stone-850/80 border border-stone-750/70 space-y-2.5 transition hover:border-stone-600"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-base">{isHaytham ? '🎬' : '💻'}</span>
                    <span className="text-xs font-bold text-white">{act.actorName}</span>
                    <span className={`px-2 py-0.5 rounded-md border text-[10px] font-bold ${badge.bg}`}>
                      {badge.label}
                    </span>
                  </div>
                  <span className="text-[10px] text-stone-500">
                    {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <p className="text-xs text-stone-200 leading-relaxed font-medium">
                  {act.title}
                </p>

                {/* Interactive Reactions Bar */}
                <div className="flex items-center justify-between pt-1 border-t border-stone-800">
                  <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                    {Object.entries(act.reactions || {}).map(([emoji, count]) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => onReact(act.id, emoji)}
                        className="px-2 py-0.5 rounded-full bg-stone-800 hover:bg-stone-700 border border-stone-700 text-xs flex items-center space-x-1 transition cursor-pointer"
                      >
                        <span>{emoji}</span>
                        <span className="text-[10px] font-bold text-stone-300">{count}</span>
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center space-x-1">
                    {emojis.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => onReact(act.id, emoji)}
                        className="w-6 h-6 rounded-full hover:bg-stone-750 flex items-center justify-center text-xs transition cursor-pointer"
                        title="Reacționează"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
