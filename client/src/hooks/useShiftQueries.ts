import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { PaginatedResponse, Shift, ShiftFilters } from "../types";
import { useCurrentWorker } from "./useWorker";

// Helper function for building filter params
function buildShiftFilterParams(
  filters?: ShiftFilters,
  additionalParams?: Record<string, string>
): URLSearchParams {
  const params = new URLSearchParams(additionalParams);

  if (filters?.location) params.set('location', filters.location);
  if (filters?.jobType) params.set('jobtype', filters.jobType);
  if (filters?.payRateMin !== undefined) {
    params.set('payratemin', filters.payRateMin.toString());
  }
  if (filters?.dateFrom) params.set('datefrom', filters.dateFrom);
  if (filters?.dateTo) params.set('dateto', filters.dateTo);

  return params;
}


const API_ENDPOINTS = {
  shifts: {
    available: '/api/shifts/available',
    filterOptions: '/api/shifts/filter-options/search',
  },
  workers: {
    claims: '/api/workers/claims',
  },
};


export const useAvailableShifts = (filters?: ShiftFilters) => {
  return useInfiniteQuery({
    queryKey: ["available-shifts", filters],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const params = buildShiftFilterParams(filters, {
        page: String(pageParam),
      });

      const { data } = await axios.get<PaginatedResponse<Shift>>(
        `${API_ENDPOINTS.shifts.available}?${params.toString()}`
      );
      return data;
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.links?.next ? allPages.length : undefined;
    },
  });
};


export const useSearchableFilterOptions = (
  type: 'locations' | 'jobTypes',
  searchTerm?: string,
  limit = 20,
  filters?: ShiftFilters,
  enabled = true
) => {
  return useInfiniteQuery({
    queryKey: ["searchable-filter-options", type, searchTerm, filters],
    initialPageParam: 0,
    enabled,
    queryFn: async ({ pageParam }) => {
      const params = buildShiftFilterParams(filters, {
        type,
        limit: String(limit),
        page: String(pageParam),
      });

      if (searchTerm) {
        params.set('search', searchTerm);
      }

      const { data } = await axios.get<string[]>(
        `${API_ENDPOINTS.shifts.filterOptions}?${params.toString()}`
      );
      return data;
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length < limit ? undefined : allPages.length;
    },
  });
};

export const useBookedShifts = (page = 0) => {
  const { data: worker } = useCurrentWorker();
  
  return useQuery({
    queryKey: ["booked-shifts", worker?.id, page],
    enabled: !!worker?.id,
    queryFn: async () => {
      if (!worker?.id) throw new Error("Worker ID required");
      
      const { data } = await axios.get<PaginatedResponse<Shift>>(
        `${API_ENDPOINTS.workers.claims}?page=${page}&workerId=${worker.id}`
      );
      return data;
    },
  });
};