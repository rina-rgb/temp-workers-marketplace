import { useMemo, useState } from "react";
import { useQueryClient, type InfiniteData } from "@tanstack/react-query";

import { useAvailableShifts } from "./useShiftQueries";
import { useClaimShift } from "./useShiftMutations";
import { useInfiniteScroll } from "./useInfiniteScroll";
import { useShiftFilters } from "./useShiftFilters";
import { groupShiftsByDate, sortShiftsWithinGroup } from "../utils/dateUtils";
import { Shift, type PaginatedResponse } from "../types";

export function useAvailableShiftFeed() {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [claimingId, setClaimingId] = useState<number | null>(null);

  const { filters: searchFilters, setFilters: setSearchFilters, activeFiltersCount } = useShiftFilters();

  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useAvailableShifts(searchFilters);

  const allShifts = useMemo(() => {
    return data?.pages.flatMap(page => page.data) ?? [];
  }, [data]);

  const { loadingElementRef } = useInfiniteScroll({
    hasNextPage: !!hasNextPage,
    isLoading: isLoading || Boolean(isFetchingNextPage),
    onLoadMore: () => {
      if (hasNextPage && !isFetchingNextPage) {
        void fetchNextPage();
      }
    },
  });

  const groupedShifts = useMemo(() => {
    return groupShiftsByDate(allShifts).map(group => ({
      ...group,
      shifts: sortShiftsWithinGroup(group.shifts)
    }));
  }, [allShifts]);
  const queryKey = ["available-shifts", searchFilters];

  const claimMutation = useClaimShift({
    onSuccess: (message: string, claimedShift: Shift) => {
      setSuccessMessage(message);
      queryClient.setQueryData<InfiniteData<PaginatedResponse<Shift>>>(queryKey, (existing) => {
        if (!existing) return existing;

        const updatedPages = existing.pages.map(page => ({
          ...page,
          data: page.data.filter(shift => shift.id !== claimedShift.id),
        }));

        return {
          ...existing,
          pages: updatedPages,
          pageParams: [...existing.pageParams],
        };
      });
    },
    onError: (message: string) => {
      setErrorMessage(message);
    }
  });

  const handleClaimShift = (shiftId: number) => {
    setClaimingId(shiftId);
    claimMutation.mutate(shiftId, {
      onSettled: () => setClaimingId(null),
    });
  };

  const clearAllFilters = () => {
    setSearchFilters({});
  };

  const state = {
    filters: {
      data: searchFilters,
      set: setSearchFilters,
      clear: clearAllFilters,
      activeCount: activeFiltersCount,
    },
    pagination: {
      groupedShifts,
      total: allShifts.length,
    hasNextPage: !!hasNextPage,
    loadingRef: loadingElementRef,
    isInitial: isLoading && !data,
    isFetchingMore: isFetchingNextPage,
  },
    status: {
      isLoading,
      isError,
      error,
    },
    claim: {
      claimingId,
      isPending: claimMutation.isPending,
      handle: handleClaimShift,
      successMessage,
      errorMessage,
      clearSuccess: () => setSuccessMessage(""),
      clearError: () => setErrorMessage(""),
    },
  };

  return state;
}

export type AvailableShiftFeedState = ReturnType<typeof useAvailableShiftFeed>;
