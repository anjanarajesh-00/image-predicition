// ── Anthropic API ────────────────────────────────────────────

function buildSystemPrompt(customInstruction = '') {
  return `You are an image analysis API. Analyze the provided image and return ONLY a JSON object with no markdown, no backticks, no preamble. The JSON must have:
- "labels": array of objects with "label" (string) and "confidence" (0.0–1.0 float). Include 5–8 relevant labels.
- "description": a 2–3 sentence natural language description of the image.
- "meta": object with useful image attributes as key-value strings. Always include "dominant_colors" (comma-separated color names), "scene_type" (e.g. indoor, outdoor, abstract), and "image_style" (e.g. photograph, illustration, screenshot). Add more if relevant.
${customInstruction ? `\nAdditional instruction: ${customInstruction}` : ''}
Return ONLY the JSON object. No surrounding text.`;
}

async function callPredictionAPI({ apiKey, base64, mimeType, customInstruction }) {
  const response = await fetch(CONFIG.API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': CONFIG.ANTHROPIC_VERSION,
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: CONFIG.MODEL,
      max_tokens: CONFIG.MAX_TOKENS,
      system: buildSystemPrompt(customInstruction),
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: mimeType, data: base64 },
          },
          {
            type: 'text',
            text: 'Analyze this image and return the JSON object.',
          },
        ],
      }],
    }),
  });

  const raw = await response.json();

  if (raw.error) {
    throw new Error(raw.error.message || 'API returned an error');
  }

  const text = (raw.content || [])
    .filter(b => b.type === 'text')
    .map(b => b.text)
    .join('');

  const clean = text.replace(/```json|```/g, '').trim();

  try {
    return JSON.parse(clean);
  } catch {
    throw new Error('Could not parse API response as JSON. Raw: ' + clean.slice(0, 300));
  }
}
