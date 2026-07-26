import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0a0a0f] flex items-center justify-center px-6">
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-orange-600/25 blur-3xl" />

      <svg
        className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 text-orange-600/40"
        viewBox="0 0 200 200"
        fill="none"
      >
        <path
          d="M0 150 Q 60 100 100 150 T 200 130"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>

      <div className="relative w-full max-w-sm">
        <div className="rounded-2xl border border-orange-500/70 bg-[#111116]/90 p-8 shadow-[0_0_40px_-10px_rgba(249,115,22,0.35)] backdrop-blur">
          <h1 className="text-center text-xl font-extrabold text-white">
            ITC <span className="text-orange-500">Resources</span> Portal
          </h1>
          <p className="mt-2 text-center text-xs leading-relaxed text-gray-400">
            Sign in to submit projects, request institute resources and track
            your progress.
          </p>

          <button
            onClick={() => navigate("/")}
            className="mt-6 w-full rounded-full bg-orange-500 py-3 text-xs font-bold tracking-wide text-white transition-colors hover:bg-orange-600"
          >
            LOGIN WITH SSO
          </button>

          <div className="my-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-[11px] font-semibold text-gray-500">OR</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <button
            onClick={() => navigate("/not-admin")}
            className="w-full rounded-full bg-white py-3 text-xs font-bold tracking-wide text-orange-600 transition-colors hover:bg-gray-100"
          >
            ADMIN LOGIN
          </button>
        </div>
      </div>
    </div>
  );
}
