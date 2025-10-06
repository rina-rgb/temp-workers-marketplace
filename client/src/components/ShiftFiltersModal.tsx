import {
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { ShiftFilters as FilterType } from "../types";
import { useShiftFilterModalState } from "../hooks/useShiftFilterModalState";

interface ShiftFiltersModalProps {
  filters: FilterType;
  onSearch: (filters: FilterType) => void;
  activeFiltersCount: number;
  isLoading?: boolean;
  open: boolean;
  onClose: () => void;
}

const ShiftFiltersModal = ({
  filters,
  onSearch,
  activeFiltersCount,
  isLoading = false,
  open,
  onClose,
}: ShiftFiltersModalProps) => {
  const {
    draftFilters,
    locations,
    jobTypes,
    locationsLoading,
    jobTypesLoading,
    isFetchingNextLocations,
    isFetchingNextJobTypes,
    today,
    hasFilters,
    locationInputValue,
    jobTypeInputValue,
    locationOpen,
    jobTypeOpen,
    handleLocationOpen,
    handleLocationClose,
    handleJobTypeOpen,
    handleJobTypeClose,
    handleLocationSelect,
    handleJobTypeSelect,
    handleLocationInputChange,
    handleJobTypeInputChange,
    handleLocationScroll,
    handleJobTypeScroll,
    handlePayRateInputChange,
    handleDateFromChange,
    handleDateToChange,
    buildFilters,
    clearFiltersState,
  } = useShiftFilterModalState({ filters, open });

  const handleSearchSubmit = () => {
    const nextFilters = buildFilters();
    onSearch(nextFilters);
    onClose();
  };

  const handleClearFilters = () => {
    const cleared = clearFiltersState();
    onSearch(cleared);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, pr: 6 }}>
          <FilterListIcon color="primary" />
          <Typography variant="h6" component="span">Filter Shifts</Typography>
          {activeFiltersCount > 0 && (
            <Chip
              label={activeFiltersCount}
              size="small"
              color="primary"
              sx={{ ml: 1 }}
            />
          )}
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pb: 2 }}>
        <Grid container spacing={3}>

          <Grid item xs={12} sx={{ mt: 1 }}>
            <Autocomplete
              options={locations}
              value={draftFilters.location ?? null}
              inputValue={locationInputValue}
              open={locationOpen}
              onOpen={handleLocationOpen}
              onClose={handleLocationClose}
              onChange={handleLocationSelect}
              onInputChange={handleLocationInputChange}
              loading={locationsLoading || isFetchingNextLocations}
              disabled={isLoading}
              ListboxProps={{
                onScroll: handleLocationScroll,
                style: { maxHeight: 280, overflow: 'auto' },
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Filter by Location"
                  variant="outlined"
                  placeholder="Search locations..."
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {locationsLoading || isFetchingNextLocations ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
              renderOption={(props, option) => (
                <li {...props} key={option}>
                  {option}
                </li>
              )}
              freeSolo={false}
              clearOnBlur
              selectOnFocus
              handleHomeEndKeys
            />
          </Grid>

          <Grid item xs={12}>
            <Autocomplete
              options={jobTypes}
              value={draftFilters.jobType ?? null}
              inputValue={jobTypeInputValue}
              open={jobTypeOpen}
              onOpen={handleJobTypeOpen}
              onClose={handleJobTypeClose}
              onChange={handleJobTypeSelect}
              onInputChange={handleJobTypeInputChange}
              loading={jobTypesLoading || isFetchingNextJobTypes}
              disabled={isLoading}
              ListboxProps={{
                onScroll: handleJobTypeScroll,
                style: { maxHeight: 280, overflow: 'auto' },
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Filter by Job Type"
                  variant="outlined"
                  placeholder="Search job types..."
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {jobTypesLoading || isFetchingNextJobTypes ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
              renderOption={(props, option) => (
                <li {...props} key={option}>
                  {option}
                </li>
              )}
              freeSolo={false}
              clearOnBlur
              selectOnFocus
              handleHomeEndKeys
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              type="number"
              fullWidth
              label="Min Pay Rate (/hour)"
              value={draftFilters.payRateMin?.toString() || ""}
              onChange={handlePayRateInputChange}
              variant="outlined"
              inputProps={{ min: 0, step: 1 }}
              helperText="Show shifts paying at least this much"
              disabled={isLoading}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              type="date"
              fullWidth
              label="From Date"
              value={draftFilters.dateFrom || ""}
              onChange={handleDateFromChange}
              variant="outlined"
              disabled={isLoading}
              inputProps={{ min: today }}
              helperText="Show shifts from this date onwards"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              type="date"
              fullWidth
              label="To Date"
              value={draftFilters.dateTo || ""}
              onChange={handleDateToChange}
              variant="outlined"
              disabled={isLoading}
              inputProps={{ min: draftFilters.dateFrom || today }}
              helperText="Show shifts up to this date"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          variant="outlined"
          onClick={handleClearFilters}
          disabled={!hasFilters}
          startIcon={<ClearIcon />}
        >
          Clear All
        </Button>
        <Button
          variant="contained"
          onClick={handleSearchSubmit}
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={16} /> : <SearchIcon />}
        >
          Apply Filters
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShiftFiltersModal;
