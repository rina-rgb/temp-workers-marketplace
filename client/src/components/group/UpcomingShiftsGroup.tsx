import { Shift } from "../../types";
import { ShiftGroup } from "../../utils/shiftGrouping";
import ShiftDateGroup from "./ShiftDateGroup";
import ShiftCard from "../ShiftCard";
import CancelButton from "../ui/CancelButton";
interface UpcomingShiftsGroupProps {
  groupedShifts: ShiftGroup[];
  onCancelClick: (shift: Shift) => void;
  cancellingId: number | null;
  isLoading: boolean;
}

const UpcomingShiftsGroup = ({
  groupedShifts,
  onCancelClick,
  cancellingId,
  isLoading,
}: UpcomingShiftsGroupProps) => {
  
  return (
    <>
      {groupedShifts.map((group, idx) => (
        <ShiftDateGroup
          key={group.date}
          date={group.date}
          displayDate={group.displayDate}
          shifts={group.shifts}
          showDivider={idx < groupedShifts.length - 1}
          variant="primary"
        >
          {group.shifts.map((shift) => {
            const isPending = shift.pendingCancellationAt !== null;
            const isCurrentlyLoading = cancellingId === shift.id && isLoading;
            
            return (
              <ShiftCard
                key={shift.id}
                shift={shift}
                actionButton={
                  <CancelButton
                    shift={shift}
                    onClick={onCancelClick}
                    disabled={isLoading}
                    loading={isCurrentlyLoading}
                    isPending={isPending}
                  />
                }
              />
            );
          })}
        </ShiftDateGroup>
      ))}
    </>
  );
}

export default UpcomingShiftsGroup;
