// API Service for backend system operations
// These endpoints will be built on the backend to handle local PC operations

const API_BASE = '/api/system';

export const systemAPI = {
  // File Operations
  async createFile(filename: string, content: string) {
    return fetch(`${API_BASE}/files/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename, content })
    }).then(r => r.json());
  },

  async listFiles(directory: string = 'documents') {
    return fetch(`${API_BASE}/files/list?dir=${directory}`)
      .then(r => r.json());
  },

  async playLocalFile(filepath: string) {
    return fetch(`${API_BASE}/media/play`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filepath })
    }).then(r => r.json());
  },

  // Application Operations
  async openApplication(appName: string) {
    return fetch(`${API_BASE}/apps/open`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ appName })
    }).then(r => r.json());
  },

  async listApplications() {
    return fetch(`${API_BASE}/apps/list`)
      .then(r => r.json());
  },

  // System Command Execution (safe subset)
  async executeCommand(command: string) {
    return fetch(`${API_BASE}/commands/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ command })
    }).then(r => r.json());
  },

  // Media Operations
  async listMusicFiles(directory?: string) {
    const query = directory ? `?dir=${directory}` : '';
    return fetch(`${API_BASE}/media/music${query}`)
      .then(r => r.json());
  },

  async playMusic(filename: string) {
    return fetch(`${API_BASE}/media/play-music`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename })
    }).then(r => r.json());
  },

  // System Information
  async getSystemInfo() {
    return fetch(`${API_BASE}/info`)
      .then(r => r.json());
  },

  async getStorageInfo() {
    return fetch(`${API_BASE}/storage`)
      .then(r => r.json());
  },
};
