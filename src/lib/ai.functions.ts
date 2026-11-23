import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { askJson, langRule } from "./ai.server";

const Lang = z.enum(["en", "hi"]);
const Img = z.string().startsWith("data:image/").max(8_000_000);

export type PlantResult = {
  isPlant: boolean; plant: string; healthy: boolean; disease: string; scientificName: string; confidence: number;
  symptoms: string[]; cause: string;
  medicines: { name: string; dose: string; howToUse: string }[];
  organic: string[]; prevention: string[];
};

export const diagnosePlant = createServerFn({ method: "POST" })
  .validator((d) => z.object({ image: Img, lang: Lang, crop: z.string().max(40).optional(), model: z.object({ label: z.string().max(120), confidence: z.number() }).optional() }).parse(d))
  .handler(async ({ data }) =>
    askJson<PlantResult>(
      `You are an expert Indian agronomist and plant pathologist (ICAR/KVK level). Identify the plant in the photo and diagnose any disease, pest or nutrient deficiency. Reason step by step from visible signs: lesion shape, colour, halo, concentric rings, powdery/downy growth, pustules, leaf curl, mosaic, chlorosis pattern (old vs new leaves), insects or webbing. Distinguish fungal, bacterial, viral, pest and deficiency causes. If the photo is blurry, too far or unclear, lower confidence honestly (below 50). Suggest medicines commonly sold in India with doses per litre of water. ${langRule(data.lang)}`,
      `Return JSON: {"isPlant":bool,"plant":string,"healthy":bool,"disease":string (or "Healthy"),"scientificName":string (pathogen, empty if healthy),"confidence":number 0-100,"symptoms":string[],"cause":string,"medicines":[{"name":string,"dose":string,"howToUse":string}],"organic":string[],"prevention":string[]}. If the image is not a plant set isPlant false.${data.crop ? ` The farmer says this crop is: ${data.crop}. Use this unless the photo clearly shows otherwise.` : ""}${data.model ? ` A specialist image model trained on 54,000 leaf photos (PlantVillage, 38 classes: apple, blueberry, cherry, corn, grape, orange, peach, bell pepper, potato, raspberry, soybean, squash, strawberry, tomato) predicts: "${data.model.label}" with ${data.model.confidence}% confidence. If the plant is one of those crops and the confidence is above 70, trust this diagnosis and use it as the disease name. Otherwise rely on your own analysis.` : ""}`,
      data.image,
    ));

export type Ingredient = { name: string; simple: string; level: "safe" | "warn" | "danger" };
export type ProductResult = {
  found: boolean; product: string; score: number; verdict: string;
  ingredients: Ingredient[]; avoid: string[]; benefits: string[]; harms: string[]; alternatives: string[];
};

const productPrompt = (lang: "en" | "hi") =>
  `You are a food safety and nutrition expert in India. Explain ingredients in very simple words, flag who should avoid the product (diabetics, children, pregnant women, allergies, heart patients, etc.). Score 0-100 (100 = very healthy). ${langRule(lang)}`;
const productShape = `Return JSON: {"found":bool,"product":string,"score":number,"verdict":string (short),"ingredients":[{"name":string,"simple":string,"level":"safe"|"warn"|"danger"}],"avoid":string[],"benefits":string[],"harms":string[],"alternatives":string[]}.`;

export const scanLabel = createServerFn({ method: "POST" })
  .validator((d) => z.object({ image: Img, lang: Lang }).parse(d))
  .handler(async ({ data }) =>
    askJson<ProductResult>(productPrompt(data.lang), `Read the product label / ingredients in this photo. ${productShape} If no ingredients are readable set found false.`, data.image));

export const scanBarcode = createServerFn({ method: "POST" })
  .validator((d) => z.object({ code: z.string().regex(/^\d{6,14}$/), lang: Lang }).parse(d))
  .handler(async ({ data }) => {
    const r = await fetch(`https://world.openfoodfacts.org/api/v2/product/${data.code}.json?fields=product_name,brands,ingredients_text,ingredients_text_en,nutriments,allergens_tags,quantity`, { headers: { "User-Agent": "URDIP/1.0" } });
    const j = (await r.json().catch(() => null)) as { status?: number; product?: Record<string, unknown> } | null;
    if (!j || j.status !== 1 || !j.product) return { found: false } as ProductResult;
    return askJson<ProductResult>(productPrompt(data.lang), `Product data from Open Food Facts: ${JSON.stringify(j.product).slice(0, 6000)}. ${productShape}`);
  });

export type Scheme = { name: string; benefit: string; why: string; site: string; helpline: string; docs: string[]; steps: string[] };
export type SchemeResult = { schemes: Scheme[]; pensions: Scheme[]; scholarships: Scheme[] };

export const matchSchemes = createServerFn({ method: "POST" })
  .validator((d) => z.object({ profile: z.record(z.string(), z.string().max(100)), lang: Lang }).parse(d))
  .handler(async ({ data }) =>
    askJson<SchemeResult>(
      `You are an expert on Indian central and state government welfare schemes. Only list real, currently active schemes the person is likely eligible for, with official .gov.in / .nic.in websites and real helpline numbers. ${langRule(data.lang)}`,
      `Person profile: ${JSON.stringify(data.profile)}. Return JSON: {"schemes":Scheme[],"pensions":Scheme[],"scholarships":Scheme[]} where Scheme = {"name":string,"benefit":string,"why":string (why they qualify),"site":string (url),"helpline":string,"docs":string[],"steps":string[] (how to apply)}. Give 2-6 schemes, 0-4 pensions, 0-4 scholarships; empty array if none fit.`,
    ));
