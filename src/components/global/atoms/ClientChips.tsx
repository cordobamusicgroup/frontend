import { BlockOutlined, CancelOutlined, CheckCircleOutline, PriorityHighOutlined, ScheduleOutlined } from "@mui/icons-material";
import { Chip } from "@mui/material";

interface VatStatusChipProps {
  isRegistered: boolean;
}
interface LabelStatusChipProps {
  status: string;
}
export const VatStatusChip: React.FC<VatStatusChipProps> = ({ isRegistered }) => {
  if (isRegistered) {
    return <Chip label="Registered" color="success" icon={<CheckCircleOutline style={{ color: "white" }} />} size="small" />;
  }
  return <Chip label="Not Registered" color="default" icon={<CancelOutlined style={{ color: "gray" }} />} size="small" />;
};

export const LabelStatusChip: React.FC<LabelStatusChipProps> = ({ status }) => {
  if (status === "ACTIVE") {
    return <Chip label="Active" color="success" icon={<CheckCircleOutline style={{ color: "white" }} />} size="small" />;
  } else if (status === "DISABLED") {
    return <Chip label="Disabled" color="default" icon={<CancelOutlined style={{ color: "gray" }} />} size="small" />;
  }
};
interface LabelSpecialStoreStatusProps {
  status: string;
}
export const LabelSpecialStoreStatus: React.FC<LabelSpecialStoreStatusProps> = ({ status }) => {
  if (status === "NO_REGISTRATION") return <Chip label="Unregistered" color="default" icon={<CancelOutlined style={{ color: "gray" }} />} size="small" />; // NO_REGISTRATION
  if (status === "PENDING") return <Chip label="Pending" color="warning" icon={<ScheduleOutlined />} size="small" />; // pending
  if (status === "ACTIVE") return <Chip label="Active" color="success" icon={<CheckCircleOutline style={{ color: "white" }} />} size="small" />;
  if (status === "REJECTED") return <Chip label="Rejected" color="error" icon={<PriorityHighOutlined style={{ color: "white" }} />} size="small" />;
};
