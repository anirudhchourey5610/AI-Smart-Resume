import React, { Suspense, lazy, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AiOptimizer = lazy(() => import("./pages/AiOptimizer"));
const ResumeVault = lazy(() => import("./pages/ResumeVault"));

function App() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <div className="app-shell">
      <Router>
        <AuthProvider>
          <Suspense fallback={<div className="app-loading">Loading...</div>}>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/ai-optimizer"
                element={
                  <ProtectedRoute>
                    <AiOptimizer />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/resumes"
                element={
                  <ProtectedRoute>
                    <ResumeVault />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Suspense>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
