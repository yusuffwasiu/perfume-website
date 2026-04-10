module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { messages } = req.body;

  const CATALOG = `
  PERFUMES WE SELL:
  - Bloom Noir | Floral Oriental | Rose, oud, musk | $120
  - Sea Drift | Fresh Aquatic | Citrus, sea salt, cedar | $95
  - Velvet Ember | Warm Woody | Vanilla, sandalwood, amber | $140
  - Garden Reverie | Green Floral | Peony, green tea, musk | $85
  - Midnight Oud | Dark Oriental | Oud, leather, incense | $200
  - Citrus Matin | Fresh Citrus | Bergamot, lemon, vetiver | $75
  `;

  const SYSTEM = `You are a warm, knowledgeable perfume advisor for our boutique.
  Ask 2-3 questions about the customer's preferences such as occasion, personality, 
  favourite smells, and season. Then recommend 1-2 perfumes from our catalog only.
  ${CATALOG}
  Keep responses under 4 sentences. Always end with a question until you 
  have enough info to recommend. Be warm and poetic but concise.`;

  const geminiMessages = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM }] },
          contents: geminiMessages,
          generationConfig: {
            maxOutputTokens: 300,
            temperature: 0.8
          }
        })
      }
    );

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) throw new Error('No reply from Gemini');

    res.status(200).json({ reply });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
}