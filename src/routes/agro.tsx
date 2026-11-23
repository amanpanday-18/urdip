import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { AlertTriangle, FlaskConical, Leaf, Loader2, ShieldCheck, Sprout } from "lucide-react";
import { useState } from "react";
import { PhotoPicker } from "@/components/PhotoPicker";
import { useLang } from "@/lib/i18n";
import { diagnosePlant, type PlantResult } from "@/lib/ai.functions";

export const Route = createFileRoute("/agro")({
  head: () => ({
    meta: [
      { title: "Plant Doctor — URDIP" },
      { name: "description", content: "Take a photo of your plant to identify it, diagnose the disease and get medicine suggestions." },
      { property: "og:title", content: "Plant Doctor — URDIP" },
      { property: "og:description", content: "Photo-based plant disease diagnosis with treatment advice." },
    ],
  }),
  component: Agro,
});

function Agro() {
  const { t, lang } = useLang();
  const diagnose = useServerFn(diagnosePlant);
  const [img, setImg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [res, setRes] = useState<PlantResult | null>(null);
  const analyse = async () => {
    if (!img) return;
    setLoading(true); setErr(null);
    try { setRes(await diagnose({ data: { image: img, lang } })); }
    catch (e) { setErr(e instanceof Error ? e.message : "Error"); }
    finally { setLoading(false); }
  };
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold">{t("Plant Doctor", "पौधा डॉक्टर")}</h1>
      <PhotoPicker image={img} onPick={(u) => { setImg(u); setRes(null); setErr(null); }} hint={t("Take a clear photo of the affected leaf", "प्रभावित पत्ती की साफ फोटो लें")} />
      {img && !res && (
        <button onClick={analyse} disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-soil py-4 text-lg font-semibold text-soil-foreground">
          {loading ? <><Loader2 className="h-5 w-5 animate-spin" /> {t("Analysing…", "जांच हो रही है…")}</> : t("Diagnose plant", "पौधे की जांच करें")}
        </button>
      )}
      {err && <p className="rounded-2xl bg-danger/10 p-4 text-danger">{err}</p>}
      {res && (res.isPlant ? <Result r={res} /> : <p className="rounded-2xl bg-warn/10 p-4">{t("This doesn't look like a plant. Please take a photo of a leaf or crop.", "यह पौधा नहीं लगता। कृपया पत्ती या फसल की फोटो लें।")}</p>)}
      {res && <p className="text-center text-xs text-muted-foreground">{t("AI advice — confirm with your local agriculture officer before spraying.", "AI सलाह — छिड़काव से पहले स्थानीय कृषि अधिकारी से पुष्टि करें।")}</p>}
    </div>
  );
}

function List({ items }: { items: string[] }) {
  return <ul className="list-disc space-y-1 pl-5">{items.map((i) => <li key={i}>{i}</li>)}</ul>;
}

function Result({ r }: { r: PlantResult }) {
  const { t } = useLang();
  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-card p-5 shadow-sm">
        <div className="flex items-center gap-2 text-muted-foreground"><Sprout className="h-4 w-4" /> {t("Plant", "पौधा")}: <b className="text-foreground">{r.plant}</b></div>
        <div className="mt-3 flex items-start justify-between gap-3">
          <div>
            <p className={`text-sm font-semibold ${r.healthy ? "text-safe" : "text-danger"}`}>{r.healthy ? t("Looks healthy", "स्वस्थ है") : t("Disease detected", "रोग मिला")}</p>
            <h2 className="text-2xl font-bold">{r.disease}</h2>
            {r.scientificName && <p className="text-sm italic text-muted-foreground">{r.scientificName}</p>}
          </div>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary">{Math.round(r.confidence)}%</span>
        </div>
      </div>
      {(r.symptoms.length > 0 || r.cause) && <Section icon={AlertTriangle} title={t("Symptoms & cause", "लक्षण और कारण")}><List items={r.symptoms} />{r.cause && <p className="mt-2 text-muted-foreground">{r.cause}</p>}</Section>}
      {r.medicines.length > 0 && <Section icon={FlaskConical} title={t("Medicines", "दवाइयां")}>
        {r.medicines.map((m) => <div key={m.name} className="mb-2 rounded-2xl bg-muted p-3"><b>{m.name}</b> · {m.dose}<p className="text-sm text-muted-foreground">{m.howToUse}</p></div>)}
      </Section>}
      {r.organic.length > 0 && <Section icon={Leaf} title={t("Organic remedies", "जैविक उपाय")}><List items={r.organic} /></Section>}
      {r.prevention.length > 0 && <Section icon={ShieldCheck} title={t("Prevention", "रोकथाम")}><List items={r.prevention} /></Section>}
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
