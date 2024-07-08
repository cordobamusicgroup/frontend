"use client";

import React, { useState, useEffect, useRef } from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

interface FullScreenLoaderProps {
  open: boolean;
}

const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({ open }) => {
  const [showMessage, setShowMessage] = useState(false);
  const timer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (open) {
      timer.current = setTimeout(() => {
        setShowMessage(true);
      }, 10000);
    } else {
      clearTimeout(timer.current);
      setShowMessage(false);
    }

    return () => clearTimeout(timer.current);
  }, [open]);

  return (
    <Backdrop
      sx={{
        color: "#fff",
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        flexDirection: "column",
      }}
      open={open}
    >
      <CircularProgress color="inherit" size={45} />
      {showMessage && (
        <Typography variant="body1" sx={{ mt: 2 }}>
          It is taking us longer than expected.{" "}
        </Typography>
      )}
    </Backdrop>
  );
};

export default FullScreenLoader;
