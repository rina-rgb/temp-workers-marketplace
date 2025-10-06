import type { ReactNode } from "react";
import { Box, Typography, Divider } from "@mui/material";
import { Shift } from "../../types";

interface ShiftDateGroupProps {
  date: string;
  displayDate: string;
  shifts: Shift[];
  children: ReactNode;
  showDivider?: boolean;
  variant?: "primary" | "secondary";
}

const ShiftDateGroup = ({
  displayDate,
  shifts,
  children,
  showDivider = false,
  variant = "primary",
}: ShiftDateGroupProps) => {
  const isPrimary = variant === "primary";

  return (
    <Box>
      <Typography
        variant={isPrimary ? "h6" : "subtitle1"}
        sx={{
          mb: isPrimary ? 2 : 1.5,
          color: isPrimary ? "primary.main" : "text.secondary",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        {displayDate}
        <Typography 
          component="span" 
          variant="body2" 
          color="text.secondary"
        >
          ({shifts.length} shift{shifts.length !== 1 ? 's' : ''})
        </Typography>
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 2 }}>
        {children}
      </Box>
      
      {showDivider && <Divider sx={{ mt: 2, mb: 1 }} />}
    </Box>
  );
}

export default ShiftDateGroup;
