import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, IndianRupee, Layers3 } from "lucide-react";
import { fetchProjectDetails } from "../js/projectApi";

function formatBudget(value) {
  const amount = Number(value || 0);
  return `Rs. ${amount.toLocaleString("en-IN")}`;
}

export default function ProjectDetailsPage() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadProject() {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchProjectDetails(projectId);

        if (!cancelled) {
          setProject(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load this project");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProject();

    return () => {
      cancelled = true;
    };
  }, [projectId]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] px-6 py-10 text-white md:px-16">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#FD6E59] transition-colors hover:text-[#FC9D44]"
        >
          <ArrowLeft size={16} />
          Back to explore
        </Link>

        {loading ? (
          <p className="mt-12 text-sm text-gray-400">Loading project details...</p>
        ) : error ? (
          <p className="mt-12 rounded-lg border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        ) : !project ? (
          <p className="mt-12 text-sm text-gray-400">Project not found.</p>
        ) : (
          <div className="mt-10 rounded-3xl border border-white/10 bg-[#111116]/90 p-8 shadow-[0_0_40px_-10px_rgba(253,110,89,0.20)]">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="inline-block rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-gray-300">
                  {project.domain || "General"}
                </span>
                <h1 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl">
                  {project.title}
                </h1>
                <p className="mt-3 text-sm text-gray-400">
                  Shared by {project.created_by_name || "ITC student"}
                </p>
              </div>

              <span className="rounded-full bg-[#FD6E59]/15 px-4 py-2 text-xs font-bold uppercase tracking-wide text-[#FD6E59]">
                {project.status}
              </span>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                  <CalendarDays size={16} />
                  Timeline
                </div>
                <p className="mt-3 text-lg font-bold text-white">
                  {project.tentative_timeline || "Not shared"}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                  <Layers3 size={16} />
                  Team size
                </div>
                <p className="mt-3 text-lg font-bold text-white">
                  {project.team_size || "Flexible"}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                  <IndianRupee size={16} />
                  Budget
                </div>
                <p className="mt-3 text-lg font-bold text-white">
                  {formatBudget(project.budget_needed)}
                </p>
              </div>
            </div>

            <section className="mt-8">
              <h2 className="text-lg font-bold text-[#FD6E59]">Problem statement</h2>
              <p className="mt-3 text-sm leading-7 text-gray-300">
                {project.problem_statement}
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-lg font-bold text-[#FD6E59]">Budget breakdown</h2>
              <p className="mt-3 text-sm leading-7 text-gray-300">
                {project.budget_breakdown || "No detailed budget breakdown has been shared yet."}
              </p>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
