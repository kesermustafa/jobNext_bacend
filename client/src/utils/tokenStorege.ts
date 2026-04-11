import CryptoJS from "crypto-js";

const SECRET_KEY = import.meta.env.VITE_STORAGE_KEY

export const setEncryptedToken = (token: string) => {

    const encrypted = CryptoJS.AES.encrypt(token, SECRET_KEY).toString();

    localStorage.setItem("token", encrypted);
};

export const getDecryptedToken = (): string | null => {
    const encrypted = localStorage.getItem("token");
    if (!encrypted) return null;

    try {
        const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
        const originalToken = bytes.toString(CryptoJS.enc.Utf8);
        return originalToken || null;
    } catch (error) {
        console.error("Token çözme hatası:", error);
        return null;
    }
};