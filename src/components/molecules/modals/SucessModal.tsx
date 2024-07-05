import React from "react";
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, styled } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";

const SuccessIcon = styled(CheckCircle)({
  color: "green",
  fontSize: "2.5rem",
  marginRight: "8px",
});

interface SuccessModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ open, onClose, title, children }) => {
  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="success-dialog-title">
      <DialogTitle id="success-dialog-title">
        <div style={{ display: "flex", alignItems: "center" }}>
          <SuccessIcon />
          <Typography variant="h6">{title}</Typography>
          <IconButton aria-label="close" onClick={onClose} style={{ marginLeft: "auto", color: "gray" }}>
            &times;
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent dividers>{children}</DialogContent>
    </Dialog>
  );
};

export default SuccessModal;
