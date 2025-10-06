import { RefObject, SyntheticEvent } from "react";
import { Box, Paper, Tabs, Tab } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import { Work, Assignment } from "@mui/icons-material";

import { AvailableShifts } from "../AvailableShifts";
import BookedShifts from "../BookedShifts";

interface MobileShiftViewProps {
  activeTab: number;
  onTabChange: (event: SyntheticEvent, value: number) => void;
  scrollRef: RefObject<HTMLDivElement>;
  paperStyles: SxProps<Theme>;
}

const MobileShiftView = ({
  activeTab,
  onTabChange,
  scrollRef,
  paperStyles,
}: MobileShiftViewProps) => {
  return (
    <Box sx={{ height: 'calc(100vh - 140px)', display: 'flex', flexDirection: 'column' }}>
      <Paper
        elevation={0}
        sx={{
          ...paperStyles,
          position: 'sticky',
          top: 0,
          zIndex: 100,

        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={activeTab}
            onChange={onTabChange}
            aria-label="shift tabs"
            variant="fullWidth"
          >
            <Tab
              icon={<Work />}
              label="Available"
              id="shift-tab-0"
              aria-controls="shift-tabpanel-0"
              sx={{ minHeight: 48 }}
            />
            <Tab
              icon={<Assignment />}
              label="My Shifts"
              id="shift-tab-1"
              aria-controls="shift-tabpanel-1"
              sx={{ minHeight: 48 }}
            />
          </Tabs>
        </Box>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          ...paperStyles,
          flex: 1,
          borderRadius: '0 0 12px 12px',
          mt: 0,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'none',
        }}
      >
        <Box
          ref={scrollRef}
          sx={{
            flex: 1,
            overflow: 'auto',
            px: 4,
          }}
        >
          <Box sx={{ display: activeTab === 0 ? 'block' : 'none' }}>
            <AvailableShifts
              scrollContainerRef={scrollRef}
            />
          </Box>
          <Box sx={{ display: activeTab === 1 ? 'block' : 'none' }}>
            <BookedShifts
              scrollContainerRef={scrollRef}
            />
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default MobileShiftView;
