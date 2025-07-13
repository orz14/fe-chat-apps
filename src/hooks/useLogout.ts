import { usePageStore } from "@/stores/usePageStore";
import { useToast } from "./use-toast";

export default function useLogout() {
  const { toast } = useToast();
  const { setPage } = usePageStore();

  async function logoutAuth(notification: boolean = false) {
    setPage("logout");

    if (notification) {
      toast({
        variant: "destructive",
        description: "Token not valid.",
      });
    }
  }

  return { logoutAuth };
}
