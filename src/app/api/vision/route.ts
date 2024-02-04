import { NextRequest, NextResponse } from 'next/server'
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID,
});

export async function POST(req: NextRequest) {
  const { base64, prompt } = await req.json()
  try {
    const completions = await openai.chat.completions.create({
      max_tokens: 1024,
      messages: [
        { role: "user",content: [
        {"type": "text", "text": prompt },
        {
          "type": "image_url",
          "image_url": {
            "url": `${base64}`,
          },
        },
        ]
    }
      ],
      model: "gpt-4-vision-preview",
    });
    return NextResponse.json(completions);
  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json(error);
  }
}
