import authAxios from "./axios";

export const login = async (username: string, password: string): Promise<string | null> => {
    try {
        const response = await authAxios.post<{ token: string }>("/api/Auth/login", { username, password });
        return response.data.token;
    } catch (error) {
        console.error("Login failed", error);
        return null;
    }
}

export const logout = async (): Promise<void> => {
    try {
        await authAxios.post("/api/Logout");
        localStorage.removeItem("token");
    } catch (error) {
        console.error("Logout failed", error);
    }
};

export const isAuthenticated = (): boolean => {
    const token = localStorage.getItem("token");
    return !!token; // Returns true if token exists, false otherwise
};

export default {
    login,
    logout,
    isAuthenticated
};