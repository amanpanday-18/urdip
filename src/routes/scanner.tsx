import { createFileRoute } from "@tanstack/react-router";
import { Camera, Loader2, ScanBarcode, ThumbsDown, ThumbsUp, UserX } from "lucide-react";
import { useState } from "react";
import { PhotoPicker } from "@/components/PhotoPicker";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/scanner")({
  head: () => ({
    meta: [
      { title: "Product Safety Scanner — Kisan Mitra" },
      { name: "description", content: "Scan a barcode or ingredient label to understand ingredients, who should avoid it, and its benefits and harms." },
      { property: "og:title", content: "Product Safety Scanner — Kisan Mitra" },
      { property: "og:description", content: "Know what is in your food in simple words." },
    ],
  }),
  component: Scanner,
});

const ingredients = [
  { name: "Refined wheat flour (Maida)", simple: "Polished flour with little fibre", level: "warn" },
  { name: "Sugar", simple: "Adds sweetness; too much raises blood sugar", level: "danger" },
  { name: "Palm oil", simple: "Cheap fat high in saturated fat", level: "danger" },
  { name: "Milk solids", simple: "Dried milk, gives protein and calcium", level: "safe" },
  { name: "E503 (Raising agent)", simple: "Makes biscuits fluffy; safe in small amounts", level: "warn" },
] as const;

function Scanner() {
  const { t } = useLang();
  const [mode, setMode] = useState<"barcode" | "photo">("barcode");
  const [img, setImg] = useState<string | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const run = () => { setState("loading"); setTimeout(() => setState("done"), 1300); };
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold">{t("Product Scanner", "प्रोडक्ट स्कैनर")}</h1>
      <div className="grid grid-cols-2 gap-2 rounded-2xl bg-muted p-1">
        {([["barcode", ScanBarcode, t("Barcode", "बारकोड")], ["photo", Camera, t("Label photo", "लेबल फोटो")]] as const).map(([k, I, l]) => (
          <button key={k} onClick={() => { setMode(k); setState("idle"); }} className={cn("flex items-center justify-center gap-2 rounded-xl py-3 font-semibold", mode === k ? "bg-card shadow-sm" : "text-muted-foreground")}><I className="h-5 w-5" /> {l}</button>
        ))}
      </div>
      {state !== "done" && (mode === "barcode" ? (
        <div className="rounded-3xl bg-foreground/90 p-6 text-center">
          <div className="relative mx-auto aspect-[4/3] max-w-sm rounded-2xl border-4 border-accent">
            <div className="absolute inset-x-4 top-1/2 h-0.5 animate-pulse bg-danger" />
            <ScanBarcode className="absolute inset-0 m-auto h-20 w-20 text-background/50" />
          </div>
          <p className="mt-4 text-background/80">{t("Point the camera at the barcode", "कैमरे को बारकोड पर रखें")}</p>
        </div>
      ) : (
        <PhotoPicker image={img} onPick={setImg} hint={t("Take a photo of the ingredients list", "सामग्री सूची की फोटो लें")} />
      ))}
      {state !== "done" && (
        <button onClick={run} disabled={state === "loading"} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-soil py-4 text-lg font-semibold text-soil-foreground">
          {state === "loading" ? <><Loader2 className="h-5 w-5 animate-spin" /> {t("Checking…", "जांच हो रही है…")}</> : t("Try sample scan", "नमूना स्कैन करें")}
        </button>
      )}
      {state === "done" && <Result onReset={() => setState("idle")} />}
    </div>
  );
}

function Result({ onReset }: { onReset: () => void }) {
  const { t } = useLang();
  const dot = { safe: "bg-safe", warn: "bg-warn", danger: "bg-danger" };
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-5 rounded-3xl bg-card p-5 shadow-sm">
        <div className="grid h-24 w-24 shrink-0 place-items-center rounded-full border-8 border-warn">
          <span className="font-display text-3xl font-bold">42</span>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Cream Biscuits · 100g</p>
          <h2 className="text-2xl font-bold text-warn">{t("Moderate — eat occasionally", "मध्यम — कभी-कभी खाएं")}</h2>
        </div>
      </div>
      <div className="rounded-3xl border bg-card p-5">
        <h3 className="mb-3 text-lg font-bold">{t("What's inside (simple words)", "इसमें क्या है (आसान भाषा में)")}</h3>
        <ul className="space-y-3">{ingredients.map((i) => (
          <li key={i.name} className="flex gap-3"><span className={cn("mt-2 h-3 w-3 shrink-0 rounded-full", dot[i.level])} /><div><b>{i.name}</b><p className="text-sm text-muted-foreground">{i.simple}</p></div></li>
        ))}</ul>
      </div>
      <div className="rounded-3xl border border-danger/30 bg-danger/5 p-5">
        <h3 className="mb-3 flex items-center gap-2 text-lg font-bold"><UserX className="h-5 w-5 text-danger" /> {t("Who should avoid", "किसे नहीं खाना चाहिए")}</h3>
        <div className="flex flex-wrap gap-2">{["Diabetics", "Heart patients", "Gluten allergy", "Young children (in excess)"].map((p) => <span key={p} className="rounded-full bg-card px-3 py-1 text-sm">{p}</span>)}</div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border bg-card p-5"><h3 className="mb-2 flex items-center gap-2 font-bold"><ThumbsUp className="h-5 w-5 text-safe" /> {t("Benefits", "फायदे")}</h3><ul className="list-disc pl-5"><li>Quick energy</li><li>Some calcium from milk</li></ul></div>
        <div className="rounded-3xl border bg-card p-5"><h3 className="mb-2 flex items-center gap-2 font-bold"><ThumbsDown className="h-5 w-5 text-danger" /> {t("Harms", "नुकसान")}</h3><ul className="list-disc pl-5"><li>High sugar (28g/100g)</li><li>Saturated fat from palm oil</li><li>Low fibre</li></ul></div>
      </div>
      <div className="rounded-3xl bg-primary/10 p-5"><h3 className="mb-1 font-bold text-primary">{t("Healthier choices", "बेहतर विकल्प")}</h3><p>Roasted chana, ragi biscuits, fruits</p></div>
      <button onClick={onReset} className="w-full rounded-2xl bg-primary py-4 font-semibold text-primary-foreground">{t("Scan another", "दूसरा स्कैन करें")}</button>
      <p className="text-center text-xs text-muted-foreground">{t("Sample result — real scanning coming next.", "नमूना परिणाम — असली स्कैनिंग जल्द आ रही है।")}</p>
    </div>
  );
}
