import { Shift } from "../types";
import { groupShiftsByDate, sortShiftsWithinGroup } from "./dateUtils";
import { categorizeShifts } from "./shiftUtils";

export interface ShiftGroup {
  date: string;
  displayDate: string;
  shifts: Shift[];
}

export interface ShiftGroupingResult {
  upcomingShifts: Shift[];
  pastShifts: Shift[];
  groupedUpcoming: ShiftGroup[];
  groupedPast: ShiftGroup[];
}

export const groupShifts = (
  bookedShifts: Shift[], 
  now: Date = new Date()
): ShiftGroupingResult => {
  const { upcoming: upcomingShifts, past: pastShifts } = categorizeShifts(bookedShifts, now);

  const groupedUpcoming = groupShiftsByDate(upcomingShifts).map(group => ({
    ...group,
    shifts: sortShiftsWithinGroup(group.shifts),
  }));

  const groupedPast = groupShiftsByDate(pastShifts).map(group => ({
    ...group,
    shifts: sortShiftsWithinGroup(group.shifts),
  })).reverse();

  return {
    upcomingShifts,
    pastShifts,
    groupedUpcoming,
    groupedPast,
  };
};