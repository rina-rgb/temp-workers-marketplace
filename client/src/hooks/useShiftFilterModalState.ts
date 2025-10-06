import { ChangeEvent, SyntheticEvent, useCallback, useEffect, useMemo, useState } from "react";

import { ShiftFilters as FilterType } from "../types";
import { useSearchableFilterOptions } from "./useShiftQueries";

function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [value, delay]);

  return debouncedValue;
}

const isEmptyValue = (value: unknown): boolean => {
  if (value === undefined || value === null) return true;
  if (typeof value === "string") return value.trim() === "";
  return false;
};

interface UseShiftFilterModalStateParams {
  filters: FilterType;
  open: boolean;
}

interface UseShiftFilterModalStateResult {
  draftFilters: FilterType;
  locations: string[];
  jobTypes: string[];
  locationsLoading: boolean;
  jobTypesLoading: boolean;
  isFetchingNextLocations: boolean;
  isFetchingNextJobTypes: boolean;
  today: string;
  hasFilters: boolean;
  locationInputValue: string;
  jobTypeInputValue: string;
  locationOpen: boolean;
  jobTypeOpen: boolean;
  handleLocationOpen: () => void;
  handleLocationClose: () => void;
  handleJobTypeOpen: () => void;
  handleJobTypeClose: () => void;
  handleLocationSelect: (_: unknown, value: string | null) => void;
  handleJobTypeSelect: (_: unknown, value: string | null) => void;
  handleLocationInputChange: (_: unknown, value: string, reason: string) => void;
  handleJobTypeInputChange: (_: unknown, value: string, reason: string) => void;
  handleLocationScroll: (event: SyntheticEvent<HTMLUListElement>) => void;
  handleJobTypeScroll: (event: SyntheticEvent<HTMLUListElement>) => void;
  handlePayRateInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleDateFromChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleDateToChange: (event: ChangeEvent<HTMLInputElement>) => void;
  buildFilters: () => FilterType;
  clearFiltersState: () => FilterType;
}

