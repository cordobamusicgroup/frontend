import Avatar from "@mui/material/Avatar";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Image from "next/image";

function LoginLogo() {
  return <Image src={"/static/logocmg.svg"} alt={"CMG Logo"} width={250} height={100} />;
}

export default LoginLogo;
