const OPENAI_KEY = import.meta.env.VITE_OPENAI_KEY;
const BASE = "https://api.openai.com/v1";

const openaiHeaders = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${OPENAI_KEY}`,
};


const chatComplete = async (systemPrompt, userMessage, model = "gpt-4o-mini") => {
  const res = await fetch(`${BASE}/chat/completions`, {
    method: "POST",
    headers: openaiHeaders,
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user",   content: userMessage },
      ],
      max_tokens: 300,
    }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || "OpenAI API error");
  }
  const data = await res.json();
  return data.choices[0].message.content.trim();
};

export const getEnhancedPrompt = async (input) => {
  try {
    const result = await chatComplete(
      "You are an expert prompt engineer. Transform the user's simple idea into a vivid 50-word image prompt that includes: subject, artistic style, lighting, camera angle, and mood. Return only the enhanced prompt, no extra commentary.",
      input
    );
    return { result, error: null };
  } catch (err) {
    console.error("getEnhancedPrompt:", err);
    return { result: null, error: err.message };
  }
};

export const generateImage = async (prompt) => {
  try {
    const res = await fetch(`${BASE}/images/generations`, {
      method: "POST",
      headers: openaiHeaders,
      body: JSON.stringify({
        model: "dall-e-3",
        prompt,
        n: 1,
        size: "1024x1024",
      }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error?.message || "DALL-E 3 API error");
    }
    const data = await res.json();
    return { result: data.data[0].url, error: null };
  } catch (err) {
    console.error("generateImage:", err);
    return { result: null, error: err.message };
  }
};

export const analyzeImage = async (base64DataUrl) => {
  try {
    const mimeType = base64DataUrl.split(";")[0].replace("data:", "");
    const base64   = base64DataUrl.split(",")[1];

    const res = await fetch(`${BASE}/chat/completions`, {
      method: "POST",
      headers: openaiHeaders,
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: `data:${mimeType};base64,${base64}` },
            },
            {
              type: "text",
              text: `Analyze this image and return ONLY a valid JSON object with exactly these keys (no markdown, no explanation):
{
  "mainSubject": "...",
  "colorPalette": ["color1", "color2", "color3"],
  "artisticStyle": "...",
  "lighting": "...",
  "mood": "..."
}`,
            },
          ],
        }],
        max_tokens: 300,
      }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error?.message || "GPT-4o vision API error");
    }
    const data    = await res.json();
    const raw     = data.choices[0].message.content.trim();
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const parsed  = JSON.parse(cleaned);
    return { result: parsed, error: null };
  } catch (err) {
    console.error("analyzeImage:", err);
    return { result: null, error: err.message };
  }
};

export const generateVariation = async (analysis) => {
  const { mainSubject, colorPalette, artisticStyle, lighting, mood } = analysis;
  const variationPrompt =
    `${mainSubject}, rendered in ${artisticStyle} style. ` +
    `Color palette: ${colorPalette.join(", ")}. ` +
    `Lighting: ${lighting}. Mood: ${mood}. ` +
    `Ultra-detailed, professional photography, cinematic composition.`;
  return generateImage(variationPrompt);
};