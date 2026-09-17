import { Link, useLocation, useNavigate } from "react-router-dom";
import { FIND_YOUR_TEAM_URL } from "../js/findYourTeamLink";
import BrandLockup from "./BrandLockup";

const navLinks = [
    { label: "Home", href: "#" },
    { label: "How it Works", href: "#" },
    { label: "Find Team", href: FIND_YOUR_TEAM_URL, external: true },
];

export default function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();

    const showLogout = location.pathname === "/profile";

    const handleLogout = () => {
        // Remove whatever login/auth data you are storing
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");

        // Go back to login page
        navigate("/login");
    };

    return (
        <div className="sticky top-0 z-20 px-4 pt-4">
            <header className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-4 rounded-2xl border border-white/10 bg-[#111116]/90 px-5 py-3 shadow-xl shadow-black/40 backdrop-blur-md">

                <nav className="col-start-1 hidden items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 text-xs font-bold tracking-wide text-gray-300 md:flex">
                    {navLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            target={link.external ? "_blank" : undefined}
                            rel={link.external ? "noreferrer" : undefined}
                            className="rounded-full px-4 py-2 transition-colors hover:bg-white/10 hover:text-white"
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>

                <Link
                    to="/"
                    className="col-start-2 justify-self-center transition-opacity hover:opacity-80"
                >
                    <BrandLockup />
                </Link>

                <div className="col-start-3 flex items-center justify-end gap-2.5">

                    <Link
                        to="/profile"
                        className="rounded-full bg-gradient-to-r from-[#FC9D44] to-[#FD6E59] px-5 py-2.5 text-xs font-extrabold tracking-wide text-white shadow-md shadow-black/20 transition-transform hover:scale-[1.03]"
                    >
                        MY PROFILE
                    </Link>

                    {showLogout && (
                        <button
                            onClick={handleLogout}
                            className="rounded-full border-2 border-red-500 px-5 py-2.5 text-xs font-extrabold tracking-wide text-red-500 transition-colors hover:bg-red-500 hover:text-white"
                        >
                            LOGOUT
                        </button>
                    )}

                </div>
            </header>
        </div>
    );
}
