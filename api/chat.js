module.exports = async function handler(req, res) {

  // Allow all origins
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check API key exists
  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'GEMINI_API_KEY not set in environment variables' });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array is required' });
  }

  const CATALOG = `
  PERFUMES WE SELL:
  - Bloom Noir | Floral Oriental | Rose, oud, musk | $120
  - Sea Drift | Fresh Aquatic | Citrus, sea salt, cedar | $95
  - Velvet Ember | Warm Woody | Vanilla, sandalwood, amber | $140
  - Garden Reverie | Green Floral | Peony, green tea, musk | $85
  - Midnight Oud | Dark Oriental | Oud, leather, incense | $200
  - Citrus Matin | Fresh Citrus | Bergamot, lemon, vetiver | $75
  `;

  const SYSTEM = `You are a warm, knowledgeable perfume advisor for Maison de Parfum boutique.
Your goal is to help customers find their perfect fragrance from our catalog.
Ask 2-3 friendly questions about their preferences such as occasion, personality, 
favourite smells, and season. Then recommend 1-2 perfumes from our catalog only.
${CATALOG}
Keep responses under 4 sentences. Always end with a follow-up question until you 
have enough information to recommend. Be warm, poetic but concise.
Only recommend perfumes that are in the catalog above.`;

  // Convert message history to Gemini format
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
          system_instruction: {
            parts: [{ text: SYSTEM }]
          },
          contents: geminiMessages,
          generationConfig: {
            maxOutputTokens: 300,
            temperature: 0.8
          }
        })
      }
    );

    const data = await response.json();

    // Check for API errors
    if (data.error) {
      console.error('Gemini API error:', data.error);
      return res.status(500).json({ error: data.error.message });
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      console.error('No reply from Gemini:', JSON.stringify(data));
      return res.status(500).json({ error: 'No response from AI' });
    }

    return res.status(200).json({ reply });

  } catch (error) {
    console.error('Server error:', error.message);
    return res.status(500).json({ error: 'Server error: ' + error.message });
  }
};