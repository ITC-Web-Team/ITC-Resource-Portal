import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import CreateProjectPage from "./pages/CreateProjectPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/not-admin" element={<AdminPage />} />
        <Route path="/create-project" element={<CreateProjectPage />} />
      </Routes>
    </BrowserRouter>
  );
}
