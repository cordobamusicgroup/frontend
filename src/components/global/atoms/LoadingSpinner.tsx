import React from "react";
import { CircularProgress, CircularProgressProps } from "@mui/material";

interface LoadingSpinnerProps {
  color?: CircularProgressProps["color"];
  size?: number;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ color = "inherit", size = 45 }) => {
  return <CircularProgress color={color} size={size} />;
};

export default LoadingSpinner;
