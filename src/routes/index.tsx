import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Landmark, Leaf, ScanBarcode } from "lucide-react";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kisan Mitra — Farm, Schemes & Food Safety" },
      { name: "description", content: "Diagnose plant diseases, find government schemes you qualify for, and check if food products are safe." },
      { property: "og:title", content: "Kisan Mitra — Farm, Schemes & Food Safety" },
      { property: "og:description", content: "Plant doctor, scheme finder and product safety scanner in one app." },
    ],
  }),
  component: Index,
});

function Index() {
  const { t } = useLang();
  const cards = [
    { to: "/agro", icon: Leaf, cls: "bg-primary text-primary-foreground", title: t("Plant Doctor", "पौधा डॉक्टर"), desc: t("Photo of a sick plant → disease & medicine", "बीमार पौधे की फोटो → रोग और दवा") },
    { to: "/schemes", icon: Landmark, cls: "bg-accent text-accent-foreground", title: t("Government Schemes", "सरकारी योजनाएं"), desc: t("Schemes, pensions & scholarships for you", "आपके लिए योजनाएं, पेंशन और छात्रवृत्ति") },
    { to: "/scanner", icon: ScanBarcode, cls: "bg-soil text-soil-foreground", title: t("Product Scanner", "प्रोडक्ट स्कैनर"), desc: t("Is this food safe for you?", "क्या यह खाना आपके लिए सुरक्षित है?") },
  ] as const;
  return (
    <div className="space-y-6">
      <section>
        <p className="text-muted-foreground">{t("Namaste 🙏", "नमस्ते 🙏")}</p>
        <h1 className="text-3xl font-bold md:text-4xl">{t("How can we help you today?", "आज हम आपकी क्या मदद करें?")}</h1>
      </section>
      <div className="grid gap-4">
        {cards.map((c) => (
          <Link key={c.to} to={c.to} className={`group flex items-center gap-4 rounded-3xl p-5 shadow-sm transition-transform hover:-translate-y-0.5 ${c.cls}`}>
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-background/20"><c.icon className="h-8 w-8" /></span>
            <span className="flex-1">
              <span className="block font-display text-xl font-bold">{c.title}</span>
              <span className="block opacity-90">{c.desc}</span>
            </span>
            <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
          </Link>
        ))}
      </div>
      <section className="rounded-3xl border bg-card p-5">
        <h2 className="mb-3 text-lg font-bold">{t("Recent activity", "हाल की गतिविधि")}</h2>
        <ul className="divide-y">
          <li className="flex justify-between py-2"><span>🍅 {t("Tomato — Early Blight", "टमाटर — अगेती झुलसा")}</span><span className="text-sm text-muted-foreground">2d</span></li>
          <li className="flex justify-between py-2"><span>🍪 {t("Biscuit — Moderate", "बिस्कुट — मध्यम")}</span><span className="text-sm text-muted-foreground">4d</span></li>
          <li className="flex justify-between py-2"><span>🏛️ {t("6 schemes matched", "6 योजनाएं मिलीं")}</span><span className="text-sm text-muted-foreground">1w</span></li>
        </ul>
      </section>
    </div>
  );
}
