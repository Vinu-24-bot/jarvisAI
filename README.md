Jarvis AI – Voice‑Controlled Browser Assistant
Jarvis AI is a voice‑controlled AI assistant that runs directly in your browser and helps you control the web, generate code files, search information, and perform dozens of everyday tasks hands‑free.​

Live Demo:
https://jarvis-cqoj81e18-vinay-kumars-projects-c769063f.vercel.app

Key Features
Voice‑first interface – Trigger Jarvis with a microphone button and control everything by speaking natural commands.​

Rich command library (350+ commands) – System actions, web search, media control, code generation, file creation, math, weather, news, and more.​

Smart web automation – Opens sites like Google, YouTube, Gmail, Amazon, LinkedIn, GitHub, and others on demand.​

Developer‑friendly code generation – Creates ready‑to‑download source files for popular algorithms in multiple languages (Python, Java, C, JavaScript, etc.).​

Optional local‑PC backend – With an additional Node.js backend, Jarvis can open local apps, list files, create documents, and play music from your machine.​

Tech Stack
Frontend: React, Vite, TypeScript, Tailwind CSS.​

State & data: React hooks, React Query, custom command processing hooks.​

Build tooling: Vite, PostCSS, Tailwind, TypeScript, ESLint‑friendly setup.​

Backend (optional): Node.js + Express for system control APIs (file operations, app launch, media playback, system info).​

Deployment: Vercel (static frontend build from dist/public).​

Getting Started (Local Development)
Clone and install

bash
git clone https://github.com/Vinu-24-bot/jarvisAI.git
cd jarvisAI
npm install
This installs all frontend and server dependencies defined in package.json.​

Run the frontend

bash
npm run devclient
Vite dev server runs on http://localhost:5000 by default.​

Open the URL in your browser and allow microphone access when prompted.​

(Optional) Run the local backend

Implement the API endpoints from BACKEND_API_REQUIREMENTS.md, then start your Node/Express server (for example on http://localhost:3001) to enable local‑PC actions like opening apps, listing files, and playing music.​

Example Voice Commands
Jarvis understands many natural variations; some representative examples:​

“Create Python file with Kadane.” – downloads a Python file containing Kadane’s algorithm implementation.

“Play Bohemian Rhapsody.” – opens YouTube Music and starts the song.

“Search for machine learning.” – opens a Google search for your query.

“Open YouTube / Open GitHub / Open Netflix.” – navigates directly to the requested site.

“What time is it?” / “What’s the weather in New York?” / “Tell me the latest news.” – answers informational queries via the browser.

Refer to COMMANDS.txt for the full catalog of supported commands and phrasing options.​

Project Structure
client/ – React frontend (pages, components, hooks, styling).​

server/ (optional) – Node/Express backend for local system integration as described in BACKEND_API_REQUIREMENTS.md.​

COMMANDS.txt – Full list of supported voice commands and examples.​

LOCAL_SETUP_GUIDE.md – Step‑by‑step local setup instructions for VS Code and Node.js.​

BACKEND_API_REQUIREMENTS.md – Specification for backend endpoints and security considerations.​

Deployment
The live version of Jarvis AI is hosted on Vercel as a static Vite build:

Production URL:
https://jarvis-cqoj81e18-vinay-kumars-projects-c769063f.vercel.app
