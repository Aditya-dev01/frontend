// import { useState } from "react";

// import {
//   ShieldCheck,
//   LockKeyhole,
//   Mail,
//   Eye,
//   EyeOff,
//   ArrowRight,
//   Fingerprint,
//   UserPlus,
// } from "lucide-react";

// import { Link, useNavigate } from "react-router-dom";

// import { useAuth } from "../context/AuthContext";

// export default function Login() {
//   const navigate = useNavigate();
//   const { login } = useAuth();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState("guard");

//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const submit = async (e) => {
//     e.preventDefault();

//     setError("");
//     setLoading(true);

//     try {
//       const response = await fetch("http://127.0.0.1:5000/login", {
//         method: "POST",

//         headers: {
//           "Content-Type": "application/json",
//         },

//         body: JSON.stringify({
//           email: email.trim().toLowerCase(),
//           password: password,
//           role: role,
//         }),
//       });

//       let data;

//       try {
//         data = await response.json();
//       } catch {
//         throw new Error("Invalid response from authentication server.");
//       }

//       // --------------------------------
//       // LOGIN FAILED
//       // --------------------------------

//       if (!response.ok) {
//         setError(
//           data.message ||
//             "Check your login credentials."
//         );

//         return;
//       }

//       // --------------------------------
//       // GET JWT + USER
//       // --------------------------------

//       const token = data.token;
//       const user = data.user;

//       // Backend must return JWT
//       if (!token) {
//         setError(
//           "Login successful, but authentication token was not received."
//         );

//         return;
//       }

//       // --------------------------------
//       // SAVE JWT
//       // --------------------------------

//       localStorage.setItem("token", token);

//       // --------------------------------
//       // SAVE USER
//       // --------------------------------

//       if (user) {
//         localStorage.setItem(
//           "user",
//           JSON.stringify(user)
//         );

//         // Save role separately
//         if (user.role) {
//           localStorage.setItem(
//             "role",
//             user.role
//           );
//         }
//       }

//       // --------------------------------
//       // UPDATE AUTH CONTEXT
//       // --------------------------------

//       login(user, token);

//       console.log("Login successful");
//       console.log("User:", user);
//       console.log("Role:", user?.role);
//       console.log("JWT:", token);

//       // --------------------------------
//       // REDIRECT
//       // --------------------------------

//       if (user?.role === "user") {
//         navigate("/user-dashboard");
//       } else if (user?.role === "admin") {
//         navigate("/dashboard");
//       } else if (user?.role === "guard") {
//         navigate("/dashboard");
//       } else {
//         setError(
//           "Invalid user role received from server."
//         );
//       }
//     } catch (error) {
//       console.error("Authentication error:", error);

//       setError(
//         "Unable to connect to authentication server. Please make sure Flask is running."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#0b1f33] flex items-center justify-center p-5">

//       <div className="w-full max-w-[1050px] bg-white rounded-xl overflow-hidden shadow-2xl grid lg:grid-cols-[45%_55%]">

//         {/* ========================================
//             BRAND PANEL
//         ======================================== */}

//         <div className="hidden lg:flex bg-[#0b1f33] text-white p-12 flex-col justify-between">

//           {/* LOGO */}

//           <div>
//             <div className="flex items-center gap-3">

//               <div className="w-11 h-11 bg-[#1677b8] rounded-lg flex items-center justify-center">
//                 <ShieldCheck size={25} />
//               </div>

//               <div>

//                 <h1 className="font-bold tracking-wide text-lg">
//                   PramaanAI
//                 </h1>

//                 <p className="text-[9px] tracking-[2px] text-slate-400">
//                   IDENTITY INTELLIGENCE SYSTEM
//                 </p>

//               </div>

//             </div>
//           </div>

//           {/* BRAND CONTENT */}

//           <div>

//             <div className="mb-8">

//               <Fingerprint
//                 size={70}
//                 strokeWidth={1}
//                 className="text-[#3ba3dd]"
//               />

//             </div>

//             <p className="text-xs text-[#3ba3dd] font-semibold tracking-[2px] mb-3">
//               SECURE ACCESS PORTAL
//             </p>

//             <h2 className="text-4xl font-bold leading-tight">

//               Intelligent
//               <br />
//               Identity Screening

//             </h2>

//             <p className="mt-5 text-sm text-slate-400 leading-6 max-w-sm">

//               AI-assisted verification of identity documents,
//               biometric consistency and document integrity
//               for secure screening operations.

//             </p>

//           </div>

//           {/* FOOTER */}

//           <div className="text-xs text-slate-500">

//             AUTHORIZED PERSONNEL & REGISTERED USERS

//           </div>

