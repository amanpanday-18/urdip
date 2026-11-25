import modelAsset from "@/assets/urdip_plant_v2.onnx.asset.json";
import classes from "./plant-classes.json";

type Ort = typeof import("onnxruntime-web");
let sessionP: Promise<{ ort: Ort; s: import("onnxruntime-web").InferenceSession }> | null = null;

function load() {
  if (!sessionP) {
    sessionP = (async () => {
      const ort = await import("onnxruntime-web");
      ort.env.wasm.wasmPaths = "https://cdn.jsdelivr.net/npm/onnxruntime-web@" + ort.env.versions.web + "/dist/";
      const s = await ort.InferenceSession.create(modelAsset.url, { executionProviders: ["wasm"] });
      return { ort, s };
    })().catch((e) => { sessionP = null; throw e; });
  }
  return sessionP;
}

export const preloadPlantModel = () => { load().catch(() => {}); };

/** Runs the trained 90-class model on a data URL. Returns readable label + confidence %. */
export async function classifyPlant(dataUrl: string): Promise<{ label: string; confidence: number }> {
  const { ort, s } = await load();
  const img = new Image();
  img.src = dataUrl;
  await img.decode();
  const N = 224;
  const c = document.createElement("canvas");
  c.width = N; c.height = N;
  const ctx = c.getContext("2d")!;
  // resize shorter side to 256 then center crop 224 approximation: scale to cover
  const sc = Math.max(N / img.width, N / img.height);
  const w = img.width * sc, h = img.height * sc;
  ctx.drawImage(img, (N - w) / 2, (N - h) / 2, w, h);
  const px = ctx.getImageData(0, 0, N, N).data;
  const mean = [0.485, 0.456, 0.406], std = [0.229, 0.224, 0.225];
  const f = new Float32Array(3 * N * N);
  for (let i = 0; i < N * N; i++) for (let k = 0; k < 3; k++) f[k * N * N + i] = (px[i * 4 + k]! / 255 - mean[k]!) / std[k]!;
  const out = await s.run({ [s.inputNames[0]!]: new ort.Tensor("float32", f, [1, 3, N, N]) });
  const logits = out[s.outputNames[0]!]!.data as Float32Array;
  const mx = Math.max(...logits);
  const ex = Array.from(logits, (v) => Math.exp(v - mx));
  const sum = ex.reduce((a, b) => a + b, 0);
  let best = 0;
  ex.forEach((v, i) => { if (v > ex[best]!) best = i; });
  const raw = (classes as string[])[best] ?? "Unknown";
  const [plant, dis] = raw.split("___");
  const label = `${(plant ?? "").replace(/_/g, " ")} - ${(dis ?? "").replace(/_/g, " ").trim()}`;
  return { label, confidence: Math.round((ex[best]! / sum) * 1000) / 10 };
}
