import { Box, Tooltip } from "@mui/material";
import { DeleteActionButton, EditActionButton } from "../atoms/ActionButtonsTables";

interface ActionButtonsProps {
  onEdit: () => void;
  onDelete: () => void;
}
const ActionButtonsClient: React.FC<ActionButtonsProps> = ({ onEdit, onDelete }) => {
  return (
    <Box>
      <EditActionButton onClick={onEdit} />

      <DeleteActionButton onClick={onDelete} />
    </Box>
  );
};
export default ActionButtonsClient;
