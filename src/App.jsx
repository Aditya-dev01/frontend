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
              ADMIN + OFFICER
          ================================================= */}

          <Route
            element={
              <ProtectedRoute
                allowedRoles={[
                  "admin",
                  "officer",
                ]}
              />
            }
          >

            <Route element={<Layout />}>

              <Route
                path="/dashboard"
                element={<Dashboard />}
              />

              <Route
                path="/screening/new"
                element={<DocumentUpload />}
              />

              <Route
                path="/screening/:id/ocr"
                element={<OCRResults />}
              />

              <Route
                path="/screening/:id/verification"
                element={<VerificationResult />}
              />

              <Route
                path="/audit-history"
                element={<AuditHistory />}
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