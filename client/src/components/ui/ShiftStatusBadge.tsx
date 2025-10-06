import { Chip } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import WarningIcon from "@mui/icons-material/Warning";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";

interface ShiftStatusBadgeProps {
  status: 'confirmed' | 'flagged' | 'cancelled_pending' | 'pending-cancellation' | 'pending' | 'completed';
  size?: 'small' | 'medium';
}

const ShiftStatusBadge = ({ status, size = 'small' }: ShiftStatusBadgeProps) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'confirmed':
        return {
          label: 'Confirmed',
          color: 'success',
          icon: <CheckCircleIcon fontSize="small" />,
          sx: { backgroundColor: 'success.light', color: 'success.dark' }
        };
      case 'flagged':
        return {
          label: 'Flagged',
          color: 'error',
          icon: <WarningIcon fontSize="small" />,
          sx: { backgroundColor: 'error.light', color: 'error.dark' }
        };
      case 'cancelled_pending':
        return {
          label: 'Cancellation Pending',
          color: 'error',
          icon: <HourglassTopIcon fontSize="small" />,
          sx: { 
            backgroundColor: 'error.light', 
            color: 'error.dark',
            opacity: 0.8,
            fontStyle: 'italic'
          }
        };
      case 'pending-cancellation':
        return {
          label: 'Contact Required',
          color: 'error',
          icon: <PendingIcon fontSize="small" />,
          sx: { 
            backgroundColor: 'error.light', 
            color: 'error.dark',
            fontWeight: 600
          }
        };
      case 'pending':
        return {
          label: 'Pending',
          color: 'warning',
          icon: <HourglassTopIcon fontSize="small" />,
          sx: { 
            backgroundColor: '#fff3cd', 
            color: '#b8860b',
            border: '1px solid #ffd633',
            fontWeight: 600
          }
        };
      case 'completed':
        return {
          label: 'Completed',
          color: 'default',
          icon: <CheckCircleIcon fontSize="small" />,
          sx: { 
            backgroundColor: 'grey.300',
            color: 'text.secondary',
            fontWeight: 600
          }
        };
      default:
        return {
          label: 'Unknown',
          color: 'default',
          icon: null,
          sx: {}
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Chip
      label={config.label}
      size={size}
      variant="filled"
      sx={{
        fontWeight: 600,
        ...config.sx
      }}
    />
  );
}

export default ShiftStatusBadge;
