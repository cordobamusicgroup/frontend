import React from "react";
import { ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { Home as HomeIcon, Assessment as AssessmentIcon, LibraryMusic as LibraryMusicIcon, Campaign as CampaignIcon, AttachMoney as AttachMoneyIcon, Gavel as GavelIcon } from "@mui/icons-material";

interface DrawerListProps {
  open: boolean;
}

const DrawerList: React.FC<DrawerListProps> = ({ open }) => {
  const items = [
    { text: "Overview", icon: <HomeIcon /> },
    { text: "Catalog", icon: <LibraryMusicIcon /> },
    { text: "Analytics", icon: <AssessmentIcon /> },
    { text: "Promotion", icon: <CampaignIcon /> },
    { text: "Financial", icon: <AttachMoneyIcon /> },
    { text: "Neighbouring Rights", icon: <GavelIcon /> },
    { text: "Legal", icon: <GavelIcon /> },
  ];

  return items.map(({ text, icon }) => (
    <ListItem button key={text}>
      <ListItemIcon>{icon}</ListItemIcon>
      {open && <ListItemText primary={text} />}
    </ListItem>
  ));
};

export default DrawerList;
