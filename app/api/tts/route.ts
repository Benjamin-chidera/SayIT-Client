import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  const { text, language, gender } = await req.json();

  if (!text || typeof text !== "string") {
    return NextResponse.json({ error: "Invalid text" }, { status: 400 });
  }

  // 1️⃣ Translate
  // const translation = await client.responses.create({
  //   model: "gpt-5.2",
  //   input: `Translate the following text to ${language}:\n\n${text}.`,
  //   instructions:
  //     "Just provide the translated text without any additional commentary.",
  // });

  const translation = await client.responses.create({
    model: "gpt-5.2",
    input: [
      {
        role: "system",
        content: `You are a translation engine. 
        Translate the user text EXACTLY into ${language}. 
        Do not paraphrase, correct, add, or remove words.
        Preserve names, casing, punctuation, and very short text exactly.
        If the text is already in ${language}, return it unchanged.`,
      },
      {
        role: "user",
        content: text,
      },
    ],
    
    temperature: 0,
    max_output_tokens: 100,
  });

  console.log("translation: ", translation, "gendeer: ", gender);
  

  // 2️⃣ Text → Speech
  const audio = await client.audio.speech.create({
    model: "gpt-4o-mini-tts",
    voice: gender === "female" ? "coral" : "ash",
    input: translation.output_text,
  });

  return new Response(audio.body, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "no-store",
    },
  });
}