//         </div>

//         {/* ========================================
//             LOGIN PANEL
//         ======================================== */}

//         <div className="p-8 md:p-12">

//           <div className="max-w-md mx-auto">

//             {/* HEADER */}

//             <div className="mb-8">

//               <p className="text-xs font-bold tracking-[1.5px] text-[#1677b8]">

//                 SECURE AUTHENTICATION

//               </p>

//               <h2 className="text-3xl font-bold text-[#17212b] mt-2">

//                 Sign in

//               </h2>

//               <p className="text-sm text-slate-500 mt-2">

//                 Access your PramaanAI verification console.

//               </p>

//             </div>

//             {/* ========================================
//                 ERROR MESSAGE
//             ======================================== */}

//             {error && (

//               <div className="mb-5 p-3 rounded-lg border border-red-200 bg-red-50 text-sm text-red-700">

//                 {error}

//               </div>

//             )}

//             {/* ========================================
//                 LOGIN FORM
//             ======================================== */}

//             <form
//               onSubmit={submit}
//               className="space-y-5"
//             >

//               {/* EMAIL */}

//               <div>

//                 <label className="text-xs font-semibold text-slate-600">

//                   EMAIL ADDRESS

//                 </label>

//                 <div className="mt-2 flex items-center border border-slate-300 rounded-md h-11 px-3 focus-within:border-[#1677b8]">

//                   <Mail
//                     size={17}
//                     className="text-slate-400"
//                   />

//                   <input
//                     type="email"
//                     required
//                     value={email}
//                     onChange={(e) =>
//                       setEmail(e.target.value)
//                     }
//                     placeholder="Enter your email"
//                     className="w-full ml-3 outline-none text-sm text-slate-800"
//                   />

//                 </div>

//               </div>

//               {/* PASSWORD */}

//               <div>

//                 <label className="text-xs font-semibold text-slate-600">

//                   PASSWORD

//                 </label>

//                 <div className="mt-2 flex items-center border border-slate-300 rounded-md h-11 px-3 focus-within:border-[#1677b8]">

//                   <LockKeyhole
//                     size={17}
//                     className="text-slate-400"
//                   />

//                   <input
//                     type={
//                       showPassword
//                         ? "text"
//                         : "password"
//                     }
//                     required
//                     value={password}
//                     onChange={(e) =>
//                       setPassword(e.target.value)
//                     }
//                     placeholder="Enter password"
//                     className="w-full ml-3 outline-none text-sm text-slate-800"
//                   />

//                   <button
//                     type="button"
//                     onClick={() =>
//                       setShowPassword(
//                         (previous) =>
//                           !previous
//                       )
//                     }
//                     className="text-slate-400 hover:text-slate-600"
//                   >

//                     {showPassword ? (
//                       <EyeOff size={17} />
//                     ) : (
//                       <Eye size={17} />
//                     )}

//                   </button>

//                 </div>

//               </div>

//               {/* ========================================
//                   ROLE
//               ======================================== */}

//               <div>

//                 <label className="text-xs font-semibold text-slate-600">

//                   ACCESS ROLE

//                 </label>

//                 <select
//                   value={role}
//                   onChange={(e) =>
//                     setRole(e.target.value)
//                   }
//                   className="mt-2 w-full h-11 border border-slate-300 rounded-md px-3 text-sm outline-none focus:border-[#1677b8]"
//                 >

//                   <option value="guard">
//                     Security Guard
//                   </option>

//                   <option value="admin">
//                     System Administrator
//                   </option>

//                   <option value="user">
//                     Registered User
//                   </option>

//                 </select>

//               </div>

