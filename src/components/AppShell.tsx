import { Link } from "@tanstack/react-router";
import { Home, Leaf, Landmark, ScanBarcode } from "lucide-react";
import type { ReactNode } from "react";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import urdipMark from "@/assets/urdip-mark.png.asset.json";

export function AppShell({ children }: { children: ReactNode }) {
  const { lang, setLang, t } = useLang();
  const nav = [
    { to: "/", label: t("Home", "होम"), icon: Home },
    { to: "/agro", label: t("Agro", "कृषि"), icon: Leaf },
    { to: "/schemes", label: t("Schemes", "योजनाएं"), icon: Landmark },
    { to: "/scanner", label: t("Scanner", "स्कैनर"), icon: ScanBarcode },
  ] as const;
  return (
    <div className="min-h-screen md:flex">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col gap-2 border-r bg-sidebar p-5 md:flex">
        <Brand />
        <nav className="mt-6 flex flex-col gap-1">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} activeOptions={{ exact: n.to === "/" }}
              className="flex items-center gap-3 rounded-xl px-4 py-3 font-medium text-sidebar-foreground hover:bg-sidebar-accent"
              activeProps={{ className: "bg-primary text-primary-foreground hover:bg-primary" }}>
              <n.icon className="h-5 w-5" /> {n.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b bg-background/90 px-4 py-3 backdrop-blur">
          <div className="md:invisible"><Brand /></div>
          <div className="flex rounded-full border bg-card p-1 text-sm font-semibold">
            {(["en", "hi"] as const).map((l) => (
              <button key={l} onClick={() => setLang(l)}
                className={cn("rounded-full px-3 py-1", lang === l ? "bg-primary text-primary-foreground" : "text-muted-foreground")}>
                {l === "en" ? "EN" : "हिं"}
              </button>
            ))}
          </div>
        </header>
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-28 pt-5 md:pb-10">{children}</main>
      </div>
      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t bg-card md:hidden">
        {nav.map((n) => (
          <Link key={n.to} to={n.to} activeOptions={{ exact: n.to === "/" }}
            className="flex flex-col items-center gap-1 py-2.5 text-xs font-medium text-muted-foreground"
            activeProps={{ className: "text-primary" }}>
            <n.icon className="h-6 w-6" /> {n.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <img
        src={urdipMark.url}
        alt="URDIP logo: hands holding a sprout under the sun"
        className="h-10 w-10 shrink-0 object-contain"
      />
      <span className="font-display text-xl font-bold">URDIP</span>
    </Link>
  );
}
