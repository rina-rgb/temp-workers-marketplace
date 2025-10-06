import { FormControlLabel, Checkbox } from "@mui/material";

import StickyHeader from "../ui/StickyHeader";

interface BookedShiftsHeaderProps {
  showPastShifts: boolean;
  onTogglePastShifts: (show: boolean) => void;
  isMobile?: boolean;
}

const BookedShiftsHeader = ({ showPastShifts, onTogglePastShifts, isMobile = false}: BookedShiftsHeaderProps) => {
  return (
    <StickyHeader title="My Booked Shifts" isMobile={isMobile}>
      <FormControlLabel
        control={
          <Checkbox
            checked={showPastShifts}
            onChange={(event) => onTogglePastShifts(event.target.checked)}
            size="small"
          />
        }
        label="View past shifts"
        sx={{ ml: 2 }}
      />
    </StickyHeader>
  );
};

export default BookedShiftsHeader;
