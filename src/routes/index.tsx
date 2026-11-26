import { createFileRoute } from "@tanstack/react-router";
import { Leaf } from "lucide-react";
import { useLang } from "@/lib/i18n";
import urdipMark from "@/assets/urdip-mark.png.asset.json";

const TEAM = [
  { reg: "24BEY10038", name: "Aman Panday" },
  { reg: "24MIP10143", name: "Somya Tiwari" },
  { reg: "24BCE10080", name: "Pranav Kumar" },
  { reg: "24BEY10178", name: "Himesh Jham" },
  { reg: "24BCE11394", name: "Aarshi Jaiswal" },
  { reg: "24MIM10067", name: "Suhana Bisht" },
] as const;

const WORDMARK = ["U", "R", "D", "I", "P"];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "URDIP — Plant Doctor, Schemes & Food Safety" },
      {
        name: "description",
        content:
          "URDIP is a student-built app: diagnose crop disease from a photo, find government schemes you qualify for, and check whether a food product is safe.",
      },
      { property: "og:title", content: "URDIP — Plant Doctor, Schemes & Food Safety" },
      {
        property: "og:description",
        content: "Built by a six-member student team under Dr. Velmurugan.",
      },
    ],
  }),
  component: Index,
});

export function Index() {
  const { t } = useLang();

  return (
    <div className="space-y-5">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border bg-card px-5 py-12 text-center shadow-sm md:py-16">
        <div
          className="anim-spin-slow urdip-rays pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2"
          aria-hidden
        />
        <div
          className="anim-glow pointer-events-none absolute left-1/2 top-0 h-56 w-56 rounded-full"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklab, var(--accent) 75%, transparent), transparent 70%)",
          }}
          aria-hidden
        />
        <Leaf className="anim-float pointer-events-none absolute left-5 top-12 h-9 w-9 text-primary/20" aria-hidden />
        <Leaf
          className="anim-float pointer-events-none absolute right-6 top-24 h-7 w-7 text-primary/15"
          style={{ animationDelay: "1.4s" }}
          aria-hidden
        />
        <Leaf
          className="anim-float pointer-events-none absolute bottom-10 left-10 h-6 w-6 text-accent-foreground/20"
          style={{ animationDelay: "2.6s" }}
          aria-hidden
        />
        <Leaf
          className="anim-float pointer-events-none absolute bottom-16 right-12 h-8 w-8 text-primary/15"
          style={{ animationDelay: "0.7s" }}
          aria-hidden
        />

        <div className="relative">
          <img
            src={urdipMark.url}
            alt="URDIP logo: hands holding a sprout under the sun"
            className="anim-pop mx-auto h-24 w-24 object-contain md:h-28 md:w-28"
          />

          <h1 className="mt-4 font-display text-6xl font-bold tracking-tight md:text-8xl">
            {WORDMARK.map((letter, i) => (
              <span
                key={letter + i}
                className="anim-rise inline-block"
                style={{ animationDelay: `${0.3 + i * 0.1}s` }}
              >
                {letter}
              </span>
            ))}
          </h1>

          <div
            className="anim-grow mx-auto mt-5 h-px w-44 bg-gradient-to-r from-transparent via-primary to-transparent"
            aria-hidden
          />

          <p
            className="anim-rise mx-auto mt-5 max-w-md text-base text-muted-foreground md:text-lg"
            style={{ animationDelay: "0.85s" }}
          >
            {t(
              "A plant doctor, a government scheme finder and a food safety scanner — in one app for every Indian home.",
              "पौधा डॉक्टर, सरकारī योजनā खोजक और खाने कī सुरक्षा स्कैनर — भāरत के हर घर के लिए एक ऐप में।",
            )}
          </p>
        </div>
      </section>

      {/* Supervisor */}
      <section
        className="anim-rise rounded-3xl border bg-card p-5 shadow-sm"
        style={{ animationDelay: "1s" }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {t("Project Supervisor", "प्रोजेक्ट पर्यवेक्षक")}
        </p>
        <p className="mt-1 font-display text-2xl font-bold">Dr. Velmurugan</p>
      </section>

      {/* Team */}
      <section
        className="anim-rise rounded-3xl border bg-card p-5 shadow-sm"
        style={{ animationDelay: "1.15s" }}
      >
        <h2 className="mb-3 flex items-center gap-2 text-lg font-bold">
          <Leaf className="h-5 w-5 text-primary" />
          {t("Built by", "बनाने वāलī टीम")}
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {TEAM.map((member, i) => (
            <li
              key={member.reg}
              className="anim-rise flex items-center gap-3 rounded-2xl border bg-background p-3 transition-transform hover:-translate-y-0.5"
              style={{ animationDelay: `${1.25 + i * 0.1}s` }}
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary/10 font-display text-sm font-bold text-primary">
                {initials(member.name)}
              </span>
              <span className="min-w-0">
                <span className="block truncate font-semibold">{member.name}</span>
                <span className="block text-sm text-muted-foreground">{member.reg}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <p
        className="anim-fade pt-1 text-center text-sm text-muted-foreground"
        style={{ animationDelay: "2s" }}
      >
        {t("A student innovation project · 2026", "एक छाव-नवāचāर परियोजनā · 2026")}
      </p>
    </div>
  );
}
