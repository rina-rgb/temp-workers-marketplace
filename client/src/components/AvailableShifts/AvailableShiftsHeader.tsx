import { Box, Button, Chip, IconButton, Typography } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";
import StickyHeader from "../ui/StickyHeader";

interface AvailableShiftsHeaderProps {
  activeFiltersCount: number;
  onOpenFilters: () => void;
  onClearFilters: () => void;
  disableClear?: boolean;
  isMobile?: boolean;
}

const AvailableShiftsHeader = ({
  activeFiltersCount,
  onOpenFilters,
  onClearFilters,
  disableClear = false,
  isMobile = false,
}: AvailableShiftsHeaderProps) => {
  const hasActiveFilters = activeFiltersCount > 0;

  return (
    <StickyHeader title="Available Shifts" isMobile={isMobile}>
        {hasActiveFilters && (
          <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            (filtered)
          </Typography>
        )}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {hasActiveFilters && (
          <>
            <Chip
              label={`${activeFiltersCount} filter${activeFiltersCount !== 1 ? 's' : ''}`}
              size="small"
              color="primary"
              variant="outlined"
            />
            <IconButton
              size="small"
              onClick={onClearFilters}
              title="Clear all filters"
              disabled={disableClear}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          </>
        )}
        <Button
          variant="outlined"
          startIcon={<FilterListIcon />}
          onClick={onOpenFilters}
          size="small"
        >
          Filters
        </Button>
      </Box>
    </StickyHeader>
  );
};

export default AvailableShiftsHeader;
