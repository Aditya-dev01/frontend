import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext(null);

// =====================================================
// API CONFIG
// =====================================================

// Local Flask backend
// const API_URL = "http://127.0.0.1:5000";

// Render backend
const API_URL =
  "https://hackathon-backend-0eoj.onrender.com";

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
    const savedToken =
      localStorage.getItem(TOKEN_KEY);

    // -----------------------------------------------
    // No token
    // -----------------------------------------------

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
          },
        }
      );

      let data;

      try {
        data = await response.json();
      } catch {
        logout();

        return false;
      }

      console.log(
        "Token verification:",
        data
      );

      // -----------------------------------------------
      // Invalid token
      // -----------------------------------------------

      if (
        !response.ok ||
        !data.success
      ) {
        logout();

        return false;
      }

      // -----------------------------------------------
      // Valid token
      // -----------------------------------------------

      setToken(savedToken);

      // -----------------------------------------------
      // Restore saved user
      // -----------------------------------------------

      const savedUser =
        localStorage.getItem(USER_KEY);

      if (savedUser) {
        try {
          setUser(
            JSON.parse(savedUser)
          );
        } catch {
          localStorage.removeItem(
            USER_KEY
          );

          setUser(null);
        }
      } else {
        // Backend /verifyToken does not return
        // user information.

        setUser(null);
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
    password
  ) => {
    try {
      // -----------------------------------------------
      // Validate input
      // -----------------------------------------------

      if (!email?.trim()) {
        return {
          success: false,
          message: "Email is required.",
        };
      }

      if (!password) {
        return {
          success: false,
          message: "Password is required.",
        };
      }

      // -----------------------------------------------
      // Clean email
      // -----------------------------------------------

      const cleanedEmail =
        email.trim().toLowerCase();

      // -----------------------------------------------
      // Hash password
      // -----------------------------------------------

      const passwordHash =
        await sha256(password);

      // -----------------------------------------------
      // LOGIN REQUEST
      //
      // Backend expects:
      //
      // {
      //   email,
      //   password
      // }
      //
      // DO NOT SEND role.
      // -----------------------------------------------

      const response = await fetch(
        `${API_URL}/login`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            email: cleanedEmail,
            password: passwordHash,
          }),
        }
      );

      let data;

      try {
        data = await response.json();
      } catch {
        return {
          success: false,
          message:
            "Server returned an invalid response.",
        };
      }

      console.log(
        "Login response:",
        data
      );

      // -----------------------------------------------
      // LOGIN FAILED
      // -----------------------------------------------

      if (
        !response.ok ||
        !data.success
      ) {
        return {
          success: false,
          message:
            data.msg ||
            data.message ||
            "Invalid email or password.",
          details:
            data.details || {},
        };
      }

      // -----------------------------------------------
      // GET JWT
      //
      // Backend:
      //
      // details: {
      //   email,
      //   password,
      //   token
      // }
      // -----------------------------------------------

      const authToken =
        data.details?.token;

      if (!authToken) {
        return {
          success: false,
          message:
            "Authentication token could not be created.",
        };
      }

      // -----------------------------------------------
      // CREATE FRONTEND USER
      //
      // Current backend does NOT return:
      // name
      // phone
      // organization
      // role
      //
      // Therefore only store the email.
      // -----------------------------------------------

      const userData = {
        email: cleanedEmail,
      };

      // -----------------------------------------------
      // SAVE TOKEN
      // -----------------------------------------------

      localStorage.setItem(
        TOKEN_KEY,
        authToken
      );

      // -----------------------------------------------
      // SAVE USER
      // -----------------------------------------------

      localStorage.setItem(
        USER_KEY,
        JSON.stringify(userData)
      );

      // -----------------------------------------------
      // UPDATE STATE
      // -----------------------------------------------

      setToken(authToken);
      setUser(userData);

      console.log(
        "Authenticated user:",
        userData
      );

      // -----------------------------------------------
      // RETURN SUCCESS
      // -----------------------------------------------

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
          "Unable to connect to backend. Make sure the Flask server is running.",
      };
    }
  };

  // ===================================================
  // REGISTER
  // ===================================================

  /*
   * Backend /register expects:
   *
   * {
   *   oldUserData,
   *   newUserData,
   *   adminRegistration
   * }
   *
   * app.py:
   *
   * checkDictShape(
   *   data,
   *   {
   *     "oldUserData",
   *     "newUserData",
   *     "adminRegistration"
   *   }
   * )
   *
   * Then:
   *
   * createUser(
   *   oldUserData=data["oldUserData"],
   *   newUserData=data["newUserData"],
   *   admin_registration=data["adminRegistration"]
   * )
   */

  const register = async ({
  oldUserData = {},
  newUserData = {},
  adminRegistration = true,
  }) => {
  try {
    // -----------------------------------------------
    // GET USER DATA
    // -----------------------------------------------

    const {
      name,
      email,
      phone,
      organization,
      password,
    } = newUserData;

    // -----------------------------------------------
    // VALIDATE
    // -----------------------------------------------

    if (!name?.trim()) {
      return {
        success: false,
        message: "Name is required.",
      };
    }

    if (!email?.trim()) {
      return {
        success: false,
        message: "Email is required.",
      };
    }

    if (!phone?.trim()) {
      return {
        success: false,
        message: "Phone number is required.",
      };
    }

    if (!organization?.trim()) {
      return {
        success: false,
        message: "Organization is required.",
      };
    }

    if (!password) {
      return {
        success: false,
        message: "Password is required.",
      };
    }

    // -----------------------------------------------
    // CLEAN VALUES
    // -----------------------------------------------

    const cleanedName = name.trim();

    const cleanedEmail =
      email.trim().toLowerCase();

    const cleanedPhone =
      phone.trim();

    const cleanedOrganization =
      organization.trim();

    // -----------------------------------------------
    // HASH PASSWORD
    // -----------------------------------------------

    const passwordHash =
      await sha256(password);

    // -----------------------------------------------
    // CREATE NEW USER DATA
    // -----------------------------------------------

    const cleanedNewUserData = {
      name: cleanedName,
      email: cleanedEmail,
      phone: cleanedPhone,
      organization: cleanedOrganization,
      password: passwordHash,
    };

    // -----------------------------------------------
    // FINAL REGISTER PAYLOAD
    // -----------------------------------------------

    const payload = {
      oldUserData,
      newUserData: cleanedNewUserData,
      adminRegistration,
    };

    console.log(
      "Registration payload:",
      {
        ...payload,
        newUserData: {
          ...cleanedNewUserData,
          password: "[SHA-256 HASH]",
        },
      }
    );

    // -----------------------------------------------
    // REGISTER REQUEST
    // -----------------------------------------------

    const response = await fetch(
      `${API_URL}/register`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(payload),
      }
    );

    // -----------------------------------------------
    // PARSE RESPONSE
    // -----------------------------------------------

    let data;

    try {
      data = await response.json();
    } catch {
      return {
        success: false,
        message:
          "Server returned an invalid response.",
      };
    }

    console.log(
      "Registration response:",
      data
    );

    // -----------------------------------------------
    // REGISTRATION FAILED
    // -----------------------------------------------

    if (
      !response.ok ||
      !data.success
    ) {
      return {
        success: false,
        message:
          data.msg ||
          data.message ||
          "Registration failed.",

        details:
          data.details || {},
      };
    }

    // -----------------------------------------------
    // REGISTRATION SUCCESSFUL
    // -----------------------------------------------

    return {
      success: true,

      message:
        data.msg ||
        "Registration successful.",

      details:
        data.details || {},
    };

  } catch (error) {
    console.error(
      "Registration error:",
      error
    );

    return {
      success: false,
      message:
        "Unable to connect to backend. Make sure the Flask server is running.",
    };
  }
};


  // ===================================================
  // AUTHENTICATED FETCH
  // ===================================================

  /*
   * Used for protected APIs:
   *
   * /ocr
   * /audit_log
   *
   * Automatically adds:
   *
   * Authorization: Bearer <JWT>
   */

  const authFetch = async (
    endpoint,
    options = {}
  ) => {
    const savedToken =
      localStorage.getItem(
        TOKEN_KEY
      );

    // -----------------------------------------------
    // No token
    // -----------------------------------------------

    if (!savedToken) {
      logout();

      throw new Error(
        "Authentication token is missing."
      );
    }

    // -----------------------------------------------
    // Headers
    // -----------------------------------------------

    const headers = {
      ...(options.headers || {}),
      Authorization:
        `Bearer ${savedToken}`,
    };

    // -----------------------------------------------
    // Do NOT set Content-Type for FormData
    // -----------------------------------------------

    if (
      !(options.body instanceof FormData) &&
      !headers["Content-Type"]
    ) {
      headers["Content-Type"] =
        "application/json";
    }

    // -----------------------------------------------
    // Request
    // -----------------------------------------------

    const response = await fetch(
      endpoint.startsWith("http")
        ? endpoint
        : `${API_URL}${endpoint}`,
      {
        ...options,
        headers,
      }
    );

    // -----------------------------------------------
    // Invalid / expired JWT
    // -----------------------------------------------

    if (
      response.status === 401 ||
      response.status === 403
    ) {
      logout();
    }

    return response;
  };

  // ===================================================
  // OCR UPLOAD
  // ===================================================

  /*
   * Convenience function for /ocr.
   *
   * Usage:
   *
   * const result = await uploadOCR(imageFile);
   */

  const uploadOCR = async (imageFile) => {
    try {
      if (!imageFile) {
        return {
          success: false,
          message:
            "Please select an image.",
        };
      }

      const formData =
        new FormData();

      formData.append(
        "image",
        imageFile
      );

      const response =
        await authFetch(
          "/ocr",
          {
            method: "POST",
            body: formData,
          }
        );

      let data;

      try {
        data =
          await response.json();
      } catch {
        return {
          success: false,
          message:
            "Server returned an invalid response.",
        };
      }

      console.log(
        "OCR response:",
        data
      );

      if (
        !response.ok ||
        !data.success
      ) {
        return {
          success: false,
          message:
            data.msg ||
            data.message ||
            "OCR processing failed.",
          details:
            data.details || {},
        };
      }

      return {
        success: true,
        message:
          data.msg ||
          "OCR completed successfully.",
        details:
          data.details || {},
      };

    } catch (error) {
      console.error(
        "OCR error:",
        error
      );

      return {
        success: false,
        message:
          error.message ||
          "Unable to process OCR.",
      };
    }
  };

  // ===================================================
  // AUDIT LOG
  // ===================================================

  /*
   * Backend:
   *
   * POST /audit_log
   *
   * Optional JSON:
   *
   * {
   *   limit,
   *   offset
   * }
   */

  const getAuditLogs = async ({
    limit,
    offset,
  } = {}) => {
    try {
      const response =
        await authFetch(
          "/audit_log",
          {
            method: "POST",

            body: JSON.stringify({
              limit:
                limit ?? null,
              offset:
                offset ?? null,
            }),
          }
        );

      let data;

      try {
        data =
          await response.json();
      } catch {
        return {
          success: false,
          message:
            "Server returned an invalid response.",
        };
      }

      console.log(
        "Audit log response:",
        data
      );

      if (
        !response.ok ||
        !data.success
      ) {
        return {
          success: false,
          message:
            data.msg ||
            data.message ||
            "Could not fetch audit logs.",
          details:
            data.details || {},
        };
      }

      return {
        success: true,
        message:
          data.msg ||
          "Audit logs fetched successfully.",
        details:
          data.details || [],
      };

    } catch (error) {
      console.error(
        "Audit log error:",
        error
      );

      return {
        success: false,
        message:
          error.message ||
          "Unable to fetch audit logs.",
      };
    }
  };

  // ===================================================
  // CONTEXT
  // ===================================================

  return (
    <AuthContext.Provider
      value={{
        // -------------------------------------------
        // State
        // -------------------------------------------

        user,
        token,
        loading,

        // -------------------------------------------
        // Authentication
        // -------------------------------------------

        login,
        logout,
        verifyAuthentication,

        // -------------------------------------------
        // Registration
        // -------------------------------------------

        register,

        // -------------------------------------------
        // Protected API
        // -------------------------------------------

        authFetch,

        // -------------------------------------------
        // OCR
        // -------------------------------------------

        uploadOCR,

        // -------------------------------------------
        // Audit logs
        // -------------------------------------------

        getAuditLogs,

        // -------------------------------------------
        // Authentication state
        // -------------------------------------------

        isAuthenticated:
          Boolean(token),

        // -------------------------------------------
        // Current backend does NOT return role
        // -------------------------------------------

        isAdmin: false,
        isOfficer: false,
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