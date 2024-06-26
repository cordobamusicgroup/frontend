import Avatar from "@mui/material/Avatar";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

function LockIcon() {
  return (
    <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
      <LockOutlinedIcon />
    </Avatar>
  );
}

export default LockIcon;
