import { useState, useRef, SyntheticEvent } from "react";
import { Container, Typography, Box, useTheme, useMediaQuery } from "@mui/material";
import MobileShiftView from "./dashboard/MobileShiftView";
import DesktopShiftView from "./dashboard/DesktopShiftView";
import { useCurrentWorker } from "../hooks/useWorker";

const ShiftDashboard = () => {
  const { data: worker, isLoading } = useCurrentWorker();
  const [activeTab, setActiveTab] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const availableShiftsScrollRef = useRef<HTMLDivElement>(null);
  const bookedShiftsScrollRef = useRef<HTMLDivElement>(null);
  const mobileScrollRef = useRef<HTMLDivElement>(null);

  const handleTabChange = (_event: SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const paperStyles = {
    p: isMobile ? 0 : 4,
    borderRadius: 3,
    background: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.2)",
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 3,
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 1, sm: 0 },
      }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            color: "text.primary",
            textShadow: "0 2px 4px rgba(0,0,0,0.05)",
            fontSize: { xs: '1.5rem', sm: '1.875rem' },
          }}
        >
          My Shifts Dashboard
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: "text.secondary",
            fontWeight: 500,
            fontSize: { xs: '0.875rem', sm: '1rem' },
          }}
        >
          {isLoading ? "Loading..." : `Hello ${worker?.name || "Worker"}`}
        </Typography>
      </Box>

      {isMobile ? (
        <>
          <MobileShiftView
            activeTab={activeTab}
            onTabChange={handleTabChange}
            scrollRef={mobileScrollRef}
            paperStyles={paperStyles}
          />
        </>
      ) : (
        <DesktopShiftView
          paperStyles={paperStyles}
          availableScrollRef={availableShiftsScrollRef}
          bookedScrollRef={bookedShiftsScrollRef}
        />
      )}
    </Container>
  );
};

export default ShiftDashboard;
