"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  return (
    <nav className="w-full sm:flex sm:items-center sm:justify-between bg-white text-gray-900 px-4 sm:px-6 py-4 shadow-lg border-b-2 border-purple-400">

      <div className="flex items-center justify-between gap-4">
        {/* Title */}
        <h1 className="text-2xl sm:text-4xl font-semibold tracking-wide poppins-black bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
          ITSP Team Making
        </h1>

        {/* Mobile Toggle */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="sm:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-900 hover:bg-purple-100"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
        >
          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {menuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden sm:flex gap-6 text-xl items-center">

        <Link href="/" className="hover:text-purple-400 transition">
          Home
        </Link>

        <Link href="/profile" className="hover:text-purple-400 transition">
          Profile
        </Link>

        {/* Add Idea */}
        <Link href={user ? "/add" : "/login"}>
          <div className="bg-purple-600 flex items-center py-2 px-4 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg cursor-pointer border border-transparent hover:border-white">
            Add Your Own Idea
          </div>
        </Link>

        {/* Login / Logout */}
        {!user ? (
          <Link href="/login">
            <button className="bg-white px-4 py-2 rounded-xl hover:bg-blue-700 transition">
              Login
            </button>
          </Link>
        ) : (
          <button
            onClick={() => {
              localStorage.removeItem("user");
              window.location.reload();
            }}
            className="bg-purple-600 px-4 py-2 rounded-xl hover:bg-purple-700 transition"
          >
            Logout
          </button>
        )}

      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div
          id="mobile-nav"
          className="sm:hidden mt-4 flex flex-col gap-4 text-base rounded-xl bg-white/5 p-4"
        >
          <Link
            href="/"
            className="hover:text-blue-400 transition"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>

          <Link
            href="/profile"
            className="hover:text-blue-400 transition"
            onClick={() => setMenuOpen(false)}
          >
            Profile
          </Link>

          <Link
            href={user ? "/add" : "/login"}
            onClick={() => setMenuOpen(false)}
          >
            <div className="bg-purple-600 flex items-center py-2 px-4 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg cursor-pointer border border-transparent hover:border-white">
              Add Your Own Idea
            </div>
          </Link>

          {!user ? (
            <Link href="/login" onClick={() => setMenuOpen(false)}>
              <button className="w-full bg-white px-4 py-2 rounded-xl hover:bg-blue-700 transition">
                Login
              </button>
            </Link>
          ) : (
            <button
              onClick={() => {
                localStorage.removeItem("user");
                window.location.reload();
              }}
              className="bg-purple-600 px-4 py-2 rounded-xl hover:bg-purple-700 transition"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}