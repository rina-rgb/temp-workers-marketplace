import type { ReactNode } from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { format } from "date-fns";
import { Shift } from "../types";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ShiftStatusBadge from "./ui/ShiftStatusBadge";

interface ShiftCardProps {
  shift: Shift;
  actionButton?: ReactNode;
  statusBadge?: ReactNode;
}

const ShiftCard = ({ shift, actionButton, statusBadge }: ShiftCardProps) => {
  const { jobType, payRate } = shift;
  const location = shift.workplace.name;

  //calculate hours time difference from new Date
  const startTime = Number(new Date(shift.startAt));
  const endTime = Number(new Date(shift.endAt));
  const formattedDateTime = `${format(startTime, "EEE, MMM d")} · ${format(
    endTime,
    "h:mm a"
  )} - ${format(startTime, "h:mm a")}`;

  const timeDifferenceMs = endTime - startTime;
  const totalHours = timeDifferenceMs / (1000 * 60 * 60);

  const totalPayPerHour = totalHours * payRate;

  return (
    <Card variant="outlined" sx={{ overflow: "hidden" }}>
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
          <Typography
            variant="subtitle1"
            sx={{ display: "flex", alignItems: "center", gap: 1, fontWeight: 700 }}
          >
            <PlaceOutlinedIcon fontSize="small" />
            {location}
          </Typography>
          {statusBadge ?? (shift.status && <ShiftStatusBadge status={shift.status} />)}
        </Box>

        <Typography
          variant="body1"
          sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1, fontWeight: 500 }}
        >
          <WorkOutlineIcon fontSize="small" />
          {jobType}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AccessTimeOutlinedIcon fontSize="small" />
            <Typography variant="body2" color="text.secondary">
              {formattedDateTime}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Box sx={{ display: "flex", flexDirection: "row" }}>
              <AttachMoneyIcon fontSize="small" color="success" />
              <Typography variant="body1" sx={{ fontWeight: 700, color: "success.main" }}>
                {payRate}/hour
              </Typography>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row" }}>
              <AttachMoneyIcon fontSize="small" />
              <Typography variant="body1" sx={{ fontWeight: 700, color: "grey" }}>
                {totalPayPerHour}/shift
              </Typography>
            </Box>
          </Box>
        </Box>

        {actionButton && (
          <Box sx={{ mt: 1, display: "flex", justifyContent: "flex-start" }}>{actionButton}</Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ShiftCard;
