import { ShiftFilters } from "./shifts.schemas";

export function parseShiftFilters(params: {
  location?: string;
  jobtype?: string;
  payratemin?: string;
  datefrom?: string;
  dateto?: string;
}): ShiftFilters | undefined {
  const filters: ShiftFilters = {};
  
  if (params.location) filters.location = params.location;
  if (params.jobtype) filters.jobType = params.jobtype;
  
  if (params.payratemin) {
    const num = parseFloat(params.payratemin);
    if (!isNaN(num) && num >= 0) filters.payRateMin = num;
  }
  
  if (params.datefrom) {
    const date = new Date(params.datefrom);
    if (!isNaN(date.getTime())) filters.dateFrom = date;
  }
  
  if (params.dateto) {
    const date = new Date(params.dateto);
    if (!isNaN(date.getTime())) filters.dateTo = date;
  }
  
  return Object.keys(filters).length > 0 ? filters : undefined;
}