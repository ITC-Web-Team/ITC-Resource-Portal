"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import IdeaCard from "@/components/IdeaCard";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [ideas, setIdeas] = useState([]);
  const [status, setStatus] = useState("loading");
  const [updatingId, setUpdatingId] = useState(null);

  const userLabel = useMemo(() => {
    if (!user) return "";
    return user.name || user.roll || "User";
  }, [user]);

  useEffect(() => {
    const stored = localStorage.getItem("user");

    if (!stored) {
      router.replace("/login");
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      setUser(parsed);
    } catch (error) {
      localStorage.removeItem("user");
      router.replace("/login");
    }
  }, [router]);

  useEffect(() => {
    if (!user?.roll) return;

    let active = true;

    async function loadIdeas() {
      setStatus("loading");
      try {
        const res = await fetch(
          `/api/ideas?user=${encodeURIComponent(user.roll)}`
        );
        const data = await res.json();

        if (!active) return;

        if (!res.ok) {
          setStatus("error");
          return;
        }

        setIdeas(Array.isArray(data) ? data : []);
        setStatus("ready");
      } catch (error) {
        if (!active) return;
        setStatus("error");
      }
    }

    loadIdeas();

    return () => {
      active = false;
    };
  }, [user]);

  async function handleTogglePrivacy(ideaId, nextPrivate) {
    if (!user?.roll) return;

    setUpdatingId(ideaId);

    try {
      const res = await fetch("/api/ideas", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: ideaId,
          isPrivate: nextPrivate,
          user,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        return;
      }

      setIdeas((prev) =>
        prev.map((idea) =>
          idea.id === data.id ? { ...idea, isPrivate: data.isPrivate } : idea
        )
      );
    } catch (error) {
      setStatus("error");
    } finally {
      setUpdatingId(null);
    }
  }

  if (!user) {
    return (
      <div className="text-gray-900 p-6">Loading...</div>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-white via-purple-50 to-purple-100 text-gray-900 px-6 py-10 space-y-8">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl border-2 border-purple-200 shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900">{userLabel}</h1>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
            <div>
              <span className="text-gray-500 text-sm">Roll</span>
              <div className="text-gray-900 font-medium">
                {user.roll || "-"}
              </div>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Department</span>
              <div className="text-gray-900 font-medium">
                {user.department || "-"}
              </div>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Degree</span>
              <div className="text-gray-900 font-medium">
                {user.degree || "-"}
              </div>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Passing Year</span>
              <div className="text-gray-900 font-medium">
                {user.passing_year || "-"}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Your Ideas</h2>

          {status === "loading" && (
            <div className="text-gray-600">Loading your ideas...</div>
          )}

          {status === "error" && (
            <div className="text-red-600">Could not load ideas.</div>
          )}

          {status === "ready" && ideas.length === 0 && (
            <div className="text-gray-600">No ideas yet.</div>
          )}

          {status === "ready" && ideas.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ideas.map((idea) => (
                <div key={idea.id} className="space-y-3">
                  <IdeaCard idea={idea} />
                  <button
                    type="button"
                    onClick={() =>
                      handleTogglePrivacy(idea.id, !idea.isPrivate)
                    }
                    disabled={updatingId === idea.id}
                    className="w-full rounded-xl border-2 border-purple-400 my-4 text-sm py-2 text-purple-600 font-medium hover:bg-purple-50 disabled:opacity-50 transition"
                  >
                    {idea.isPrivate ? "Make Public" : "Make Private"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
