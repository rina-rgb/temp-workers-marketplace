import { Button } from "@mui/material";
import { Shift } from "../../types";

interface CancelButtonProps {
  shift: Shift;
  onClick: (shift: Shift) => void;
  disabled: boolean;
  loading: boolean;
  isPending: boolean;
}

const CancelButton = ({ shift, onClick, disabled, loading, isPending }: CancelButtonProps) => {
  return (
    <Button
      variant="contained"
      color={isPending ? "inherit" : "secondary"}
      onClick={() => onClick(shift)}
      disabled={disabled}
      size="medium"
      sx={{
        py: 1,
        px: 3,
        minWidth: 140,
        ...(isPending ? {
          backgroundColor: 'white',
          color: 'text.primary',
          border: '2px solid',
          borderColor: 'primary.main',
          '&:hover': {
            backgroundColor: 'grey.100',
            borderColor: 'primary.main'
          }
        } : {})
      }}
    >
      {loading ? "Processing..." : isPending ? "Keep Shift" : "Cancel"}
    </Button>
  );
}

export default CancelButton;
