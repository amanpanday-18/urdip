import { Camera, ImagePlus } from "lucide-react";
import { useRef } from "react";
import { useLang } from "@/lib/i18n";
import { fileToDataUrl } from "@/lib/image";

export function PhotoPicker({ image, onPick, hint }: { image: string | null; onPick: (url: string, file: File) => void; hint: string }) {
  const cam = useRef<HTMLInputElement>(null);
  const gal = useRef<HTMLInputElement>(null);
  const { t } = useLang();
  const handle = async (f?: File) => { if (f) onPick(await fileToDataUrl(f), f); };
  return (
    <div className="rounded-3xl border-2 border-dashed border-primary/40 bg-card p-5 text-center">
      {image ? <img src={image} alt="Selected" className="mx-auto mb-4 max-h-64 rounded-2xl object-cover" />
        : <div className="mx-auto mb-4 grid h-28 w-28 place-items-center rounded-full bg-primary/10"><Camera className="h-12 w-12 text-primary" /></div>}
      <p className="mb-4 text-muted-foreground">{hint}</p>
      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => cam.current?.click()} className="flex items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-lg font-semibold text-primary-foreground">
          <Camera className="h-5 w-5" /> {t("Camera", "कैमरा")}
        </button>
        <button onClick={() => gal.current?.click()} className="flex items-center justify-center gap-2 rounded-2xl bg-secondary py-4 text-lg font-semibold text-secondary-foreground">
          <ImagePlus className="h-5 w-5" /> {t("Gallery", "गैलरी")}
        </button>
      </div>
      <input ref={cam} type="file" accept="image/*" capture="environment" hidden onChange={(e) => handle(e.target.files?.[0])} />
      <input ref={gal} type="file" accept="image/*" hidden onChange={(e) => handle(e.target.files?.[0])} />
    </div>
  );
}
