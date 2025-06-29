import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { decryptData } from "./crypto";

declare global {
  interface Window {
    Pusher: typeof Pusher;
  }
}

let echo: Echo<any> | null = null;

if (typeof window !== "undefined") {
  let token: string = "";
  const encryptedData = localStorage.getItem("credentials") ?? null;
  if (encryptedData) {
    const decryptedData = decryptData(encryptedData);
    if (decryptedData) {
      token = `Bearer ${decryptedData.token}`;
    }
  }

  window.Pusher = Pusher;

  echo = new Echo<any>({
    broadcaster: "pusher",
    key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
    cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER || "mt1",
    wsHost: process.env.NEXT_PUBLIC_PUSHER_HOST || `ws-${process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER}.pusher.com`,
    wsPort: process.env.NEXT_PUBLIC_PUSHER_PORT || 80,
    wssPort: process.env.NEXT_PUBLIC_PUSHER_PORT || 443,
    forceTLS: (process.env.NEXT_PUBLIC_PUSHER_SCHEME || "https") === "https",
    encrypted: true,
    disableStats: true,
    enabledTransports: ["ws", "wss"],
    authEndpoint: process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/broadcasting/auth` : "https://be-chat.orzverse.com/api/broadcasting/auth", // endpoint Laravel Anda
    auth: {
      headers: {
        Authorization: token, // jika pakai Sanctum / Passport
      },
    },
  });
}

export default echo;
