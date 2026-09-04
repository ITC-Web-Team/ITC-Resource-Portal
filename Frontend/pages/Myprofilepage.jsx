import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Phone, CheckCircle2 } from "lucide-react";
import {
  fetchProfile,
  fetchMentor,
  fetchMyProjects,
} from "../js/UserApi";
import { FIND_YOUR_TEAM_URL } from "../js/findYourTeamLink";

const navLinks = [
  { label: "Home", id: "home" },
  { label: "How it works", id: "how-it-works" },
  {
    label: "Find Team",
    id: "find-team",
    href: FIND_YOUR_TEAM_URL,
  },
];

const MOCK_USER = {
  name: "Raj Kumar",
  initials: "RK",
  rollNo: "22B1234",
  branch: "B.Tech CSE",
  year: "3rd Year",
  email: "raj@iitb.ac.in",
  phone: "+91 98765 43210",
};

const MOCK_MENTOR = {
  name: "Dr. Anita Sharma",
  initials: "AS",
  role: "Assistant Professor, CSE",
  email: "anita.sharma@iitb.ac.in",
  phone: "+91 91234 56789",
};

const MOCK_PROJECTS = [
  {
    id: 1,
    title: "AI-powered Crop Disease Detector",
    category: "AI / ML",
    deadline: "Oct 15, 2026",
    status: "APPROVED",
    allotted: "₹18,000",
    timeline: "3 months",
    period: "Jul – Oct",
    progress: 40,
  },
];

