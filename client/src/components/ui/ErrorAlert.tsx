import { Alert, Box } from "@mui/material";

interface ErrorAlertProps {
  error?: unknown;
  message?: string;
}

const ErrorAlert = ({ 
  error, 
  message = "Unable to load data. Please check your connection and try again." 
}: ErrorAlertProps) => {
  return (
    <Alert severity="error" sx={{ mb: 2 }}>
      {message}
      {!!error && (
        <Box component="details" sx={{ mt: 1, fontSize: "0.875rem" }}>
          <summary style={{ cursor: "pointer" }}>Technical details</summary>
          <span>{error instanceof Error ? error.message : String(error || '')}</span>
        </Box>
      )}
    </Alert>
  );
}

export default ErrorAlert;
