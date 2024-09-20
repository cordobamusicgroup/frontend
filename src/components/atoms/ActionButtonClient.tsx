import { Delete, Edit, Visibility } from "@mui/icons-material";
import { IconButton } from "@mui/material";

interface ActionButtonProps {
  onClick: () => void;
}

const EditActionButton: React.FC<ActionButtonProps> = ({ onClick }) => {
  return (
    <IconButton sx={{ color: "gray" }} onClick={onClick} size="small">
      <Edit sx={{ fontSize: 20 }} />
    </IconButton>
  );
};

const DeleteActionButton: React.FC<ActionButtonProps> = ({ onClick }) => {
  return (
    <IconButton sx={{ color: "gray" }} onClick={onClick} size="small">
      <Delete sx={{ fontSize: 20 }} />
    </IconButton>
  );
};

export { EditActionButton, DeleteActionButton };
