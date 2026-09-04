import { Link, useLocation, useNavigate } from "react-router-dom";
import { FIND_YOUR_TEAM_URL } from "../js/findYourTeamLink";

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
        <header className="flex items-center justify-between px-6 py-5 md:px-12">

            <div className="flex items-baseline gap-2 pl-10">
                <span className="text-lg font-extrabold tracking-tight">
                    itc
                </span>

                <span className="hidden text-[10px] uppercase tracking-widest text-gray-500 sm:inline">
                    Resources
                </span>

                <span className="ml-2 text-sm font-bold text-orange-500">
                    Resources portal
                </span>
            </div>

            <nav className="hidden items-center gap-12 text-sm text-gray-300 md:flex pl-150 mr-12">
                {navLinks.map((link) => (
                    <a
                        key={link.label}
                        href={link.href}
                        target={link.external ? "_blank" : undefined}
                        rel={link.external ? "noreferrer" : undefined}
                        className="transition-colors hover:text-white"
                    >
                        {link.label}
                    </a>
                ))}
            </nav>

            <div className="flex items-center gap-3">

                <Link
                    to="/profile"
                    className="rounded-md border border-white/70 px-4 py-2 text-xs font-semibold tracking-wide text-white transition-colors hover:bg-white hover:text-black"
                >
                    MY PROFILE
                </Link>

                {showLogout && (
                    <button
                        onClick={handleLogout}
                        className="rounded-md border border-red-500 px-4 py-2 text-xs font-semibold tracking-wide text-red-500 transition-colors hover:bg-red-500 hover:text-white"
                    >
                        LOGOUT
                    </button>
                )}

            </div>
        </header>
    );
}