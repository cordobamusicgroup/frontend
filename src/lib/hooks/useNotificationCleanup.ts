import { useEffect } from "react";
import { useAppStore } from "@/lib/zustand/zustandStore";

export const useNotificationCleanup = () => {
  const clearNotification = useAppStore.notification((state) => state.clearNotification);

  useEffect(() => {
    return () => {
      // Limpiar la notificación al desmontar
      clearNotification();
    };
  }, [clearNotification]);
};