//               {/* ========================================
//                   LOGIN BUTTON
//               ======================================== */}

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full h-11 bg-[#1677b8] hover:bg-[#12679f] text-white rounded-md font-semibold text-sm flex items-center justify-center gap-2 transition disabled:opacity-60 disabled:cursor-not-allowed"
//               >

//                 {loading
//                   ? "Authenticating..."
//                   : "Sign in to console"}

//                 {!loading && (
//                   <ArrowRight size={17} />
//                 )}

//               </button>

//             </form>

//             {/* ========================================
//                 CREATE ACCOUNT
//             ======================================== */}

//             <div className="mt-7">

//               <div className="relative">

//                 <div className="absolute inset-0 flex items-center">

//                   <div className="w-full border-t border-slate-200" />

//                 </div>

//                 <div className="relative flex justify-center">

//                   <span className="bg-white px-3 text-[10px] font-semibold text-slate-400">

//                     OR

//                   </span>

//                 </div>

//               </div>

//               <Link
//                 to="/register"
//                 className="mt-5 w-full h-11 border border-slate-300 hover:border-[#1677b8] hover:bg-blue-50 text-slate-700 rounded-md font-semibold text-sm flex items-center justify-center gap-2 transition"
//               >

//                 <UserPlus size={17} />

//                 Create a new account

//               </Link>

//             </div>

//             {/* ========================================
//                 SECURITY MESSAGE
//             ======================================== */}

//             <div className="mt-8 pt-5 border-t border-slate-200">

//               <p className="text-[10px] font-bold text-slate-400 tracking-[1px]">

//                 SECURE LOGIN

//               </p>

//               <p className="mt-2 text-xs text-slate-500 leading-5">

//                 Every successful login generates a new
//                 authentication token from the PramaanAI backend.

//               </p>

//             </div>

//             {/* ========================================
//                 FOOTER
//             ======================================== */}

//             <div className="flex items-center justify-center gap-2 mt-8 text-[10px] text-slate-400">

//               <ShieldCheck size={13} />

//               Protected PramaanAI authentication environment

//             </div>

//           </div>

//         </div>

//       </div>

//     </div>
//   );
// }


import { useState } from "react";

import {
  ShieldCheck,
  LockKeyhole,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Fingerprint,
  UserPlus,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Default role changed from guard → user
  const [role, setRole] = useState("user");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      // ========================================
      // SEND LOGIN REQUEST
      // ========================================

      const response = await fetch(
        "http://127.0.0.1:5000/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            password: password,
            role: role,
          }),
        }
      );

      // ========================================
      // READ SERVER RESPONSE
      // ========================================

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "Invalid response from authentication server."
        );
      }

      console.log("Login server response:", data);

      // ========================================
      // LOGIN FAILED
      // ========================================

      if (!response.ok) {
        setError(
          data.message ||
            data.error ||
            "Check your login credentials."
        );

        return;
      }

      // ========================================
      // GET JWT + USER
      // ========================================

      const token = data.token;
      const user = data.user;

      // ========================================
      // CHECK TOKEN
      // ========================================

      if (!token) {
        setError(
          "Login successful, but authentication token was not received."
        );

        return;
      }

      // ========================================
      // SAVE JWT
      // ========================================

      localStorage.setItem(
        "token",
        token
      );

      // ========================================
      // SAVE USER
      // ========================================

      if (user) {
        localStorage.setItem(
          "user",
          JSON.stringify(user)
        );

        if (user.role) {
          localStorage.setItem(
            "role",
            user.role
          );
        }
      }

      // ========================================
      // UPDATE AUTH CONTEXT
      // ========================================

      login(user, token);

      console.log(
        "================================"
      );

      console.log(
        "LOGIN SUCCESSFUL"
      );

      console.log(
        "User:",
        user
      );

      console.log(
        "Role:",
        user?.role
      );

      console.log(
        "JWT:",
        token
      );

      console.log(
        "================================"
      );

      // ========================================
      // REDIRECT
      // ========================================

      if (user?.role === "user") {
        navigate("/user-dashboard");
      }

      else if (user?.role === "admin") {
        navigate("/dashboard");
      }

      else if (user?.role === "guard") {
        navigate("/dashboard");
      }

      else {
        setError(
          "Invalid user role received from server."
        );
      }

    } catch (error) {

      console.error(
        "Authentication error:",
        error
      );

      setError(
        error.message ||
          "Unable to connect to authentication server."
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="min-h-screen bg-[#0b1f33] flex items-center justify-center p-5">

      <div className="w-full max-w-[1050px] bg-white rounded-xl overflow-hidden shadow-2xl grid lg:grid-cols-[45%_55%]">

        {/* ========================================
            BRAND PANEL
        ======================================== */}

        <div className="hidden lg:flex bg-[#0b1f33] text-white p-12 flex-col justify-between">

          <div>

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 bg-[#1677b8] rounded-lg flex items-center justify-center">

                <ShieldCheck size={25} />

              </div>

              <div>

                <h1 className="font-bold tracking-wide text-lg">
                  PramaanAI
                </h1>

                <p className="text-[9px] tracking-[2px] text-slate-400">
                  IDENTITY INTELLIGENCE SYSTEM
                </p>

              </div>

            </div>

          </div>


          {/* BRAND CONTENT */}

          <div>

            <div className="mb-8">

              <Fingerprint
                size={70}
                strokeWidth={1}
                className="text-[#3ba3dd]"
              />

            </div>

            <p className="text-xs text-[#3ba3dd] font-semibold tracking-[2px] mb-3">
              SECURE ACCESS PORTAL
            </p>

            <h2 className="text-4xl font-bold leading-tight">

              Intelligent
              <br />
              Identity Screening

            </h2>

            <p className="mt-5 text-sm text-slate-400 leading-6 max-w-sm">

              AI-assisted verification of identity documents,
              biometric consistency and document integrity
              for secure screening operations.

            </p>

          </div>


          {/* FOOTER */}

          <div className="text-xs text-slate-500">

            AUTHORIZED PERSONNEL & REGISTERED USERS

          </div>

        </div>


        {/* ========================================
            LOGIN PANEL
        ======================================== */}

        <div className="p-8 md:p-12">

          <div className="max-w-md mx-auto">

            {/* HEADER */}

            <div className="mb-8">

              <p className="text-xs font-bold tracking-[1.5px] text-[#1677b8]">
                SECURE AUTHENTICATION
              </p>

              <h2 className="text-3xl font-bold text-[#17212b] mt-2">
                Sign in
              </h2>

              <p className="text-sm text-slate-500 mt-2">
                Access your PramaanAI verification console.
              </p>

            </div>


            {/* ERROR */}

            {error && (

              <div className="mb-5 p-3 rounded-lg border border-red-200 bg-red-50 text-sm text-red-700">

                {error}

              </div>

            )}


            {/* LOGIN FORM */}

            <form
              onSubmit={submit}
              className="space-y-5"
            >

              {/* EMAIL */}

              <div>

                <label className="text-xs font-semibold text-slate-600">
                  EMAIL ADDRESS
                </label>

                <div className="mt-2 flex items-center border border-slate-300 rounded-md h-11 px-3 focus-within:border-[#1677b8]">

                  <Mail
                    size={17}
                    className="text-slate-400"
                  />

                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="Enter your email"
                    className="w-full ml-3 outline-none text-sm text-slate-800"
                  />

                </div>

              </div>


              {/* PASSWORD */}

              <div>

                <label className="text-xs font-semibold text-slate-600">
                  PASSWORD
                </label>

                <div className="mt-2 flex items-center border border-slate-300 rounded-md h-11 px-3 focus-within:border-[#1677b8]">

                  <LockKeyhole
                    size={17}
                    className="text-slate-400"
                  />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    required
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="Enter password"
                    className="w-full ml-3 outline-none text-sm text-slate-800"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (previous) =>
                          !previous
                      )
                    }
                    className="text-slate-400 hover:text-slate-600"
                  >

                    {showPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}

                  </button>

                </div>

              </div>


              {/* ROLE */}

              <div>

                <label className="text-xs font-semibold text-slate-600">
                  ACCESS ROLE
                </label>

                <select
                  value={role}
                  onChange={(e) =>
                    setRole(e.target.value)
                  }
                  className="mt-2 w-full h-11 border border-slate-300 rounded-md px-3 text-sm outline-none focus:border-[#1677b8]"
                >

                  <option value="user">
                    Registered User
                  </option>

                  <option value="guard">
                    Security Guard
                  </option>

                  <option value="admin">
                    System Administrator
                  </option>

                </select>

              </div>


              {/* LOGIN BUTTON */}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-[#1677b8] hover:bg-[#12679f] text-white rounded-md font-semibold text-sm flex items-center justify-center gap-2 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >

                {loading
                  ? "Authenticating..."
                  : "Sign in to console"}

                {!loading && (
                  <ArrowRight size={17} />
                )}

              </button>

            </form>


            {/* CREATE ACCOUNT */}

            <div className="mt-7">

              <div className="relative">

                <div className="absolute inset-0 flex items-center">

                  <div className="w-full border-t border-slate-200" />

                </div>

                <div className="relative flex justify-center">

                  <span className="bg-white px-3 text-[10px] font-semibold text-slate-400">
                    OR
                  </span>

                </div>

              </div>

              <Link
                to="/register"
                className="mt-5 w-full h-11 border border-slate-300 hover:border-[#1677b8] hover:bg-blue-50 text-slate-700 rounded-md font-semibold text-sm flex items-center justify-center gap-2 transition"
              >

                <UserPlus size={17} />

                Create a new account

              </Link>

            </div>


            {/* SECURITY MESSAGE */}

            <div className="mt-8 pt-5 border-t border-slate-200">

              <p className="text-[10px] font-bold text-slate-400 tracking-[1px]">
                SECURE LOGIN
              </p>

              <p className="mt-2 text-xs text-slate-500 leading-5">

                Every successful login generates a new
                authentication token from the PramaanAI backend.

              </p>

            </div>


            {/* FOOTER */}

            <div className="flex items-center justify-center gap-2 mt-8 text-[10px] text-slate-400">

              <ShieldCheck size={13} />

              Protected PramaanAI authentication environment

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}