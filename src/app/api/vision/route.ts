import { NextRequest, NextResponse } from 'next/server'
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY?.trim(),
  organization: process.env.OPENAI_ORG_ID?.trim(),
});

export async function POST(req: NextRequest) {
  const prompt = `
  Return a short visual description in the key 'short_visual_description', 
  and a more detailed description in the key 'short_visual_description' 
  and their position in the key 'position' as laid out in the following example JSON response:

  {
    "people" : 
    [
      {"short_visual_description": "Wears glasses", 
      "long_visual_description": "The persons shirt is pink. Has light skin color.", 
      "position":"Upper right"},
      {"short_visual_description": "Balck hair", "long_visual_description": "The persons shirt is pink. Has light skin color.", "position":"Upper right"}
    ]
  }
`

  const { base64 } = await req.json()
  try {
    const completions = await openai.chat.completions.create({      
      max_tokens:2000,
      messages: [
         {
          role: "user", content: [
            { "type": "text", "text": prompt },
            {
              "type": "image_url",
              "image_url": {
                "url": `${base64}`,
              },
            },
          ]
        }
      ],
      model:"gpt-4-vision-preview",

    });

    const jsonTxt=  completions.choices[0].message.content;

    console.log(jsonTxt);

    const srippedJson = jsonTxt?.replace('```json', '').replace('```','');


    const completionsRoast = await openai.chat.completions.create({
      response_format:{type:'json_object'},
      model: 'gpt-3.5-turbo-0125',
      messages: [
        {
          role: "system",
          content: "You are a commedian in the style of an insult comic."
        },
        {
          role: 'assistant',
          content: `For each Person in the array of 'people' populate the response as:

          {
            "people":
            [
              {
                "short_visual_description": "same value from the input",
                "joke": "a spicy insult based on the 'long_visual_description' from the input",
                "position": "the same value from the input",
                "nickname": "a nickname no greater than 3 words based on the spicy insult in the 'joke' field"
              }
            ]
          }

          Input json:

          ${srippedJson}
          `
        }
      ],
    });

    const jokes = JSON.parse(completionsRoast.choices[0].message.content!)
    console.log(jokes);


    return NextResponse.json(jokes);
  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json(error);
  }
}
