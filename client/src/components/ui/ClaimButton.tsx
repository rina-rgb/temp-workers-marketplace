import { Button } from "@mui/material";
import { Shift } from "../../types";

interface ClaimButtonProps {
  shift: Shift;
  onClick: (shiftId: number) => void;
  disabled: boolean;
  loading: boolean;
}

const ClaimButton = ({ shift, onClick, disabled, loading }: ClaimButtonProps) => {
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={() => onClick(shift.id)}
      disabled={disabled}
      fullWidth
      size="medium"
      sx={{ py: 1, fontSize: "0.95rem", fontWeight: 600 }}
    >
      {loading ? "Claiming..." : "Claim Shift"}
    </Button>
  );
}

export default ClaimButton;
