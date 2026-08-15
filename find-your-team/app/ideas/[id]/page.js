"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";

function renderMessage(title, message) {
	return (
		<div className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-white via-purple-50 to-purple-100 text-gray-900 flex justify-center items-start px-4 py-10">
			<div className="w-full max-w-2xl bg-white border-2 border-purple-200 rounded-2xl shadow-xl p-6 space-y-4 self-start relative overflow-hidden">
				<div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle,rgba(167,139,250,0.35)_1px,transparent_1px)] [background-size:16px_16px]"></div>
					<div className="relative z-10">
					<h1 className="text-2xl font-bold text-gray-900">{title}</h1>
					<p className="text-gray-600">{message}</p>
				</div>
			</div>
		</div>
	);
}

export default function IdeaPage() {
	const params = useParams();
	const rawId = useMemo(() => {
		if (!params?.id) return "";
		if (Array.isArray(params.id)) return params.id[0] || "";
		return String(params.id);
	}, [params]);

	const [idea, setIdea] = useState(null);
	const [status, setStatus] = useState("idle");

	useEffect(() => {
		if (!rawId) return;

		let active = true;

		async function loadIdea() {
			setStatus("loading");
			try {
				const res = await fetch(`/api/ideas?id=${encodeURIComponent(rawId)}`);
				const data = await res.json();

				if (!active) return;

				if (!res.ok) {
					setStatus(res.status === 404 ? "not-found" : "error");
					return;
				}

				setIdea(data);
				setStatus("ready");
			} catch (error) {
				if (!active) return;
				setStatus("error");
			}
		}

		loadIdea();

		return () => {
			active = false;
		};
	}, [rawId]);

	if (!rawId) {
		return (
			<>
				<Navbar />
				{renderMessage("Invalid idea", "This idea link is not valid.")}
			</>
		);
	}

	if (status === "loading" || status === "idle") {
		return (
			<>
				<Navbar />
				{renderMessage("Loading", "Fetching idea details...")}
			</>
		);
	}

	if (status === "not-found") {
		return (
			<>
				<Navbar />
				{renderMessage("Idea not found", "This idea does not exist.")}
			</>
		);
	}

	if (status === "error") {
		return (
			<>
				<Navbar />
				{renderMessage(
					"Something went wrong",
					"We could not load this idea right now. Please try again later."
				)}
			</>
		);
	}

	if (!idea) {
		return (
			<>
				<Navbar />
				{renderMessage(
					"Something went wrong",
					"We could not load this idea right now. Please try again later."
				)}
			</>
		);
	}

	return (
		<>
			<Navbar />

			<div className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-white via-purple-50 to-purple-100 text-gray-900 flex justify-center items-start px-4 py-10">
				<div className="w-full max-w-2xl bg-white border-2 border-purple-200 rounded-2xl shadow-xl p-6 space-y-5 relative overflow-hidden self-start">
					<div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle,#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
					<div className="relative z-10">
						<div className="flex justify-between items-start">
							<span className="px-3 py-1 text-xs rounded-full bg-purple-100 text-purple-700 border border-purple-300 font-medium">
								{idea.flair}
							</span>

							<span className="text-sm text-gray-600 font-medium">
								{idea.isPrivate ? "Private" : "Public"}
							</span>
						</div>

						<h1 className="text-3xl font-bold leading-tight break-words text-gray-900">
							{idea.title}
						</h1>

						<p className="text-gray-700 text-base leading-relaxed break-words whitespace-pre-wrap">
							{idea.text}
						</p>

						<div className="border-t-2 border-purple-200"></div>

						<div className="flex flex-col sm:flex-row sm:justify-between gap-2 text-sm text-gray-600 mt-4">
							<span className="break-words">Posted by: {idea.userLdap}</span>
							<span className="break-words">Contact: {idea.contact}</span>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
