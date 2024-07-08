import Avatar from "@mui/material/Avatar";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Image from "next/image";

function LoginLogo() {
  return <Image src={"/static/logocmg.svg"} alt={"CMG Logo"} width={0} height={0} style={{ width: "250px", height: "auto" }} priority={true} />;
}

export default LoginLogo;
