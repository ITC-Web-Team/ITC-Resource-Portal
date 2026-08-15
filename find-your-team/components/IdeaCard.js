import Link from "next/link";
export default function IdeaCard({ idea }) {
  const ideaId = idea?.id ? String(idea.id) : "";

  if (!ideaId) {
    return null;
  }

  return (
    <Link href={`/ideas/${encodeURIComponent(ideaId)}`}>
      <div className="group relative bg-white rounded-2xl p-[1px] hover:scale-[1.02] transition-all duration-300">
      
      {/* gradient border */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-400/60 to-purple-300/60 opacity-0 group-hover:opacity-100 blur-sm transition"></div>

      <div className="relative bg-white p-5 rounded-2xl border-2 border-purple-200 shadow-md group-hover:shadow-xl transition overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle,#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="relative z-10">
        <div className="flex justify-between items-start mb-3">
          <span className="text-xs px-3 py-1 rounded-full bg-purple-100 text-purple-700 border border-purple-300 font-medium">
            {idea.flair}
          </span>

          <span className="text-xs text-gray-600">
            {idea.userLdap}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition break-words">
          {idea.title}
        </h2>

        {/* Description */}
        <p className="text-gray-600 mt-2 text-sm leading-relaxed line-clamp-3 overflow-hidden">
          {idea.text}
        </p>

        {/* Footer */}
        <div className="mt-4 flex justify-between items-center text-xs text-gray-500">
          <span>Contact: {idea.contact}</span>
          <span>{idea.isPrivate ? "Private 🔒" : "Public 🌍"}</span>
        </div>
        </div>
      </div>
    </div>
    </Link>
  );
}