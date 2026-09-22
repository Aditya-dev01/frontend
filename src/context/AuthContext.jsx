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
  // NORMALIZE USER
  // ===================================================

  const normalizeUser = (data) => {
    /*
      Backend may return user in any of these:

      data.details.user
      data.user
      data.details

      Expected user:

      {
        email,
        name,
        phone,
        organization,
        role
      }
    */

    const backendUser =
      data?.details?.user ||
      data?.user ||
      data?.details;

    if (
      !backendUser ||
      typeof backendUser !== "object"
    ) {
      return null;
    }

    return {
      email:
        backendUser.email || "",

      name:
        backendUser.name || "",

      phone:
        backendUser.phone || "",

      organization:
        backendUser.organization || "",

      role:
        String(
          backendUser.role || ""
        ).toLowerCase(),
    };
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
            Authorization:
              `Bearer ${savedToken}`,
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
      // INVALID TOKEN
      // -----------------------------------------------

      if (
        !response.ok ||
        !data.success
      ) {
        logout();

        return false;
      }

      // -----------------------------------------------
      // VALID TOKEN
      // -----------------------------------------------

      setToken(savedToken);

      // -----------------------------------------------
      // RESTORE USER
      // -----------------------------------------------

      const savedUser =
        localStorage.getItem(USER_KEY);

      if (savedUser) {
        try {
          const parsedUser =
            JSON.parse(savedUser);

          setUser(parsedUser);

          console.log(
            "Restored user:",
            parsedUser
          );

        } catch (error) {
          console.error(
            "Invalid saved user:",
            error
          );

          localStorage.removeItem(
            USER_KEY
          );

          setUser(null);
        }
      } else {
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
  // VERIFY TOKEN WHEN APP LOADS
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
      // VALIDATION
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
      // CLEAN EMAIL
      // -----------------------------------------------

      const cleanedEmail =
        email.trim().toLowerCase();

      // -----------------------------------------------
      // HASH PASSWORD
      // -----------------------------------------------

      const passwordHash =
        await sha256(password);

      // -----------------------------------------------
      // LOGIN REQUEST
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
      // -----------------------------------------------

      const authToken =
        data.details?.token ||
        data.token;

      if (!authToken) {
        return {
          success: false,
          message:
            "Authentication token could not be created.",
        };
      }

      // -----------------------------------------------
      // GET USER DATA
      // -----------------------------------------------

      const backendUser =
        normalizeUser(data);

      // -----------------------------------------------
      // FALLBACK USER
      // -----------------------------------------------

      const userData =
        backendUser || {
          email:
            data.details?.email ||
            data.email ||
            cleanedEmail,

          name:
            data.details?.name ||
            data.name ||
            "",

          phone:
            data.details?.phone ||
            data.phone ||
            "",

          organization:
            data.details?.organization ||
            data.organization ||
            "",

          role:
            String(
              data.details?.role ||
              data.role ||
              ""
            ).toLowerCase(),
        };

      console.log(
        "Authenticated user:",
        userData
      );

      console.log(
        "Authenticated role:",
        userData.role
      );

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

      // -----------------------------------------------
      // LOGIN SUCCESS
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
  //
  // THIS FUNCTION SUPPORTS BOTH:
  //
  // 1. HOME PAGE ADMIN REGISTRATION
  //
  //    oldUserData = {}
  //    newUserData = ADMIN
  //    adminRegistration = true
  //
  //
  // 2. ADMIN CREATE USER
  //
  //    oldUserData = LOGGED-IN ADMIN
  //    newUserData = NEW USER
  //    adminRegistration = false
  //
  // ===================================================

  const register = async ({
    oldUserData = null,
    newUserData = {},
    adminRegistration = true,
  }) => {
    try {
      // -----------------------------------------------
      // GET NEW USER DATA
      // -----------------------------------------------

      const {
        name,
        email,
        phone,
        organization,
        password,
      } = newUserData;

      // -----------------------------------------------
      // VALIDATION
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
      // CLEAN NEW USER DATA
      // -----------------------------------------------

      const cleanedNewUserData = {
        name:
          name.trim(),

        email:
          email.trim().toLowerCase(),

        phone:
          phone.trim(),

        organization:
          organization.trim(),

        password:
          await sha256(password),
      };

      // =================================================
      // HOME PAGE ADMIN REGISTRATION
      // =================================================
      //
      // oldUserData MUST be {}
      //
      // newUserData = ADMIN
      //
      // adminRegistration = true
      // =================================================

      let cleanedOldUserData = {};

      if (adminRegistration === true) {
        cleanedOldUserData = {};
      }

      // =================================================
      // ADMIN CREATE USER
      // =================================================
      //
      // oldUserData = LOGGED-IN ADMIN
      //
      // newUserData = NEW USER
      //
      // adminRegistration = false
      // =================================================

      else {
        // ---------------------------------------------
        // ADMIN MUST BE LOGGED IN
        // ---------------------------------------------

        if (!user) {
          return {
            success: false,
            message:
              "You must be logged in to create a user.",
          };
        }

        // ---------------------------------------------
        // ONLY ADMIN CAN CREATE USER
        // ---------------------------------------------

        if (
          String(user.role).toLowerCase() !==
          "admin"
        ) {
          return {
            success: false,
            message:
              "Only an admin can create users.",
          };
        }

        // ---------------------------------------------
        // OLD USER = LOGGED-IN ADMIN
        // ---------------------------------------------

        cleanedOldUserData = {
          name:
            user.name || "",

          email:
            user.email || "",

          phone:
            user.phone || "",

          organization:
            user.organization || "",

          role:
            "admin",
        };
      }

      // =================================================
      // FINAL PAYLOAD
      // =================================================

      const payload = {
        oldUserData:
          cleanedOldUserData,

        newUserData:
          cleanedNewUserData,

        adminRegistration:
          Boolean(adminRegistration),
      };

      // =================================================
      // DEBUG PAYLOAD
      // =================================================

      console.log(
        "===================================="
      );

      console.log(
        "REGISTER REQUEST"
      );

      console.log(
        "Admin Registration:",
        adminRegistration
      );

      console.log(
        "Old User Data:",
        cleanedOldUserData
      );

      console.log(
        "New User Data:",
        {
          ...cleanedNewUserData,
          password: "[SHA-256 HASH]",
        }
      );

      console.log(
        "Final Payload:",
        {
          ...payload,

          newUserData: {
            ...cleanedNewUserData,

            password:
              "[SHA-256 HASH]",
          },
        }
      );

      console.log(
        "===================================="
      );

      // =================================================
      // SEND REQUEST
      // =================================================

      let response;

      // -----------------------------------------------
      // HOME ADMIN REGISTRATION
      // -----------------------------------------------

      if (adminRegistration === true) {
        response = await fetch(
          `${API_URL}/register`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(payload),
          }
        );
      }

      // -----------------------------------------------
      // ADMIN CREATE USER
      // -----------------------------------------------

      else {
        response = await authFetch(
          "/register",
          {
            method: "POST",

            body:
              JSON.stringify(payload),
          }
        );
      }

      // =================================================
      // PARSE RESPONSE
      // =================================================

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
        "Registration response:",
        data
      );

      // =================================================
      // REGISTRATION FAILED
      // =================================================

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

      // =================================================
      // REGISTRATION SUCCESS
      // =================================================

      return {
        success: true,

        message:
          data.msg ||
          (
            adminRegistration
              ? "Admin registered successfully."
              : "User created successfully."
          ),

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
          error.message ||
          "Unable to connect to backend.",
      };
    }
  };

  // ===================================================
  // AUTHENTICATED FETCH
  // ===================================================

  const authFetch = async (
    endpoint,
    options = {}
  ) => {
    const savedToken =
      localStorage.getItem(
        TOKEN_KEY
      );

    // -----------------------------------------------
    // NO TOKEN
    // -----------------------------------------------

    if (!savedToken) {
      logout();

      throw new Error(
        "Authentication token is missing."
      );
    }

    // -----------------------------------------------
    // HEADERS
    // -----------------------------------------------

    const headers = {
      ...(options.headers || {}),

      Authorization:
        `Bearer ${savedToken}`,
    };

    // -----------------------------------------------
    // FORM DATA
    // -----------------------------------------------

    if (
      !(options.body instanceof FormData) &&
      !headers["Content-Type"]
    ) {
      headers["Content-Type"] =
        "application/json";
    }

    // -----------------------------------------------
    // REQUEST
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
    // TOKEN INVALID
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

  const uploadOCR = async (
    imageFile
  ) => {
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

            body:
              JSON.stringify({
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
  // ROLE CHECKS
  // ===================================================

  const currentRole =
    String(
      user?.role || ""
    ).toLowerCase();

  const isAdmin =
    currentRole === "admin";

  const isOfficer =
    currentRole === "officer";

  // ===================================================
  // CONTEXT
  // ===================================================

  return (
    <AuthContext.Provider
      value={{
        // -------------------------------------------
        // STATE
        // -------------------------------------------

        user,
        token,
        loading,

        // -------------------------------------------
        // AUTHENTICATION
        // -------------------------------------------

        login,
        logout,
        verifyAuthentication,

        // -------------------------------------------
        // REGISTRATION
        // -------------------------------------------

        register,

        // -------------------------------------------
        // PROTECTED API
        // -------------------------------------------

        authFetch,

        // -------------------------------------------
        // OCR
        // -------------------------------------------

        uploadOCR,

        // -------------------------------------------
        // AUDIT LOGS
        // -------------------------------------------

        getAuditLogs,

        // -------------------------------------------
        // AUTH STATE
        // -------------------------------------------

        isAuthenticated:
          Boolean(token),

        // -------------------------------------------
        // ROLE
        // -------------------------------------------

        role: currentRole,

        isAdmin,

        isOfficer,
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