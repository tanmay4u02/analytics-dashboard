import { Button, Typography } from "@mui/material";
import React, { useState } from "react";

const ShareButton = () => {
  const [showSnackbar, setShowSnackbar] = useState(false);

  const onClick = () => {
    setShowSnackbar(true);
    navigator.clipboard.writeText(window.location.href);
    setTimeout(() => setShowSnackbar(false), 3000);
  };

  return (
    <Button variant="outlined" color="primary" onClick={onClick} size="small">
      Share Dashboard
      <div
        id="snackbar"
        className={showSnackbar ? "show" : ""}
        style={{
          maxWidth: "2rem",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        Link copied to clipboard
        <Typography
          variant="caption"
          display="block"
          textOverflow="ellipsis"
          overflow="hidden"
        >
          {window.location.href}
        </Typography>
      </div>
    </Button>
  );
};

export default ShareButton;
