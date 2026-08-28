import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, DollarSign, Receipt, Landmark, CheckCircle } from 'lucide-react';
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

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Adjust for Monday start (0: Mon, 6: Sun)
  const startingDay = (firstDayIndex + 6) % 7;

  const monthName = currentDate.toLocaleDateString(lang === 'ro' ? 'ro-RO' : 'en-US', { month: 'long', year: 'numeric' });

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Map events to day numbers
  const eventsByDay: Record<number, Array<{ title: string; amount: number; type: 'INCOME' | 'BILL' | 'DEBT'; actor?: string }>> = {};

  // 1. Cati Salary on 10th & 25th (or 15th)
  const salaryDay = 15;
  if (!eventsByDay[salaryDay]) eventsByDay[salaryDay] = [];
  eventsByDay[salaryDay].push({
    title: `Salariu ${profile.wifeName.split(' ')[0]}`,
    amount: profile.wifeMonthlySalary || 6500,
    type: 'INCOME',
    actor: 'Cati'
  });

  // 2. Fixed bills
  expenses.forEach((exp, idx) => {
    const dueDay = ((idx * 3 + 4) % 28) + 1; // spread across month
    if (!eventsByDay[dueDay]) eventsByDay[dueDay] = [];
    eventsByDay[dueDay].push({
      title: exp.title,
      amount: exp.amount,
      type: 'BILL'
    });
  });

  // 3. Bank Debts due days
  debts.forEach((debt) => {
    const day = debt.dueDayOfMonth || 20;
    if (!eventsByDay[day]) eventsByDay[day] = [];
    eventsByDay[day].push({
      title: `Rată: ${debt.bankName}`,
      amount: debt.minMonthlyPayment || 350,
      type: 'DEBT'
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
          title: `Încasare: ${proj.projectTitle}`,
          amount: proj.balanceRemaining > 0 ? proj.balanceRemaining : proj.totalFee,
          type: 'INCOME',
          actor: 'Haytham'
        });
      }
    }
  });

  const weekDays = lang === 'ro' ? ['Lun', 'Mar', 'Mie', 'Joi', 'Vin', 'Sâm', 'Dum'] : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-900 border border-stone-750 p-4 sm:p-5 rounded-3xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black font-display text-white">
              {lang === 'ro' ? 'Calendarul Plăților & Încasărilor' : 'Cash Flow & Bills Calendar'}
            </h2>
            <p className="text-xs text-stone-400">
              {lang === 'ro' ? 'Planificarea scadențelor pentru a evita orice surpriză' : 'Scheduled bills and freelance inflows'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={prevMonth}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition cursor-pointer"
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
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-stone-900 border border-stone-750 rounded-3xl p-4 sm:p-6 space-y-3">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs font-bold text-stone-400 pb-2 border-b border-stone-800">
          {weekDays.map((d, i) => (
            <div key={i} className={i >= 5 ? 'text-amber-400/80' : ''}>{d}</div>
          ))}
        </div>

        {/* Month days */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {/* Empty starting slots */}
          {Array.from({ length: startingDay }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[70px] sm:min-h-[85px] rounded-xl bg-stone-950/30 border border-transparent p-1.5 opacity-30" />
          ))}

          {/* Actual days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dayEvents = eventsByDay[dayNum] || [];
            const isToday = new Date().getDate() === dayNum && new Date().getMonth() === month && new Date().getFullYear() === year;

            return (
              <div
                key={dayNum}
                className={`min-h-[70px] sm:min-h-[85px] rounded-xl p-1.5 flex flex-col justify-between border transition ${
                  isToday
                    ? 'bg-emerald-950/30 border-emerald-500/50 ring-1 ring-emerald-500/30'
                    : dayEvents.length > 0
                    ? 'bg-stone-850/80 border-stone-750'
                    : 'bg-stone-900/50 border-stone-800/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-bold ${isToday ? 'text-emerald-400 font-black' : 'text-stone-300'}`}>
                    {dayNum}
                  </span>
                  {isToday && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />}
                </div>

                <div className="space-y-1 my-1 overflow-hidden">
                  {dayEvents.slice(0, 2).map((ev, evIdx) => (
                    <div
                      key={evIdx}
                      className={`px-1 py-0.5 rounded text-[9px] font-bold truncate flex items-center space-x-1 ${
                        ev.type === 'INCOME'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : ev.type === 'DEBT'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}
                      title={`${ev.title}: ${ev.amount.toLocaleString()} ${currencySymbol}`}
                    >
                      <span className="truncate">{ev.title}</span>
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <span className="text-[9px] text-stone-500 font-bold block text-center">
                      +{dayEvents.length - 2} altele
                    </span>
                  )}
                </div>

                <div className="text-[9px] text-stone-500 text-right">
                  {dayEvents.length > 0 && (
                    <span className="font-mono font-bold">
                      {dayEvents.reduce((s, e) => (e.type === 'INCOME' ? s + e.amount : s - e.amount), 0) > 0 ? '+' : ''}
                      {dayEvents.reduce((s, e) => (e.type === 'INCOME' ? s + e.amount : s - e.amount), 0).toLocaleString()} {currencySymbol}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
