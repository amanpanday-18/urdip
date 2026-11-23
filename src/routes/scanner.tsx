import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Camera, Loader2, ScanBarcode, ThumbsDown, ThumbsUp, UserX } from "lucide-react";
import { useState } from "react";
import { PhotoPicker } from "@/components/PhotoPicker";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { scanBarcode, scanLabel, type ProductResult } from "@/lib/ai.functions";

export const Route = createFileRoute("/scanner")({
  head: () => ({
    meta: [
      { title: "Product Safety Scanner — URDIP" },
      { name: "description", content: "Scan a barcode or ingredient label to understand ingredients, who should avoid it, and its benefits and harms." },
      { property: "og:title", content: "Product Safety Scanner — URDIP" },
      { property: "og:description", content: "Know what is in your food in simple words." },
    ],
  }),
  component: Scanner,
});

async function readBarcode(file: File): Promise<string | null> {
  const { Html5Qrcode } = await import("html5-qrcode");
  const el = document.createElement("div"); el.id = "qr-tmp"; el.hidden = true; document.body.appendChild(el);
  try { return await new Html5Qrcode("qr-tmp").scanFile(file, false); } catch { return null; } finally { el.remove(); }
}

function Scanner() {
  const { t, lang } = useLang();
  const label = useServerFn(scanLabel);
  const barcode = useServerFn(scanBarcode);
  const [mode, setMode] = useState<"barcode" | "photo">("barcode");
  const [img, setImg] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [res, setRes] = useState<ProductResult | null>(null);

  const run = async () => {
    setLoading(true); setErr(null);
    try {
      const r = mode === "photo" ? await label({ data: { image: img!, lang } }) : await barcode({ data: { code: code.trim(), lang } });
      if (!r.found) setErr(mode === "photo" ? t("Couldn't read the ingredients. Try a clearer, closer photo.", "सामग्री नहीं पढ़ी जा सकी। साफ और पास से फोटो लें।") : t("Product not found for this barcode. Try a label photo instead.", "इस बारकोड का प्रोडक्ट नहीं मिला। लेबल फोटो आज़माएं।"));
      else setRes(r);
    } catch (e) { setErr(e instanceof Error ? e.message : "Error"); } finally { setLoading(false); }
  };
  const canRun = mode === "photo" ? !!img : /^\d{6,14}$/.test(code.trim());

  if (res) return <div className="space-y-5"><h1 className="text-3xl font-bold">{t("Product Scanner", "प्रोडक्ट स्कैनर")}</h1><Result r={res} onReset={() => { setRes(null); setImg(null); setCode(""); }} /></div>;

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold">{t("Product Scanner", "प्रोडक्ट स्कैनर")}</h1>
      <div className="grid grid-cols-2 gap-2 rounded-2xl bg-muted p-1">
        {([["barcode", ScanBarcode, t("Barcode", "बारकोड")], ["photo", Camera, t("Label photo", "लेबल फोटो")]] as const).map(([k, I, l]) => (
          <button key={k} onClick={() => { setMode(k); setErr(null); }} className={cn("flex items-center justify-center gap-2 rounded-xl py-3 font-semibold", mode === k ? "bg-card shadow-sm" : "text-muted-foreground")}><I className="h-5 w-5" /> {l}</button>
        ))}
      </div>
      {mode === "barcode" ? (
        <div className="space-y-3">
          <PhotoPicker image={img} onPick={async (u, f) => {
            setImg(u); setErr(null);
            const c = await readBarcode(f);
            if (c) setCode(c); else setErr(t("No barcode found in the photo. Type the number below.", "फोटो में बारकोड नहीं मिला। नीचे नंबर लिखें।"));
          }} hint={t("Take a photo of the barcode", "बारकोड की फोटो लें")} />
          <input inputMode="numeric" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} placeholder={t("Or type barcode number", "या बारकोड नंबर लिखें")} className="w-full rounded-2xl border bg-card px-4 py-3 text-lg tracking-widest" />
        </div>
      ) : (
        <PhotoPicker image={img} onPick={(u) => { setImg(u); setErr(null); }} hint={t("Take a photo of the ingredients list", "सामग्री सूची की फोटो लें")} />
      )}
      {err && <p className="rounded-2xl bg-danger/10 p-4 text-danger">{err}</p>}
      <button onClick={run} disabled={loading || !canRun} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-soil py-4 text-lg font-semibold text-soil-foreground disabled:opacity-50">
        {loading ? <><Loader2 className="h-5 w-5 animate-spin" /> {t("Checking…", "जांच हो रही है…")}</> : t("Check product", "प्रोडक्ट जांचें")}
      </button>
    </div>
  );
}

