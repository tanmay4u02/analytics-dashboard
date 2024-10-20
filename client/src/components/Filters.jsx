import { Button, MenuItem, Stack, TextField } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import DateRangeSelect from "./DateRangeSelect";
import ShareButton from "./ShareButton";

const Filters = ({
  ageFilter,
  genderFilter,
  startDate,
  endDate,
  setAgeFilter,
  setGenderFilter,
  setStartDate,
  setEndDate,
}) => {
  const navigate = useNavigate();

  const applyFiltersAndRedirect = () => {
    const params = new URLSearchParams();

    if (ageFilter && ageFilter !== "All") params.set("ageFilter", ageFilter);
    if (genderFilter && genderFilter !== "All")
      params.set("genderFilter", genderFilter);
    startDate?.toDateString &&
      params.set("startDate", startDate.toDateString());
    endDate?.toDateString && params.set("endDate", endDate.toDateString());

    if (params.toString()) {
      localStorage.setItem("analytics_filters", "?" + params.toString());
    } else {
      localStorage.removeItem("analytics_filters");
    }

    navigate({ search: params.toString() });
  };

  return (
    <Stack
      direction="row"
      spacing={2}
      justifyContent="space-between"
      mb={2}
      flexWrap="wrap"
      marginTop="2rem"
      rowGap="1rem"
      alignItems="center"
    >
      <Stack
        direction="row"
        spacing={2}
        flexWrap="wrap"
        justifyContent="space-around"
        rowGap="1.5rem"
      >
        <TextField
          value={ageFilter}
          select
          label="Age"
          onChange={(e) => setAgeFilter(e.target.value)}
          size="small"
          sx={{ minWidth: "8rem" }}
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="15-25">15-25</MenuItem>
          <MenuItem value=">25">Above 25</MenuItem>
        </TextField>

        <TextField
          value={genderFilter}
          select
          label="Gender"
          onChange={(e) => setGenderFilter(e.target.value)}
          size="small"
          sx={{ minWidth: "8rem" }}
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
        </TextField>

        <DateRangeSelect
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={applyFiltersAndRedirect}
        >
          Apply Filters
        </Button>
      </Stack>
      <div style={{ marginLeft: "auto", marginTop: "0.5rem" }}>
        <ShareButton />
      </div>
    </Stack>
  );
};

export default Filters;
