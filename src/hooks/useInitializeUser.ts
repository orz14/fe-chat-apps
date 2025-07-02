import { decryptData } from "@/lib/crypto";
import { useUserDataStore } from "@/stores/useUserDataStore";
import { requestNotificationPermission } from "@/utils/notifications";
import { useEffect } from "react";

export function useInitializeUser() {
  const { setUser } = useUserDataStore();

  useEffect(() => {
    handleSetCredentials();
    requestNotificationPermission();
  }, []);

  function handleSetCredentials() {
    const credentials = localStorage.getItem("credentials") ?? null;
    if (credentials) {
      const decryptedData = decryptData(credentials);
      if (decryptedData) {
        setUser({
          id: decryptedData.user.id,
          name: decryptedData.user.name,
          username: decryptedData.user.username,
          email: decryptedData.user.email,
          avatar: decryptedData.user.avatar,
          token: decryptedData.token,
        });
      }
    }
  }
}
