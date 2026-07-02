const express = require('express');
const router = express.Router();

const SYSTEM_PROMPT = `You are Jan Samasya Assistant — a helpful, friendly guide for the Jan Samasya civic platform (India).

Jan Samasya helps citizens report local public problems such as road damage, water leakage, electricity issues, sanitation, and health-related civic issues.

Key information you should share when asked:
- Users must sign up and complete registration with their city, state, and pincode.
- After login, citizens can create a problem with title, description, category, photo, and location.
- All users can browse problems on the "All Problems" page.
- Citizens can like/dislike problems in their own registered city when voting is enabled by the problem creator.
- Users can manage their own problems from "My Problems".
- City-wise problems can be viewed from the navbar when logged in.
- Admins manage the platform; MLAs and government employees manage problems for their city.
- Contact: aagamjain64@gmail.com | Phone: +91 8769561403

Rules:
- Reply in Hindi if the user asks in Hindi, otherwise reply in English.
- Keep answers short and clear (2-5 sentences).
- Answer only Jan Samasya related questions.
- If asked unrelated questions, politely say you only help with Jan Samasya platform queries.`;

const getOpenRouterModels = () =>
  [...new Set([
    process.env.OPENROUTER_MODEL,
    'openrouter/free',
    'meta-llama/llama-3.2-3b-instruct:free',
    'meta-llama/llama-3.3-70b-instruct:free',
  ].filter(Boolean))];

router.post('/chat', async (req, res) => {
  const { message, history = [] } = req.body;

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ message: 'Message is required.' });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ message: 'Assistant is not configured yet.' });
  }

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history
      .filter((item) => item?.text && (item.role === 'user' || item.role === 'model'))
      .slice(-10)
      .map((item) => ({
        role: item.role === 'model' ? 'assistant' : 'user',
        content: item.text,
      })),
    { role: 'user', content: message.trim() },
  ];

  let lastError = 'Assistant could not respond right now.';
  const models = getOpenRouterModels();

  for (const model of models) {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:5173',
          'X-Title': 'Jan Samasya Assistant',
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.7,
          max_tokens: 512,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        lastError = data?.error?.message || `OpenRouter error (${model})`;
        continue;
      }

      const reply =
        data?.choices?.[0]?.message?.content?.trim() ||
        data?.choices?.[0]?.message?.reasoning?.trim();

      if (!reply) {
        lastError = 'Empty response from assistant.';
        continue;
      }

      return res.json({ reply });
    } catch (err) {
      lastError = err.message;
    }
  }

  console.error('OpenRouter chat error:', lastError);
  return res.status(502).json({ message: lastError });
});

module.exports = router;
