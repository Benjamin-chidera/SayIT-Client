import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  const { text, language } = await req.json();

  if (!text || typeof text !== "string") {
    return NextResponse.json({ error: "Invalid text" }, { status: 400 });
  }

  // 1️⃣ Translate
  const translation = await client.responses.create({
    model: "gpt-5.2",
    input: `Translate the following text to ${language}:\n\n${text}.`,
    instructions:
      "Just provide the translated text without any additional commentary.",
  });

  // 2️⃣ Text → Speech
  const audio = await client.audio.speech.create({
    model: "gpt-4o-mini-tts",
    voice: "alloy",
    input: translation.output_text,
  });

  return new Response(audio.body, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "no-store",
    },
  });
}
