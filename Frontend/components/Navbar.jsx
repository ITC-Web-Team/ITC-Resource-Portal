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
        <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0a0a0f]/80 shadow-lg shadow-black/20 backdrop-blur-md">
            <div className="mx-auto grid max-w-6xl grid-cols-[auto_1fr_auto] items-center gap-6 px-6 py-4 md:px-12">

                <Link to="/" className="transition-opacity hover:opacity-80">
                    <BrandLockup />
                </Link>

                <nav className="hidden items-center justify-center gap-10 text-sm font-medium text-gray-300 md:flex">
                    {navLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            target={link.external ? "_blank" : undefined}
                            rel={link.external ? "noreferrer" : undefined}
                            className="relative py-1 transition-colors hover:text-white after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-[#FD6E59] after:transition-all after:duration-200 hover:after:w-full"
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>

                <div className="flex items-center justify-end gap-3">

                    <Link
                        to="/profile"
                        className="rounded-md border-2 border-[#FD6E59] px-4 py-2 text-xs font-bold tracking-wide text-white transition-colors hover:bg-[#FD6E59]"
                    >
                        MY PROFILE
                    </Link>

                    {showLogout && (
                        <button
                            onClick={handleLogout}
                            className="rounded-md border-2 border-red-500 px-4 py-2 text-xs font-bold tracking-wide text-red-500 transition-colors hover:bg-red-500 hover:text-white"
                        >
                            LOGOUT
                        </button>
                    )}

                </div>
            </div>
        </header>
    );
}
