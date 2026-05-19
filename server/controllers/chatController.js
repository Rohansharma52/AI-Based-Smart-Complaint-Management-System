const fetch = require('node-fetch');
const https = require('https');
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

// Session history store
const sessions = {};

const SYSTEM_PROMPT = `You are SmartComplaint AI Assistant — an intelligent support bot for a Smart Complaint Management System.

You help citizens with:
- How to register complaints
- Tracking complaint status
- Understanding complaint categories (Water, Electricity, Roads, Sanitation, etc.)
- Explaining AI analysis results (priority, department, summary)
- General civic issue guidance
- Answering questions about the complaint process

Platform features:
- Register complaints online
- AI-based priority detection (Low/Medium/High)
- Department routing (Water Dept, Electricity Dept, PWD, Sanitation Dept)
- Real-time status tracking (Pending → In Progress → Resolved)
- Admin manages and resolves complaints

Rules:
- Be helpful, friendly, and concise
- Respond in the same language as the user (Hindi or English)
- Keep responses short and practical
- Use emojis to be friendly
- If asked about specific complaint status, say you can check in "My Complaints" section`;

exports.chat = async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    if (!message?.trim()) return res.status(400).json({ success: false, message: 'Message required' });

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey || apiKey === 'your_key_here')
      return res.status(400).json({ success: false, message: 'AI not configured' });

    const sid = sessionId || 'default';
    if (!sessions[sid]) sessions[sid] = [];
    sessions[sid].push({ role: 'user', content: message });
    if (sessions[sid].length > 16) sessions[sid] = sessions[sid].slice(-16);

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      agent: httpsAgent,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:5173',
        'X-Title': 'SmartComplaint Chatbot'
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...sessions[sid]
        ],
        max_tokens: 400,
        temperature: 0.7
      })
    });

    if (!response.ok) throw new Error('AI API failed');
    const data = await response.json();
    const reply = data.choices[0].message.content;
    sessions[sid].push({ role: 'assistant', content: reply });

    res.json({ success: true, reply, sessionId: sid });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.clearChat = (req, res) => {
  const { sessionId } = req.body;
  if (sessionId && sessions[sessionId]) delete sessions[sessionId];
  res.json({ success: true });
};
