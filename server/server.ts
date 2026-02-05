import "dotenv/config";
import express from "express";
import cors from "cors";
import { z } from "zod";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const bodySchema = z.object({
  input: z
    .string()
    .transform((s) => s.trim())
    .refine((s) => s.length >= 10, {
      message: "Input is too short. Please add more detail.",
    })
    .refine((s) => /[A-Za-zА-Яа-яІіЇїЄє]/.test(s), {
      message: "Please describe your goal using words, not only symbols.",
    }),
  mode: z.enum(["fast", "deep"]).default("fast"),
  tone: z.enum(["strict", "soft"]).default("strict"),
  includeTime: z.boolean().default(true),
});

const planSchema = z.object({
  title: z.string(),
  steps: z
    .array(
      z.object({
        title: z.string(),
        details: z.string().optional(),
        eta: z.string().optional(),
      }),
    )
    .min(3)
    .max(6),
  firstAction: z.string(),
});

app.get("/", (_req, res) => res.json({ ok: true }));

app.post("/api/plan", async (req, res) => {
  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) {
  const msg =
    parsed.error.issues?.[0]?.message ?? "Invalid request";
  return res.status(400).json({ error: "Invalid request", message: msg });
}

  const { input, mode, tone, includeTime } = parsed.data;

  const instructions = `
You are an assistant that turns messy user thoughts into a short actionable plan.
Return ONLY valid JSON that matches this shape:
{
  "title": string,
  "steps": [{"title": string, "details"?: string, "eta"?: string}],
  "firstAction": string
}

Rules:
- 3 to 5 steps max
- Each step must be concrete and doable
- No philosophy, no long explanations
- firstAction must be a 10-minute action
- ${includeTime ? 'Include "eta" for each step (like "5 min", "15 min").' : 'Do NOT include "eta".'}
- Tone: ${tone} (strict = direct, no fluff; soft = supportive but still concrete)
- Depth: ${mode} (fast = concise; deep = a bit more detailed in "details" but still short)
`;

  try {
    // Responses API (recommended for new projects)
    const response = await client.responses.create({
      model: "gpt-5",
      reasoning: { effort: "low" },
      instructions,
      input,
    }); // :contentReference[oaicite:1]{index=1}

    // Extract text output
    const text = (response.output_text && response.output_text.trim()) || "";

    // Parse JSON safely
    let json: unknown;
    try {
      json = JSON.parse(text);
    } catch {
      return res.status(502).json({
        error: "Model returned non-JSON output",
        raw: text.slice(0, 1000),
      });
    }

    const planParsed = planSchema.safeParse(json);
    if (!planParsed.success) {
      return res.status(502).json({
        error: "Model returned JSON with wrong schema",
        details: planParsed.error.flatten(),
        raw: json,
      });
    }

    return res.json(planParsed.data);
  } catch (err: any) {
    return res.status(500).json({
      error: "Server error",
      message: err?.message ?? String(err),
    });
  }
});

const port = Number(process.env.PORT || 5001);
app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
