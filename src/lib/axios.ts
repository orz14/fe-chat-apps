import axios from "axios";
import { decryptData } from "./crypto";
// import { writeLogClient } from "./logClient";
// import { deleteCookie, getCookie, setCookie } from "cookies-next";

const headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

const axiosInstance = axios.create({
  headers,
  timeout: 60 * 1000,
});

if (typeof window !== "undefined") {
  // async function getCsrfToken(method: any) {
  //   const baseURL = process.env.NEXT_PUBLIC_API_URL ?? "https://be-chat.orzverse.com/api";

  //   if (method && ["post", "put", "patch", "delete"].includes(method)) {
  //     try {
  //       const resServer = await axiosInstance.get(`${baseURL}/check-connection`);
  //       if (resServer?.status === 200) {
  //         setCookie("CSRF-TOKEN", resServer?.data.csrf_token || "", {
  //           path: "/",
  //           maxAge: 60 * 60 * 24,
  //           secure: true,
  //           sameSite: "strict",
  //         });
  //       }
  //     } catch (err) {
  //       if (err?.status === 401 || err?.response?.status === 401) {
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

  axiosInstance.interceptors.request.use(
    async (config) => {
      // X-CSRF-TOKEN
      // const csrfToken = getCookie("CSRF-TOKEN") ?? null;
      // if (csrfToken) {
      //   config.headers["X-CSRF-TOKEN"] = csrfToken;
      // }

      // Authorization
      const encryptedData = localStorage.getItem("credentials") ?? null;
      if (encryptedData) {
        const decryptedData = decryptData(encryptedData);
        if (decryptedData) {
          config.headers["Authorization"] = `Bearer ${decryptedData.token}`;
        }
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    async (response) => {
      // const method = response.config.method;
      // await getCsrfToken(method);

      return response;
    },
    async (error) => {
      if (error.response) {
        console.error("🚀 Error response:", error.response);
      } else if (error.request) {
        console.error("🚀 Error request:", error.request);
      } else {
        console.error("🚀 Error message:", error.message);
      }

      if (error.response?.data?.message == "Unauthenticated.") {
        localStorage.removeItem("credentials");
      }

      // const method = error.config?.method;
      // await getCsrfToken(method);

      return Promise.reject(error);
    }
  );
}

function useAxiosInterceptors() {
  return axiosInstance;
}

export default useAxiosInterceptors;
