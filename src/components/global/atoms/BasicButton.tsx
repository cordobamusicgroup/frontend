import React from "react";
import { Button, ButtonProps } from "@mui/material";
import { useTheme } from "@mui/material/styles";

interface BasicButtonProps extends ButtonProps {
  colorText?: string; // Color del texto personalizado
  colorBackground?: string; // Color de fondo personalizado
}

const BasicButton: React.FC<BasicButtonProps> = ({ colorText = "white", colorBackground = "primary", children, ...props }) => {
  const theme = useTheme();

  return (
    <Button
      {...props}
      color="primary" // Valor predeterminado si no se pasa `colorBackground`
      variant="contained"
      sx={{
        backgroundColor: colorBackground === "primary" ? theme.palette.primary.main : colorBackground, // Fondo personalizado o color primario
        color: colorText === "primary" ? theme.palette.primary.contrastText : colorText, // Texto personalizado o color primario
        "&:hover": {
          backgroundColor: colorBackground === "primary" ? theme.palette.primary.dark : theme.palette.grey[300], // Hover dependiendo del fondo
        },
        ...props.sx, // Permite sobreescribir estilos personalizados
      }}
    >
      {children}
    </Button>
  );
};

export default BasicButton;
