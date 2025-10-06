import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  Typography,
  Box,
  Stack,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Shift } from "../types";
import { CANCELLATION_MODAL_TEXT } from "../constants/cancellationModal";

type Props = {
  open: boolean;
  shift: Shift | null;
  isLastMinute: boolean;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
};

export default function CancellationModal({
  open,
  shift,
  isLastMinute,
  isLoading,
  onClose,
  onConfirm,
}: Props) {
  const [reason, setReason] = useState("");

  const canCancelDirectly = !isLastMinute;

  useEffect(() => {
    if (open) setReason("");
  }, [open]);

  const titleId = "cancel-shift-title";

  const { dateLabel, startLabel, endLabel, workplaceLabel } = useMemo(() => {
    if (!shift) {
      return { dateLabel: "", startLabel: "", endLabel: "", workplaceLabel: "" };
    }
    const start = new Date(shift.startAt);
    const end = new Date(shift.endAt);

    const dateLabel = start.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    const timeFmt: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit" };
    const startLabel = start.toLocaleTimeString(undefined, timeFmt);
    const endLabel = end.toLocaleTimeString(undefined, timeFmt);
    const workplaceLabel = shift.workplace?.name || `Workplace ${shift.workplaceId}`;
    return { dateLabel, startLabel, endLabel, workplaceLabel };
  }, [shift]);

  if (!shift) return null;

  return (
    <Dialog
      open={open}
      aria-labelledby={titleId}
      maxWidth="sm"
      fullWidth
      onClose={(_, reasonClose) => {
        if (!isLoading && reasonClose !== "backdropClick") onClose();
      }}
    >
      <DialogTitle id={titleId}>{CANCELLATION_MODAL_TEXT.dialogTitle}</DialogTitle>

      <DialogContent>
        <Stack spacing={2}>
          <Typography>{CANCELLATION_MODAL_TEXT.confirmationMessage}</Typography>

          {isLastMinute && (
            <Alert severity="warning">
              <Stack spacing={0.5}>
                <Typography variant="body2" fontWeight={600}>
                  {CANCELLATION_MODAL_TEXT.lastMinuteWarning.title}
                </Typography>
                <Typography variant="body2">
                  {CANCELLATION_MODAL_TEXT.lastMinuteWarning.message(
                    shift.minCancellationHours || 0,
                    shift.contactPersonName || "the manager",
                    shift.contactPersonNumber || "the provided number"
                  )}
                </Typography>
              </Stack>
            </Alert>
          )}

          {canCancelDirectly && (
            <Alert severity="info">
              <Typography variant="body2">
                {CANCELLATION_MODAL_TEXT.immediateInfo}
              </Typography>
            </Alert>
          )}

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              {CANCELLATION_MODAL_TEXT.shiftDetails.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {CANCELLATION_MODAL_TEXT.shiftDetails.location(workplaceLabel)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {CANCELLATION_MODAL_TEXT.shiftDetails.time(
                dateLabel,
                startLabel,
                endLabel
              )}
            </Typography>
          </Box>

          <TextField
            fullWidth
            multiline
            rows={3}
            label={CANCELLATION_MODAL_TEXT.reasonField.label}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={CANCELLATION_MODAL_TEXT.reasonField.placeholder}
            inputProps={{ "data-testid": "cancel-reason" }}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          {CANCELLATION_MODAL_TEXT.buttons.keep}
        </Button>
        <Button
          onClick={() => onConfirm(reason)}
          color={isLastMinute ? "warning" : "secondary"}
          variant="contained"
          disabled={isLoading}
          sx={{ px: 3, minWidth: 140 }}
        >
          {isLastMinute
            ? (isLoading
                ? CANCELLATION_MODAL_TEXT.buttons.sendRequestLoading
                : CANCELLATION_MODAL_TEXT.buttons.sendRequest)
            : (isLoading
                ? CANCELLATION_MODAL_TEXT.buttons.cancelImmediateLoading
                : CANCELLATION_MODAL_TEXT.buttons.cancelImmediate)}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
