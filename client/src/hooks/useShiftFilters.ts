import { useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { ShiftFilters } from "../types";

export function useShiftFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo((): ShiftFilters => {
    const urlFilters: ShiftFilters = {};

    const location = searchParams.get("location");
    if (location) urlFilters.location = location;

    const jobType = searchParams.get("jobType");
    if (jobType) urlFilters.jobType = jobType;

    const payRateMin = searchParams.get("payRateMin");
    if (payRateMin && !Number.isNaN(Number(payRateMin))) {
      urlFilters.payRateMin = Number(payRateMin);
    }

    const dateFrom = searchParams.get("dateFrom");
    if (dateFrom) urlFilters.dateFrom = dateFrom;

    const dateTo = searchParams.get("dateTo");
    if (dateTo) urlFilters.dateTo = dateTo;

    return urlFilters;
  }, [searchParams]);

  const setFilters = useCallback((newFilters: ShiftFilters) => {
    const params = new URLSearchParams();

    Object.entries(newFilters).forEach(([key, value]) => {
      if (value == null || value === "") return;
      params.set(key, String(value));
    });

    setSearchParams(params, { replace: true });
  }, [setSearchParams]);

  const activeFiltersCount = useMemo(() => {
    return Object.values(filters).filter(value => value != null && value !== "" && value !== undefined).length;
  }, [filters]);

  return {
    filters,
    setFilters,
    activeFiltersCount,
  };
}
