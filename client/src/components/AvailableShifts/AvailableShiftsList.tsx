import { MutableRefObject } from "react";
import { Box, CircularProgress, Divider, Typography } from "@mui/material";

import ShiftCard from "../ShiftCard";
import ClaimButton from "../ui/ClaimButton";
import EmptyState from "../ui/EmptyState";
import { GroupedShifts } from "../../utils/dateUtils";

interface AvailableShiftsListProps {
  groupedShifts: GroupedShifts[];
  totalCount: number;
  isInitialLoad: boolean;
  isLoadingMore: boolean;
  hasNextPage: boolean;
  loadMoreRef: MutableRefObject<HTMLDivElement | null>;
  activeFiltersCount: number;
  onClaimShift: (shiftId: number) => void;
  claimingShiftId: number | null;
  isClaimInFlight: boolean;
}

const AvailableShiftsList = ({
  groupedShifts,
  totalCount,
  isInitialLoad,
  isLoadingMore,
  hasNextPage,
  loadMoreRef,
  activeFiltersCount,
  onClaimShift,
  claimingShiftId,
  isClaimInFlight,
}: AvailableShiftsListProps) => {
  if (!isInitialLoad && totalCount === 0) {
    return (
      <EmptyState
        title={activeFiltersCount > 0 ? "No shifts match your current filters" : "No shifts are currently available"}
        subtitle={activeFiltersCount > 0 ? "Try adjusting your filters to see more shifts" : "Check back later for new opportunities"}
      />
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {groupedShifts.map((dateGroup, groupIndex) => {
        const { date, displayDate, shifts } = dateGroup;
        const shiftCount = shifts.length;

        return (
          <Box key={date}>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                color: "primary.main",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            {displayDate}
            <Typography component="span" variant="body2" color="text.secondary">
              ({shiftCount} shift{shiftCount !== 1 ? 's' : ''})
            </Typography>
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 2 }}>
            {shifts.map((shift) => (
              <ShiftCard
                key={shift.id}
                shift={shift}
                actionButton={
                  <ClaimButton
                    shift={shift}
                    onClick={onClaimShift}
                    disabled={claimingShiftId === shift.id && isClaimInFlight}
                    loading={claimingShiftId === shift.id && isClaimInFlight}
                  />
                }
              />
            ))}
          </Box>

          {groupIndex < groupedShifts.length - 1 && (
            <Divider sx={{ mt: 2, mb: 1 }} />
          )}
        </Box>
        );
      })}

      {totalCount > 0 && hasNextPage && (
        <Box
          ref={loadMoreRef}
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 3,
            py: 2,
            minHeight: '50px'
          }}
        >
          {isLoadingMore && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={20} />
              <Typography variant="body2" color="text.secondary">
                Loading more shifts...
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default AvailableShiftsList;
