import { createFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ExternalLink, FileText, Phone } from "lucide-react";
import { useState } from "react";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/schemes")({
  head: () => ({
    meta: [
      { title: "Government Schemes Finder — Kisan Mitra" },
      { name: "description", content: "Answer a few questions to find schemes, pensions and scholarships you are eligible for, and how to apply." },
      { property: "og:title", content: "Government Schemes Finder — Kisan Mitra" },
      { property: "og:description", content: "Find schemes, pensions and scholarships you qualify for." },
    ],
  }),
  component: Schemes,
});

type Field = { key: string; en: string; hi: string; options?: string[]; type?: "number" };
const steps: Field[][] = [
  [{ key: "age", en: "Age", hi: "उम्र", type: "number" }, { key: "gender", en: "Gender", hi: "लिंग", options: ["Male", "Female", "Other"] }, { key: "marital", en: "Marital status", hi: "वैवाहिक स्थिति", options: ["Single", "Married", "Widowed", "Divorced"] }],
  [{ key: "state", en: "State", hi: "राज्य", options: ["Uttar Pradesh", "Bihar", "Maharashtra", "Madhya Pradesh", "Rajasthan", "Other"] }, { key: "area", en: "Area", hi: "क्षेत्र", options: ["Village", "City"] }, { key: "caste", en: "Category", hi: "वर्ग", options: ["General", "OBC", "SC", "ST"] }],
  [{ key: "income", en: "Yearly family income", hi: "वार्षिक पारिवारिक आय", options: ["< ₹1 lakh", "₹1–2.5 lakh", "₹2.5–8 lakh", "> ₹8 lakh"] }, { key: "job", en: "Occupation", hi: "व्यवसाय", options: ["Farmer", "Student", "Worker", "Self-employed", "Unemployed"] }, { key: "disability", en: "Disability", hi: "दिव्यांगता", options: ["No", "Yes"] }],
];

type Scheme = { name: string; benefit: string; why: string; site: string; helpline: string; docs: string[]; steps: string[] };
const results: Record<string, Scheme[]> = {
  schemes: [
    { name: "PM-KISAN", benefit: "₹6,000 per year in 3 instalments", why: "You are a farmer with cultivable land", site: "https://pmkisan.gov.in", helpline: "155261", docs: ["Aadhaar", "Land record", "Bank passbook"], steps: ["Visit pmkisan.gov.in", "Click 'New Farmer Registration'", "Enter Aadhaar & land details", "Submit and track status"] },
    { name: "PM Fasal Bima Yojana", benefit: "Crop insurance at 1.5–2% premium", why: "Farmers growing notified crops", site: "https://pmfby.gov.in", helpline: "14447", docs: ["Aadhaar", "Land record", "Sowing certificate"], steps: ["Visit bank/CSC or pmfby.gov.in", "Fill the proposal form", "Pay premium before cut-off"] },
  ],
  pensions: [
    { name: "PM Kisan Maandhan", benefit: "₹3,000/month pension after 60", why: "Farmers aged 18–40", site: "https://maandhan.in", helpline: "1800-267-6888", docs: ["Aadhaar", "Bank account"], steps: ["Visit nearest CSC", "Register with Aadhaar", "Set up auto-debit contribution"] },
  ],
  scholarships: [
    { name: "National Scholarship Portal (Post-Matric)", benefit: "Tuition + maintenance allowance", why: "Income below ₹2.5 lakh", site: "https://scholarships.gov.in", helpline: "0120-6619540", docs: ["Aadhaar", "Income certificate", "Marksheet"], steps: ["Register on scholarships.gov.in", "Fill application", "Upload documents", "Institute verification"] },
  ],
};

