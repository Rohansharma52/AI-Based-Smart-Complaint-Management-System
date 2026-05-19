const fetch = require('node-fetch');
const https = require('https');
const Complaint = require('../models/Complaint');

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

// POST /api/ai/analyze
exports.analyzeComplaint = async (req, res) => {
  try {
    const { title, description, category, location, complaintId } = req.body;
    if (!title || !description)
      return res.status(400).json({ success: false, message: 'Title and description required' });

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey || apiKey === 'your_key_here')
      return res.status(400).json({ success: false, message: 'AI API key not configured' });

    const prompt = `You are an AI Complaint Analyzer for a Smart Complaint Management System.
Your task is to analyze the complaint description and generate:
1. Complaint Priority
   - Low
   - Medium
   - High

2. Responsible Department
3. Short Complaint Summary
4. Professional Auto-generated Response

Rules:
- Electricity sparks, fire, accidents, gas leakage → High Priority
- Water leakage, road damage → Medium Priority
- Garbage collection, street light issue → Low/Medium Priority

Department Examples:
- Water issues → Water Department
- Electricity issues → Electricity Department
- Garbage issues → Sanitation Department
- Road issues → PWD Department
- Drainage issues → Drainage Department

Return response strictly in JSON format:
{
  "priority": "",
  "department": "",
  "summary": "",
  "autoResponse": ""
}

Complaint:
"Title: ${title}
Description: ${description}
Category: ${category || 'Not specified'}
Location: ${location || 'Not specified'}"`;


    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      agent: httpsAgent,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:5173',
        'X-Title': 'Smart Complaint Management System'
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a complaint analysis AI. Return only valid JSON.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 600,
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || 'AI API failed');
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    let analysis;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch {
      analysis = null;
    }

    if (!analysis) {
      analysis = {
        priority: getPriorityFallback(title, description),
        department: getDepartmentFallback(category),
        summary: `Complaint regarding "${title}" reported from ${location || 'the area'}.`,
        autoResponse: `Dear ${title ? 'Complainant' : 'User'}, thank you for registering your complaint. We have forwarded it to the concerned department and it will be resolved at the earliest.`
      };
    }

    // Ensure priority is only Low/Medium/High (normalize Critical → High)
    if (analysis.priority === 'Critical') analysis.priority = 'High';
    if (!['Low', 'Medium', 'High'].includes(analysis.priority)) {
      analysis.priority = getPriorityFallback(title, description);
    }

    // Save AI analysis to complaint if complaintId provided
    if (complaintId) {
      await Complaint.findByIdAndUpdate(complaintId, { aiAnalysis: analysis });
    }

    res.json({ success: true, data: analysis });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Fallback department mapping
function getDepartmentFallback(category) {
  const map = {
    'Water Supply': 'Water Department',
    'Electricity': 'Electricity Department',
    'Roads': 'PWD Department',
    'Sanitation': 'Sanitation Department',
    'Public Safety': 'Police Department',
    'Healthcare': 'Health Department',
    'Education': 'Education Department',
    'Other': 'Municipal Corporation'
  };
  return map[category] || 'Municipal Corporation';
}

// Fallback priority based on keywords
function getPriorityFallback(title, description) {
  const text = (title + ' ' + description).toLowerCase();
  const highKeywords = ['spark', 'fire', 'accident', 'gas leakage', 'electric shock', 'explosion', 'flood', 'collapse', 'emergency', 'danger', 'hazard'];
  const mediumKeywords = ['water leakage', 'road damage', 'pothole', 'broken pipe', 'sewage', 'drainage', 'no water', 'power cut'];
  if (highKeywords.some(k => text.includes(k))) return 'High';
  if (mediumKeywords.some(k => text.includes(k))) return 'Medium';
  return 'Low';
}
