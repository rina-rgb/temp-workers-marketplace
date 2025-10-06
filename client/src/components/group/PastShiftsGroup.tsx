import { Typography, Divider, Box } from "@mui/material";
import { ShiftGroup } from "../../utils/shiftGrouping";
import ShiftDateGroup from "./ShiftDateGroup";
import ShiftCard from "../ShiftCard";

interface PastShiftsGroupProps {
  groupedShifts: ShiftGroup[];
}

const PastShiftsGroup = ({ groupedShifts }: PastShiftsGroupProps) => {

  return (
    <>
      <Divider sx={{ my: 1 }} />
      <Typography variant="h6" sx={{ color: "text.secondary", fontWeight: 600, mb: 2 }}>
        Past Shifts
      </Typography>
      {groupedShifts.map((group, idx) => (
        <ShiftDateGroup
          key={group.date}
          date={group.date}
          displayDate={group.displayDate}
          shifts={group.shifts}
          showDivider={idx < groupedShifts.length - 1}
          variant="secondary"
        >
          {group.shifts.map((shift) => (
            <Box key={shift.id} sx={{ opacity: 0.6, filter: 'grayscale(0.3)' }}>
              <ShiftCard shift={shift} />
            </Box>
          ))}
        </ShiftDateGroup>
      ))}
    </>
  );
}

export default PastShiftsGroup;
