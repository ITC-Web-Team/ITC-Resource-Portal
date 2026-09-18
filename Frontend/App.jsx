import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

import { BASE_URL } from "./js/apiClient";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import AdminDashboard from "./pages/AdminDashboard";
import MyProfilePage from "./pages/Myprofilepage";
import ExploreProjectsPage from "./pages/Exploreprojectspage";
import CreateProjectPage from "./pages/CreateProjectPage";
import ProjectDetailsPage from "./pages/ProjectDetailsPage";
import AdminRoute from "./pages/AdminRoute";
import AdminProjectDetailsPage from "./pages/AdminProjectDetailsPage";


/* =========================
   REQUIRE LOGIN FOR THE WHOLE APP
   (everything except /login lives under this layout route, so the
   login check runs once per app load rather than once per navigation)
   ========================= */

function RequireAuth() {
  const [checking, setChecking] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const checkLogin = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/profile/me/`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!cancelled) {
          setLoggedIn(response.ok);
        }
      } catch (error) {
        console.error("Login check failed:", error);
        if (!cancelled) {
          setLoggedIn(false);
        }
      } finally {
        if (!cancelled) {
          setChecking(false);
        }
      }
    };

    checkLogin();

    return () => {
      cancelled = true;
    };
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

  return <Outlet />;
}


/* =========================
   APP
   ========================= */

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login - the only route reachable while logged out */}
        <Route path="/login" element={<LoginPage />} />

        <Route element={<RequireAuth />}>

          {/* Landing */}
          <Route path="/" element={<LandingPage />} />

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

          {/* User profile */}
          <Route path="/profile" element={<MyProfilePage />} />

          {/* Other pages */}
          <Route path="/explore" element={<ExploreProjectsPage />} />

          <Route path="/project/:projectId" element={<ProjectDetailsPage />} />

          <Route path="/create-project" element={<CreateProjectPage />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}
