import { Box, CircularProgress } from "@mui/material";

const LoadingSpinner = () => {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
      <CircularProgress />
    </Box>
  );
}

export default LoadingSpinner;
