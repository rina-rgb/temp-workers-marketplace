import { Snackbar, Alert, Portal } from "@mui/material";

interface NotificationSnackbarsProps {
  successMessage: string;
  errorMessage: string;
  onClearSuccess: () => void;
  onClearError: () => void;
}

const NotificationSnackbars = ({
  successMessage,
  errorMessage,
  onClearSuccess,
  onClearError,
}: NotificationSnackbarsProps) => {
  return (
    <Portal container={document.body}>
      <>
        <Snackbar
          open={!!successMessage}
          autoHideDuration={6000}
          onClose={onClearSuccess}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          sx={{
            position: "fixed",
            top: 24,
            zIndex: (theme) => theme.zIndex.snackbar,
          }}
        >
          <Alert severity="success" onClose={onClearSuccess}>
            {successMessage}
          </Alert>
        </Snackbar>

        <Snackbar
          open={!!errorMessage}
          autoHideDuration={6000}
          onClose={onClearError}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          sx={{
            position: "fixed",
            top: 24,
            zIndex: (theme) => theme.zIndex.snackbar,
          }}
        >
          <Alert severity="error" onClose={onClearError}>
            {errorMessage}
          </Alert>
        </Snackbar>
      </>
    </Portal>
  );
}

export default NotificationSnackbars;
