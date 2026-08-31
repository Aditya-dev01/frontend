// import dotenv from 'dotenv';
// dotenv.config();
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext(null);

// const API_URL = "http://127.0.0.1:5000";
// const API_URL = import.meta.env.BACKEND_URL;
const API_URL = "https://hackathon-backend-0eoj.onrender.com";
const TOKEN_KEY = "pramaanai_token";
const USER_KEY = "pramaanai_user";

// =====================================================
// SHA-256
// =====================================================

const sha256 = async (text) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);

  const hashBuffer = await crypto.subtle.digest(
    "SHA-256",
    data
  );

  const hashArray = Array.from(
    new Uint8Array(hashBuffer)
  );

  return hashArray
    .map((byte) =>
      byte.toString(16).padStart(2, "0")
    )
    .join("");
};

// =====================================================
// AUTH PROVIDER
// =====================================================

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // ===================================================
  // LOGOUT
  // ===================================================

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    setToken(null);
    setUser(null);
  };

  // ===================================================
  // VERIFY JWT
  // ===================================================

  const verifyAuthentication = async () => {
    const savedToken = localStorage.getItem(TOKEN_KEY);

    if (!savedToken) {
      setToken(null);
      setUser(null);
      setLoading(false);
      return false;
    }

    try {
      const response = await fetch(
        `${API_URL}/verifyToken`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${savedToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      console.log("Token verification:", data);

      if (!response.ok || !data.success) {
        logout();
        return false;
      }

      setToken(savedToken);

      const savedUser =
        localStorage.getItem(USER_KEY);

      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          localStorage.removeItem(USER_KEY);
          setUser(null);
        }
      } else if (data.details?.user) {
        setUser(data.details.user);

        localStorage.setItem(
          USER_KEY,
          JSON.stringify(data.details.user)
        );
      }

      return true;
    } catch (error) {
      console.error(
        "Token verification failed:",
        error
      );

      logout();
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // VERIFY TOKEN WHEN APPLICATION LOADS
  // ===================================================

  useEffect(() => {
    verifyAuthentication();
  }, []);

  // ===================================================
  // LOGIN
  // ===================================================

  const login = async (
    email,
    password,
    role
  ) => {
    try {
      const cleanedEmail =
        email.trim().toLowerCase();

      // Hash password before sending
      const passwordHash =
        await sha256(password);

      const response = await fetch(
        `${API_URL}/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: cleanedEmail,
            password: passwordHash,
            role,
          }),
        }
      );

      const data = await response.json();

      console.log("Login response:", data);

      console.log(data.success);
      if ( !data.success) {
        return {
          success: false,
          message:
            data.msg ||
            data.message ||
            "Login failed.",
        };
      }

      // Backend returns token in details.token
      const authToken =
        data.details?.token;

        console.log(authToken);
      if (!authToken) {
        return {
          success: false,
          message:
            "Authentication token could not be created.",
        };
      }

      /*
       * Your current backend does not return
       * details.user.
       *
       * Therefore create the frontend user
       * from the successful login information.
       */

      const userData = {
        email: cleanedEmail,
        role: role,
      };

      console.log(authToken);
      // Save JWT
      localStorage.setItem(
        TOKEN_KEY,
        authToken
      );

      // Save user
      localStorage.setItem(
        USER_KEY,
        JSON.stringify(userData)
      );

      // Update React state
      setToken(authToken);
      setUser(userData);

      return {
        success: true,
        token: authToken,
        user: userData,
        message:
          data.msg ||
          "Login successful.",
      };
    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      return {
        success: false,
        message:
          "Unable to connect to backend. Make sure Flask is running.",
      };
    }
  };

  // ===================================================
  // REGISTER
  // ===================================================

  const register = async ({
    name,
    email,
    phone,
    password,
    role,
  }) => {
    try {
      const cleanedName =
        name.trim();

      const cleanedEmail =
        email.trim().toLowerCase();

      // Backend supports officer/admin.
      const finalRole =
        role === "admin"
          ? "admin"
          : "officer";

      // Hash password before sending
      const passwordHash =
        await sha256(password);

      const response = await fetch(
        `${API_URL}/register`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: cleanedName,
            email: cleanedEmail,
            phone: phone?.trim() || "",
            password: passwordHash,
            role: finalRole,
          }),
        }
      );

      const data = await response.json();

      console.log(
        "Registration response:",
        data
      );

      if (!response.ok || !data.success) {
        return {
          success: false,
          message:
            data.msg ||
            data.message ||
            "Registration failed.",
        };
      }

      /*
       * Registration does NOT create a JWT.
       *
       * User must login after registration.
       */

      return {
        success: true,
        message:
          data.msg ||
          "User has been created.",
      };
    } catch (error) {
      console.error(
        "Registration error:",
        error
      );

      return {
        success: false,
        message:
          "Unable to connect to backend. Make sure Flask is running.",
      };
    }
  };

  // ===================================================
  // AUTHENTICATED FETCH
  // ===================================================

  /*
   * Use this function for every protected API request.
   *
   * Example:
   *
   * const response = await authFetch("/ocr", {
   *   method: "POST",
   *   body: formData
   * });
   */

  const authFetch = async (
    endpoint,
    options = {}
  ) => {
    const savedToken =
      localStorage.getItem(TOKEN_KEY);

    if (!savedToken) {
      logout();

      throw new Error(
        "Authentication token is missing."
      );
    }

    const headers = {
      ...(options.headers || {}),
      Authorization: `Bearer ${savedToken}`,
    };

    /*
     * Do not force Content-Type for FormData.
     * Browser must set multipart/form-data boundary.
     */

    if (
      !(options.body instanceof FormData) &&
      !headers["Content-Type"]
    ) {
      headers["Content-Type"] =
        "application/json";
    }

    const response = await fetch(
      endpoint.startsWith("http")
        ? endpoint
        : `${API_URL}${endpoint}`,
      {
        ...options,
        headers,
      }
    );

    /*
     * If backend rejects the token,
     * automatically logout.
     */

    if (
      response.status === 401 ||
      response.status === 403
    ) {
      logout();
    }

    return response;
  };

  // ===================================================
  // CONTEXT
  // ===================================================

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,

        login,
        register,
        logout,

        verifyAuthentication,
        authFetch,

        isAuthenticated:
          Boolean(user && token),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// =====================================================
// useAuth
// =====================================================

export const useAuth = () => {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};