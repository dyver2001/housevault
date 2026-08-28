import React, { useState } from 'react';
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
  X
} from 'lucide-react';
import { HouseholdProfile, FreelanceProject, BankDebt, HouseholdExpense } from '../types';

interface CashFlowCalendarViewProps {
  profile: HouseholdProfile;
  projects: FreelanceProject[];
  debts: BankDebt[];
  expenses: HouseholdExpense[];
  currencySymbol?: string;
  lang?: string;
}

export const CashFlowCalendarView: React.FC<CashFlowCalendarViewProps> = ({
  profile,
  projects,
  debts,
  expenses,
  currencySymbol = 'lei',
  lang = 'ro'
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDate());
  const [isPopoutOpen, setIsPopoutOpen] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

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
    id: 'salary-wife',
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
      id: exp.id,
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
      id: debt.id,
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
          id: proj.id,
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
  const totalBillsAndDebts = selectedEvents.filter(e => e.type !== 'INCOME').reduce((s, e) => s + e.amount, 0);
  const totalIncome = selectedEvents.filter(e => e.type === 'INCOME').reduce((s, e) => s + e.amount, 0);

  const selectedDateObj = new Date(year, month, selectedDay);
  const selectedDateFormatted = selectedDateObj.toLocaleDateString(lang === 'ro' ? 'ro-RO' : 'en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

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
              {lang === 'ro' ? 'Apasă pe orice zi pentru a deschide detaliile exacte ale scadențelor' : 'Click on any day to pop out scheduled payments'}
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
                  {isToday && (
                    <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold hidden sm:inline">
                      Azi
                    </span>
                  )}
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
                    <span className={`font-bold ${hasDebt || hasBill ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {dayEvents.length} {dayEvents.length === 1 ? 'eveniment' : 'scadențe'}
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
                  <div className="text-[10px] uppercase font-bold text-rose-400 tracking-wider">De Plătit</div>
                  <div className="text-base sm:text-lg font-black font-mono text-rose-300">
                    -{totalBillsAndDebts.toLocaleString()} {currencySymbol}
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

            {/* List of items scheduled on this day */}
            {selectedEvents.length > 0 ? (
              <div className="space-y-2.5">
                {selectedEvents.map((ev) => {
                  const isIncome = ev.type === 'INCOME';
                  const isDebt = ev.type === 'DEBT';
                  return (
                    <div
                      key={ev.id}
                      className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isIncome
                          ? 'bg-emerald-950/20 border-emerald-500/30'
                          : isDebt
                          ? 'bg-purple-950/20 border-purple-500/30'
                          : 'bg-rose-950/20 border-rose-500/30'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            isIncome
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : isDebt
                              ? 'bg-purple-500/20 text-purple-400'
                              : 'bg-rose-500/20 text-rose-400'
                          }`}
                        >
                          {isIncome ? (
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

                      <div className="text-right sm:self-center flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                        <span className="text-xs text-stone-400 sm:hidden">Sumă:</span>
                        <span
                          className={`text-base sm:text-lg font-black font-mono ${
                            isIncome ? 'text-emerald-400' : isDebt ? 'text-purple-300' : 'text-rose-400'
                          }`}
                        >
                          {isIncome ? '+' : '-'}{ev.amount.toLocaleString()} {currencySymbol}
                        </span>
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
