import { format, isToday, isTomorrow, isThisWeek, isThisYear } from "date-fns";
import { Shift } from "../types";

export interface GroupedShifts {
  date: string;
  displayDate: string;
  shifts: Shift[];
}

export function groupShiftsByDate(shifts: Shift[]): GroupedShifts[] {
  const grouped = shifts.reduce((acc, shift) => {
    const shiftDate = new Date(shift.startAt);
    const dateKey = format(shiftDate, "yyyy-MM-dd");
    
    if (!acc[dateKey]) {
      acc[dateKey] = {
        date: dateKey,
        displayDate: getDisplayDate(shiftDate),
        shifts: [],
      };
    }
    
    acc[dateKey].shifts.push(shift);
    
    return acc;
  }, {} as Record<string, GroupedShifts>);
  
  return Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date));
}

function getDisplayDate(date: Date): string {
  if (isToday(date)) {
    return "Today";
  }
  
  if (isTomorrow(date)) {
    return "Tomorrow";
  }
  
  if (isThisWeek(date)) {
    return format(date, "EEEE, MMM d");
  }
  
  if (isThisYear(date)) {
    return format(date, "EEE, MMM d");
  }
  
  return format(date, "EEE, MMM d, yyyy");
}

export function sortShiftsWithinGroup(shifts: Shift[]): Shift[] {
  return [...shifts].sort((a, b) => {
    const aTime = new Date(a.startAt);
    const bTime = new Date(b.startAt);
    return aTime.getTime() - bTime.getTime();
  });
}