import { Link } from "react-router-dom";
import { ArrowRight, Plus } from "lucide-react";
import Navbar from "../components/Navbar.jsx";

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

// const navLinks = ["Home", "How it works", "Find Team"];

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-[#0a0a0f] text-white flex flex-col relative overflow-hidden">
      <div className="pointer-events-none fixed -top-40 -left-40 h-96 w-96 rounded-full bg-orange-600/20 blur-3xl" />

     
      <div className="relative flex-1 flex flex-col ">
                <Navbar />
        {/* <header className="flex items-center justify-between px-6 py-5 md:px-12">
          <div className="flex items-baseline gap-2 pl-10 ">
            <span className="text-lg font-extrabold tracking-tight">itc</span>
            <span className="hidden text-[10px] uppercase tracking-widest text-gray-500 sm:inline">
              Resources
            </span>
            <span className="ml-2 text-sm font-bold text-orange-500">
              Resources portal
            </span>
          </div>
          
          

          <nav className="hidden items-center gap-12 text-sm text-gray-300 md:flex pl-150 mr-12 ">
            {navLinks.map((link) => (
              <a key={link} href="#" className="transition-colors hover:text-white">
                {link}
              </a>
            ))}
          </nav>

          <Link
            to="/login"
            className="rounded-md border border-white/70 px-4 py-2 text-xs font-semibold tracking-wide text-white transition-colors hover:bg-white hover:text-black"
          >
            MY PROFILE
          </Link>
        </header> */}

            <div className="pl-10">
        <section className="px-6 pb-16 pt-10 md:px-12 md:pt-16">
          <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            AN IDEA <span className="text-orange-500">WORTH</span> BUILDING?
            <br />
            <span className="text-orange-500">START HERE.</span>
          </h1>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-gray-400">
            A year-round platform to pitch projects, request resources, and turn
            ideas into working builds.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/create-project"
              className="flex items-center gap-2 rounded-md bg-white/10 px-5 py-3 text-xs font-semibold tracking-wide text-white transition-colors hover:bg-white/20"
            >
              <Plus size={14} strokeWidth={3} />
              CREATE PROJECT
            </Link>
            <button className="flex items-center gap-2 rounded-md border border-white/30 px-5 py-3 text-xs font-semibold tracking-wide text-white transition-colors hover:border-white hover:bg-white/5">
              EXPLORE PROJECTS
              <ArrowRight size={14} strokeWidth={3} />
            </button>
          </div>
        </section>
        </div>

        <div className="mx-6 border-t border-white/10 md:mx-12" />

        <section className="px-6 py-16 md:px-12">
          <h2 className="text-center text-xl font-extrabold tracking-wide sm:text-2xl">
            HOW IT <span className="text-orange-500">WORKS</span> ?
          </h2>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div
                key={step.n}
                className="rounded-lg bg-white/5 p-5 transition-colors hover:bg-white/10"
              >
                <span className="inline-block rounded bg-white/10 px-2 py-1 text-[11px] font-bold tracking-wide text-white">
                  {step.n}
                </span>
                <h3 className="mt-3 text-sm font-bold leading-snug text-white">
                  {step.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-gray-400">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="px-6 pb-16 md:px-12">
          <h3 className="mb-6 text-center text-lg font-extrabold tracking-wide sm:text-xl">
            BUILD <span className="text-orange-500">ideas.</span>{" "}
            <span className="text-orange-500">FIND</span>{" "}
            <span className="text-gray-400">teams.</span>{" "}
            <span className="text-gray-400">GET funded.</span>
          </h3>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 px-6 py-8 sm:px-10">
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
              <p className="max-w-sm text-base font-semibold text-white sm:text-lg">
                Great projects start with the right team.
              </p>
              <button className="flex shrink-0 items-center gap-2 rounded-md bg-white px-5 py-3 text-xs font-bold tracking-wide text-black transition-transform hover:scale-[1.03]">
                Find Your Team
                <ArrowRight size={14} strokeWidth={3} />
              </button>
            </div>

            <div className="absolute -bottom-4 -right-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-orange-500 bg-[#0a0a0f] text-sm font-bold text-white shadow-lg">
              N
            </div>
          </div>
        </section>
      </div>

      <footer className="relative border-t border-orange-600/40 px-6 py-5 text-center md:px-12">
        <p className="text-xs text-gray-500">
          Developed and maintained by{" "}
          <span className="font-semibold text-orange-500">ITC web team</span> with
          love
        </p>
      </footer>
    </div>
  );
}
