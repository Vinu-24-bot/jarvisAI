# JARVIS - Google Gemini Setup (FREE)

JARVIS now runs on **Google Gemini's free tier**! No credit card needed, no paid APIs.

## Setup (2 Minutes)

### Step 1: Get Free Gemini API Key

1. Visit: https://makersuite.google.com/app/apikey
2. Click **"Create API Key"**
3. Copy your key (looks like: `AIza...`)

### Step 2: Add Key to JARVIS

1. Create `.env.local` file in project root
2. Paste this line:
   ```
   VITE_GEMINI_API_KEY=your_key_here
   ```
3. Replace `your_key_here` with your actual key
4. Save the file

### Step 3: Restart & Test

Restart your dev server:
```bash
npm run dev:client
```

Then try asking JARVIS:
- "What is machine learning?"
- "Explain blockchain"
- "How does photosynthesis work?"

**JARVIS answers like Gemini!** 🤖

---

## Free Tier Limits

| Feature | Limit |
|---------|-------|
| Requests/day | 1,500 ✅ |
| Response quality | Full (same as paid) |
| Cost | FREE |

Perfect for personal use! 🎉

---

## How It Works

1. **You speak** - "What is X?"
2. **JARVIS listens** - Processes your voice
3. **Sends to Gemini** - Uses your free API key
4. **Gemini thinks** - Generates response
5. **JARVIS answers** - Speaks the response back

---

## Troubleshooting

**"LLM error: Gemini API key not configured"?**
- Make sure `.env.local` file exists in project root
- Check the key is correct (copy from makersuite.google.com/app/apikey)
- Restart dev server: `npm run dev:client`

**API key giving errors?**
- Visit https://makersuite.google.com/app/apikey
- Create a NEW key
- Paste it fresh in `.env.local`

**Rate limited?**
- You have 1,500 free requests/day
- That's plenty for personal use!
- Wait 24 hours for limit to reset

---

## What JARVIS Can Do

✅ Answer ANY question (like Gemini)  
✅ Explain concepts  
✅ Solve problems  
✅ Generate content  
✅ Play YouTube music  
✅ Create & download files  
✅ Tell jokes  
✅ Show time/date  

---

## No Other APIs Needed!

This version uses **ONLY Gemini** (free tier). No OpenAI, no Claude, no payment needed.

**Ready to go!** 🚀