function Schemes() {
  const { t } = useLang();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Record<string, string>>({});
  const [tab, setTab] = useState("schemes");
  const [open, setOpen] = useState<Scheme | null>(null);
  const done = step >= steps.length;

  if (open) return (
    <div className="space-y-4">
      <button onClick={() => setOpen(null)} className="flex items-center gap-1 text-primary"><ChevronLeft className="h-5 w-5" /> {t("Back", "वापस")}</button>
      <h1 className="text-2xl font-bold">{t("How to apply", "आवेदन कैसे करें")}: {open.name}</h1>
      <ol className="space-y-3">{open.steps.map((s, i) => (
        <li key={s} className="flex gap-3 rounded-2xl bg-card p-4"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary font-bold text-primary-foreground">{i + 1}</span>{s}</li>
      ))}</ol>
      <div className="rounded-3xl border bg-card p-5">
        <h3 className="mb-2 flex items-center gap-2 font-bold"><FileText className="h-5 w-5 text-primary" /> {t("Documents needed", "जरूरी दस्तावेज")}</h3>
        <div className="flex flex-wrap gap-2">{open.docs.map((d) => <span key={d} className="rounded-full bg-secondary px-3 py-1 text-sm">{d}</span>)}</div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <a href={open.site} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-2xl bg-primary py-4 font-semibold text-primary-foreground"><ExternalLink className="h-5 w-5" /> {t("Website", "वेबसाइट")}</a>
        <a href={`tel:${open.helpline}`} className="flex items-center justify-center gap-2 rounded-2xl bg-accent py-4 font-semibold text-accent-foreground"><Phone className="h-5 w-5" /> {open.helpline}</a>
      </div>
    </div>
  );

  if (done) return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">{t("You may be eligible for", "आप इनके पात्र हो सकते हैं")}</h1>
      <div className="grid grid-cols-3 gap-2 rounded-2xl bg-muted p-1">
        {[["schemes", t("Schemes", "योजनाएं")], ["pensions", t("Pensions", "पेंशन")], ["scholarships", t("Scholarships", "छात्रवृत्ति")]].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k!)} className={cn("rounded-xl py-2 font-semibold", tab === k ? "bg-card shadow-sm" : "text-muted-foreground")}>{l} ({results[k!]!.length})</button>
        ))}
      </div>
      {results[tab]!.map((s) => (
        <div key={s.name} className="rounded-3xl border bg-card p-5">
          <h2 className="text-xl font-bold">{s.name}</h2>
          <p className="mt-1 text-lg font-semibold text-primary">{s.benefit}</p>
          <p className="mt-1 text-sm text-muted-foreground">✓ {s.why}</p>
          <button onClick={() => setOpen(s)} className="mt-4 w-full rounded-2xl bg-soil py-3 font-semibold text-soil-foreground">{t("How to apply →", "आवेदन कैसे करें →")}</button>
        </div>
      ))}
      <button onClick={() => setStep(0)} className="w-full text-primary underline">{t("Edit my details", "मेरी जानकारी बदलें")}</button>
      <p className="text-center text-xs text-muted-foreground">{t("Sample results — smart matching coming next.", "नमूना परिणाम — स्मार्ट मिलान जल्द आ रहा है।")}</p>
    </div>
  );

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold">{t("Find your schemes", "अपनी योजनाएं खोजें")}</h1>
      <div className="flex gap-2">{steps.map((_, i) => <div key={i} className={cn("h-2 flex-1 rounded-full", i <= step ? "bg-primary" : "bg-muted")} />)}</div>
      <p className="text-muted-foreground">{t(`Step ${step + 1} of ${steps.length}`, `चरण ${step + 1} / ${steps.length}`)}</p>
      {steps[step]!.map((f) => (
        <div key={f.key} className="space-y-2">
          <label className="font-semibold">{t(f.en, f.hi)}</label>
          {f.type === "number" ? (
            <input type="number" value={data[f.key] ?? ""} onChange={(e) => setData({ ...data, [f.key]: e.target.value })} className="w-full rounded-2xl border bg-card px-4 py-3 text-lg" />
          ) : (
            <div className="flex flex-wrap gap-2">{f.options!.map((o) => (
              <button key={o} onClick={() => setData({ ...data, [f.key]: o })} className={cn("rounded-full border px-4 py-2", data[f.key] === o ? "border-primary bg-primary text-primary-foreground" : "bg-card")}>{o}</button>
            ))}</div>
          )}
        </div>
      ))}
      <div className="flex gap-3 pt-2">
        {step > 0 && <button onClick={() => setStep(step - 1)} className="flex-1 rounded-2xl bg-secondary py-4 font-semibold">{t("Back", "वापस")}</button>}
        <button onClick={() => setStep(step + 1)} className="flex-[2] rounded-2xl bg-primary py-4 text-lg font-semibold text-primary-foreground">{step === steps.length - 1 ? t("Show my schemes", "मेरी योजनाएं दिखाएं") : t("Next", "आगे")}</button>
      </div>
    </div>
  );
}
