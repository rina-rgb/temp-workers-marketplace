import { Box, Typography } from "@mui/material";

interface EmptyStateProps {
  title: string;
  subtitle: string;
}

const EmptyState = ({ title, subtitle }: EmptyStateProps) => {
  return (
    <Box sx={{ textAlign: "center", py: 4 }}>
      <Typography color="text.secondary" variant="body1">
        {title}
      </Typography>
      <Typography color="text.secondary" variant="body2" sx={{ mt: 1 }}>
        {subtitle}
      </Typography>
    </Box>
  );
}

export default EmptyState;
