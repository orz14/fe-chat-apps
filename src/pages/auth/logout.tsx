import SpinnerLoader from "@/components/loaders/SpinnerLoader";
import MetaTag from "@/components/MetaTag";
import { useToast } from "@/hooks/use-toast";
import { comfortaa } from "@/lib/fonts";
import { useUserDataStore } from "@/stores/useUserDataStore";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function LoggingOutPage() {
  const router = useRouter();
  const { setUser } = useUserDataStore();
  const { toast } = useToast();

  useEffect(() => {
    const timeout = setTimeout(() => {
      const { notification } = router.query;

      setUser({
        id: null,
        name: null,
        username: null,
        email: null,
        avatar: null,
        token: null,
      });

      localStorage.removeItem("credentials");

      if (notification == "true") {
        toast({
          variant: "destructive",
          description: "Token not valid.",
        });
      }

      router.push("/");
    }, 1000);

    return () => clearTimeout(timeout);
  }, [router.query]);

  return (
    <>
      <MetaTag />

      <main className={`${comfortaa.className} w-full h-svh flex items-center justify-center lg:p-5`}>
        <div className="w-full h-full overflow-hidden lg:rounded-2xl bg-indigo-100">
          <section className="h-full flex flex-row justify-center items-center gap-x-2">
            <SpinnerLoader width="w-5 -mt-1" />
            <span className="font-bold">Logging Out</span>
          </section>
        </div>
      </main>
    </>
  );
}