export function useShiftFilterModalState({ filters, open }: UseShiftFilterModalStateParams): UseShiftFilterModalStateResult {
  const [draftFilters, setDraftFilters] = useState<FilterType>(filters);
  const [locationSearch, setLocationSearch] = useState("");
  const [jobTypeSearch, setJobTypeSearch] = useState("");
  const [locationOpen, setLocationOpen] = useState(false);
  const [jobTypeOpen, setJobTypeOpen] = useState(false);

  const debouncedLocationSearch = useDebouncedValue(locationSearch);
  const debouncedJobTypeSearch = useDebouncedValue(jobTypeSearch);

  useEffect(() => {
    setDraftFilters(filters);
    setLocationSearch("");
    setJobTypeSearch("");
  }, [filters, open]);

  const locationFilterDependencies = useMemo<FilterType>(() => ({
    ...(draftFilters.jobType && { jobType: draftFilters.jobType }),
    ...(draftFilters.payRateMin !== undefined && { payRateMin: draftFilters.payRateMin }),
    ...(draftFilters.dateFrom && { dateFrom: draftFilters.dateFrom }),
    ...(draftFilters.dateTo && { dateTo: draftFilters.dateTo }),
  }), [draftFilters.jobType, draftFilters.payRateMin, draftFilters.dateFrom, draftFilters.dateTo]);

  const jobTypeFilterDependencies = useMemo<FilterType>(() => ({
    ...(draftFilters.location && { location: draftFilters.location }),
  }), [draftFilters.location]);

  const shouldFetchLocations = locationOpen || Boolean(locationSearch);
  const shouldFetchJobTypes = jobTypeOpen || Boolean(jobTypeSearch);

  const {
    data: locationPages,
    isLoading: locationsLoading,
    fetchNextPage: fetchNextLocationsPage,
    hasNextPage: hasMoreLocations,
    isFetchingNextPage: isFetchingNextLocations,
  } = useSearchableFilterOptions(
    'locations',
    debouncedLocationSearch || undefined,
    10,
    locationFilterDependencies,
    shouldFetchLocations
  );

  const {
    data: jobTypePages,
    isLoading: jobTypesLoading,
    fetchNextPage: fetchNextJobTypesPage,
    hasNextPage: hasMoreJobTypes,
    isFetchingNextPage: isFetchingNextJobTypes,
  } = useSearchableFilterOptions(
    'jobTypes',
    debouncedJobTypeSearch || undefined,
    10,
    jobTypeFilterDependencies,
    shouldFetchJobTypes
  );

  const locations = useMemo(() => {
    const flattened = locationPages?.pages.flat() ?? [];
    const uniqueSet = new Set([
      ...(draftFilters.location ? [draftFilters.location] : []),
      ...flattened,
    ]);
    return Array.from(uniqueSet);
  }, [locationPages, draftFilters.location]);

  const jobTypes = useMemo(() => {
    const flattened = jobTypePages?.pages.flat() ?? [];
    const uniqueSet = new Set([
      ...(draftFilters.jobType ? [draftFilters.jobType] : []),
      ...flattened,
    ]);
    return Array.from(uniqueSet);
  }, [jobTypePages, draftFilters.jobType]);

  const handleLocationScroll = useCallback((event: SyntheticEvent<HTMLUListElement>) => {
    if (!hasMoreLocations || isFetchingNextLocations) return;
    const list = event.currentTarget;
    if (list.scrollTop + list.clientHeight >= list.scrollHeight - 16) {
      void fetchNextLocationsPage();
    }
  }, [fetchNextLocationsPage, hasMoreLocations, isFetchingNextLocations]);

  const handleJobTypeScroll = useCallback((event: SyntheticEvent<HTMLUListElement>) => {
    if (!hasMoreJobTypes || isFetchingNextJobTypes) return;
    const list = event.currentTarget;
    if (list.scrollTop + list.clientHeight >= list.scrollHeight - 16) {
      void fetchNextJobTypesPage();
    }
  }, [fetchNextJobTypesPage, hasMoreJobTypes, isFetchingNextJobTypes]);

  const handleLocationSelect = useCallback((_: unknown, newValue: string | null) => {
    setDraftFilters((prev: FilterType) => {
      const next: FilterType = { ...prev };
      if (newValue) {
        next.location = newValue;
      } else {
        delete next.location;
      }
      delete next.jobType;
      return next;
    });
    setLocationSearch("");
    setJobTypeSearch("");
    setLocationOpen(false);
  }, []);

  const handleJobTypeSelect = useCallback((_: unknown, newValue: string | null) => {
    setDraftFilters((prev: FilterType) => {
      const next: FilterType = { ...prev };
      if (newValue) {
        next.jobType = newValue;
      } else {
        delete next.jobType;
      }
      return next;
    });
    setJobTypeSearch("");
    setJobTypeOpen(false);
  }, []);

  const handleLocationInputChange = useCallback((_: unknown, newInputValue: string, reason: string) => {
    if (reason === 'input' || reason === 'clear') {
      setLocationSearch(newInputValue);
    }
  }, []);

  const handleJobTypeInputChange = useCallback((_: unknown, newInputValue: string, reason: string) => {
    if (reason === 'input' || reason === 'clear') {
      setJobTypeSearch(newInputValue);
    }
  }, []);

  const handlePayRateInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value;
    const numericValue = rawValue ? parseFloat(rawValue) : undefined;

    setDraftFilters((prev: FilterType) => {
      const next: FilterType = { ...prev };
      if (numericValue === undefined || isNaN(numericValue) || numericValue < 0) {
        delete next.payRateMin;
      } else {
        next.payRateMin = numericValue;
      }
      return next;
    });
  }, []);

  const handleDateFromChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value || undefined;

    setDraftFilters((prev: FilterType) => {
      const next: FilterType = { ...prev };

      if (isEmptyValue(value)) {
        delete next.dateFrom;
      } else {
        next.dateFrom = value;
        if (next.dateTo && next.dateTo < value!) {
          delete next.dateTo;
        }
      }

      return next;
    });
  }, []);

  const handleDateToChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value || undefined;

    setDraftFilters((prev: FilterType) => {
      const next: FilterType = { ...prev };
      if (isEmptyValue(value)) {
        delete next.dateTo;
      } else {
        next.dateTo = value;
      }
      return next;
    });
  }, []);

  const handleLocationOpen = useCallback(() => setLocationOpen(true), []);
  const handleLocationClose = useCallback(() => setLocationOpen(false), []);
  const handleJobTypeOpen = useCallback(() => setJobTypeOpen(true), []);
  const handleJobTypeClose = useCallback(() => setJobTypeOpen(false), []);

  const buildFilters = useCallback((): FilterType => {
    return { ...draftFilters };
  }, [draftFilters]);

  const clearFiltersState = useCallback((): FilterType => {
    setDraftFilters({});
    setLocationSearch("");
    setJobTypeSearch("");
    return {};
  }, []);

  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  const hasFilters = useMemo(() => Boolean(
    draftFilters.location ||
    draftFilters.jobType ||
    draftFilters.payRateMin !== undefined ||
    draftFilters.dateFrom ||
    draftFilters.dateTo
  ), [draftFilters.dateFrom, draftFilters.dateTo, draftFilters.jobType, draftFilters.payRateMin, draftFilters.location]);

  const locationInputValue = draftFilters.location || locationSearch;
  const jobTypeInputValue = draftFilters.jobType || jobTypeSearch;

  return {
    draftFilters,
    locations,
    jobTypes,
    locationsLoading,
    jobTypesLoading,
    isFetchingNextLocations,
    isFetchingNextJobTypes,
    today,
    hasFilters,
    locationInputValue,
    jobTypeInputValue,
    locationOpen,
    jobTypeOpen,
    handleLocationOpen,
    handleLocationClose,
    handleJobTypeOpen,
    handleJobTypeClose,
    handleLocationSelect,
    handleJobTypeSelect,
    handleLocationInputChange,
    handleJobTypeInputChange,
    handleLocationScroll,
    handleJobTypeScroll,
    handlePayRateInputChange,
    handleDateFromChange,
    handleDateToChange,
    buildFilters,
    clearFiltersState,
  };
}