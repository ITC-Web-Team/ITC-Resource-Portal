import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { fetchRequestDetails } from "../js/Adminapi";

export default function AdminProjectDetailsPage() {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadProject() {
      try {
        const data = await fetchRequestDetails(id);
        setProject(data);
      } catch (err) {
        setError(err.message || "Failed to load project details");
      } finally {
        setLoading(false);
      }
    }

    loadProject();
  }, [id]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] px-6 py-10 text-white md:px-16">
      <div className="mx-auto max-w-4xl">

        <Link
          to="/admin-dashboard"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#FD6E59]"
        >
          <ArrowLeft size={16} />
          Back to dashboard
        </Link>

        <h1 className="mt-8 text-4xl font-extrabold text-[#FD6E59]">
          Project Details
        </h1>

        {loading && (
          <p className="mt-8 text-gray-400">
            Loading project details...
          </p>
        )}

        {error && (
          <p className="mt-8 rounded-lg bg-red-500/10 px-4 py-3 text-red-400">
            {error}
          </p>
        )}

        {project && (
          <div className="mt-8 rounded-3xl border border-white/10 bg-[#111116] p-8">

            <h2 className="text-3xl font-bold">
              {project.title}
            </h2>

            <p className="mt-2 text-gray-400">
              Status: {project.status}
            </p>

            <div className="mt-8">
              <h3 className="text-lg font-bold text-[#FD6E59]">
                Problem Statement
              </h3>

              <p className="mt-3 text-gray-300">
                {project.problem_statement}
              </p>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-bold text-[#FD6E59]">
                Domain
              </h3>

              <p className="mt-3 text-gray-300">
                {project.domain || "Not provided"}
              </p>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-bold text-[#FD6E59]">
                Timeline
              </h3>

              <p className="mt-3 text-gray-300">
                {project.tentative_timeline || "Not provided"}
              </p>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-bold text-[#FD6E59]">
                Team Size
              </h3>

              <p className="mt-3 text-gray-300">
                {project.team_size || "Not provided"}
              </p>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-bold text-[#FD6E59]">
                Budget
              </h3>

              <p className="mt-3 text-gray-300">
                ₹{project.budget_needed}
              </p>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-bold text-[#FD6E59]">
                Budget Breakdown
              </h3>

              <p className="mt-3 text-gray-300">
                {project.budget_breakdown || "Not provided"}
              </p>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
