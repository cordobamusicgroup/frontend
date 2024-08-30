import { CancelOutlined, CheckCircleOutline } from "@mui/icons-material";
import { Chip } from "@mui/material";

interface VatStatusChipProps {
  isRegistered: boolean;
}
const VatStatusChip: React.FC<VatStatusChipProps> = ({ isRegistered }) => {
  if (isRegistered) {
    return <Chip label="Registered" color="success" icon={<CheckCircleOutline style={{ color: "white" }} />} size="small" />;
  }
  return <Chip label="Not Registered" color="default" icon={<CancelOutlined style={{ color: "gray" }} />} size="small" />;
};
export { VatStatusChip };
