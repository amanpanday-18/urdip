import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, FlaskConical, Leaf, Loader2, ShieldCheck, Sprout } from "lucide-react";
import { useState } from "react";
import { PhotoPicker } from "@/components/PhotoPicker";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/agro")({
  head: () => ({
    meta: [
      { title: "Plant Doctor — Kisan Mitra" },
      { name: "description", content: "Take a photo of your plant to identify it, diagnose the disease and get medicine suggestions." },
      { property: "og:title", content: "Plant Doctor — Kisan Mitra" },
      { property: "og:description", content: "Photo-based plant disease diagnosis with treatment advice." },
    ],
  }),
  component: Agro,
});

function Agro() {
  const { t } = useLang();
  const [img, setImg] = useState<string | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const analyse = () => { setState("loading"); setTimeout(() => setState("done"), 1500); };
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold">{t("Plant Doctor", "पौधा डॉक्टर")}</h1>
      <PhotoPicker image={img} onPick={(u) => { setImg(u); setState("idle"); }} hint={t("Take a clear photo of the affected leaf", "प्रभावित पत्ती की साफ फोटो लें")} />
      {img && state !== "done" && (
        <button onClick={analyse} disabled={state === "loading"} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-soil py-4 text-lg font-semibold text-soil-foreground">
          {state === "loading" ? <><Loader2 className="h-5 w-5 animate-spin" /> {t("Analysing…", "जांच हो रही है…")}</> : t("Diagnose plant", "पौधे की जांच करें")}
        </button>
      )}
      {state === "done" && <Result />}
      <p className="text-center text-xs text-muted-foreground">{t("Sample result shown — AI analysis coming next.", "नमूना परिणाम — AI जांच जल्द आ रही है।")}</p>
    </div>
  );
}

function Result() {
  const { t } = useLang();
  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-card p-5 shadow-sm">
        <div className="flex items-center gap-2 text-muted-foreground"><Sprout className="h-4 w-4" /> {t("Plant", "पौधा")}: <b className="text-foreground">{t("Tomato", "टमाटर")}</b></div>
        <div className="mt-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-danger font-semibold">{t("Disease detected", "रोग मिला")}</p>
            <h2 className="text-2xl font-bold">{t("Early Blight", "अगेती झुलसा")}</h2>
            <p className="text-sm italic text-muted-foreground">Alternaria solani</p>
          </div>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary">92%</span>
        </div>
      </div>
      <Section icon={AlertTriangle} title={t("Symptoms & cause", "लक्षण और कारण")}>
        <ul className="list-disc space-y-1 pl-5">
          <li>{t("Brown spots with rings on older leaves", "पुरानी पत्तियों पर छल्लेदार भूरे धब्बे")}</li>
          <li>{t("Leaves turn yellow and fall", "पत्तियां पीली होकर गिरती हैं")}</li>
          <li>{t("Fungus spreads in warm, wet weather", "गर्म और नम मौसम में फफूंद फैलती है")}</li>
        </ul>
      </Section>
      <Section icon={FlaskConical} title={t("Medicines", "दवाइयां")}>
        {[["Mancozeb 75% WP", "2.5 g / L", t("Spray every 7–10 days", "हर 7–10 दिन में छिड़काव")], ["Chlorothalonil 75% WP", "2 g / L", t("Spray on both sides of leaves", "पत्तियों के दोनों ओर छिड़कें")]].map(([n, d, h]) => (
          <div key={n} className="mb-2 rounded-2xl bg-muted p-3"><b>{n}</b> · {d}<p className="text-sm text-muted-foreground">{h}</p></div>
        ))}
      </Section>
      <Section icon={Leaf} title={t("Organic remedies", "जैविक उपाय")}>
        <ul className="list-disc space-y-1 pl-5"><li>{t("Neem oil 5 ml/L spray", "नीम तेल 5 ml/L छिड़काव")}</li><li>{t("Remove and burn infected leaves", "संक्रमित पत्तियां हटाकर जलाएं")}</li></ul>
      </Section>
      <Section icon={ShieldCheck} title={t("Prevention", "रोकथाम")}>
        <ul className="list-disc space-y-1 pl-5"><li>{t("Rotate crops every season", "हर मौसम फसल चक्र अपनाएं")}</li><li>{t("Water at the base, not on leaves", "पत्तियों पर नहीं, जड़ में पानी दें")}</li></ul>
      </Section>
    </div>
  );
}

function Section({ icon: Icon, title, children }: { icon: typeof Leaf; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border bg-card p-5">
      <h3 className="mb-3 flex items-center gap-2 text-lg font-bold"><Icon className="h-5 w-5 text-primary" /> {title}</h3>
      {children}
    </div>
  );
}
