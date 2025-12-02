# JARVIS - Local PC Setup Guide (VS Code)

Follow these steps to run JARVIS on your local machine.

---

## Prerequisites

Make sure you have installed:
- **Node.js** (v18+) - https://nodejs.org
- **npm** (comes with Node.js)
- **VS Code** - https://code.visualstudio.com

**Verify installation:**
```bash
node --version
npm --version
```

---

## Step 1: Extract & Open Project

1. Download the JARVIS project (ZIP file from Replit)
2. Extract it to a folder on your PC
3. Open **VS Code**
4. Go to `File → Open Folder` and select the JARVIS folder
5. VS Code should now show the project structure

---

## Step 2: Install Dependencies

Open a terminal in VS Code:
- **Windows/Linux:** `Ctrl + ~` (or View → Terminal)
- **Mac:** `Cmd + ~`

Then run:
```bash
npm install
```

This installs all required packages (React, Vite, Tailwind, etc.). This may take 2-5 minutes.

---

## Step 3: Run Frontend Dev Server

In the same terminal, run:
```bash
npm run dev:client
```

You should see output like:
```
  VITE v5.0.0  ready in 234 ms

  ➜  Local:   http://localhost:5000/
  ➜  press h + enter to show help
```

---

## Step 4: Open JARVIS in Browser

Click the URL or open your browser and go to:
```
http://localhost:5000
```

**JARVIS is now running!** ✅

---

## What Works Now (Frontend Only)

✅ **Web Browser Operations:**
- Search Google
- Play music on YouTube
- Open websites (Gmail, Amazon, GitHub, etc.)
- Create & download files
- Tell jokes, facts, quotes
- Calculate math
- Show time & date

⏳ **Waiting for Backend:**
- Open local applications (Firefox, Chrome, etc.)
- Play local music files
- Access file system (Documents, Downloads, etc.)
- Run system commands

---

## Optional: Set Up Backend (Advanced)

If you want full local PC control, follow these steps:

### Step 5A: Create Backend Directory

In terminal, run:
```bash
mkdir server
cd server
npm init -y
npm install express cors body-parser child_process
```

### Step 5B: Create Backend Server

Create file: `server/index.js`

```javascript
const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const app = express();
app.use(express.json());

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Create File
app.post('/api/system/files/create', (req, res) => {
  const { filename, content } = req.body;
  const filepath = path.join(os.homedir(), 'Documents', filename);
  
  fs.writeFile(filepath, content || '', (err) => {
    if (err) return res.json({ success: false, error: err.message });
    res.json({ success: true, message: `Created ${filename}` });
  });
});

// List Files
app.get('/api/system/files/list', (req, res) => {
  const dir = req.query.dir || 'documents';
  const dirPath = path.join(os.homedir(), dir.charAt(0).toUpperCase() + dir.slice(1));
  
  fs.readdir(dirPath, (err, files) => {
    if (err) return res.json({ success: false, error: err.message });
    res.json({ success: true, files: files.slice(0, 10) });
  });
});

// Open Application
app.post('/api/system/apps/open', (req, res) => {
  const { appName } = req.body;
  let command;
  
  if (process.platform === 'win32') {
    const apps = {
      firefox: 'firefox',
      chrome: 'chrome',
      notepad: 'notepad',
      calculator: 'calc',
      explorer: 'explorer',
      vscode: 'code',
    };
    command = apps[appName];
    if (!command) return res.json({ success: false, error: 'App not found' });
    command = `start ${command}`;
  } else if (process.platform === 'darwin') { // Mac
    command = `open -a ${appName}`;
  } else { // Linux
    command = appName;
  }
  
  exec(command, (err) => {
    if (err) return res.json({ success: false, error: err.message });
    res.json({ success: true, message: `Opened ${appName}` });
  });
});

// List Music Files
app.get('/api/system/media/music', (req, res) => {
  const musicDir = path.join(os.homedir(), 'Music');
  
  fs.readdir(musicDir, (err, files) => {
    if (err) return res.json({ success: false, error: err.message });
    const musicFiles = files.filter(f => /\.(mp3|wav|flac|m4a)$/.test(f));
    res.json({ success: true, files: musicFiles.slice(0, 10) });
  });
});

// Play Music
app.post('/api/system/media/play-music', (req, res) => {
  const { filename } = req.body;
  const filepath = path.join(os.homedir(), 'Music', filename);
  
  let command;
  if (process.platform === 'win32') {
    command = `start "" "${filepath}"`;
  } else if (process.platform === 'darwin') {
    command = `open "${filepath}"`;
  } else {
    command = `xdg-open "${filepath}"`;
  }
  
  exec(command, (err) => {
    if (err) return res.json({ success: false, error: err.message });
    res.json({ success: true, message: `Playing ${filename}` });
  });
});

// Get System Info
app.get('/api/system/info', (req, res) => {
  res.json({
    success: true,
    os: process.platform,
    hostname: os.hostname(),
    cpus: os.cpus().length,
    ram: `${Math.round(os.totalmem() / 1024 / 1024 / 1024)}GB`,
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
```

### Step 5C: Run Backend Server

Open a **new terminal** in VS Code (next to your frontend terminal) and run:

```bash
cd server
node index.js
```

You should see:
```
Backend running at http://localhost:3001
```

---

## Now Both Are Running!

**Terminal 1 (Frontend):**
```
npm run dev:client
```

**Terminal 2 (Backend):**
```
node server/index.js
```

Visit `http://localhost:5000` → JARVIS now has full local PC control! 🎉

---

## Troubleshooting

### Port Already in Use?

If you get an error that port 5000 or 3001 is already in use:

**Windows:**
```bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
lsof -i :5000
kill -9 <PID>
```

### Module Not Found?

Run again:
```bash
npm install
```

### Permission Denied (Mac)?

Run with sudo:
```bash
sudo npm install
```

---

## File Structure After Setup

```
jarvis/
├── client/                    # Frontend (React)
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── hooks/
│   │   │   └── use-jarvis.ts  (Command processing)
│   │   ├── services/
│   │   │   └── system-api.ts  (API calls)
│   │   └── App.tsx
│   └── index.html
├── server/                    # Backend (Node.js) - Optional
│   └── index.js              (System operations API)
├── package.json
└── vite.config.ts
```

---

## Next Steps

1. **Test Frontend:** Try commands like "search python", "play music", "tell me a joke"
2. **Build Backend:** Follow Step 5 to enable local PC operations
3. **Deploy:** Once working locally, deploy to cloud or keep running locally

---

## Commands to Try

**Web Operations (Work Now):**
- "Search machine learning"
- "Play Taylor Swift" (YouTube)
- "Open Amazon"
- "Tell me a joke"
- "Create test.txt and write hello world"

**Local Operations (Need Backend):**
- "Open Firefox"
- "List my files"
- "Play my local music"

---

## Questions?

Check the documentation files:
- `BACKEND_API_REQUIREMENTS.md` - API endpoint specs
- `COMMANDS.txt` - All supported commands

Happy coding! 🚀
