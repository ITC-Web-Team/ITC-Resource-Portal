import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  fetchRequestDetails,
  approveRequest,
  rejectRequest,
} from "../js/Adminapi";

export default function AdminProjectDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [approvedBudget, setApprovedBudget] = useState("");
  const [approvedTimeline, setApprovedTimeline] = useState("");
  const [liveDeadline, setLiveDeadline] = useState("");

  useEffect(() => {
    async function loadProject() {
      try {
        const data = await fetchRequestDetails(id);
        setProject(data);
        setApprovedBudget(
          data.review?.approved_budget ?? data.budget_needed ?? ""
        );
        setApprovedTimeline(
          data.review?.approved_timeline || data.tentative_timeline || ""
        );
        setLiveDeadline(data.review?.live_deadline || "");
      } catch (err) {
        setError(err.message || "Failed to load project details");
      } finally {
        setLoading(false);
      }
    }

    loadProject();
  }, [id]);

  async function handleApprove() {
    setSubmitting(true);
    setError(null);

    try {
      await approveRequest(id, {
        approved_budget: approvedBudget,
        approved_timeline: approvedTimeline,
        live_deadline: liveDeadline,
      });
      navigate("/admin-dashboard");
    } catch (err) {
      setError(err.message || "Failed to approve request");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleReject() {
    setSubmitting(true);
    setError(null);

    try {
      await rejectRequest(id);
      navigate("/admin-dashboard");
    } catch (err) {
      setError(err.message || "Failed to reject request");
    } finally {
      setSubmitting(false);
    }
  }

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
          <div className="mt-8 rounded-3xl border border-white/10 bg-[#111116] p-8 shadow-xl shadow-black/30 transition-shadow hover:shadow-2xl hover:shadow-black/40">

            <div className="flex flex-wrap items-start justify-between gap-4">
              <h2 className="text-3xl font-bold">
                {project.title}
              </h2>

              <span
                className={`rounded-full px-3 py-1.5 text-xs font-bold tracking-wide ${
                  project.status === "approved"
                    ? "bg-green-500/15 text-green-400"
                    : project.status === "rejected"
                    ? "bg-red-500/15 text-red-400"
                    : "bg-yellow-500/15 text-yellow-400"
                }`}
              >
                {project.status.toUpperCase()}
              </span>
            </div>

            <p className="mt-2 text-sm text-gray-400">
              Submitted by{" "}
              <span className="font-semibold text-gray-300">
                {project.team_lead_name || "Unknown"}
              </span>
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

            {project.review?.admin_name && (
              <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
                <h3 className="text-sm font-bold uppercase tracking-wide text-gray-400">
                  Previously reviewed by
                </h3>
                <p className="mt-2 text-gray-200">
                  {project.review.admin_name}
                  {project.review.admin_roll_no && (
                    <span className="text-gray-500">
                      {" "}
                      · {project.review.admin_roll_no}
                    </span>
                  )}
                </p>
              </div>
            )}

            <div className="mt-8 rounded-2xl border border-[#FD6E59]/30 bg-[#FD6E59]/[0.04] p-6">
              <h3 className="text-lg font-bold text-[#FD6E59]">
                Review &amp; Approve
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                Adjust the approved budget, timeline or deadline before
                approving. Leave a field as-is to keep what was requested.
              </p>

              <div className="mt-5 grid gap-5 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Approved Budget (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={approvedBudget}
                    onChange={(e) => setApprovedBudget(e.target.value)}
                    className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white transition-colors focus:border-[#FD6E59]/60 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Approved Timeline
                  </label>
                  <input
                    type="text"
                    value={approvedTimeline}
                    onChange={(e) => setApprovedTimeline(e.target.value)}
                    placeholder="e.g. 3 months"
                    className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white transition-colors focus:border-[#FD6E59]/60 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Live Deadline
                  </label>
                  <input
                    type="date"
                    value={liveDeadline || ""}
                    onChange={(e) => setLiveDeadline(e.target.value)}
                    className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white transition-colors focus:border-[#FD6E59]/60 focus:outline-none [color-scheme:dark]"
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={handleApprove}
                  disabled={submitting}
                  className="rounded-md bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-2.5 text-xs font-bold tracking-wide text-white transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? "Working..." : "APPROVE"}
                </button>
                <button
                  onClick={handleReject}
                  disabled={submitting}
                  className="rounded-md border-2 border-red-500 px-6 py-2.5 text-xs font-bold tracking-wide text-red-400 transition-colors hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  REJECT
                </button>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
