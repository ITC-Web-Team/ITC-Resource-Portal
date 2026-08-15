import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Search } from "lucide-react";
import { fetchRequests, approveRequest, rejectRequest } from "../js/Adminapi";

const TABS = [
  { label: "Pending requests", status: "pending" },
  { label: "Approved", status: "approved" },
  { label: "All", status: "all" },
];

const MOCK_REQUESTS = [
  { id: 1, user: "XYZ", project: "Project name", status: "Approved", date: "12/06/2025" },
  { id: 2, user: "XYZ", project: "Project name", status: "Not Approved", date: "12/06/2025" },
  { id: 3, user: "XYZ", project: "Project name", status: "Approved", date: "12/06/2025" },
  { id: 4, user: "XYZ", project: "Project name", status: "Not Approved", date: "12/06/2025" },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const [requests, setRequests] = useState(MOCK_REQUESTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRequests({ status: activeTab.status, search });
      setRequests(data);
    } catch (err) {
      setError(err.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  }, [activeTab, search]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const handleInfo = (id) => {
    navigate(`/admin/project/${id}`);
  };

  const handleApprove = async (id) => {
    try {
      await approveRequest(id);
      loadRequests();
    } catch (err) {
      setError(err.message || "Failed to approve request");
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectRequest(id);
      loadRequests();
    } catch (err) {
      setError(err.message || "Failed to reject request");
    }
  };

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0a0a0f] px-6 text-white md:px-16">
      <div className="pointer-events-none fixed -top-40 -left-40 h-96 w-96 rounded-full bg-[#FD6E59]/20 blur-3xl" />

      <svg
        className="pointer-events-none fixed bottom-0 right-0 h-64 w-64 text-[#FD6E59]/30"
        viewBox="0 0 200 200"
        fill="none"
      >
        <path d="M0 150 Q 60 100 100 150 T 200 130" stroke="currentColor" strokeWidth="1.5" />
      </svg>

      <div className="relative flex min-h-screen flex-col">
  
        <header className="flex items-center justify-between py-6">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-extrabold tracking-tight">itc</span>
            <span className="text-lg font-extrabold text-[#FD6E59]">Resources portal</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-500 text-xs font-bold text-white">
              M
            </span>
            <span className="text-xs font-semibold tracking-wide text-gray-300">NAME</span>
          </div>
        </header>

    
        <h1 className="mt-4 text-3xl font-extrabold text-[#FD6E59] sm:text-4xl">
          Admin Dashboard
        </h1>

    
        <div className="mt-8 flex max-w-xl gap-3">
          <div className="relative flex-1">
            <Search size={14} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects"
              className="w-full rounded-full border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-gray-500 focus:border-[#FD6E59]/60 focus:outline-none"
            />
          </div>
          <button
            onClick={loadRequests}
            className="rounded-full border-2 border-[#FD6E59] bg-white px-6 text-xs font-extrabold tracking-wide text-black transition-colors hover:bg-gray-100"
          >
            SEARCH
          </button>
        </div>

  
        <div className="mt-8 flex items-center gap-8 border-b border-white/10 text-xs font-semibold tracking-wide">
          {TABS.map((tab) => (
            <button
              key={tab.status}
              onClick={() => setActiveTab(tab)}
              className={`relative pb-3 transition-colors ${
                activeTab.status === tab.status ? "text-[#FD6E59]" : "text-gray-400 hover:text-white"
              }`}
            >
              {tab.label}
              {activeTab.status === tab.status && (
                <span className="absolute -bottom-px left-0 h-[2px] w-full rounded-full bg-[#FD6E59]" />
              )}
            </button>
          ))}
        </div>

        <section className="mt-6 rounded-xl border border-white/10 bg-[#585A72]/20 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">{activeTab.label}</h2>
            <button className="flex items-center gap-1 text-xs font-bold text-[#FD6E59] hover:text-[#fc846f]">
              View all
              <ArrowRight size={12} strokeWidth={3} />
            </button>
          </div>

          {error && (
            <p className="mb-3 rounded-md bg-red-500/10 px-3 py-2 text-xs text-red-400">
              {error}
            </p>
          )}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-left text-xs">
              <thead>
                <tr className="text-gray-500">
                  <th className="pb-3 font-semibold">User</th>
                  <th className="pb-3 font-semibold">Project name</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Requested on</th>
                  <th className="pb-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-gray-500">
                      Loading…
                    </td>
                  </tr>
                ) : requests.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-gray-500">
                      No requests found
                    </td>
                  </tr>
                ) : (
                  requests.map((r) => (
                    <RowWithDetails
                      key={r.id}
                      request={r}
                      expanded={expandedId === r.id}
                      onToggle={() => toggleExpand(r.id)}
                      onInfo={() => handleInfo(r.id)}
                      onApprove={() => handleApprove(r.id)}
                      onReject={() => handleReject(r.id)}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <footer className="relative mt-10 border-t border-[#FD6E59]/40 py-5 text-center">
        <p className="text-xs text-gray-500">
          Developed and maintained by{" "}
          <span className="font-semibold text-[#FD6E59]">ITC web team</span> with love
        </p>
      </footer>
    </div>
  );
}

function RowWithDetails({ request, expanded, onToggle, onInfo, onApprove, onReject }) {
  return (
    <>
      <tr className="border-t border-white/5 text-gray-300">
        <td className="py-3">{request.user}</td>
        <td className="py-3">{request.project}</td>
        <td className="py-3">{request.status}</td>
        <td className="py-3">{request.date}</td>
        <td className="py-3">
          <button
            onClick={onToggle}
            className={`rounded-full px-3 py-1 text-[11px] font-bold tracking-wide transition-colors ${
              expanded
                ? "bg-[#FD6E59] text-white"
                : "bg-[#FD6E59]/15 text-[#FD6E59] hover:bg-[#FD6E59]/25"
            }`}
          >
            View details
          </button>
        </td>
      </tr>

      {expanded && (
        <tr>
          <td colSpan={5} className="pb-3 pt-1">
            <div className="flex gap-2">
              <button
                onClick={onInfo}
                className="flex-1 rounded-md bg-gradient-to-r from-[#FC9D44] to-[#FD6E59] py-3 text-xs font-bold tracking-wide text-white transition-transform hover:scale-[1.01]"
              >
                INFO
              </button>
              <button
                onClick={onApprove}
                className="rounded-md border border-green-500/50 px-4 text-xs font-bold text-green-400 transition-colors hover:bg-green-500/10"
              >
                Approve
              </button>
              <button
                onClick={onReject}
                className="rounded-md border border-red-500/50 px-4 text-xs font-bold text-red-400 transition-colors hover:bg-red-500/10"
              >
                Reject
              </button>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}