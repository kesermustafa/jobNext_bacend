import {
    createContext,
    type JSX,
    useContext,
    useEffect,
    useState,
} from "react";
import type {IFormUser, ILoginUser, IUser} from "../types";
import api from "../api";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import {getDecryptedToken, setEncryptedToken} from "../utils/tokenStorege.ts";

type ContextType = {
    user: IUser | null;
    isLoading: boolean;
    register: (user: IFormUser) => void;
    login: (user: ILoginUser) => void;
    logout: () => void;
};

export const AuthContext = createContext<ContextType>({
    user: null,
    isLoading: true,
    register: () => {
    },
    login: () => {
    },
    logout: () => {
    },
});

export const AuthProvider = ({children}: { children: JSX.Element }) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [user, setUser] = useState<IUser | null>(null);

    const navigate = useNavigate();

    // 🔥 APP AÇILDIĞINDA USER ÇEK
    useEffect(() => {

        if (user) return;

        const fetchUser = async () => {

            /*const token = getDecryptedToken();

            if (!token) {
                setIsLoading(false);
                return;
            }*/

            try {
                const res = await api.get("/users/profile");

                const userData = res.data.data;

                setUser(userData);

            } catch (err: any) {
                console.error("Profil hatası:", err.response?.data);

                localStorage.removeItem("token");
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, [user]);

    // ✅ REGISTER
    const register = async (user: IFormUser) => {
        try {

            const formData = new FormData();

            Object.entries(user).forEach(([key, value]) => {
                if (key === "photo") return; // 🔥 skip
                if (value !== undefined && value !== null) {
                    formData.append(key, String(value));
                }
            });

            if (user.photo instanceof File) {
                formData.append("photo", user.photo);
            }

            await api.post("/auth/register", formData); // ❌ header YOK

            toast.info("Hesabınız oluşturuldu. Giriş yapabilirsiniz");
            navigate("/login");

        } catch (err: any) {
            toast.error(err.response?.data?.message || "Kayıt başarısız");
        }
    };

    // ✅ LOGIN
    const login = async (loginData: ILoginUser) => {
        setIsLoading(true);

        try {
            const res = await api.post("/auth/login", loginData);

            const responseData = res.data;

            const apiUser = responseData.data.user;
            const token = responseData.data.accessToken;

            // 🔐 Şifreli kaydet
            setEncryptedToken(token);

            // 👤 User set et
            setUser(apiUser);

            toast.success("Oturum açıldı");
            navigate("/");
        } catch (err: any) {
            console.error("Login error:", err.response?.data);

            toast.error(
                err.response?.data?.message || "Giriş yapılırken hata oluştu"
            );
        } finally {
            setIsLoading(false);
        }
    };

    // ✅ LOGOUT
    const logout = async () => {
        try {
            await api.post("/auth/logout");
        } catch (err) {
            console.log(err);
        } finally {
            localStorage.removeItem("token");
            setUser(null);
            toast.info("Oturum kapandı");
        }
    };

    return (
        <AuthContext.Provider
            value={{user, isLoading, register, login, logout}}
        >
            {children}
        </AuthContext.Provider>
    );
};

// 🔥 Hook
export const useAuth = () => {
    return useContext(AuthContext);
};