function Result({ r, onReset }: { r: ProductResult; onReset: () => void }) {
  const { t } = useLang();
  const dot = { safe: "bg-safe", warn: "bg-warn", danger: "bg-danger" };
  const tone = r.score >= 70 ? "safe" : r.score >= 40 ? "warn" : "danger";
  const ring = { safe: "border-safe", warn: "border-warn", danger: "border-danger" }[tone];
  const txt = { safe: "text-safe", warn: "text-warn", danger: "text-danger" }[tone];
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-5 rounded-3xl bg-card p-5 shadow-sm">
        <div className={cn("grid h-24 w-24 shrink-0 place-items-center rounded-full border-8", ring)}><span className="font-display text-3xl font-bold">{Math.round(r.score)}</span></div>
        <div><p className="text-sm text-muted-foreground">{r.product}</p><h2 className={cn("text-2xl font-bold", txt)}>{r.verdict}</h2></div>
      </div>
      <div className="rounded-3xl border bg-card p-5">
        <h3 className="mb-3 text-lg font-bold">{t("What's inside (simple words)", "इसमें क्या है (आसान भाषा में)")}</h3>
        <ul className="space-y-3">{r.ingredients.map((i) => (
          <li key={i.name} className="flex gap-3"><span className={cn("mt-2 h-3 w-3 shrink-0 rounded-full", dot[i.level] ?? "bg-warn")} /><div><b>{i.name}</b><p className="text-sm text-muted-foreground">{i.simple}</p></div></li>
        ))}</ul>
      </div>
      {r.avoid.length > 0 && <div className="rounded-3xl border border-danger/30 bg-danger/5 p-5">
        <h3 className="mb-3 flex items-center gap-2 text-lg font-bold"><UserX className="h-5 w-5 text-danger" /> {t("Who should avoid", "किसे नहीं खाना चाहिए")}</h3>
        <div className="flex flex-wrap gap-2">{r.avoid.map((p) => <span key={p} className="rounded-full bg-card px-3 py-1 text-sm">{p}</span>)}</div>
      </div>}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border bg-card p-5"><h3 className="mb-2 flex items-center gap-2 font-bold"><ThumbsUp className="h-5 w-5 text-safe" /> {t("Benefits", "फायदे")}</h3><ul className="list-disc pl-5">{r.benefits.map((b) => <li key={b}>{b}</li>)}</ul></div>
        <div className="rounded-3xl border bg-card p-5"><h3 className="mb-2 flex items-center gap-2 font-bold"><ThumbsDown className="h-5 w-5 text-danger" /> {t("Harms", "नुकसान")}</h3><ul className="list-disc pl-5">{r.harms.map((b) => <li key={b}>{b}</li>)}</ul></div>
      </div>
      {r.alternatives.length > 0 && <div className="rounded-3xl bg-primary/10 p-5"><h3 className="mb-1 font-bold text-primary">{t("Healthier choices", "बेहतर विकल्प")}</h3><p>{r.alternatives.join(", ")}</p></div>}
      <button onClick={onReset} className="w-full rounded-2xl bg-primary py-4 font-semibold text-primary-foreground">{t("Scan another", "दूसरा स्कैन करें")}</button>
    </div>
  );
}
