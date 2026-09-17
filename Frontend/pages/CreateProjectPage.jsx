import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Slider from "@radix-ui/react-slider";
import Navbar from "../components/Navbar";
import { createProject } from "../js/projectApi";

const initialForm = {
  title: "",
  problem_statement: "",
  domain: "",
  tentative_timeline: "3 months",
  team_size: "3",
  budget_needed: 15000,
  budget_breakdown: "",
  contact_email: "",
  contact_phone: "",
  team_lead_name: "",
};

function normalizeError(message) {
  if (!message) {
    return "Unable to submit your project right now.";
  }

  if (message.toLowerCase().includes("authentication")) {
    return "Project submission is wired up, but it still needs a logged-in session until SSO is finished.";
  }

  return message;
}

const inputClass =
  "w-full rounded-lg border border-white/5 bg-box-light p-3 text-sm text-white1 placeholder:text-white2/40 transition-shadow focus:border-orange/60 focus:outline-none focus:ring-2 focus:ring-orange/40";

const fieldLabelClass = "block text-sm font-bold tracking-wide text-white1";

function SectionDivider() {
  return <div className="h-px w-full bg-white/5" />;
}

export default function CreateProjectPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      await createProject({
        title: form.title.trim(),
        problem_statement: form.problem_statement.trim(),
        domain: form.domain.trim(),
        tentative_timeline: form.tentative_timeline,
        team_size: Number(form.team_size),
        budget_needed: Number(form.budget_needed),
        budget_breakdown: form.budget_breakdown.trim(),
        contact_email: form.contact_email.trim(),
        contact_phone: form.contact_phone.trim(),
        team_lead_name: form.team_lead_name.trim(),
      });

      setSuccess("Project submitted for review.");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      setForm(initialForm);
    } catch (err) {
      setError(normalizeError(err.message));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-bg">
      <div className="pointer-events-none fixed -top-40 -left-40 h-96 w-96 rounded-full bg-orange/10 blur-3xl" />

      <Navbar />

      <main className="relative px-6 pb-24 md:px-16">
        <div className="mx-auto mt-14 max-w-2xl text-center">
          <h1 className="text-4xl font-extrabold leading-tight text-orange sm:text-5xl">
            Share your idea
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-text-grey sm:text-base">
            Shape your idea into a clear plan, define the problem, map the
            execution, and show what it will take to bring it to life.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mx-auto mt-10 flex max-w-3xl flex-col gap-8 rounded-3xl border border-white/5 bg-box-dark p-8 text-inter text-white1 shadow-2xl shadow-black/30 sm:p-12">
            {error && (
              <p className="rounded-lg border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </p>
            )}

            {success && (
              <p className="rounded-lg border border-green-400/20 bg-green-500/10 px-4 py-3 text-sm text-green-200">
                {success}
              </p>
            )}

            {/* ================= PROJECT DETAILS ================= */}
            <div className="flex flex-col gap-6">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-orange-light">
                Project Details
              </h2>

              <div className="flex flex-col gap-2">
                <label className={fieldLabelClass}>
                  Project Title <span className="text-orange">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(event) => updateField("title", event.target.value)}
                  placeholder="Give your project a clear, short name"
                  className={inputClass}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className={fieldLabelClass}>
                  Problem Statement <span className="text-orange">*</span>
                </label>
                <textarea
                  rows={3}
                  value={form.problem_statement}
                  onChange={(event) =>
                    updateField("problem_statement", event.target.value)
                  }
                  placeholder="What problem are you solving, and for whom?"
                  className={`${inputClass} resize-none`}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className={fieldLabelClass}>
                  Domain / Field <span className="text-orange">*</span>
                </label>
                <textarea
                  rows={2}
                  value={form.domain}
                  onChange={(event) => updateField("domain", event.target.value)}
                  placeholder="AI / ML, Robotics, Software, Electronics, Sustainability etc."
                  className={`${inputClass} resize-none`}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-6 sm:max-w-sm">
                <div className="flex flex-col gap-2">
                  <label className={fieldLabelClass}>Timeline</label>
                  <select
                    value={form.tentative_timeline}
                    onChange={(event) =>
                      updateField("tentative_timeline", event.target.value)
                    }
                    className={inputClass}
                  >
                    <option value="1 month">1 month</option>
                    <option value="2 months">2 months</option>
                    <option value="3 months">3 months</option>
                    <option value="6 months">6 months</option>
                    <option value="1 year">1 year</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className={fieldLabelClass}>Team Size</label>
                  <select
                    value={form.team_size}
                    onChange={(event) =>
                      updateField("team_size", event.target.value)
                    }
                    className={inputClass}
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">5+</option>
                  </select>
                </div>
              </div>
            </div>

            <SectionDivider />

            {/* ================= BUDGET ================= */}
            <div className="flex flex-col gap-6">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-orange-light">
                Budget
              </h2>

              <div>
                <div className="rounded-xl border border-orange/60 bg-orange/[0.06] px-6 py-5">
                  <p className="text-center text-3xl font-extrabold text-orange">
                    Rs. {Number(form.budget_needed).toLocaleString("en-IN")}
                  </p>
                  <p className="mt-1 text-center text-xs font-semibold text-text-grey">
                    Drag to adjust · max Rs. 50,000
                  </p>
                </div>

                <div className="mt-6 px-2 sm:px-6">
                  <Slider.Root
                    value={[Number(form.budget_needed)]}
                    max={50000}
                    min={0}
                    step={1000}
                    className="relative flex h-5 w-full items-center"
                    onValueChange={(value) =>
                      updateField("budget_needed", value[0] || 0)
                    }
                  >
                    <Slider.Track className="relative h-1.5 w-full rounded-full bg-white1/20">
                      <Slider.Range className="absolute h-1.5 rounded-full bg-orange" />
                    </Slider.Track>
                    <Slider.Thumb className="block h-5 w-5 cursor-pointer rounded-full border-2 border-white1 bg-orange shadow-md outline-none transition-transform hover:scale-110" />
                  </Slider.Root>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className={fieldLabelClass}>Budget Breakdown</label>
                <textarea
                  rows={3}
                  value={form.budget_breakdown}
                  onChange={(event) =>
                    updateField("budget_breakdown", event.target.value)
                  }
                  placeholder="Roughly how the funds will be used (components, tools, travel, etc.)"
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>

            <SectionDivider />

            {/* ================= CONTACT ================= */}
            <div className="flex flex-col gap-6">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-orange-light">
                Contact
              </h2>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className={fieldLabelClass}>Email</label>
                  <input
                    type="email"
                    value={form.contact_email}
                    onChange={(event) =>
                      updateField("contact_email", event.target.value)
                    }
                    placeholder="you@iitb.ac.in"
                    className={inputClass}
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className={fieldLabelClass}>Contact Number</label>
                  <input
                    type="tel"
                    value={form.contact_phone}
                    onChange={(event) =>
                      updateField("contact_phone", event.target.value)
                    }
                    placeholder="+91 XXXXX XXXXX"
                    className={inputClass}
                    required
                  />
                </div>

                <div className="flex flex-col gap-2 sm:col-span-2">
                  <label className={fieldLabelClass}>Team Lead Name</label>
                  <input
                    type="text"
                    value={form.team_lead_name}
                    onChange={(event) =>
                      updateField("team_lead_name", event.target.value)
                    }
                    placeholder="Full name"
                    className={inputClass}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-10 flex max-w-3xl items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate("/explore")}
              className="group relative overflow-hidden rounded-lg border border-orange px-6 py-3 text-sm font-semibold transition-transform duration-200 cursor-pointer active:scale-95"
            >
              <span className="absolute inset-0 origin-left scale-x-0 bg-orange transition-all duration-200 group-hover:scale-x-100" />
              <span className="relative z-10 transition-colors">
                Cancel
              </span>
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="group relative overflow-hidden rounded-lg px-6 py-3 text-sm font-semibold shadow-lg shadow-orange/20 transition-transform duration-200 cursor-pointer active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="absolute inset-0 bg-orange" />
              <span className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-orange-light to-orange transition-all duration-400 group-hover:scale-x-100" />
              <span className="relative z-10">
                {submitting ? "Submitting..." : "Submit for review ->"}
              </span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
