import { useEffect } from "react";

export default function FindTeamRedirect() {
  useEffect(() => {
    // Replace the URL below with the repo you provided
    const repoUrl = "http://localhost:3000";
    // Use location.replace so browser history doesn't keep the redirect page
    window.location.replace(repoUrl);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] text-white">
      <div className="text-center">
        <h2 className="text-lg font-bold">Redirecting to the project repository…</h2>
        <p className="mt-2 text-sm text-gray-400">If you are not redirected automatically, <a href="http://localhost:3000" className="text-orange-500 underline">click here</a>.</p>
      </div>
    </div>
  );
}
