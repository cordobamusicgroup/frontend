import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { CheckCircle } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

interface SuccessModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  maxWidth: 400,
  bgcolor: "background.paper",
  border: "1px solid #ccc",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  textAlign: "center" as "center",
};

const SuccessModal: React.FC<SuccessModalProps> = ({ open, onClose, title, message }) => {
  const theme = useTheme();

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="success-modal-title" aria-describedby="success-modal-description">
      <Box sx={style}>
        <CheckCircle sx={{ color: theme.palette.success.main, fontSize: "3rem", mb: 2 }} />
        <Typography id="success-modal-title" variant="h6" component="h2" color="success">
          {title}
        </Typography>
        <Typography id="success-modal-description" sx={{ mt: 2 }}>
          {message}
        </Typography>
        <Button onClick={onClose} sx={{ mt: 3 }} variant="contained" color="success">
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default SuccessModal;