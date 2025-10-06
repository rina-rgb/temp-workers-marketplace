import { MutableRefObject } from "react";
import { Box, CircularProgress, Divider, Typography } from "@mui/material";

import EmptyState from "../ui/EmptyState";
import ShiftCard from "../ShiftCard";
import CancelButton from "../ui/CancelButton";
import ShiftDateGroup from "../group/ShiftDateGroup";
import { ShiftGroup } from "../../utils/shiftGrouping";
import { Shift } from "../../types";

interface BookedShiftsListProps {
  groupedShifts: {
    groupedUpcoming: ShiftGroup[];
    groupedPast: ShiftGroup[];
    upcomingShifts: Shift[];
    pastShifts: Shift[];
  };
  showPastShifts: boolean;
  onCancelClick: (shift: Shift) => void;
  cancellingShiftId: number | null;
  isCancelling: boolean;
  loadMoreRef: MutableRefObject<HTMLDivElement | null>;
  hasNextPage: boolean;
  isLoadingMore: boolean;
  totalCount: number;
}

const BookedShiftsList = ({
  groupedShifts,
  showPastShifts,
  onCancelClick,
  cancellingShiftId,
  isCancelling,
  loadMoreRef,
  hasNextPage,
  isLoadingMore,
  totalCount,
}: BookedShiftsListProps) => {
  const { groupedUpcoming, groupedPast, upcomingShifts, pastShifts } = groupedShifts;

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {showPastShifts ? (
          pastShifts.length === 0 ? (
            <EmptyState
              title="No past shifts"
              subtitle="Your completed shifts will appear here"
            />
          ) : (
            <>
              <Typography variant="h6" sx={{ color: "text.secondary", fontWeight: 600, mb: 2 }}>
                Past Shifts
              </Typography>
              {groupedPast.map((dateGroup, groupIndex) => {
                const { date, displayDate, shifts } = dateGroup;

                return (
                  <ShiftDateGroup
                    key={date}
                    date={date}
                    displayDate={displayDate}
                    shifts={shifts}
                    showDivider={groupIndex < groupedPast.length - 1}
                    variant="secondary"
                  >
                    {shifts.map((shift) => (
                      <Box key={shift.id} sx={{ opacity: 0.6, filter: 'grayscale(0.3)' }}>
                        <ShiftCard shift={shift} />
                      </Box>
                    ))}
                  </ShiftDateGroup>
                );
              })}
            </>
          )
        ) : upcomingShifts.length === 0 ? (
          <EmptyState
            title="No upcoming shifts"
            subtitle="Your upcoming booked shifts will appear here"
          />
        ) : (
          groupedUpcoming.map((dateGroup, groupIndex) => {
            const { date, displayDate, shifts } = dateGroup;

            return (
              <ShiftDateGroup
                key={date}
                date={date}
                displayDate={displayDate}
                shifts={shifts}
                showDivider={groupIndex < groupedUpcoming.length - 1}
                variant="primary"
              >
                {shifts.map((shift) => {
                  const isPending = shift.pendingCancellationAt !== null;
                  const isCurrentlyCancelling = cancellingShiftId === shift.id && isCancelling;

                  return (
                    <ShiftCard
                      key={shift.id}
                      shift={shift}
                      actionButton={
                        <CancelButton
                          shift={shift}
                          onClick={onCancelClick}
                          disabled={isCurrentlyCancelling}
                          loading={isCurrentlyCancelling}
                          isPending={isPending}
                        />
                      }
                    />
                  );
                })}
              </ShiftDateGroup>
            );
          })
        )}
      </Box>

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
    </>
  );
};

export default BookedShiftsList;
