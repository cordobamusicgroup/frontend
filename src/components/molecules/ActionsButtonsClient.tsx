import { Box } from "@mui/material";
import { DeleteActionButton, EditActionButton, ViewActionButton } from "../atoms/ActionButtonClient";

interface ActionButtonsProps {
  onEdit: () => void;
  onDelete: () => void;
  onView: () => void;
}
const ActionButtonsClient: React.FC<ActionButtonsProps> = ({ onEdit, onDelete, onView }) => {
  return (
    <Box>
      <EditActionButton onClick={onEdit} />
      <ViewActionButton onClick={onView} />
      <DeleteActionButton onClick={onDelete} />
    </Box>
  );
};
export default ActionButtonsClient;
