import { useState } from "react";
import { useMediaQuery, useTheme } from "@mui/material";

import LoadingSpinner from "./ui/LoadingSpinner";
import ErrorAlert from "./ui/ErrorAlert";
import NotificationSnackbars from "./ui/NotificationSnackbars";
import BackToTopButton from "./ui/BackToTopButton";
import BookedShiftsHeader from "./BookedShifts/BookedShiftsHeader";
import CancellationModal from "./CancellationModal";
import BookedShiftsList from "./BookedShifts/BookedShiftsList";

import { useBookedShiftFeed } from "../hooks/useBookedShiftFeed";
import { isWithinMinimumCancellationHours } from "../utils/shiftUtils";

export interface BookedShiftsProps {
  scrollContainerRef?: React.RefObject<HTMLElement>;
}

const BookedShifts = ({
  scrollContainerRef,
}: BookedShiftsProps) => {
  const {
    pagination: paginationState,
    status: feedStatus,
    cancellation: cancellationState,
  } = useBookedShiftFeed();
  const theme = useTheme();
  const isMobileView = useMediaQuery(theme.breakpoints.down('md'));
  const [showPastShifts, setShowPastShifts] = useState(false);

  const {
    groupedShifts,
    total: totalCount,
    hasNextPage,
    isFetchingMore: isLoadingMore,
    loadingRef: loadMoreRef,
    isInitial,
  } = paginationState;

  const { isError, error } = feedStatus;

  const {
    start: startCancellation,
    busyId: cancellingShiftId,
    isLoading: isCancelling,
    modalShift,
    successMessage,
    clearSuccess: clearCancellationSuccess,
    close: closeCancellationModal,
    confirm: confirmCancellation,
  } = cancellationState;

  if (isInitial) return <LoadingSpinner />;
  if (isError) return <ErrorAlert error={error} message="Error loading shifts" />;

  const isLastMinuteCancellation = !!(modalShift && isWithinMinimumCancellationHours(modalShift, new Date()));


  return (
    <>
      <BookedShiftsHeader
        showPastShifts={showPastShifts}
        onTogglePastShifts={(next) => setShowPastShifts(next)}
        isMobile={isMobileView}
      />

      <BookedShiftsList
        groupedShifts={groupedShifts}
        showPastShifts={showPastShifts}
        onCancelClick={startCancellation}
        cancellingShiftId={cancellingShiftId}
        isCancelling={isCancelling}
        loadMoreRef={loadMoreRef}
        hasNextPage={hasNextPage}
        isLoadingMore={isLoadingMore}
        totalCount={totalCount}
      />

      {successMessage && (
        <NotificationSnackbars
          successMessage={successMessage}
          errorMessage=""
          onClearSuccess={clearCancellationSuccess}
          onClearError={() => {}}
        />
      )}

      <CancellationModal
        open={!!modalShift}
        shift={modalShift}
        isLastMinute={isLastMinuteCancellation}
        isLoading={isCancelling}
        onClose={closeCancellationModal}
        onConfirm={confirmCancellation}
      />
        <BackToTopButton
          targetRef={scrollContainerRef}
          containerPosition="absolute"
        />
    </>
  );
};

export default BookedShifts;
