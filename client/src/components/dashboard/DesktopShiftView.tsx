import { RefObject } from "react";
import { Box, Grid, Paper } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

import { AvailableShifts } from "../AvailableShifts";
import BookedShifts from "../BookedShifts";

interface DesktopShiftViewProps {
  paperStyles: SxProps<Theme>;
  availableScrollRef: RefObject<HTMLDivElement>;
  bookedScrollRef: RefObject<HTMLDivElement>;
}

const DesktopShiftView = ({
  paperStyles,
  availableScrollRef,
  bookedScrollRef,
}: DesktopShiftViewProps) => {
  return (
    <Grid container spacing={4} sx={{ height: 'calc(100vh - 200px)' }}>
      <Grid item xs={12} md={6} sx={{ height: '100%' }}>
        <Paper
          elevation={0}
          sx={{
            ...paperStyles,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            position: 'relative',
          }}
        > 
          <Box
            ref={availableScrollRef}
            sx={{
              flex: 1,
              overflow: 'auto',
              '&::-webkit-scrollbar': { width: '8px' },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '4px',
                '&:hover': { background: 'rgba(0,0,0,0.5)' },
              },
            }}
          >
            <AvailableShifts
              scrollContainerRef={availableScrollRef}
            />
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6} sx={{ height: '100%' }}>
        <Paper
          elevation={0}
          sx={{
            ...paperStyles,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <Box
            ref={bookedScrollRef}
            sx={{
              flex: 1,
              overflow: 'auto',
              '&::-webkit-scrollbar': { width: '8px' },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '4px',
                '&:hover': { background: 'rgba(0,0,0,0.5)' },
              },
            }}
          >
            <BookedShifts
              scrollContainerRef={bookedScrollRef}   
            />
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default DesktopShiftView;
