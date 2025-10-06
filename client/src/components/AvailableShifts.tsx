import { useState } from "react";
import { useMediaQuery, useTheme } from "@mui/material";

import ShiftFiltersModal from "./ShiftFiltersModal";
import LoadingSpinner from "./ui/LoadingSpinner";
import ErrorAlert from "./ui/ErrorAlert";
import NotificationSnackbars from "./ui/NotificationSnackbars";
import BackToTopButton from "./ui/BackToTopButton";
import AvailableShiftsHeader from "./AvailableShifts/AvailableShiftsHeader";
import AvailableShiftsList from "./AvailableShifts/AvailableShiftsList";

import { useAvailableShiftFeed } from "../hooks/useAvailableShiftFeed";
import { ShiftFilters as ShiftFiltersType } from "../types";

export interface AvailableShiftsProps {
  scrollContainerRef?: React.RefObject<HTMLElement>;
}



export const AvailableShifts = ({
  scrollContainerRef,
}: AvailableShiftsProps) => {
  const {
    filters: filterState,
    pagination: paginationState,
    status: statusState,
    claim: claimState,
  } = useAvailableShiftFeed();
  const [filtersModalOpen, setFiltersModalOpen] = useState(false);
  const theme = useTheme();
  const isMobileView = useMediaQuery(theme.breakpoints.down('md'));

  const {
    data: currentFilters,
    set: setFilters,
    clear: clearFilters,
    activeCount: activeFiltersCount,
  } = filterState;

  const {
    groupedShifts,
    total: totalCount,
    hasNextPage,
    isFetchingMore: isLoadingMore,
    loadingRef: loadMoreRef,
    isInitial: isInitialLoad,
  } = paginationState;

  const { isLoading, isError, error } = statusState;

  const {
    handle: claimShift,
    claimingId,
    isPending: isClaimPending,
    successMessage,
    errorMessage,
    clearSuccess,
    clearError,
  } = claimState;

  const handleSearch = (nextFilters: ShiftFiltersType) => {
    setFilters(nextFilters);
  };

  if (isInitialLoad) return <LoadingSpinner />;
  if (isError) return <ErrorAlert error={error} message="Unable to load available shifts." />;

  return (
    <>
      <AvailableShiftsHeader
        activeFiltersCount={activeFiltersCount}
        onOpenFilters={() => setFiltersModalOpen(true)}
        onClearFilters={clearFilters}
        disableClear={isLoading}
        isMobile={isMobileView}
      />
      <AvailableShiftsList
        groupedShifts={groupedShifts}
        totalCount={totalCount}
        isInitialLoad={isInitialLoad}
        isLoadingMore={isLoadingMore}
        hasNextPage={hasNextPage}
        loadMoreRef={loadMoreRef}
        activeFiltersCount={activeFiltersCount}
        onClaimShift={claimShift}
        claimingShiftId={claimingId}
        isClaimInFlight={isClaimPending}
      />
      <NotificationSnackbars
        successMessage={successMessage}
        errorMessage={errorMessage}
        onClearSuccess={clearSuccess}
        onClearError={clearError}
      />
      <BackToTopButton
        targetRef={scrollContainerRef}
        containerPosition="absolute"
      />
      <ShiftFiltersModal
        filters={currentFilters}
        onSearch={handleSearch}
        activeFiltersCount={activeFiltersCount}
        isLoading={isLoading}
        open={filtersModalOpen}
        onClose={() => setFiltersModalOpen(false)}
      />
    </>
  );
};

export default AvailableShifts;
