import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Slider from "@radix-ui/react-slider";
import Navbar from "../components/Navbar";
import { createProject } from "../js/projectApi";

const initialForm = {
  title: "",
  objective: "",
  scope: "",
  expected_outcome: "",
  problem_statement: "",
  motivation: "",
  domain: "",
  tentative_timeline: "3 months",
  end_date: "",
  team_size: "3",
  needs_room: false,
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

function SectionHeading({ title, hint }) {
  return (
    <div>
      <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-orange-light">
        {title}
      </h2>
      {hint && <p className="mt-1.5 text-xs text-text-grey">{hint}</p>}
    </div>
  );
}

function RequiredLabel({ children }) {
  return (
    <label className={fieldLabelClass}>
      {children} <span className="text-orange">*</span>
    </label>
  );
}

function TextAreaField({ label, value, onChange, placeholder, rows = 3 }) {
  return (
    <div className="flex flex-col gap-2">
      <RequiredLabel>{label}</RequiredLabel>
      <textarea
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`${inputClass} resize-none`}
        required
      />
    </div>
  );
}

function tomorrowISO() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
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
    setError(null);
    setSuccess(null);

    if (Number(form.budget_needed) <= 0) {
      setError("Please set a budget greater than ₹0.");
      return;
    }

    setSubmitting(true);

    try {
      await createProject({
        title: form.title.trim(),
        objective: form.objective.trim(),
        scope: form.scope.trim(),
        expected_outcome: form.expected_outcome.trim(),
        problem_statement: form.problem_statement.trim(),
        motivation: form.motivation.trim(),
        domain: form.domain.trim(),
        tentative_timeline: form.tentative_timeline,
        end_date: form.end_date,
        team_size: Number(form.team_size),
        needs_room: form.needs_room,
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

            <p className="text-xs text-text-grey">
              All fields are required.
            </p>

            {/* ================= PROPOSAL ================= */}
            <div className="flex flex-col gap-6">
              <SectionHeading
                title="Proposal"
                hint="A clear objective, scope and expected outcome."
              />

              <div className="flex flex-col gap-2">
                <RequiredLabel>Project Title</RequiredLabel>
                <input
                  type="text"
                  value={form.title}
                  onChange={(event) => updateField("title", event.target.value)}
                  placeholder="Give your project a clear, short name"
                  className={inputClass}
                  required
                />
              </div>

              <TextAreaField
                label="Objective"
                value={form.objective}
                onChange={(value) => updateField("objective", value)}
                placeholder="What exactly do you want to achieve?"
              />

              <TextAreaField
                label="Scope"
                value={form.scope}
                onChange={(value) => updateField("scope", value)}
                placeholder="What is included in this project, and what is explicitly out of scope?"
              />

              <TextAreaField
                label="Expected Outcome"
                value={form.expected_outcome}
                onChange={(value) => updateField("expected_outcome", value)}
                placeholder="What will exist at the end - a working prototype, a deployed app, a report?"
              />

              <TextAreaField
                label="Domain / Field"
                rows={2}
                value={form.domain}
                onChange={(value) => updateField("domain", value)}
                placeholder="AI / ML, Robotics, Software, Electronics, Sustainability etc."
              />
            </div>

            <SectionDivider />

            {/* ================= MOTIVATION ================= */}
            <div className="flex flex-col gap-6">
              <SectionHeading
                title="Motivation"
                hint="A clear reason for the project and why it's worth doing."
              />

              <TextAreaField
                label="Problem Statement"
                value={form.problem_statement}
                onChange={(value) => updateField("problem_statement", value)}
                placeholder="What problem are you solving, and for whom?"
              />

              <TextAreaField
                label="Why is it worth doing?"
                value={form.motivation}
                onChange={(value) => updateField("motivation", value)}
                placeholder="Who benefits, what impact will it have, and why now?"
              />
            </div>

            <SectionDivider />

            {/* ================= TIMELINE ================= */}
            <div className="flex flex-col gap-6">
              <SectionHeading
                title="Timeline"
                hint="The end date should be broadly feasible for the scope above."
              />

              <div className="grid gap-6 sm:grid-cols-3">
                <div className="flex flex-col gap-2">
                  <RequiredLabel>Duration</RequiredLabel>
                  <select
                    value={form.tentative_timeline}
                    onChange={(event) =>
                      updateField("tentative_timeline", event.target.value)
                    }
                    className={inputClass}
                    required
                  >
                    <option value="1 month">1 month</option>
                    <option value="2 months">2 months</option>
                    <option value="3 months">3 months</option>
                    <option value="6 months">6 months</option>
                    <option value="1 year">1 year</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <RequiredLabel>End Date</RequiredLabel>
                  <input
                    type="date"
                    min={tomorrowISO()}
                    value={form.end_date}
                    onChange={(event) =>
                      updateField("end_date", event.target.value)
                    }
                    className={`${inputClass} [color-scheme:dark]`}
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <RequiredLabel>Team Size</RequiredLabel>
                  <select
                    value={form.team_size}
                    onChange={(event) =>
                      updateField("team_size", event.target.value)
                    }
                    className={inputClass}
                    required
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

              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/5 bg-box-light px-4 py-3 text-sm text-white1 transition-colors hover:border-orange/40">
                <input
                  type="checkbox"
                  checked={form.needs_room}
                  onChange={(event) =>
                    updateField("needs_room", event.target.checked)
                  }
                  className="h-4 w-4 accent-[#FD6E59]"
                />
                <span>
                  <span className="font-bold">We need a room</span>
                  <span className="text-white2/60">
                    {" "}— tick if your team needs room retention for this project
                  </span>
                </span>
              </label>
            </div>

            <SectionDivider />

            {/* ================= BUDGET ================= */}
            <div className="flex flex-col gap-6">
              <SectionHeading
                title="Budget"
                hint="Reasonable and justified, with all major expenses accounted for."
              />

              <div>
                <div className="rounded-xl border border-orange/60 bg-orange/[0.06] px-6 py-5">
                  <p className="text-center text-3xl font-extrabold text-orange">
                    Rs. {Number(form.budget_needed).toLocaleString("en-IN")}
                  </p>
                  <p className="mt-1 text-center text-xs font-semibold text-text-grey">
                    Drag to adjust · max Rs. 20,000
                  </p>
                </div>

                <div className="mt-8 px-2 sm:px-6">
                  <div className="relative pt-8">
                    <div
                      className="pointer-events-none absolute top-0 -translate-x-1/2 rounded-md bg-gradient-to-r from-orange-light to-orange px-2.5 py-1 text-xs font-bold text-white shadow-lg shadow-orange/30 transition-all duration-150"
                      style={{
                        left: `${(Number(form.budget_needed) / 20000) * 100}%`,
                      }}
                    >
                      ₹{Number(form.budget_needed).toLocaleString("en-IN")}
                      <span className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-x-4 border-t-4 border-x-transparent border-t-orange" />
                    </div>

                    <Slider.Root
                      value={[Number(form.budget_needed)]}
                      max={20000}
                      min={0}
                      step={1000}
                      className="relative flex h-7 w-full items-center"
                      onValueChange={(value) =>
                        updateField("budget_needed", value[0] || 0)
                      }
                    >
                      <Slider.Track className="relative h-3 w-full rounded-full bg-white1/10 shadow-[inset_0_1px_3px_rgba(0,0,0,0.4)]">
                        <Slider.Range className="absolute h-3 rounded-full bg-gradient-to-r from-orange-light to-orange shadow-[0_0_14px_rgba(253,110,89,0.55)]" />
                      </Slider.Track>
                      <Slider.Thumb className="block h-7 w-7 cursor-grab rounded-full border-[3px] border-white1 bg-gradient-to-br from-orange-light to-orange shadow-lg outline-none ring-4 ring-orange/20 transition-transform hover:scale-110 active:cursor-grabbing active:scale-125" />
                    </Slider.Root>

                    <div className="mt-2 flex justify-between text-[10px] font-semibold text-text-grey">
                      <span>₹0</span>
                      <span>₹5k</span>
                      <span>₹10k</span>
                      <span>₹15k</span>
                      <span>₹20k</span>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {[5000, 10000, 15000, 20000].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => updateField("budget_needed", preset)}
                        className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-colors ${
                          Number(form.budget_needed) === preset
                            ? "border-orange bg-orange text-white"
                            : "border-white1/10 bg-white1/5 text-text-grey hover:border-orange/50 hover:text-white1"
                        }`}
                      >
                        ₹{preset.toLocaleString("en-IN")}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <TextAreaField
                label="Budget Breakdown"
                rows={4}
                value={form.budget_breakdown}
                onChange={(value) => updateField("budget_breakdown", value)}
                placeholder={"List each major expense with its cost, e.g.\nSensors - ₹4,000\nMicrocontroller - ₹2,500\nFabrication - ₹3,000"}
              />
            </div>

            <SectionDivider />

            {/* ================= CONTACT ================= */}
            <div className="flex flex-col gap-6">
              <SectionHeading title="Contact" />

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <RequiredLabel>Email</RequiredLabel>
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
                  <RequiredLabel>Contact Number</RequiredLabel>
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
                  <RequiredLabel>Team Lead Name</RequiredLabel>
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
