import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import DocumentUpload from "./pages/DocumentUpload";
import OCRResults from "./pages/OCRResults";
import VerificationResult from "./pages/VerificationResult";
import RiskDashboard from "./pages/RiskDashboard";
import AuditHistory from "./pages/AuditHistory";

import UserDashboard from "./pages/UserDashboard";
import IdentityCheck from "./pages/IdentityCheck";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* =================================================
            PUBLIC ROUTES
        ================================================== */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* =================================================
            ADMIN + SECURITY OFFICER CONSOLE
        ================================================== */}

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

            {/* Dashboard */}

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            {/* New Screening */}

            <Route
              path="/screening/new"
              element={<DocumentUpload />}
            />

            {/* OCR */}

            <Route
              path="/screening/:id/ocr"
              element={<OCRResults />}
            />

            {/* Verification */}

            <Route
              path="/screening/:id/verification"
              element={<VerificationResult />}
            />

            {/* Risk Dashboard */}

            <Route
              path="/risk-dashboard"
              element={<RiskDashboard />}
            />

            {/* Audit History */}

            <Route
              path="/audit-history"
              element={<AuditHistory />}
            />

          </Route>

        </Route>


        {/* =================================================
            REGISTERED USER
        ================================================== */}

        <Route
          element={
            <ProtectedRoute
              allowedRoles={[
                "user",
              ]}
            />
          }
        >

          <Route
            path="/user-dashboard"
            element={<UserDashboard />}
          />

          <Route
            path="/identity-check"
            element={<IdentityCheck />}
          />

        </Route>


        {/* =================================================
            DEFAULT ROUTE
        ================================================== */}

        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

        {/* =================================================
            UNKNOWN ROUTES
        ================================================== */}

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
  );
}