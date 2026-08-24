import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Plus } from "lucide-react";
import { FIND_YOUR_TEAM_URL } from "../js/findYourTeamLink";
import { fetchProjects } from "../js/projectApi";

const navLinks = [
  { label: "Home", id: "home" },
  { label: "How it works", id: "how-it-works" },
  { label: "Find Team", id: "find-team", href: FIND_YOUR_TEAM_URL },
];

function matchesSearch(project, searchTerm) {
  const haystack = [
    project.title,
    project.domain,
    project.problem_statement,
    project.created_by_name,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(searchTerm.toLowerCase());
}

function summarize(text) {
  if (!text) {
    return "No description shared yet.";
  }

  if (text.length <= 140) {
    return text;
  }

  return `${text.slice(0, 137)}...`;
}

export default function ExploreProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadProjects() {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchProjects();

        if (!cancelled) {
          setProjects(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load projects");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProjects();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredProjects = projects.filter((project) =>
    matchesSearch(project, search),
  );

  return (
    <div className="min-h-screen w-full bg-[#0a0a0f] text-white relative overflow-hidden">
      <div className="pointer-events-none fixed -top-40 -left-40 h-96 w-96 rounded-full bg-[#FD6E59]/20 blur-3xl" />

      <div className="relative mx-auto flex w-full max-w-[1440px] flex-col">
        <header className="grid grid-cols-[auto_1fr_auto] items-center gap-6 px-6 py-6 md:px-16">
          <div className="flex items-center gap-2">
            <span className="text-xl font-extrabold tracking-tight">itc</span>
            <span className="ml-1 text-lg font-extrabold text-[#FD6E59] sm:text-xl">
              Resources portal
            </span>
          </div>

          <nav className="hidden items-center justify-center gap-14 text-sm font-medium text-gray-300 md:flex">
            {navLinks.map((link) => (
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
                <Link key={link.id} to="/" className="transition-colors hover:text-white">
                  {link.label}
                </Link>
              )
            ))}
          </nav>

          <Link
            to="/profile"
            className="justify-self-end rounded-md border border-[#FD6E59] px-5 py-2.5 text-xs font-extrabold tracking-wide text-white transition-colors hover:bg-[#FD6E59] hover:text-black"
          >
            MY PROFILE
          </Link>
        </header>

        <section className="px-6 pt-10 md:px-16">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search
                size={16}
                className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="search projects, fields, skills..."
                className="w-full rounded-lg bg-[#585A72]/50 py-4 pl-12 pr-4 text-sm text-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FD6E59]/60"
              />
            </div>
            <Link
              to="/create-project"
              className="flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#FD6E59] px-8 py-4 text-sm font-extrabold tracking-wide text-white transition-transform hover:scale-[1.02]"
            >
              <Plus size={16} strokeWidth={3} />
              CREATE PROJECT
            </Link>
          </div>
        </section>

        <section className="px-6 pb-28 pt-14 md:px-16">
          <h1 className="text-4xl font-extrabold text-[#FD6E59] sm:text-5xl">
            Explore Projects
          </h1>
          <p className="mt-3 text-sm text-gray-400 sm:text-base">
            Find a project that matches your skills and interest
          </p>

          {error && (
            <p className="mt-8 rounded-lg border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </p>
          )}

          <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <p className="text-sm text-gray-400">Loading approved projects...</p>
            ) : filteredProjects.length === 0 ? (
              <p className="text-sm text-gray-400">
                No projects matched your search yet.
              </p>
            ) : (
              filteredProjects.map((project) => (
                <div key={project.id} className="relative">
                  <div className="flex h-64 flex-col justify-between rounded-xl border border-white/20 p-6">
                    <div>
                      <span className="inline-block rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-gray-300">
                        {project.domain || "General"}
                      </span>
                      <h3 className="mt-4 text-lg font-bold text-white">{project.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-gray-400">
                        {summarize(project.problem_statement)}
                      </p>
                    </div>

                    <div className="pt-4 text-xs font-medium uppercase tracking-wide text-gray-500">
                      By {project.created_by_name || "ITC student"}
                    </div>
                  </div>
                  <Link
                    to={`/project/${project.id}`}
                    className="absolute -bottom-5 left-6 rounded-lg bg-[#FD6E59] px-5 py-2.5 text-xs font-extrabold tracking-wide text-white shadow-lg transition-transform hover:scale-[1.03]"
                  >
                    View details
                  </Link>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <footer className="relative border-t border-[#FD6E59]/40 px-6 py-5 text-center md:px-16">
        <p className="text-xs text-gray-500">
          Developed and maintained by{" "}
          <span className="font-semibold text-[#FD6E59]">ITC web team</span> with love
        </p>
      </footer>
    </div>
  );
}
