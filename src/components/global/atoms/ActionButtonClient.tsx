import { Delete, Edit, Visibility } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";

interface ActionButtonProps {
  onClick: () => void;
}

const EditActionButton: React.FC<ActionButtonProps> = ({ onClick }) => {
  return (
    <Tooltip title="Edit">
      <IconButton sx={{ color: "gray" }} onClick={onClick} size="small">
        <Edit sx={{ fontSize: 20 }} />
      </IconButton>
    </Tooltip>
  );
};

const DeleteActionButton: React.FC<ActionButtonProps> = ({ onClick }) => {
  return (
    <Tooltip title="Delete">
      <IconButton sx={{ color: "gray" }} onClick={onClick} size="small">
        <Delete sx={{ fontSize: 20 }} />
      </IconButton>
    </Tooltip>
  );
};

export { EditActionButton, DeleteActionButton };
