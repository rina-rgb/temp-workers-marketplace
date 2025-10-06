import { useEffect, useMemo, useState } from "react";

import { useBookedShifts } from "./useShiftQueries";
import { useInfiniteScroll } from "./useInfiniteScroll";
import { useShiftCancellation } from "./useShiftCancellation";
import { groupShifts } from "../utils/shiftGrouping";
import { Shift } from "../types";

export function useBookedShiftFeed() {
  const [successMessage, setSuccessMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [allShifts, setAllShifts] = useState<Shift[]>([]);

  const { data, isLoading, isError, error } = useBookedShifts(currentPage);

  useEffect(() => {
    if (!data?.data) return;

    setAllShifts(prev => {
      if (currentPage === 0) {
        return data.data;
      }

      const existingIds = new Set(prev.map(shift => shift.id));
      const newShifts = data.data.filter(shift => !existingIds.has(shift.id));
      return [...prev, ...newShifts];
    });
  }, [data, currentPage]);

  const hasNextPage = !!data?.links?.next;

  const { loadingElementRef } = useInfiniteScroll({
    hasNextPage,
    isLoading,
    onLoadMore: () => setCurrentPage(prev => prev + 1)
  });

  const cancellation = useShiftCancellation({
    onSuccess: (message) => setSuccessMessage(message),
  });

  const grouping = useMemo(() => groupShifts(allShifts), [allShifts]);

  const state = {
    pagination: {
      groupedShifts: grouping,
      total: allShifts.length,
      hasNextPage,
      loadingRef: loadingElementRef,
      isInitial: isLoading && currentPage === 0,
      isFetchingMore: isLoading && currentPage > 0,
    },
    status: {
      isLoading,
      isError,
      error,
    },
    cancellation: {
      ...cancellation,
      successMessage,
      clearSuccess: () => setSuccessMessage(""),
    },
  };

  return state;
}

export type BookedShiftFeedState = ReturnType<typeof useBookedShiftFeed>;
