import { Link,useNavigate } from "react-router-dom";
import { ArrowRight, Plus, Lightbulb } from "lucide-react";
import { FIND_YOUR_TEAM_URL } from "../js/findYourTeamLink";

const steps = [
  {
    n: "01",
    title: "Sign In",
    desc: "Log in securely with your ITC SSO. Your institute details are added automatically.",
  },
  {
    n: "02",
    title: "Pitch Your Idea",
    desc: "Share your project vision, timeline, requirements and estimated budget.",
  },
  {
    n: "03",
    title: "Review & Approval",
    desc: "The admin evaluates your proposal and confirms the funding and deadlines.",
  },
  {
    n: "04",
    title: "Build & Showcase",
    desc: "Form your team, build your project and present the final outcome.",
  },
];

const navLinks = [
  { label: "Home", id: "home" },
  { label: "How it works", id: "how-it-works" },
  { label: "Find Team", id: "find-team", href: FIND_YOUR_TEAM_URL },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const handleCreateProject = async () => {
  try {
    const response = await fetch(
      "http://127.0.0.1:8000/api/profile/me/",
      {
        credentials: "include",
      }
    );

    if (response.ok) {
      navigate("/create-project");
    } else {
      navigate("/login");
    }
  } catch (error) {
    navigate("/login");
  }
};
  return (
    <div className="min-h-screen w-full bg-[#0a0a0f] text-white flex flex-col relative overflow-hidden">
      <div className="pointer-events-none fixed -top-40 -left-40 h-96 w-96 rounded-full bg-[#FD6E59]/20 blur-3xl" />

      <div className="relative mx-auto flex w-full max-w-[1440px] flex-1 flex-col">
        <header className="grid grid-cols-[auto_1fr_auto] items-center gap-6 px-6 py-6 md:px-16">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-6 w-6 text-[#FD6E59]" strokeWidth={2} />
            <span className="text-xl font-extrabold tracking-tight">itc</span>
            <span className="ml-1 text-lg font-extrabold text-[#FD6E59] sm:text-xl">
              Resources portal
            </span>
          </div>

          <nav className="hidden items-center justify-center gap-14 text-sm font-medium text-gray-300 md:flex">
            {navLinks.map((link) => (
              link.href ? (
                <a
                  key={link.id}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              ) : (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className="transition-colors hover:text-white"
                >
                  {link.label}
                </button>
              )
            ))}
          </nav>

                   <button
  onClick={async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/profile/me/",
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        navigate("/profile");
      } else {
        navigate("/login");
      }
    } catch (error) {
      navigate("/login");
    }
  }}
  className="justify-self-end rounded-md border border-[#FD6E59] px-5 py-2.5 text-xs font-extrabold tracking-wide text-white transition-colors hover:bg-[#FD6E59] hover:text-black"
>
  MY PROFILE
</button>
        </header>

        <section id="home" className="scroll-mt-24 px-6 pb-16 pt-16 md:px-16 md:pt-20">
          <div className="mx-auto max-w-5xl">
            <h1 className="text-5xl font-extrabold leading-[1.1] tracking-tight sm:text-7xl">
              AN IDEA <span className="text-[#FD6E59]">WORTH</span> BUILDING?
            </h1>
            <h1 className="mt-2 text-5xl font-extrabold leading-[1.1] tracking-tight text-[#FD6E59] sm:text-7xl">
              START HERE.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-gray-400">
              A year-round platform to pitch projects, request resources, and turn
              ideas into working builds.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/create-project"
                className="flex items-center gap-2 rounded-lg border-2 border-[#FD6E59] bg-white px-6 py-3.5 text-xs font-extrabold tracking-wide text-black transition-transform hover:scale-[1.02]"
              >
                <Plus size={14} strokeWidth={3} />
                CREATE PROJECT
              </Link>
              <Link
                to="/explore"
                className="flex items-center gap-2 rounded-lg border-2 border-[#FD6E59] bg-white px-6 py-3.5 text-xs font-extrabold tracking-wide text-black transition-transform hover:scale-[1.02]"
              >
                EXPLORE PROJECTS
                <ArrowRight size={14} strokeWidth={3} />
              </Link>
            </div>
          </div>
        </section>

        <div className="mx-6 border-t border-[#FD6E59]/40 md:mx-16" />

        <section id="how-it-works" className="scroll-mt-24 px-6 py-20 md:px-16">
          <h2 className="text-center text-3xl font-extrabold tracking-wide sm:text-5xl">
            HOW IT <span className="text-[#FD6E59]">WORKS</span>?
          </h2>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div
                key={step.n}
                className="rounded-xl bg-[#585A72]/50 p-6 transition-colors hover:bg-[#585A72]/70"
              >
                <h3 className="text-lg font-extrabold leading-snug text-white">
                  {step.n} {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-300">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id="find-team" className="scroll-mt-24 px-6 pb-24 pt-6 md:px-16">
          <h3 className="mb-10 text-center text-2xl font-extrabold tracking-wide sm:text-4xl">
            <span className="text-white">BUILD </span>
            <span className="text-white">ideas. </span>
            <span className="text-[#FD6E59]">FIND </span>
            <span className="text-gray-400">teams. </span>
            <span className="text-white">GET </span>
            <span className="text-gray-400">funded.</span>
          </h3>

          <div className="relative mx-auto flex w-full max-w-[1167px] flex-col items-start justify-between gap-8 rounded-[25px] bg-gradient-to-r from-[#FC9D44] to-[#FD6E59] px-8 py-10 sm:flex-row sm:items-center sm:px-16">
            <p className="max-w-md text-2xl font-semibold leading-snug text-black sm:text-[32px]">
              Great projects start with the right team.
            </p>
            <a
              href={FIND_YOUR_TEAM_URL}
              target="_blank"
              rel="noreferrer"
              className="flex shrink-0 items-center justify-center gap-2 rounded-lg border-2 border-[#FD6E59] bg-white px-8 py-4 text-base font-extrabold tracking-wide text-black shadow-[inset_0px_2px_15px_rgba(0,0,0,0.05)] transition-transform hover:scale-[1.03]"
            >
              Find Your Team
              <ArrowRight size={18} strokeWidth={3} />
            </a>
          </div>
        </section>
      </div>

      <footer className="relative border-t border-[#FD6E59]/40 px-6 py-5 text-center md:px-16">
        <p className="text-xs text-gray-500">
          Developed and maintained by{" "}
          <span className="font-semibold text-[#FD6E59]">ITC web team</span> with
          love
        </p>
      </footer>
    </div>
  );
}
