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
        setLiveDeadline(data.review?.live_deadline || data.end_date || "");
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
                {project.submitted_by_name}
              </span>
              {project.submitted_by_roll_no && (
                <span className="text-gray-500">
                  {" "}· {project.submitted_by_roll_no}
                </span>
              )}
              <span className="text-gray-500"> · {project.created_at}</span>
            </p>

            <ReviewSection
              title="1. Proposal"
              criterion="Clear objective, scope and expected outcome"
            >
              <Field label="Objective" value={project.objective} />
              <Field label="Scope" value={project.scope} />
              <Field label="Expected Outcome" value={project.expected_outcome} />
              <Field label="Domain" value={project.domain} />
            </ReviewSection>

            <ReviewSection
              title="2. Motivation"
              criterion="A clear reason for the project and why it's worth doing"
            >
              <Field label="Problem Statement" value={project.problem_statement} />
              <Field label="Why it's worth doing" value={project.motivation} />
            </ReviewSection>

            <ReviewSection
              title="3. Timeline"
              criterion="End date is broadly feasible for the scope"
            >
              <div className="grid gap-4 sm:grid-cols-3">
                <Field
                  label="End Date"
                  value={formatDate(project.end_date)}
                />
                <Field label="Duration" value={project.tentative_timeline} />
                <Field label="Team Size" value={project.team_size} />
              </div>
              <Field
                label="Room Needed"
                value={project.needs_room ? "Yes" : "No"}
              />
            </ReviewSection>

            <ReviewSection
              title="4. Budget"
              criterion="Reasonable, justified, with major expenses accounted for"
            >
              <Field
                label="Requested"
                value={
                  project.budget_needed &&
                  `₹${Number(project.budget_needed).toLocaleString("en-IN")}`
                }
              />
              <Field label="Breakdown" value={project.budget_breakdown} />
            </ReviewSection>

            <ReviewSection title="Contact">
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Team Lead" value={project.team_lead_name} />
                <Field
                  label="Email"
                  value={
                    project.contact_email && (
                      <a
                        href={`mailto:${project.contact_email}`}
                        className="text-[#FD6E59] hover:underline"
                      >
                        {project.contact_email}
                      </a>
                    )
                  }
                />
                <Field
                  label="Phone"
                  value={
                    project.contact_phone && (
                      <a
                        href={`tel:${project.contact_phone}`}
                        className="text-[#FD6E59] hover:underline"
                      >
                        {project.contact_phone}
                      </a>
                    )
                  }
                />
              </div>
            </ReviewSection>

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
                    max="20000"
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

function ReviewSection({ title, criterion, children }) {
  return (
    <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
      <h3 className="text-lg font-bold text-[#FD6E59]">{title}</h3>
      {criterion && (
        <p className="mt-1 text-xs text-gray-500">Check: {criterion}</p>
      )}
      <div className="mt-5 flex flex-col gap-5">{children}</div>
    </section>
  );
}

function Field({ label, value }) {
  const empty = value === null || value === undefined || value === "";

  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <div className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-gray-200">
        {empty ? (
          <span className="italic text-gray-600">Not provided</span>
        ) : (
          value
        )}
      </div>
    </div>
  );
}

function formatDate(iso) {
  if (!iso) {
    return null;
  }

  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
