import { Delete, Edit, Visibility } from "@mui/icons-material";
import { IconButton } from "@mui/material";

interface ActionButtonProps {
  onClick: () => void;
}
const EditActionButton: React.FC<ActionButtonProps> = ({ onClick }) => {
  return (
    <IconButton sx={{ color: "#8e8e8e" }} onClick={onClick}>
      <Edit />
    </IconButton>
  );
};

const ViewActionButton: React.FC<ActionButtonProps> = ({ onClick }) => {
  return (
    <IconButton sx={{ color: "#8e8e8e" }} onClick={onClick}>
      <Visibility />
    </IconButton>
  );
};

const DeleteActionButton: React.FC<ActionButtonProps> = ({ onClick }) => {
  return (
    <IconButton sx={{ color: "#8e8e8e" }} onClick={onClick}>
      <Delete />
    </IconButton>
  );
};

export {EditActionButton, ViewActionButton, DeleteActionButton};