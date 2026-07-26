import { useNavigate } from "react-router-dom";

export default function AdminPage() {
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

      <div className="relative text-center">
        <h1 className="text-3xl font-extrabold text-orange-500 sm:text-4xl">
          You Are Not an Admin
        </h1>
        <p className="mt-3 text-sm text-gray-400">
          Sorry, you don&apos;t have permission to access this page.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="mt-6 rounded-full bg-orange-500 px-6 py-2 text-xs font-bold tracking-wide text-white transition-colors hover:bg-orange-600"
        >
          Back
        </button>
      </div>
    </div>
  );
}
