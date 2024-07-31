"use client";

import { useTransition } from "react";
import { Locale } from "@/config";
import { setUserLocale } from "@/services/locale"; // Esta función debe estar en una API Route o similar para el cliente
import { Button, ButtonGroup, CircularProgress } from "@mui/material";

type Props = {
  defaultValue: string;
  items: Array<{ value: string; label: string }>;
};

export default function LocaleSwitcherSelect({ defaultValue, items }: Props) {
  const [isPending, startTransition] = useTransition();

  function onChange(locale: string) {
    startTransition(async () => {
      await setUserLocale(locale as Locale); // Asegúrate de que el tipo sea correcto
    });
  }

  return (
    <ButtonGroup variant="outlined" disabled={isPending}>
      {items.map((item) => (
        <Button key={item.value} onClick={() => onChange(item.value)} disabled={defaultValue === item.value || isPending}>
          {item.label.toUpperCase()}
          {defaultValue === item.value && isPending && <CircularProgress size={20} />}
        </Button>
      ))}
    </ButtonGroup>
  );
}
