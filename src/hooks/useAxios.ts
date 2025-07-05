import useAxiosInterceptors from "@/lib/axios";
// import useLogout from "./useLogout";
// import { deleteCookie, getCookie, setCookie } from "cookies-next";
// import { writeLogClient } from "@/lib/logClient";
import { decryptData } from "@/lib/crypto";
import axios from "axios";

export default function useAxios() {
  const axiosInstance = useAxiosInterceptors();
  // const { logoutAuth } = useLogout();

  async function methodSwitch(type: "basic" | "custom", method: "get" | "post" | "patch" | "delete", endpoint: string, data: any = {}, config: any = {}) {
    const client = type === "basic" ? axios : axiosInstance;
    const methodsWithoutData = ["get", "delete"];
    const methodsWithData = ["post", "patch"];

    if (methodsWithoutData.includes(method)) {
      return await client[method](endpoint, config);
    } else if (methodsWithData.includes(method)) {
      return await client[method](endpoint, data, config);
    } else {
      throw new Error(`Unsupported method: ${method}`);
    }
  }

  async function axiosBasic(method: "get" | "post" | "patch" | "delete", endpoint: string, data: any = {}, config: any = {}) {
    try {
      return await methodSwitch("basic", method, endpoint, data, config);
    } catch (err) {
      throw err;
    }
  }

  async function axiosRaw(method: "get" | "post" | "patch" | "delete", endpoint: string, data: any = {}, config: any = {}) {
    try {
      return await methodSwitch("custom", method, endpoint, data, config);
    } catch (err) {
      throw err;
    }
  }

  async function axiosFetch(method: "get" | "post" | "patch" | "delete", endpoint: string, data: any = {}, config: any = {}, logout: boolean = true) {
    try {
      return await methodSwitch("custom", method, endpoint, data, config);
    } catch (err) {
      // if (err?.status === 401 || err?.response?.status === 401) {
      //   return await logoutAuth(logout);
      // }
      throw err;
    }
  }

  async function axiosLogout(endpoint: string, token?: string) {
    // async function getCsrfToken(method: any) {
    //   const baseURL = process.env.NEXT_PUBLIC_API_URL ?? "https://be-chat.orzverse.com/api";

    //   if (method && ["post", "put", "patch", "delete"].includes(method)) {
    //     try {
    //       const resServer = await methodSwitch("custom", "get", `${baseURL}/check-connection`);
    //       if (resServer?.status === 200) {
    //         setCookie("CSRF-TOKEN", resServer?.data.csrf_token || "", {
    //           path: "/",
    //           maxAge: 60 * 60 * 24,
    //           secure: true,
    //           sameSite: "strict",
    //         });
    //       }
    //     } catch (err) {
    //       if (err?.status === 401) {
    //         deleteCookie("token", { path: "/" });
    //         deleteCookie("user-ip", { path: "/" });
    //         localStorage.removeItem("encryptedData");
    //         window.location.href = `${window.location.origin}/auth/login`;
    //       } else {
    //         await writeLogClient("error", err);
    //         window.location.reload();
    //       }
    //     }
    //   }
    // }

    // X-CSRF-TOKEN
    // const csrfToken = (await getCookie("CSRF-TOKEN")) ?? "";

    // Authorization
    let bearerToken: string = "";
    if (token) {
      bearerToken = `Bearer ${token}`;
    } else {
      const encryptedData = localStorage.getItem("credentials") ?? null;
      if (encryptedData) {
        const decryptedData = decryptData(encryptedData);
        if (decryptedData) {
          bearerToken = `Bearer ${decryptedData.token}`;
        }
      }
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        // "X-CSRF-TOKEN": csrfToken,
        Authorization: bearerToken,
      },
    };

    try {
      return await methodSwitch("basic", "delete", endpoint, {}, config);
    } catch (err) {
      // const method = err?.config?.method;
      // await getCsrfToken(method);

      throw err;
    }
  }

  return { axiosBasic, axiosRaw, axiosFetch, axiosLogout };
}
