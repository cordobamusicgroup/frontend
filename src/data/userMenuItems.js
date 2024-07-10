import { AccountCircle, ExitToApp, AccountBalance, Info, Group, Lock, Support } from "@mui/icons-material";

export const menuItems = [
  {
    icon: <AccountCircle fontSize="small" />,
    text: "Profile",
    onClick: () => {
      console.log("Profile clicked");
    },
  },
  {
    icon: <AccountBalance fontSize="small" />,
    text: "Bank Information",
    onClick: () => {
      console.log("Bank Information clicked");
    },
  },
  {
    icon: <Lock fontSize="small" />,
    text: "Password",
    onClick: () => {
      console.log("Password clicked");
    },
  },
  {
    icon: <Support fontSize="small" />,
    text: "Support",
    onClick: () => {
      console.log("Support clicked");
    },
  },
  {
    icon: <ExitToApp fontSize="small" />,
    text: "Logout",
    onClick: () => {
      console.log("Logout clicked");
    },
  },
];
