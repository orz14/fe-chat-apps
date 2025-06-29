import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY || "0532e9f1a810cce15c6f392767484f4b";

export const encryptData = (data: unknown) => {
  try {
    const dataString = JSON.stringify(data);
    const encryptedData = CryptoJS.AES.encrypt(dataString, SECRET_KEY).toString();
    return encryptedData;
  } catch (err) {
    console.error("🚀 Error encrypting data", err);
    return null;
  }
};

export const decryptData = (encryptedData: string) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
  } catch (err) {
    console.error("🚀 Error decrypting data", err);
    localStorage.removeItem("credentials");
    window.location.href = `${window.location.origin}`;
    return null;
  }
};

export const encryptString = (data: string | number) => {
  try {
    const dataString = data.toString();
    const encryptedData = CryptoJS.AES.encrypt(dataString, SECRET_KEY).toString();
    return encryptedData;
  } catch (err) {
    console.error("🚀 Error encrypting data", err);
    return null;
  }
};

export const decryptString = (encryptedData: string) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedData;
  } catch (err) {
    console.error("🚀 Error decrypting data", err);
    return null;
  }
};
