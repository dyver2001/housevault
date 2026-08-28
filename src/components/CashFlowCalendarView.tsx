import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Receipt,
  Landmark,
  Coins,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowDownRight,
  ArrowUpRight,
  X,
  RotateCcw
} from 'lucide-react';
import { HouseholdProfile, FreelanceProject, BankDebt, HouseholdExpense } from '../types';
import { soundFx } from '../utils/audioEffects';
import { triggerConfetti } from '../utils/confetti';

interface CashFlowCalendarViewProps {
  profile: HouseholdProfile;
  projects: FreelanceProject[];
  debts: BankDebt[];
  expenses: HouseholdExpense[];
  currencySymbol?: string;
  lang?: string;
  onPayDebt?: (debtId: string, amount: number) => void;
  onPayExpense?: (expenseId: string, amount: number, title: string) => void;
  onCollectProject?: (projectId: string, amount: number) => void;
}

export const CashFlowCalendarView: React.FC<CashFlowCalendarViewProps> = ({
  profile,
  projects,
  debts,
  expenses,
  currencySymbol = 'lei',
  lang = 'ro',
  onPayDebt,
  onPayExpense,
  onCollectProject
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDate());
  const [isPopoutOpen, setIsPopoutOpen] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const storageKey = `housevault_calendar_paid_${year}_${month}`;

  const [paidEventIds, setPaidEventIds] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(`housevault_calendar_paid_${new Date().getFullYear()}_${new Date().getMonth()}`);
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // Sync state when month/year changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      setPaidEventIds(saved ? JSON.parse(saved) : {});
    } catch (e) {
      setPaidEventIds({});
    }
  }, [storageKey]);

  const savePaidEvents = (newPaid: Record<string, boolean>) => {
    setPaidEventIds(newPaid);
    try {
      localStorage.setItem(storageKey, JSON.stringify(newPaid));
    } catch (e) {}
  };

  // Handle phone Back button (Android & Mobile browsers) to dismiss pop-out modal
  useEffect(() => {
    if (isPopoutOpen) {
      window.history.pushState({ calendarModal: true }, '');
      const handlePopState = () => {
        setIsPopoutOpen(false);
      };
      window.addEventListener('popstate', handlePopState);
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [isPopoutOpen]);

  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Adjust for Monday start (0: Mon, 6: Sun)
  const startingDay = (firstDayIndex + 6) % 7;

  const monthName = currentDate.toLocaleDateString(lang === 'ro' ? 'ro-RO' : 'en-US', { month: 'long', year: 'numeric' });

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDay(1);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDay(1);
  };

  // Map events to day numbers with rich information
  interface CalendarEvent {
    id: string;
    rawId?: string;
    title: string;
    amount: number;
    type: 'INCOME' | 'BILL' | 'DEBT';
    category?: string;
    actor?: string;
    notes?: string;
  }

  const eventsByDay: Record<number, CalendarEvent[]> = {};

  // 1. Cati Salary on 15th
  const salaryDay = 15;
  if (!eventsByDay[salaryDay]) eventsByDay[salaryDay] = [];
  eventsByDay[salaryDay].push({
    id: `salary-wife-${month}-${year}`,
    title: `Salariu ${profile.wifeName.split(' ')[0]} (IT Support)`,
    amount: profile.wifeMonthlySalary || 6500,
    type: 'INCOME',
    category: 'Salariu Stabil',
    actor: profile.wifeName.split(' ')[0],
    notes: 'Venit de ancoră pentru cheltuielile lunare'
  });

  // 2. Fixed bills
  expenses.forEach((exp, idx) => {
    const dueDay = ((idx * 3 + 4) % 28) + 1; // spread across month
    if (!eventsByDay[dueDay]) eventsByDay[dueDay] = [];
    eventsByDay[dueDay].push({
      id: `bill-${exp.id}-${month}-${year}`,
      rawId: exp.id,
      title: exp.title,
      amount: exp.amount,
      type: 'BILL',
      category: exp.category,
      notes: 'Cheltuială fixă de supraviețuire'
    });
  });

  // 3. Bank Debts due days
  debts.forEach((debt) => {
    const day = debt.dueDayOfMonth || 20;
    if (!eventsByDay[day]) eventsByDay[day] = [];
    eventsByDay[day].push({
      id: `debt-${debt.id}-${month}-${year}`,
      rawId: debt.id,
      title: `Rată Bancă: ${debt.bankName}`,
      amount: debt.minMonthlyPayment || 350,
      type: 'DEBT',
      category: 'Datorie Bancară',
      notes: `Sold rămas: ${debt.currentBalance?.toLocaleString()} ${currencySymbol}`
    });
  });

  // 4. Freelance Invoices due dates
  projects.forEach((proj) => {
    if (proj.dueDate) {
      const projDate = new Date(proj.dueDate);
      if (projDate.getMonth() === month && projDate.getFullYear() === year) {
        const day = projDate.getDate();
        if (!eventsByDay[day]) eventsByDay[day] = [];
        eventsByDay[day].push({
          id: `proj-${proj.id}-${month}-${year}`,
          rawId: proj.id,
          title: `Încasare Freelance: ${proj.projectTitle}`,
          amount: proj.balanceRemaining > 0 ? proj.balanceRemaining : proj.totalFee,
          type: 'INCOME',
          category: 'Video Freelance',
          actor: profile.husbandName.split(' ')[0],
          notes: `Client: ${proj.clientName} (Status: ${proj.status})`
        });
      }
    }
  });

  const weekDays = lang === 'ro' ? ['Lun', 'Mar', 'Mie', 'Joi', 'Vin', 'Sâm', 'Dum'] : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const selectedEvents = eventsByDay[selectedDay] || [];
  const unpaidBillsAndDebts = selectedEvents.filter(e => e.type !== 'INCOME' && !paidEventIds[e.id]).reduce((s, e) => s + e.amount, 0);
  const totalBillsAndDebts = selectedEvents.filter(e => e.type !== 'INCOME').reduce((s, e) => s + e.amount, 0);
  const totalIncome = selectedEvents.filter(e => e.type === 'INCOME').reduce((s, e) => s + e.amount, 0);

  const selectedDateObj = new Date(year, month, selectedDay);
  const selectedDateFormatted = selectedDateObj.toLocaleDateString(lang === 'ro' ? 'ro-RO' : 'en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const handleTogglePayEvent = (ev: CalendarEvent, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const wasPaid = !!paidEventIds[ev.id];
    const nextState = !wasPaid;
    const updated = { ...paidEventIds, [ev.id]: nextState };
    savePaidEvents(updated);
    if (nextState) {
      soundFx.playCashChime();
      triggerConfetti(50, 45);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-900 border border-stone-800 p-4 sm:p-5 rounded-3xl shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black font-display text-white">
              {lang === 'ro' ? 'Calendarul Plăților & Încasărilor' : 'Cash Flow & Bills Calendar'}
            </h2>
            <p className="text-xs text-stone-400">
              {lang === 'ro' ? 'Apasă pe orice zi pentru a deschide detaliile și a efectua plățile' : 'Click on any day to pop out scheduled payments'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={prevMonth}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition cursor-pointer"
            title="Luna precedentă"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-bold text-white px-3 font-display capitalize">
            {monthName}
          </span>
          <button
            type="button"
            onClick={nextMonth}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition cursor-pointer"
            title="Luna următoare"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-3.5 sm:p-6 space-y-3 shadow-xl">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs font-bold text-stone-400 pb-2 border-b border-stone-800">
          {weekDays.map((d, i) => (
            <div key={i} className={i >= 5 ? 'text-amber-400/80 font-black' : ''}>{d}</div>
          ))}
        </div>

        {/* Month days */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {/* Empty starting slots */}
          {Array.from({ length: startingDay }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[64px] sm:min-h-[80px] rounded-2xl bg-stone-950/20 border border-transparent p-1.5 opacity-20" />
          ))}

          {/* Actual days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dayEvents = eventsByDay[dayNum] || [];
            const isToday = new Date().getDate() === dayNum && new Date().getMonth() === month && new Date().getFullYear() === year;
            const isSelected = selectedDay === dayNum;

            const hasIncome = dayEvents.some(e => e.type === 'INCOME');
            const hasDebt = dayEvents.some(e => e.type === 'DEBT');
            const hasBill = dayEvents.some(e => e.type === 'BILL');
            const allPaid = dayEvents.length > 0 && dayEvents.every(e => paidEventIds[e.id]);

            return (
              <button
                type="button"
                key={dayNum}
                onClick={() => {
                  setSelectedDay(dayNum);
                  setIsPopoutOpen(true);
                }}
                className={`min-h-[64px] sm:min-h-[80px] rounded-2xl p-1.5 sm:p-2 flex flex-col justify-between border transition-all text-left cursor-pointer active:scale-95 relative ${
                  isSelected
                    ? 'bg-emerald-950/40 border-emerald-400 ring-2 ring-emerald-400/60 shadow-lg shadow-emerald-500/10'
                    : isToday
                    ? 'bg-stone-850 border-amber-500/50'
                    : dayEvents.length > 0
                    ? 'bg-stone-850/90 border-stone-750 hover:border-stone-600'
                    : 'bg-stone-900/50 border-stone-800/60 hover:bg-stone-850/50'
                }`}
              >
                {/* Day number & indicators */}
                <div className="flex items-center justify-between w-full">
                  <span className={`text-xs font-black ${isSelected ? 'text-emerald-300 font-black' : isToday ? 'text-amber-400 font-bold' : 'text-stone-200'}`}>
                    {dayNum}
                  </span>
                  {allPaid ? (
                    <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                      ✓
                    </span>
                  ) : isToday ? (
                    <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold hidden sm:inline">
                      Azi
                    </span>
                  ) : null}
                </div>

                {/* Event Dot Badges */}
                <div className="flex flex-wrap gap-1 my-1">
                  {hasIncome && <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-500/50" title="Încasare" />}
                  {hasBill && <span className="w-2 h-2 rounded-full bg-rose-400 shadow-sm shadow-rose-500/50" title="Factură" />}
                  {hasDebt && <span className="w-2 h-2 rounded-full bg-purple-400 shadow-sm shadow-purple-500/50" title="Rată Bancară" />}
                </div>

                {/* Day Summary micro-amount */}
                <div className="text-[10px] text-right truncate font-mono">
                  {dayEvents.length > 0 && (
                    <span className={`font-bold ${allPaid ? 'text-emerald-400' : hasDebt || hasBill ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {allPaid ? 'Plătit ✓' : `${dayEvents.length} ${dayEvents.length === 1 ? 'scadență' : 'scadențe'}`}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Pop-out Modal When a Date Is Pressed */}
      {isPopoutOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsPopoutOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-t-3xl sm:rounded-3xl bg-stone-900 border border-stone-750 shadow-2xl p-5 sm:p-6 space-y-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom-8 sm:zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Pop-out Header with Close Button */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Scadențe & Plăți
                </span>
                <h3 className="text-base sm:text-lg font-black text-white capitalize">
                  {selectedDateFormatted}
                </h3>
              </div>
              <button
                onClick={() => setIsPopoutOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition cursor-pointer"
                title="Închide"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Summary Badges */}
            {selectedEvents.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-rose-950/20 border border-rose-500/30">
                  <div className="text-[10px] uppercase font-bold text-rose-400 tracking-wider">
                    {unpaidBillsAndDebts > 0 ? 'Rămas de Plătit' : 'Total Achitat'}
                  </div>
                  <div className="text-base sm:text-lg font-black font-mono text-rose-300">
                    {unpaidBillsAndDebts > 0 ? `-${unpaidBillsAndDebts.toLocaleString()} ${currencySymbol}` : '0 lei (Achitat ✓)'}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-emerald-950/20 border border-emerald-500/30">
                  <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Încasări</div>
                  <div className="text-base sm:text-lg font-black font-mono text-emerald-300">
                    +{totalIncome.toLocaleString()} {currencySymbol}
                  </div>
                </div>
              </div>
            )}

            {/* List of items scheduled on this day with Pay / Collect Buttons */}
            {selectedEvents.length > 0 ? (
              <div className="space-y-3">
                {selectedEvents.map((ev) => {
                  const isIncome = ev.type === 'INCOME';
                  const isDebt = ev.type === 'DEBT';
                  const isPaid = !!paidEventIds[ev.id];

                  return (
                    <div
                      key={ev.id}
                      className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col gap-3 ${
                        isPaid
                          ? 'bg-emerald-950/25 border-emerald-500/40 opacity-90'
                          : isIncome
                          ? 'bg-emerald-950/20 border-emerald-500/30'
                          : isDebt
                          ? 'bg-purple-950/20 border-purple-500/30'
                          : 'bg-rose-950/20 border-rose-500/30'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start space-x-3">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                              isPaid
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : isIncome
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : isDebt
                                ? 'bg-purple-500/20 text-purple-400'
                                : 'bg-rose-500/20 text-rose-400'
                            }`}
                          >
                            {isPaid ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            ) : isIncome ? (
                              <ArrowDownRight className="w-5 h-5" />
                            ) : isDebt ? (
                              <Landmark className="w-5 h-5" />
                            ) : (
                              <Receipt className="w-5 h-5" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-sm text-white">{ev.title}</span>
                              {ev.category && (
                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-stone-800 text-stone-300 border border-stone-700">
                                  {ev.category}
                                </span>
                              )}
                            </div>
                            {ev.notes && (
                              <p className="text-xs text-stone-400 mt-0.5">{ev.notes}</p>
                            )}
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <span
                            className={`text-base sm:text-lg font-black font-mono ${
                              isPaid
                                ? 'text-emerald-400 line-through opacity-75'
                                : isIncome
                                ? 'text-emerald-400'
                                : isDebt
                                ? 'text-purple-300'
                                : 'text-rose-400'
                            }`}
                          >
                            {isIncome ? '+' : '-'}{ev.amount.toLocaleString()} {currencySymbol}
                          </span>
                        </div>
                      </div>

                      {/* Pay Button Action Row */}
                      <div className="flex items-center justify-between pt-2 border-t border-stone-800/60">
                        <span className="text-[11px] text-stone-400">
                          {isPaid ? 'Tranzacție confirmată' : isIncome ? 'Așteaptă confirmare' : 'Scadentă la această dată'}
                        </span>

                        {isPaid ? (
                          <button
                            type="button"
                            onClick={() => handleTogglePayEvent(ev)}
                            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-rose-500/20 border border-emerald-500/40 hover:border-rose-500/40 text-emerald-300 hover:text-rose-300 text-xs font-bold shadow-sm transition group cursor-pointer active:scale-95"
                            title="Apasă pentru a anula și a reveni la neplătit"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 group-hover:hidden" />
                            <RotateCcw className="w-3.5 h-3.5 text-rose-400 hidden group-hover:inline" />
                            <span className="group-hover:hidden">{isIncome ? 'Încasat ✓' : 'Plătit cu Succes ✓'}</span>
                            <span className="hidden group-hover:inline">Anulează / Revino</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleTogglePayEvent(ev)}
                            className={`px-4 py-2 rounded-xl text-xs font-black transition active:scale-95 shadow-md flex items-center space-x-1.5 cursor-pointer ${
                              isIncome
                                ? 'bg-emerald-500 hover:bg-emerald-400 text-stone-950 shadow-emerald-500/20'
                                : isDebt
                                ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/20'
                                : 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/20'
                            }`}
                          >
                            {isIncome ? (
                              <>
                                <Coins className="w-3.5 h-3.5" />
                                <span>Marchează Încasat</span>
                              </>
                            ) : isDebt ? (
                              <>
                                <Landmark className="w-3.5 h-3.5" />
                                <span>Plătește Rata</span>
                              </>
                            ) : (
                              <>
                                <Receipt className="w-3.5 h-3.5" />
                                <span>Plătește Factura</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center rounded-2xl bg-stone-950/40 border border-stone-800/80 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500/60 mx-auto" />
                <h4 className="text-sm font-bold text-stone-300">Fără plăți programate</h4>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Nu ai nicio factură sau rată scadentă pe data de {selectedDateFormatted}. Ești complet liber!
                </p>
              </div>
            )}

            <button
              onClick={() => setIsPopoutOpen(false)}
              className="w-full py-3 rounded-xl bg-stone-800 hover:bg-stone-750 text-white font-bold text-sm transition cursor-pointer"
            >
              Închide
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
