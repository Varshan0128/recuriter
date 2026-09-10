import { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { apiRequest } from "../../lib/api";
import { CircleCheckBig } from "lucide-react";
import { GlassPanel } from "./shared";

const FIELDS = ["Job title", "Department", "Employment type", "Work mode", "Location", "Experience", "Salary range", "Number of openings"];

export default function JobFormPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const steps = ["Basics", "Compensation", "Requirements", "Publish"];
  const [step, setStep] = useState(0);

  const [form, setForm] = useState<Record<string, string>>({
    "Job title": "",
    Department: "",
    "Employment type": "",
    "Work mode": "",
    Location: "",
    Experience: "",
    "Salary range": "",
    "Number of openings": "",
    description: "",
  });

  const updateField = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const previewRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showStatus = (type: "success" | "error", text: string) => {
    setStatus({ type, text });
    window.setTimeout(() => setStatus(null), 3000);
  };

  const handleSaveDraft = () => {
    localStorage.setItem("job-draft", JSON.stringify(form));
    showStatus("success", "Draft saved.");
  };

  const handlePreview = () => {
    previewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handlePublish = async () => {
    if (!form["Job title"].trim()) {
      showStatus("error", "Job title is required before publishing.");
      return;
    }
    if (!user?.company_id) {
      showStatus("error", "Your account is not linked to a company.");
      return;
    }
    try {
      await apiRequest("/api/jobs", {
        method: "POST",
        body: JSON.stringify({
          company_id: user.company_id,
          created_by: user.id,
          title: form["Job title"],
          description: form.description || "Role description pending.",
          employment_type: form["Employment type"],
          work_mode: form["Work mode"],
          experience_min: form.Experience ? Number(form.Experience.split("-")[0]) : null,
          experience_max: form.Experience ? Number(form.Experience.split("-")[1]) : null,
          status: "published",
          salary_currency: "USD",
        }),
      });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["jobs", user.company_id] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard", user.company_id] }),
      ]);
      showStatus("success", `"${form["Job title"]}" published successfully.`);
      navigate("/hr/jobs");
    } catch (error) {
      showStatus("error", error instanceof Error ? error.message : "Unable to publish job.");
    }
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
      <GlassPanel title="Post a Job" subtitle="A cleaner, premium version of the same posting flow.">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          {steps.map((label, index) => (
            <div key={label} className="flex items-center gap-3">
              <div className={`grid h-8 w-8 place-items-center rounded-full text-xs font-bold ${index <= step ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-500"}`}>{index + 1}</div>
              <div className={`text-sm font-semibold ${index <= step ? "text-slate-950" : "text-slate-400"}`}>{label}</div>
              {index < steps.length - 1 ? <div className="mx-1 h-px w-8 bg-slate-200" /> : null}
            </div>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {FIELDS.map((label) => (
            <label key={label} className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
              {label === "Employment type" ? (
                <select value={form[label]} onChange={(e) => updateField(label, e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-400 focus:bg-white">
                  <option value="">Select employment type</option>
                  <option value="full-time">Full time</option>
                  <option value="part-time">Part time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              ) : label === "Work mode" ? (
                <select value={form[label]} onChange={(e) => updateField(label, e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-400 focus:bg-white">
                  <option value="">Select work mode</option>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="onsite">Onsite</option>
                </select>
              ) : label === "Experience" ? (
                <select value={form[label]} onChange={(e) => updateField(label, e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-400 focus:bg-white">
                  <option value="">Select experience</option>
                  <option value="0-1">0-1 years</option>
                  <option value="1-3">1-3 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="5-8">5-8 years</option>
                  <option value="8-12">8-12 years</option>
                </select>
              ) : (
                <input value={form[label]} onChange={(e) => updateField(label, e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-violet-400 focus:bg-white" placeholder={label} />
              )}
            </label>
          ))}
          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Job description</span>
            <textarea
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              className="min-h-36 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-violet-400 focus:bg-white"
              placeholder="Describe the role, responsibilities, and impact..."
            />
          </label>
        </div>
        {status ? (
          <div
            className={`mt-4 rounded-2xl border px-4 py-3 text-sm font-semibold ${
              status.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {status.text}
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" onClick={() => setStep((s) => Math.max(0, s - 1))} className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700">Back</button>
          <button type="button" onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))} className="rounded-2xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white">Next</button>
          <button type="button" onClick={handleSaveDraft} className="rounded-2xl border border-violet-200 bg-violet-50 px-5 py-3 text-sm font-semibold text-violet-700">Save as Draft</button>
          <button type="button" onClick={handlePreview} className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700">Preview Job</button>
          <button type="button" onClick={handlePublish} className="rounded-2xl bg-[linear-gradient(135deg,#7c3aed_0%,#6d28d9_100%)] px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(124,58,237,0.24)]">Publish Job</button>
        </div>
      </GlassPanel>

      <div className="space-y-5" ref={previewRef}>
        <GlassPanel title="Live preview" subtitle="A recruiter-facing snapshot of the final posting.">
          <div className="rounded-[26px] border border-slate-100 bg-[linear-gradient(180deg,rgba(248,247,255,0.9),rgba(255,255,255,0.95))] p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-500">Preview</div>
            <div className="mt-3 text-2xl font-extrabold tracking-tight text-slate-950">
              {form["Job title"] || "Senior Product Designer"}
            </div>
            <div className="mt-2 flex flex-wrap gap-2 text-sm text-slate-600">
              <span className="rounded-full bg-white px-3 py-1 shadow-sm">{form["Work mode"] || "Remote"}</span>
              <span className="rounded-full bg-white px-3 py-1 shadow-sm">{form["Employment type"] || "Full time"}</span>
              <span className="rounded-full bg-white px-3 py-1 shadow-sm">{form.Experience || "4-8 years"}</span>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              {form.description || "Design intuitive product flows, own design systems, and work closely with product and engineering on high-impact shipping cycles."}
            </p>
          </div>
        </GlassPanel>

        <GlassPanel title="Publishing checklist" subtitle="Everything aligned before a role goes live.">
          <div className="space-y-3 text-sm text-slate-600">
            {[
              "Review required skills and compensation",
              "Check application deadline",
              "Confirm interview stages",
              "Validate job visibility and ATS integration",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white/80 px-4 py-3">
                <CircleCheckBig size={16} className="text-emerald-500" />
                {item}
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}