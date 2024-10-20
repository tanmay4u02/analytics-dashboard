import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import { Popover, TextField, useMediaQuery } from "@mui/material";
import React, { useRef, useState } from "react";
import { DateRangePicker } from "react-date-range";

const DateRangeSelect = ({ startDate, endDate, setStartDate, setEndDate }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const focusOutFromPopover = useRef(false);

  const onSelect = (ranges) => {
    setStartDate(ranges.selection.startDate);
    setEndDate(ranges.selection.endDate);
  };

  const isLargeScreen = useMediaQuery("(min-width:470px)");

  return (
    <>
      <TextField
        label="Date Range"
        value={`${
          startDate?.toLocaleDateString
            ? startDate?.toLocaleDateString()
            : "Start date"
        } - ${
          endDate?.toLocaleDateString
            ? endDate?.toLocaleDateString()
            : "End date"
        }`}
        onFocus={(event) => {
          if (!focusOutFromPopover.current) {
            setAnchorEl(event.currentTarget);
          } else {
            focusOutFromPopover.current = false;
            event.target.blur();
          }
        }}
        size="small"
        sx={{
          minWidth: "15rem",
          ...(!isLargeScreen && { width: "75%", margin: "0px! important" }),
        }}
      />

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => {
          focusOutFromPopover.current = true;
          setAnchorEl(null);
        }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        style={{ overflowX: "scroll" }}
        className="popover-scrollable"
      >
        {open && (
          <DateRangePicker
            ranges={[
              { startDate: startDate, endDate: endDate, key: "selection" },
            ]}
            onChange={onSelect}
            className="w-full"
          />
        )}
      </Popover>
    </>
  );
};

export default DateRangeSelect;
