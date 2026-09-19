import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import DocumentUpload from "./pages/DocumentUpload";
import OCRResults from "./pages/OCRResults";
import VerificationResult from "./pages/VerificationResult";
import AuditHistory from "./pages/AuditHistory";
import CreateUser from "./pages/CreateUser";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <AuthProvider>

      <BrowserRouter>

        <Routes>

          {/* ================================================
              PUBLIC
          ================================================= */}

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />


          {/* ================================================
              AUTHENTICATED USERS
          ================================================= */}

          <Route element={<ProtectedRoute />}>

            <Route element={<Layout />}>

              {/* DASHBOARD */}

              <Route
                path="/dashboard"
                element={<Dashboard />}
              />


              {/* SCREENING */}

              <Route
                path="/screening/new"
                element={<DocumentUpload />}
              />


              {/* OCR */}

              <Route
                path="/screening/:id/ocr"
                element={<OCRResults />}
              />


              {/* VERIFICATION */}

              <Route
                path="/screening/:id/verification"
                element={<VerificationResult />}
              />


              {/* AUDIT */}

              <Route
                path="/audit-history"
                element={<AuditHistory />}
              />


              {/* ADMIN CREATE USER */}

              <Route
                path="/admin/create-user"
                element={<CreateUser />}
              />

            </Route>

          </Route>


          {/* ================================================
              DEFAULT
          ================================================= */}

          <Route
            path="/"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />

          <Route
            path="*"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />

        </Routes>

      </BrowserRouter>

    </AuthProvider>
  );
}