import { generateChatCompletion, GatewayError } from "@lovable.dev/ai-gateway";

type Part = { type: "text"; text: string } | { type: "image_url"; image_url: { url: string } };

export async function askJson<T>(system: string, user: string, image?: string): Promise<T> {
  const content: Part[] = [{ type: "text", text: user }];
  if (image) content.push({ type: "image_url", image_url: { url: image } });
  try {
    const res = await generateChatCompletion({
      model: "openai/gpt-6-astra",
      messages: [
        { role: "system", content: system + "\nReply ONLY with valid JSON matching the requested shape." },
        { role: "user", content },
      ],
      response_format: { type: "json_object" },
    });
    const text = res.choices?.[0]?.message?.content;
    if (typeof text !== "string") throw new Error("Empty AI reply");
    return JSON.parse(text) as T;
  } catch (e) {
    if (e instanceof GatewayError) {
      console.error("AI gateway error", e.code, e.httpStatus);
      if (e.httpStatus === 429) throw new Error("Too many requests right now. Please try again in a minute.");
      if (e.httpStatus === 402) throw new Error("AI credits have run out. Please add credits to continue.");
    }
    console.error(e);
    throw new Error("The AI could not read this. Please try again with a clearer photo.");
  }
}

export const langRule = (lang: "en" | "hi") =>
  lang === "hi" ? "Write all human-readable text values in simple Hindi (Devanagari). Keep medicine/chemical names in English." : "Write all text in simple English for rural users.";
