import { useRef, useState } from "react";
import { motion } from "motion/react";
import { Upload, X } from "lucide-react";
import { GlassPanel } from "./shared";

const COMPANY_FIELDS = ["Company name", "Industry", "Website", "Company size", "Headquarters"] as const;
const RECRUITER_FIELDS = ["Recruiter name", "Work email", "Phone", "Verification status"] as const;

interface CompanyInfo {
  logo: string | null;
  "Company name": string;
  Industry: string;
  Website: string;
  "Company size": string;
  Headquarters: string;
  about: string;
}

interface RecruiterInfo {
  "Recruiter name": string;
  "Work email": string;
  Phone: string;
  "Verification status": string;
  social: string;
}

interface LogoUploadProps {
  logo: string | null;
  onChange: (url: string | null) => void;
}

function LogoUpload({ logo, onChange }: LogoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | undefined) => {
    if (!file || !file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    onChange(url);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files?.[0]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="block"
    >
      <span className="mb-2 block text-sm font-semibold text-slate-700">Company logo</span>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="relative flex cursor-pointer items-center gap-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-4 transition hover:border-violet-400 hover:bg-white"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />

        {logo ? (
          <img
            src={logo}
            alt="Company logo preview"
            className="h-14 w-14 rounded-xl object-cover ring-1 ring-slate-200"
          />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
            <Upload size={20} />
          </div>
        )}

        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-700">
            {logo ? "Logo uploaded" : "Click or drag an image to upload"}
          </p>
          <p className="text-xs text-slate-400">PNG, JPG up to 5MB</p>
        </div>

        {logo && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange(null);
            }}
            className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default function CompanyPage() {
  const [company, setCompany] = useState<CompanyInfo>({
    logo: null,
    "Company name": "",
    Industry: "",
    Website: "",
    "Company size": "",
    Headquarters: "",
    about: "We build products that help candidates and recruiters move faster with AI.",
  });

  const [recruiter, setRecruiter] = useState<RecruiterInfo>({
    "Recruiter name": "",
    "Work email": "",
    Phone: "",
    "Verification status": "",
    social: "",
  });

  const updateCompany = (key: keyof CompanyInfo, value: string) =>
    setCompany((prev) => ({ ...prev, [key]: value }));

  const updateRecruiter = (key: keyof RecruiterInfo, value: string) =>
    setRecruiter((prev) => ({ ...prev, [key]: value }));

  const handleSave = () => {
    console.log("Saving:", { company, recruiter });
    // TODO: wire this up to your API call
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
        <GlassPanel title="Company profile" subtitle="Brand, role, and company metadata in one clean panel.">
          <div className="grid gap-4">
            <LogoUpload logo={company.logo} onChange={(url) => updateCompany("logo", url ?? "")} />

            {COMPANY_FIELDS.map((label, i) => (
              <motion.label
                key={label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05, ease: "easeOut" }}
                className="block"
              >
                <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
                <input
                  value={company[label]}
                  onChange={(e) => updateCompany(label, e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-violet-400 focus:bg-white"
                />
              </motion.label>
            ))}

            <motion.label
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3, ease: "easeOut" }}
              className="block"
            >
              <span className="mb-2 block text-sm font-semibold text-slate-700">About company</span>
              <textarea
                value={company.about}
                onChange={(e) => updateCompany("about", e.target.value)}
                className="min-h-36 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-violet-400 focus:bg-white"
              />
            </motion.label>
          </div>
        </GlassPanel>
      </motion.div>

      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}>
        <GlassPanel title="Recruiter details" subtitle="Contact and verification information for the hiring team.">
          <div className="grid gap-4 md:grid-cols-2">
            {RECRUITER_FIELDS.map((label, i) => (
              <motion.label
                key={label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.06, ease: "easeOut" }}
                className="block"
              >
                <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
                <input
                  value={recruiter[label]}
                  onChange={(e) => updateRecruiter(label, e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-violet-400 focus:bg-white"
                />
              </motion.label>
            ))}

            <motion.label
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3, ease: "easeOut" }}
              className="block md:col-span-2"
            >
              <span className="mb-2 block text-sm font-semibold text-slate-700">Social links</span>
              <input
                value={recruiter.social}
                onChange={(e) => updateRecruiter("social", e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-violet-400 focus:bg-white"
                placeholder="LinkedIn, X, website..."
              />
            </motion.label>

            <div className="md:col-span-2 flex gap-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSave}
                className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700"
              >
                Save changes
              </motion.button>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="rounded-2xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white">
                Request verification
              </motion.button>
            </div>
          </div>
        </GlassPanel>
      </motion.div>
    </div>
  );
}