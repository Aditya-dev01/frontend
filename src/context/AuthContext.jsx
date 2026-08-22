import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore authentication after page refresh
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("pramaanai_user");
      const savedToken = localStorage.getItem("pramaanai_token");

      if (savedUser && savedToken) {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      }
    } catch (error) {
      console.error("Failed to restore authentication:", error);

      localStorage.removeItem("pramaanai_user");
      localStorage.removeItem("pramaanai_token");
    } finally {
      setLoading(false);
    }
  }, []);

  // Login
  const login = (userData, authToken) => {
    localStorage.setItem(
      "pramaanai_user",
      JSON.stringify(userData)
    );

    localStorage.setItem(
      "pramaanai_token",
      authToken
    );

    setUser(userData);
    setToken(authToken);
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("pramaanai_user");
    localStorage.removeItem("pramaanai_token");

    setUser(null);
    setToken(null);
  };

  // Register normal user
  const register = (userData) => {
    const existingUsers =
      JSON.parse(
        localStorage.getItem("pramaanai_users")
      ) || [];

    const emailExists = existingUsers.some(
      (existingUser) =>
        existingUser.email.toLowerCase() ===
        userData.email.trim().toLowerCase()
    );

    if (emailExists) {
      throw new Error(
        "An account with this email already exists."
      );
    }

    const newUser = {
      id: `USR-${Date.now()}`,
      name: userData.name.trim(),
      email: userData.email.trim().toLowerCase(),
      phone: userData.phone?.trim() || "",
      password: userData.password,

      // Normal users always get user role
      role: "user",

      verificationStatus: "Not Verified",

      createdAt: new Date().toISOString(),
    };

    existingUsers.push(newUser);

    localStorage.setItem(
      "pramaanai_users",
      JSON.stringify(existingUsers)
    );

    return newUser;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        register,
        isAuthenticated: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};