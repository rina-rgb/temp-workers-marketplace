import { Shift } from "../types";

export const isWithinMinimumCancellationHours = (shift: Shift, now: Date = new Date()): boolean => {
  if (!shift.minCancellationHours) return false;
  const hoursUntilShift = (new Date(shift.startAt).getTime() - now.getTime()) / (1000 * 60 * 60);
  return hoursUntilShift < shift.minCancellationHours;
};

export const canCancelDirectly = (shift: Shift, now: Date = new Date()): boolean => {
  return !shift.minCancellationHours || !isWithinMinimumCancellationHours(shift, now);
};

export const categorizeShifts = (shifts: Shift[], now: Date = new Date()) => {
  return {
    upcoming: shifts.filter(shift => new Date(shift.startAt) >= now),
    past: shifts.filter(shift => new Date(shift.startAt) < now)
      .map(s => ({ ...s, status: 'completed'}))
  };
};