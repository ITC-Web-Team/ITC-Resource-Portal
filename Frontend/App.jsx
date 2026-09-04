import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import AdminDashboard from "./pages/AdminDashboard";
import MyProfilePage from "./pages/MyProfilePage";
import ExploreProjectsPage from "./pages/Exploreprojectspage";
import CreateProjectPage from "./pages/CreateProjectPage";
import ProjectDetailsPage from "./pages/ProjectDetailsPage";
import AdminRoute from "./pages/adminroute";
import AdminProjectDetailsPage from "./pages/AdminProjectDetailsPage";


/* =========================
   PROTECTED USER ROUTE
   ========================= */

function UserRoute({ children }) {
  const [checking, setChecking] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/profile/me/",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (response.ok) {
          setLoggedIn(true);
        } else {
          setLoggedIn(false);
        }
      } catch (error) {
        console.error("Login check failed:", error);
        setLoggedIn(false);
      } finally {
        setChecking(false);
      }
    };

    checkLogin();
  }, []);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f] text-white">
        <p className="text-sm text-gray-400">Checking login...</p>
      </div>
    );
  }

  if (!loggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}


/* =========================
   APP
   ========================= */

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Landing */}
        <Route path="/" element={<LandingPage />} />

        {/* Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Admin */}
        <Route path="/not-admin" element={<AdminPage />} />

        <Route
          path="/admin-dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/project/:id"
          element={
            <AdminRoute>
              <AdminProjectDetailsPage />
            </AdminRoute>
          }
        />

        {/* =========================
            USER PROFILE - PROTECTED
           ========================= */}
        <Route
          path="/profile"
          element={
            <UserRoute>
              <MyProfilePage />
            </UserRoute>
          }
        />

        {/* Other pages */}
        <Route
          path="/explore"
          element={<ExploreProjectsPage />}
        />

        <Route
          path="/project/:projectId"
          element={<ProjectDetailsPage />}
        />

        <Route
          path="/create-project"
          element={<CreateProjectPage />}
        />

      </Routes>
    </BrowserRouter>
  );
}