export default function MyProfilePage() {
  const navigate = useNavigate();

  const [user, setUser] = useState(MOCK_USER);
  const [mentor, setMentor] = useState(MOCK_MENTOR);
  const [projects, setProjects] = useState(MOCK_PROJECTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadAll() {
      setLoading(true);
      setError(null);

      try {
        const [profileData, mentorData, projectsData] =
          await Promise.all([
            fetchProfile(),
            fetchMentor(),
            fetchMyProjects(),
          ]);

        if (!cancelled) {
          setUser(profileData);
          setMentor(mentorData);
          setProjects(projectsData);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Profile loading error:", err);

          // If Django says the user is not authenticated,
          // send them to the login page.
          if (
            err.response?.status === 401 ||
            err.status === 401 ||
            err.message?.includes("401") ||
            err.message?.toLowerCase().includes("unauthorized")
          ) {
            navigate("/login");
            return;
          }

          setError(
            err.message || "Failed to load profile data"
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadAll();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  // ============================
  // LOGOUT
  // ============================
  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      // IMPORTANT:
      // This logs the user out from Django,
      // not just from localStorage.
      await fetch(
        "http://127.0.0.1:8000/accounts/logout/",
        {
          method: "GET",
          credentials: "include",
        }
      );
    } catch (err) {
      console.error("Logout API error:", err);
    } finally {
      // Clear frontend authentication data too
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Go to landing page
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0a0a0f] text-white">

      {/* Background glow */}
      <div className="pointer-events-none fixed -top-40 -left-40 h-96 w-96 rounded-full bg-[#FD6E59]/20 blur-3xl" />

      <div className="relative mx-auto flex w-full max-w-[1440px] flex-col">

        {/* ================= NAVBAR ================= */}
        <header className="grid grid-cols-[auto_1fr_auto] items-center gap-6 px-6 py-6 md:px-16">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-xl font-extrabold tracking-tight">
              itc
            </span>

            <span className="ml-1 text-lg font-extrabold text-[#FD6E59] sm:text-xl">
              Resources portal
            </span>
          </div>

          {/* Navigation */}
          <nav className="hidden items-center justify-center gap-14 text-sm font-medium text-gray-300 md:flex">
            {navLinks.map((link) =>
              link.href ? (
                <a
                  key={link.id}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.id}
                  to="/"
                  className="transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* Buttons */}
          <div className="flex items-center gap-3">

            <Link
              to="/profile"
              className="rounded-md border-2 border-[#FD6E59] px-5 py-2.5 text-xs font-extrabold tracking-wide text-white transition-colors hover:bg-[#FD6E59] hover:text-white"
            >
              MY PROFILE
            </Link>

            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="rounded-md border-2 border-red-500 px-5 py-2.5 text-xs font-extrabold tracking-wide text-red-500 transition-colors hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loggingOut ? "LOGGING OUT..." : "LOGOUT"}
            </button>

          </div>
        </header>

        {/* ================= TITLE ================= */}
        <section className="px-6 pb-10 pt-6 text-center md:px-16">

          <h1 className="text-4xl font-extrabold text-[#FD6E59] sm:text-5xl">
            Welcome back, {user.name.split(" ")[0]}
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-gray-400 sm:text-base">
            Your ideas are taking shape. Track your projects,
            approvals, funding and progress from here.
          </p>

        </section>

        {/* ================= ERROR ================= */}
        {error && (
          <div className="px-6 md:px-16">
            <p className="mb-6 rounded-md bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </p>
          </div>
        )}

        {/* ================= USER INFO ================= */}
        <section className="px-6 pb-10 md:px-16">

          <div className="rounded-2xl border border-white/10 bg-[#111116]/80 p-8">

            {loading ? (
              <p className="text-sm text-gray-500">
                Loading profile…
              </p>
            ) : (
              <div className="flex flex-wrap items-center gap-6">

                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[#FD6E59] text-xl font-extrabold text-white">
                  {user.initials}
                </div>

                <div className="min-w-[200px] flex-1">

                  <h2 className="text-xl font-extrabold text-white">
                    {user.name}
                  </h2>

                  <p className="mt-1 text-sm text-gray-400">
                    {user.rollNo} · {user.branch} · {user.year}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-3">

                    <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-300">
                      <Mail size={12} />
                      {user.email}
                    </span>

                    <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-300">
                      <Phone size={12} />
                      {user.phone}
                    </span>

                    <span className="flex items-center gap-1.5 rounded-full bg-green-500/15 px-3 py-1.5 text-xs font-semibold text-green-400">
                      <CheckCircle2 size={12} />
                      SSO verified
                    </span>

                  </div>
                </div>
              </div>
            )}

          </div>
        </section>

        {/* ================= MENTOR ================= */}
        <section className="px-6 pb-10 md:px-16">

          <div className="rounded-2xl border border-white/10 bg-[#111116]/80 p-8">

            <h3 className="mb-6 text-lg font-extrabold tracking-wide text-white">
              MENTOR AND THEIR INFO
            </h3>

            {loading ? (
              <p className="text-sm text-gray-500">
                Loading mentor info…
              </p>
            ) : (
              <div className="flex flex-wrap items-center gap-6">

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/10 text-lg font-extrabold text-white">
                  {mentor.initials}
                </div>

                <div className="min-w-[200px] flex-1">

                  <h4 className="text-base font-bold text-white">
                    {mentor.name}
                  </h4>

                  <p className="mt-1 text-sm text-gray-400">
                    {mentor.role}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-3">

                    <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-300">
                      <Mail size={12} />
                      {mentor.email}
                    </span>

                    <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-300">
                      <Phone size={12} />
                      {mentor.phone}
                    </span>

                  </div>
                </div>
              </div>
            )}

          </div>
        </section>

        {/* ================= PROJECTS ================= */}
        <section className="px-6 pb-20 md:px-16">

          <h3 className="mb-6 text-2xl font-extrabold tracking-wide text-white">
            YOUR PROJECTS
          </h3>

          {loading ? (
            <p className="text-sm text-gray-500">
              Loading projects…
            </p>
          ) : projects.length === 0 ? (
            <p className="text-sm text-gray-500">
              No projects yet.
            </p>
          ) : (
            <div className="flex flex-col gap-6">

              {projects.map((project) => (
                <div
                  key={project.id}
                  className="rounded-2xl border border-[#FD6E59]/40 bg-[#111116]/80 p-8"
                >

                  <div className="flex flex-wrap items-start justify-between gap-4">

                    <div>
                      <h4 className="text-lg font-bold text-white">
                        {project.title}
                      </h4>

                      <p className="mt-1 text-sm text-gray-400">
                        {project.category} · Deadline{" "}
                        {project.deadline}
                      </p>
                    </div>

                    <span className="flex items-center gap-1.5 rounded-full bg-green-500/15 px-3 py-1.5 text-xs font-bold tracking-wide text-green-400">
                      <CheckCircle2 size={12} />
                      {project.status}
                    </span>

                  </div>

                  <div className="mt-6 flex flex-wrap gap-10">

                    <div>
                      <p className="text-lg font-extrabold text-white">
                        {project.allotted}
                      </p>

                      <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                        Allotted
                      </p>
                    </div>

                    <div>
                      <p className="text-lg font-extrabold text-white">
                        {project.timeline}
                      </p>

                      <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                        Timeline
                      </p>
                    </div>

                    <div>
                      <p className="text-lg font-extrabold text-white">
                        {project.period}
                      </p>

                      <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                        Period
                      </p>
                    </div>

                  </div>

                  <div className="mt-6">

                    <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>

                    <div className="mt-2 h-2 w-full rounded-full bg-white/10">

                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-[#FC9D44] to-[#FD6E59]"
                        style={{
                          width: `${project.progress}%`,
                        }}
                      />

                    </div>

                  </div>

                </div>
              ))}

            </div>
          )}

        </section>
      </div>

      {/* ================= FOOTER ================= */}
      <footer className="relative border-t border-[#FD6E59]/40 px-6 py-5 text-center md:px-16">

        <p className="text-xs text-gray-500">
          Developed and maintained by{" "}
          <span className="font-semibold text-[#FD6E59]">
            ITC web team
          </span>{" "}
          with love
        </p>

      </footer>

    </div>
  );
}