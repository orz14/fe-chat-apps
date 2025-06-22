import useAuth from "@/configs/api/auth";
import { encryptData } from "@/lib/crypto";
import { comfortaa } from "@/lib/fonts";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function AuthorizationCallbackPage() {
  const router = useRouter();
  // const { toast } = useToast();
  const { currentUser } = useAuth();
  // const { login } = useAppContext();

  async function handleCatch(err: any) {
    if (err.status !== 401) {
      // toast({
      //   variant: "destructive",
      //   description: err.message,
      // });

      // await writeLogClient("error", err);

      router.push("/");
    }
  }

  async function handleLogin(token: string) {
    try {
      const resUser = await currentUser(token);
      if (resUser?.status === 200) {
        const user = {
          id: resUser.data.data.id,
          name: resUser.data.data.name,
          username: resUser.data.data.username,
          email: resUser.data.data.email,
          avatar: resUser.data.data.avatar,
        };

        const encryptedData = encryptData({ token, user });
        if (encryptedData) {
          localStorage.setItem("credentials", encryptedData);
        }

        router.push("/");
      }
    } catch (err) {
      handleCatch(err);
    }
  }

  useEffect(() => {
    const { token, status } = router.query;

    if (status && status == "failed") {
      // toast({
      //   variant: "destructive",
      //   description: "Login failed.",
      // });

      router.push("/");
    }

    if (token) {
      handleLogin(token as string);
    }
  }, [router.query]);

  return (
    <>
      {/* <MetaTag title={"Authorization"} /> */}
      <main className={`${comfortaa.className} w-full h-svh flex items-center justify-center lg:p-5`}>
        <div className="w-full h-full overflow-hidden lg:rounded-2xl bg-red-500">
          <section className="h-full flex justify-center items-center overflow-hidden bg-indigo-100">
            <Loader2 className="animate-spin w-4 h-4 mr-2 -mt-1" />
            <span>Authorization</span>
          </section>
        </div>
      </main>
    </>
  );
}
