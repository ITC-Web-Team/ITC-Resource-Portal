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

export default function CreateProjectPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const contactClass =
    "relative flex items-center max-w-xl bg-box-light rounded-lg h-12 pl-3";
  const contactInputClass =
    "absolute inset-0 flex-1 bg-transparent text-white2 text-sm h-full rounded-lg w-full pl-40 pr-3";

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
      setForm(initialForm);
    } catch (err) {
      setError(normalizeError(err.message));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <main>
        <div className="mx-auto mt-10 max-w-3xl text-center">
          <h1 className="mt-[65px] text-center text-4xl font-bold leading-[1.5] text-orange">
            Share your idea
          </h1>
          <p className="text-m text-left text-text-grey">
            Shape your idea into a clear plan, define the problem, map the
            execution, and show what it will take to bring it to life.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mx-auto mt-10 flex max-w-3xl flex-col gap-7 rounded-4xl bg-box-dark p-10 text-inter text-white1">
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

            <div className="flex flex-col space-y-4">
              <label className="block text-lg font-bold">
                Project Title <span className="text-orange">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(event) => updateField("title", event.target.value)}
                className="h-10 w-full rounded-lg bg-box-light p-3 text-s"
                required
              />
            </div>

            <div className="flex flex-col space-y-4">
              <label className="block text-lg font-bold">
                Problem Statement <span className="text-orange">*</span>
              </label>
              <textarea
                rows={3}
                value={form.problem_statement}
                onChange={(event) =>
                  updateField("problem_statement", event.target.value)
                }
                className="h-18 w-full resize-none rounded-lg bg-box-light p-3"
                required
              />
            </div>

            <div className="flex flex-col space-y-4">
              <label className="block text-lg font-bold">
                Domain / Field <span className="text-orange">*</span>
              </label>
              <textarea
                rows={3}
                value={form.domain}
                onChange={(event) => updateField("domain", event.target.value)}
                placeholder="AI / ML, Robotics, Software, Electronics, Sustainability etc."
                className="h-18 w-full resize-none rounded-lg bg-box-light p-3"
                required
              />
            </div>

            <div className="flex flex-row space-x-20">
              <div className="flex flex-col space-y-4">
                <label className="text-lg font-bold">Timeline</label>
                <select
                  value={form.tentative_timeline}
                  onChange={(event) =>
                    updateField("tentative_timeline", event.target.value)
                  }
                  className="h-10 w-30 rounded-lg bg-box-light pl-1 text-s text-white1"
                >
                  <option value="1 month">1 month</option>
                  <option value="2 months">2 months</option>
                  <option value="3 months">3 months</option>
                  <option value="6 months">6 months</option>
                  <option value="1 year">1 year</option>
                </select>
              </div>

              <div className="flex flex-col space-y-4">
                <label className="text-lg font-bold">Team Size</label>
                <select
                  value={form.team_size}
                  onChange={(event) => updateField("team_size", event.target.value)}
                  className="h-10 w-15 rounded-lg bg-box-light pl-1 text-s text-white1"
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

            <div className="flex flex-col space-y-4">
              <label className="block text-lg font-bold text-white1">
                Budget
              </label>
              <div className="mt-3 mb-3 rounded-lg border border-orange p-3">
                <p className="text-center text-2xl font-bold text-orange">
                  Rs. {Number(form.budget_needed).toLocaleString("en-IN")}
                </p>
                <p className="text-center text-md font-bold text-text-grey">
                  Drag to adjust, max Rs. 50,000
                </p>
              </div>

              <div className="mt-5 pl-10 pr-10">
                <Slider.Root
                  value={[Number(form.budget_needed)]}
                  max={50000}
                  min={0}
                  step={1000}
                  className="relative flex h-2 w-full items-center"
                  onValueChange={(value) =>
                    updateField("budget_needed", value[0] || 0)
                  }
                >
                  <Slider.Track className="relative h-1 w-full rounded-full bg-white1">
                    <Slider.Range className="absolute h-1.5 rounded-full bg-orange" />
                  </Slider.Track>
                  <Slider.Thumb className="block h-5 w-5 cursor-pointer rounded-full bg-orange outline-none" />
                </Slider.Root>
              </div>

              <div className="mt-2 text-md">
                <p className="font-bold text-text-grey">Budget breakdown</p>
                <textarea
                  value={form.budget_breakdown}
                  onChange={(event) =>
                    updateField("budget_breakdown", event.target.value)
                  }
                  className="mt-4 h-30 w-full resize-none rounded-lg bg-box-light p-3 text-s"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="mt-4 mb-7 block text-lg font-bold">
                Contact
              </label>

              <div className={contactClass}>
                <span className="mr-2 z-10 font-bold pointer-events-none">
                  Email
                </span>
                <input
                  type="email"
                  value={form.contact_email}
                  onChange={(event) =>
                    updateField("contact_email", event.target.value)
                  }
                  className={contactInputClass}
                  required
                />
              </div>

              <div className={contactClass}>
                <span className="mr-2 z-10 font-bold pointer-events-none">
                  Contact number
                </span>
                <input
                  type="tel"
                  value={form.contact_phone}
                  onChange={(event) =>
                    updateField("contact_phone", event.target.value)
                  }
                  className={contactInputClass}
                  required
                />
              </div>

              <div className={contactClass}>
                <span className="mr-2 z-10 font-bold pointer-events-none">
                  Team lead name
                </span>
                <input
                  type="text"
                  value={form.team_lead_name}
                  onChange={(event) =>
                    updateField("team_lead_name", event.target.value)
                  }
                  className={contactInputClass}
                  required
                />
              </div>
            </div>
          </div>

          <div className="mx-auto mt-10 mb-20 flex max-w-3xl items-center justify-end gap-7">
            <button
              type="button"
              onClick={() => navigate("/explore")}
              className="group relative overflow-hidden rounded-lg border border-orange px-6 py-3 font-semibold transition:transform duration-200 cursor-pointer active:scale-95"
            >
              <span className="absolute inset-0 origin-left scale-x-0 bg-orange transition-all duration-200 group-hover:scale-x-100" />
              <span className="relative z-10 transition-colors">
                Cancel
              </span>
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="group relative overflow-hidden rounded-lg px-6 py-3 font-semibold transition:transform duration-200 cursor-pointer active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
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
