'use client';

import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, CheckCircle2, Lock, Info } from 'lucide-react';

interface AvailabilityCalendarProps {
  blockedDates: string[]; // ['2026-08-01', ...]
  selectedStartDate?: string;
  selectedEndDate?: string;
  onSelectDateRange?: (startDate: string, endDate: string) => void;
  isHostView?: boolean;
  onToggleHostBlock?: (dateStr: string) => void;
}

export const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  blockedDates,
  selectedStartDate,
  selectedEndDate,
  onSelectDateRange,
  isHostView = false,
  onToggleHostBlock,
}) => {
  // Calendar month state default: August 2026
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(7); // 0-indexed: 7 = August

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  const [tempStart, setTempStart] = useState<string | null>(selectedStartDate || null);
  const [tempEnd, setTempEnd] = useState<string | null>(selectedEndDate || null);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const formatDateStr = (day: number) => {
    const m = (currentMonth + 1).toString().padStart(2, '0');
    const d = day.toString().padStart(2, '0');
    return `${currentYear}-${m}-${d}`;
  };

  const handleDateClick = (day: number) => {
    const dateStr = formatDateStr(day);

    if (isHostView) {
      if (onToggleHostBlock) onToggleHostBlock(dateStr);
      return;
    }

    if (blockedDates.includes(dateStr)) return;

    if (!tempStart || (tempStart && tempEnd)) {
      setTempStart(dateStr);
      setTempEnd(null);
      if (onSelectDateRange) onSelectDateRange(dateStr, '');
    } else if (tempStart && !tempEnd) {
      if (dateStr < tempStart) {
        setTempStart(dateStr);
        setTempEnd(null);
        if (onSelectDateRange) onSelectDateRange(dateStr, '');
      } else {
        // Check if selected range includes blocked dates (FR-9)
        const curr = new Date(tempStart);
        const end = new Date(dateStr);
        let hasBlockedInRange = false;

        while (curr <= end) {
          const checkStr = curr.toISOString().split('T')[0];
          if (blockedDates.includes(checkStr)) {
            hasBlockedInRange = true;
            break;
          }
          curr.setDate(curr.getDate() + 1);
        }

        if (hasBlockedInRange) {
          alert('Selected range overlaps with unavailable dates. Please choose clear dates.');
          setTempStart(dateStr);
          setTempEnd(null);
          if (onSelectDateRange) onSelectDateRange(dateStr, '');
        } else {
          setTempEnd(dateStr);
          if (onSelectDateRange) onSelectDateRange(tempStart, dateStr);
        }
      }
    }
  };

  const isSelected = (dateStr: string) => {
    if (tempStart && tempEnd) {
      return dateStr >= tempStart && dateStr <= tempEnd;
    }
    return dateStr === tempStart;
  };

  const daysGrid = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    daysGrid.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    daysGrid.push(d);
  }

  return (
    <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 space-y-4">
      {/* Month Navigation Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-emerald-400" />
          <h4 className="text-sm font-bold text-white">
            {monthNames[currentMonth]} {currentYear}
          </h4>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={prevMonth}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextMonth}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 text-center text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((w) => (
          <span key={w}>{w}</span>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1">
        {daysGrid.map((day, idx) => {
          if (day === null) {
            return <div key={`empty_${idx}`} className="h-9" />;
          }

          const dateStr = formatDateStr(day);
          const isBlocked = blockedDates.includes(dateStr);
          const selected = isSelected(dateStr);

          return (
            <button
              key={dateStr}
              disabled={!isHostView && isBlocked}
              onClick={() => handleDateClick(day)}
              className={`h-9 rounded-xl text-xs font-semibold flex items-center justify-center relative transition-all ${
                selected
                  ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-md shadow-emerald-500/30 scale-105 z-10'
                  : isBlocked
                  ? 'bg-red-500/10 text-red-400 border border-red-500/30 cursor-not-allowed line-through'
                  : 'bg-slate-900/80 text-slate-200 border border-slate-800/80 hover:border-emerald-500/50 hover:bg-slate-800'
              }`}
            >
              {day}
              {isBlocked && (
                <Lock className="w-2.5 h-2.5 text-red-400 absolute top-1 right-1" />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend & Instructions */}
      <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-900">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700" /> Available
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/30 border border-red-500" /> Booked/Blocked
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Selected
          </span>
        </div>

        {isHostView && (
          <p className="text-[10px] text-indigo-400 font-medium">
            Click any date to block/unblock
          </p>
        )}
      </div>
    </div>
  );
};
