import SpinnerLoader from "@/components/loaders/SpinnerLoader";
import MetaTag from "@/components/MetaTag";
import useProfile from "@/configs/api/profile";
import { useToast } from "@/hooks/use-toast";
import { encryptData } from "@/lib/crypto";
import { comfortaa } from "@/lib/fonts";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function AuthorizationCallbackPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { currentUser } = useProfile();

  useEffect(() => {
    const timeout = setTimeout(() => {
      const { token } = router.query;

      if (!token) {
        toast({
          variant: "destructive",
          description: "Login failed.",
        });
        router.push("/");
      } else if (typeof token === "string") {
        handleLogin(token);
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [router.query]);

  async function handleLogin(token: string) {
    try {
      const res = await currentUser(token);
      if (res?.status === 200) {
        const user = {
          id: res.data.data.id,
          name: res.data.data.name,
          username: res.data.data.username,
          email: res.data.data.email,
          avatar: res.data.data.avatar,
        };

        const encryptedData = encryptData({ token, user });
        if (encryptedData) {
          localStorage.setItem("credentials", encryptedData);
        }
      }
    } catch (err: any) {
      // await writeLogClient("error", err);
      if (err?.status === 401 || err?.response?.status === 401) {
        toast({
          variant: "destructive",
          description: "Login failed.",
        });
      } else {
        toast({
          variant: "destructive",
          description: err.message,
        });
      }
    } finally {
      router.push("/");
    }
  }

  return (
    <>
      <MetaTag title={"Authorization"} />

      <main className={`${comfortaa.className} w-full h-svh flex items-center justify-center lg:p-5`}>
        <div className="w-full h-full overflow-hidden lg:rounded-2xl bg-indigo-100">
          <section className="h-full flex flex-row justify-center items-center gap-x-2">
            <SpinnerLoader width="w-5 -mt-1" />
            <span className="font-bold">Authorization</span>
          </section>
        </div>
      </main>
    </>
  );
}
