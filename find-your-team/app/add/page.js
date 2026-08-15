"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AddIdeaPage() {
  const [form, setForm] = useState({
    title: "",
    text: "",
    flair: "",
    contact: "",
    private: false,
  });

  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("user");

    if (!stored) {
      router.replace("/login");
      return;
    }

    const user = JSON.parse(stored);

    // optional prefill
    setForm((prev) => ({
      ...prev,
      contact:"",
    }));

    setLoading(false);
  }, [router]);

  if (loading) {
    return <div className="text-white p-6">Loading...</div>;
  }

 const handleSubmit = async (e) => {
  e.preventDefault();

  const stored = localStorage.getItem("user");

  if (!stored) {
    alert("Not logged in");
    return;
  }

  const user = JSON.parse(stored);

  const payload = {
    ...form,
    user,
  };

  console.log("PAYLOAD:", payload);

  const res = await fetch("/api/ideas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  console.log("RESPONSE:", data);

  if (res.ok) {
    router.replace("/");
  } else {
    alert(data.error);
  }
};

  return (
    <div className="min-h-screen bg-black text-white flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-[#111827] p-6 rounded-2xl w-full max-w-lg space-y-4"
      >
        <h1 className="text-2xl font-bold">Add Idea</h1>

        <input
          placeholder="Title"
          value={form.title}
          className="w-full p-2 rounded bg-black border border-gray-700"
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        <textarea
          placeholder="Description"
          value={form.text}
          className="w-full p-2 rounded bg-black border border-gray-700"
          onChange={(e) =>
            setForm({ ...form, text: e.target.value })
          }
        />

        <select
          value={form.flair}
          className="w-full p-2 rounded bg-black border border-gray-700 text-white"
          onChange={(e) =>
            setForm({ ...form, flair: e.target.value })
          }
        >
          <option value="" disabled>
            Select flair
          </option>
          <option value="AI/ML">AI/ML</option>
          <option value="Robotics">Robotics</option>
          <option value="Aviation">Aviation</option>
          <option value="Transport">Transport</option>
          <option value="Miscellaneous">Miscellaneous</option>
        </select>

        <input
          placeholder="Contact"
          value={form.contact}
          className="w-full p-2 rounded bg-black border border-gray-700"
          onChange={(e) =>
            setForm({ ...form, contact: e.target.value })
          }
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.private}
            onChange={(e) =>
              setForm({ ...form, private: e.target.checked })
            }
          />
          Private Idea
        </label>

        <button
          type="submit"
          className="w-full bg-blue-600 py-2 rounded-xl hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
}