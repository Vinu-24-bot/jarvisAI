# JARVIS Full-Stack Backend API Requirements

This document outlines the API endpoints needed for the backend to support local PC operations.

## Base URL
```
POST /api/system/*
```

---

## 1. FILE OPERATIONS

### Create File
```
POST /api/system/files/create
Body: { filename: string, content: string }
Response: { success: boolean, message?: string, error?: string }
```
**Description:** Create a file with given name and content in user's Documents folder.

### List Files
```
GET /api/system/files/list?dir=documents
Response: { success: boolean, files: string[], error?: string }
```
**Description:** List files in specified directory (documents, downloads, etc.).

---

## 2. APPLICATION OPERATIONS

### Open Application
```
POST /api/system/apps/open
Body: { appName: string }
Response: { success: boolean, message?: string, error?: string }
```
**Description:** Open a local application (Firefox, Chrome, Notepad, VS Code, Discord, etc.)

**Supported Apps:**
- firefox
- chrome
- notepad
- calculator
- explorer (Windows) / finder (Mac)
- terminal / cmd
- vscode
- discord

### List Applications
```
GET /api/system/apps/list
Response: { success: boolean, apps: string[], error?: string }
```
**Description:** List available applications on the system.

---

## 3. MEDIA OPERATIONS

### List Music Files
```
GET /api/system/media/music?dir=Music
Response: { success: boolean, files: string[], error?: string }
```
**Description:** List music files from user's Music folder (.mp3, .wav, .flac, .m4a).

### Play Music
```
POST /api/system/media/play-music
Body: { filename: string }
Response: { success: boolean, message?: string, error?: string }
```
**Description:** Play a music file from local system using default media player.

### Play Any File
```
POST /api/system/media/play
Body: { filepath: string }
Response: { success: boolean, message?: string, error?: string }
```
**Description:** Play/open any file with its default application.

---

## 4. SYSTEM OPERATIONS

### Execute Command
```
POST /api/system/commands/execute
Body: { command: string }
Response: { success: boolean, output?: string, error?: string }
```
**Description:** Execute safe system commands (limited to whitelist).

**Whitelisted Commands:**
- `list-processes`
- `get-system-info`
- `get-battery-status`
- etc. (define your own safe list)

### Get System Info
```
GET /api/system/info
Response: { 
  success: boolean,
  os: string,
  platform: string,
  cpus: number,
  ram: string,
  hostname: string,
  error?: string
}
```
**Description:** Get system information.

### Get Storage Info
```
GET /api/system/storage
Response: {
  success: boolean,
  drives: {
    mount: string,
    used: string,
    total: string,
    percent: number
  }[],
  error?: string
}
```
**Description:** Get disk usage information.

---

## Implementation Stack

**Recommended:**
- **Node.js + Express** for API server
- **child_process** for executing system commands
- **fs** for file operations
- **os** for system information

## Security Considerations

1. **Command Whitelist** - Only allow specific safe commands
2. **File Path Validation** - Restrict file operations to user directories
3. **Process Limits** - Prevent spawning too many processes
4. **Input Sanitization** - Validate all user inputs
5. **Rate Limiting** - Add rate limits to prevent abuse
6. **User Directory Only** - Only access user home directory and subdirectories

---

## Example Implementation (Node.js)

```javascript
const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const app = express();
app.use(express.json());

// File Operations
app.post('/api/system/files/create', (req, res) => {
  const { filename, content } = req.body;
  const filepath = path.join(os.homedir(), 'Documents', filename);
  
  fs.writeFile(filepath, content || '', (err) => {
    if (err) return res.json({ success: false, error: err.message });
    res.json({ success: true, message: `Created ${filename}` });
  });
});

// Application Launch
app.post('/api/system/apps/open', (req, res) => {
  const { appName } = req.body;
  const commands = {
    firefox: 'firefox',
    chrome: 'google-chrome', // or 'open -a Google\\ Chrome' on Mac
    notepad: 'notepad',
    vscode: 'code',
  };
  
  const cmd = commands[appName];
  if (!cmd) return res.json({ success: false, error: 'App not supported' });
  
  exec(cmd, (err) => {
    if (err) return res.json({ success: false, error: err.message });
    res.json({ success: true, message: `Opened ${appName}` });
  });
});

// Music Playback
app.post('/api/system/media/play-music', (req, res) => {
  const { filename } = req.body;
  const filepath = path.join(os.homedir(), 'Music', filename);
  
  const command = process.platform === 'win32' 
    ? `start "" "${filepath}"` 
    : `open "${filepath}"`;
  
  exec(command, (err) => {
    if (err) return res.json({ success: false, error: err.message });
    res.json({ success: true, message: `Playing ${filename}` });
  });
});

app.listen(3001);
```

---

## Frontend Integration

The frontend (`client/src/services/system-api.ts`) already has all API calls prepared. Once you build these endpoints, JARVIS will automatically:

✅ Create local files
✅ Open applications
✅ Play music from Music folder
✅ List files and songs
✅ Execute system operations

**No frontend changes needed!**
