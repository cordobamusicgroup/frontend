import React from "react";
import { ArrowBack } from "@mui/icons-material";
import { Button, ButtonProps } from "@mui/material";
import { useRouter } from "next/navigation";
import { useTheme } from "@mui/material/styles";

interface BackPageButtonProps extends ButtonProps {
  colorText?: string; // Propiedad para el color del texto
  colorBackground?: string; // Propiedad para el color de fondo
}

function BackPageButton({ colorText = "white", colorBackground = "primary", ...props }: BackPageButtonProps) {
  const router = useRouter();
  const theme = useTheme();

  const handleBack = () => {
    router.back();
  };

  return (
    <Button
      {...props}
      variant="contained"
      onClick={handleBack}
      startIcon={<ArrowBack />}
      sx={{
        backgroundColor: colorBackground === "primary" ? theme.palette.primary.main : colorBackground, // Fondo personalizado o el color primario
        color: colorText === "primary" ? theme.palette.primary.contrastText : colorText, // Texto personalizado o el color del tema
        "&:hover": {
          backgroundColor: colorBackground === "primary" ? theme.palette.primary.dark : theme.palette.grey[300], // Hover dependiendo del fondo
        },
        ...props.sx, // Permitir sobreescribir estilos adicionales
      }}
    >
      Back
    </Button>
  );
}

export default BackPageButton;
