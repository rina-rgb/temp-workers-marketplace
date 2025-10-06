import { Box, Typography } from "@mui/material";
import { ReactNode } from "react";

interface StickyHeaderProps {
  title?: string;
  titleNode?: ReactNode;
  isMobile?: boolean;
  children?: ReactNode;
}

const StickyHeader = ({ title, titleNode, isMobile = false, children }: StickyHeaderProps) => {
  return (
    <Box sx={{
      position: 'sticky',
      top: 0,
      zIndex: 10,
      backgroundColor: isMobile ? '#ffffff' : 'background.paper',
      borderBottom: '1px solid',
      borderColor: 'divider',
      pt: isMobile ? 2 : 3,
      pb: 1,
      mb: 2,
      mx: isMobile ? -2 : 0,
      px: isMobile ? 2 : 0,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      {titleNode || <Typography variant="h6">{title}</Typography>}
      {children}
    </Box>
  );
};

export default StickyHeader;