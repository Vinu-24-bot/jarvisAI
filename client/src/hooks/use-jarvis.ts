import { useState, useEffect, useRef } from 'react';
import { systemAPI } from '@/services/system-api';
import { llmAPI } from '@/services/llm-api';
import { correctSpelling, expandAbbreviations } from '@/services/fuzzy-matcher';

export interface CommandLog {
  id: string;
  type: 'user' | 'system' | 'error';
  text: string;
  timestamp: Date;
}

interface JarvisState {
  isListening: boolean;
  isSpeaking: boolean;
}

const ALGORITHMS: { [key: string]: string } = {
  'kadane': `def kadane(arr):
    max_sum, current_sum = float('-inf'), 0
    for num in arr:
        current_sum = max(num, current_sum + num)
        max_sum = max(max_sum, current_sum)
    return max_sum`,
  'quicksort': `def quicksort(arr):
    if len(arr) <= 1: return arr
    pivot = arr[len(arr)//2]
    return quicksort([x for x in arr if x < pivot]) + [x for x in arr if x == pivot] + quicksort([x for x in arr if x > pivot])`,
  'fibonacci': `def fib(n):
    a, b = 0, 1
    for _ in range(n): a, b = b, a + b
    return a`,
};

const JOKES = ['Why do programmers prefer dark mode? Because light attracts bugs!', 'How many programmers does it take to change a lightbulb? None, that\'s a hardware problem!'];
const FACTS = ['Python was named after Monty Python!', 'JavaScript was created in 10 days!'];
const QUOTES = ['Innovation distinguishes between a leader and a follower. - Steve Jobs'];
const GREETINGS = [
  'Welcome back, champion! Ready to conquer your day?',
  'Hey hero! Let\'s make today absolutely legendary!',
  'Rise and shine, legend! Your greatness awaits!',
  'Good to see you again, champion! Time to shine!',
  'Welcome, superstar! Let\'s achieve something amazing today!',
  'Hey you incredible human! Ready to dominate?',
  'Greetings, hero! Let\'s make magic happen!',
  'You\'re back! Time to crush your goals!',
  'Welcome, brilliant mind! Let\'s do something extraordinary!',
  'Hello champion! Your day, your rules, your victory!',
  'Hey there, you magnificent human! Ready to be awesome?',
  'Welcome back, my friend! Let\'s create something great!',
  'Look who\'s here! The one and only star! Let\'s go!',
  'Salutations, legend! Your moment of glory starts now!',
  'Hey genius! Ready to amaze yourself today?',
  'Welcome, you magnificent creature! Today is YOURS to own!',
  'Here comes the incredible YOU! Ready to rock this day?',
  'Oh wow, it\'s the legend himself! Let\'s get amazing!',
  'Welcome back, superstar! Your greatness is showing!',
  'Hey you fearless warrior! Ready to slay today?',
  'Greetings, my brilliant friend! Time to shine BRIGHT!',
  'You\'re HERE! Let\'s create some MAGIC together!',
  'Welcome, incredible human! Today, we conquer together!',
  'Hey champion of champions! Let\'s make history today!',
  'Rise up, my hero! Your moment of glory is NOW!',
  'Welcome back, you absolute legend! Ready to be LEGENDARY?',
  'Here comes GREATNESS! That\'s YOU! Let\'s goooo!',
  'Hey brilliant one! Your brain is about to do something AMAZING!',
  'Welcome, you magnificent being! Today is YOUR DAY!',
  'Whoa, the legendary hero returns! Ready to dominate?',
];

let recognitionGlobal: any = null;
let continuousModeGlobal = false;
let hasGreetedGlobal = false;

export function useJarvis() {
  const [state, setState] = useState<JarvisState>({
    isListening: false,
    isSpeaking: false,
  });
  const [logs, setLogs] = useState<CommandLog[]>([]);
  const logsBufferRef = useRef<CommandLog[]>([]);
  const addLogRef = useRef<(type: 'user' | 'system' | 'error', text: string) => void>(null);

  const addLog = (type: 'user' | 'system' | 'error', text: string) => {
    console.log(`[${type}] ${text}`);
    if (!Array.isArray(logsBufferRef.current)) logsBufferRef.current = [];
    logsBufferRef.current.push({ id: Math.random().toString(36).substring(7), type, text, timestamp: new Date() });
    if (logsBufferRef.current.length > 100) logsBufferRef.current = logsBufferRef.current.slice(-100);
    setLogs([...logsBufferRef.current]);
  };

  addLogRef.current = addLog;

  const stopSpeaking = () => {
    // Force stop speech synthesis
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      // Clear all queued utterances
      setTimeout(() => {
        if (window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
      }, 100);
    }
    setState(s => ({ ...s, isSpeaking: false }));
    addLog('system', '⏹️ Stopped - Now Listening');
    
    // Restart listening immediately
    if (recognitionGlobal && continuousModeGlobal) {
      try {
        recognitionGlobal.abort();
        setTimeout(() => {
          try {
            recognitionGlobal.start();
          } catch (e) { }
        }, 300);
      } catch (e) { }
    }
  };

  const speak = (text: string) => {
    setState(s => ({ ...s, isSpeaking: true }));
    if (!window.speechSynthesis) {
      setState(s => ({ ...s, isSpeaking: false }));
      return;
    }
    
    const speakWithVoices = () => {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        
        const voices = window.speechSynthesis.getVoices();
        if (voices && voices.length > 0) {
          // Try to find English voice first
          const englishVoice = voices.find(v => v.lang && v.lang.startsWith('en'));
          const nativeVoice = voices.find(v => v.name.includes('Google') || v.name.includes('Microsoft') || v.name.includes('Native'));
          const selectedVoice = englishVoice || nativeVoice || voices[0];
          if (selectedVoice) utterance.voice = selectedVoice;
        }
        
        utterance.onend = () => setState(s => ({ ...s, isSpeaking: false }));
        utterance.onerror = (e) => {
          console.warn('Speech synthesis error:', e);
          setState(s => ({ ...s, isSpeaking: false }));
        };
        
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.warn('Speech synthesis exception:', e);
        setState(s => ({ ...s, isSpeaking: false }));
      }
    };
    
    // Load voices if not available
    if (!window.speechSynthesis.getVoices() || window.speechSynthesis.getVoices().length === 0) {
      const voicesChangedHandler = () => {
        window.speechSynthesis.onvoiceschanged = null;
        speakWithVoices();
      };
      window.speechSynthesis.onvoiceschanged = voicesChangedHandler;
      setTimeout(speakWithVoices, 300);
    } else {
      speakWithVoices();
    }
  };

  const downloadFile = (filename: string, content: string) => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([content], { type: 'text/plain' }));
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const executeCommand = async (transcript: string) => {
    const cmd = transcript.toLowerCase().trim();
    if (!cmd || cmd.length < 1) return;
    addLog('user', transcript);

    // ===== STOP/INTERRUPT =====
    if (cmd.match(/(?:stop|pause|cancel|quiet|hush|silence|shut|shut up)/i)) {
      stopSpeaking();
      return;
    }

    // ===== FILE CREATION WITH CONTENT =====
    if (cmd.match(/create\s+(?:a\s+)?(?:file\s+)?(?:named\s+)?([^\s]+)\s+(?:and\s+)?(?:write|add|put)/i)) {
      const match = cmd.match(/create\s+(?:a\s+)?(?:file\s+)?(?:named\s+)?([^\s]+)\s+(?:and\s+)?(?:write|add|put)\s+(?:the\s+)?(?:text\s+)?["']?([^"']+)["']?\s+(?:in it|to it|inside it|to the file)?/i);
      if (match) {
        const filename = match[1];
        const content = match[2] || '';
        try {
          const result = await systemAPI.createFile(filename, content);
          if (result.success) {
            speak(`Created ${filename}`);
            addLog('system', `✓ File: ${filename}`);
          }
        } catch (e) {
          downloadFile(filename, content);
          addLog('system', `✓ Downloaded: ${filename}`);
        }
        return;
      }
    }

    // ===== CODE FILES =====
    if (cmd.match(/(?:create|make|generate)\s+(?:a\s+)?(?:python|java|javascript|cpp|html|css)\s+(?:file|code)/i)) {
      const lang = cmd.match(/(?:python|java|javascript|cpp|html|css)/i)?.[0] || 'python';
      let ext = 'py';
      if (lang.includes('java')) ext = 'java';
      else if (lang.includes('javascript')) ext = 'js';
      else if (lang.includes('cpp')) ext = 'cpp';
      else if (lang.includes('html')) ext = 'html';
      else if (lang.includes('css')) ext = 'css';
      const algo = cmd.match(/(?:with|for)\s+(.+)/i)?.[1]?.replace(/with|for|an?|code/gi, '').trim() || 'fibonacci';
      const content = ALGORITHMS[algo.toLowerCase()] || ALGORITHMS['fibonacci'];
      downloadFile(`jarvis_${Date.now()}.${ext}`, content);
      speak(`Generated ${ext} file`);
      addLog('system', `✓ ${ext.toUpperCase()} file`);
      return;
    }

    // ===== JOKES =====
    if (cmd.match(/(?:tell|give)\s+(?:me\s+)?(?:a\s+)?joke/i)) {
      const joke = JOKES[Math.floor(Math.random() * JOKES.length)];
      speak(joke);
      addLog('system', `😂 ${joke}`);
      return;
    }

    // ===== FACTS =====
    if (cmd.match(/(?:tell|give)\s+(?:me\s+)?(?:a\s+)?fact/i)) {
      const fact = FACTS[Math.floor(Math.random() * FACTS.length)];
      speak(fact);
      addLog('system', `💡 ${fact}`);
      return;
    }

    // ===== QUOTES =====
    if (cmd.match(/(?:tell|give)\s+(?:me\s+)?(?:a\s+)?quote/i)) {
      const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
      speak(quote);
      addLog('system', `✨ ${quote}`);
      return;
    }

    // ===== TIME =====
    if (cmd.match(/(?:what|current)?\s*(?:time|hour|minute)/i)) {
      const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
      speak(`It is ${time}`);
      addLog('system', `⏰ ${time}`);
      return;
    }

    // ===== DATE =====
    if (cmd.match(/(?:what|today|current)?\s*(?:date|day)/i)) {
      const date = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
      speak(`Today is ${date}`);
      addLog('system', `📅 ${date}`);
      return;
    }

    // ===== GREETINGS =====
    if (cmd.match(/^(?:hello|hi|hey|greetings)$/i)) {
      speak('Ready');
      addLog('system', 'Greeting');
      return;
    }

    // ===== THANKS =====
    if (cmd.match(/(?:thank|thanks)/i)) {
      speak('Welcome');
      addLog('system', 'Ack');
      return;
    }

    // ===== MATH =====
    if (cmd.match(/(?:calculate|math|compute)\s+(.+)/i)) {
      const match = cmd.match(/(?:calculate|math|compute)\s+(.+)/i);
      if (match && match[1].match(/[\d+\-*/()\s.]+/)) {
        const expr = match[1].trim();
        try {
          const result = Function('"use strict"; return (' + expr + ')')();
          speak(`Result: ${result}`);
          addLog('system', `🔢 ${expr} = ${result}`);
          return;
        } catch (e) { }
      }
    }

    // ===== MUSIC/SONGS =====
    if (cmd.match(/play\s+(?:a\s+)?(?:song|music)|^music$|listen\s+to\s+(?:a\s+)?(?:song|music)/i)) {
      const popularSongs = ['Bohemian Rhapsody', 'Imagine', 'Yesterday', 'Stairway to Heaven', 'Hotel California', 'Hey Jude', 'Let It Be', 'Smells Like Teen Spirit', 'Imagine Dragons', 'Shape of You', 'Someone Like You'];
      const randomSong = popularSongs[Math.floor(Math.random() * popularSongs.length)];
      window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(randomSong)}`, '_blank');
      speak(`Playing ${randomSong} on YouTube`);
      addLog('system', `▶ YouTube: ${randomSong}`);
      return;
    }

    // ===== YOUTUBE MUSIC (explicit YouTube requests) =====
    if (cmd.match(/(?:play|listen)\s+.*\s+on\s+youtube/i) || cmd.match(/(?:play|listen)\s+(?:a\s+)?(?:song|music|video|track)\s+(.+)/i)) {
      const match = cmd.match(/(?:play|listen)\s+(?:a\s+)?(?:song|music|video|track\s+)?(.+?)(?:\s+on\s+youtube)?$/i);
      if (match) {
        const song = match[1].trim().replace(/\s+(?:song|music|video|track)$/i, '');
        if (song && song.length > 2) {
          window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(song)}`, '_blank');
          speak(`Playing ${song} on YouTube`);
          addLog('system', `▶ YouTube: ${song}`);
          return;
        }
      }
    }

    // ===== LOCAL APPLICATION LAUNCH =====
    if (cmd.match(/(?:open|launch|start|close)\s+(?:firefox|chrome|notepad|calculator|explorer|terminal|cmd|vscode|discord|gedit|sublime|atom)/i)) {
      const appMatch = cmd.match(/(?:open|launch|start)\s+(firefox|chrome|notepad|calculator|explorer|terminal|cmd|vscode|discord|gedit|sublime|atom)/i);
      const closeMatch = cmd.match(/close\s+(firefox|chrome|notepad|calculator|explorer|terminal|cmd|vscode|discord|gedit|sublime|atom)/i);
      if (appMatch) {
        const appName = appMatch[1];
        try {
          const result = await systemAPI.openApplication(appName);
          if (result.success) {
            speak(`Opening ${appName}`);
            addLog('system', `✓ ${appName} launched`);
          }
        } catch (e) {
          addLog('system', `Need backend to open ${appName}`);
        }
      } else if (closeMatch) {
        addLog('system', `💡 I can't close apps from browser. Use task manager.`);
      }
      return;
    }

    // ===== WEBSITES =====
    const sites: { [k: string]: [string, string] } = {
      youtube: ['https://youtube.com', 'YouTube'],
      google: ['https://google.com', 'Google'],
      facebook: ['https://facebook.com', 'Facebook'],
      instagram: ['https://instagram.com', 'Instagram'],
      twitter: ['https://twitter.com', 'X'],
      linkedin: ['https://linkedin.com', 'LinkedIn'],
      github: ['https://github.com', 'GitHub'],
      amazon: ['https://amazon.com', 'Amazon'],
      stackoverflow: ['https://stackoverflow.com', 'Stack Overflow'],
      reddit: ['https://reddit.com', 'Reddit'],
      wikipedia: ['https://wikipedia.org', 'Wikipedia'],
      'medium': ['https://medium.com', 'Medium'],
      'geeksforgeeks': ['https://geeksforgeeks.org', 'GeeksforGeeks'],
      'geeks for geeks': ['https://geeksforgeeks.org', 'GeeksforGeeks'],
      'dev.to': ['https://dev.to', 'Dev.to'],
    };

    for (const [site, [url, name]] of Object.entries(sites)) {
      if ((cmd.includes('open') || cmd.includes('go to')) && (cmd.includes(site) || cmd.includes(name.toLowerCase()))) {
        window.open(url, '_blank');
        speak(`Opening ${name}`);
        addLog('system', `✓ ${name}`);
        return;
      }
    }

    // ===== LOCAL FILES =====
    if (cmd.match(/(?:list|show)\s+(?:my\s+)?(?:local\s+)?(?:files|documents)/i)) {
      addLog('system', `💡 Need backend for file listing`);
      speak('I need backend to list your files');
      return;
    }

    // ===== LOCAL MUSIC =====
    if (cmd.match(/(?:play|listen to)\s+(?:my\s+)?local/i) || cmd.match(/(?:list|show)\s+(?:my\s+)?music/i)) {
      addLog('system', `💡 Need backend for local music`);
      speak('I need backend to access your local music');
      return;
    }

    // ===== INTELLIGENT Q&A (LLM-powered) - Catch-all for EVERYTHING except known commands =====
    // This is now the default handler - if it's not a known command, send it to LLM
    // Documents, questions, analysis - all go to Gemini
    
    // Check if it's the special document analysis prompt format (case-insensitive)
    const cmdLower = cmd.toLowerCase();
    const isDocumentAnalysis = 
      cmdLower.includes('document analysis') || 
      cmdLower.includes('document information') || 
      cmdLower.includes('full document content') ||
      cmdLower.includes('document file:') ||
      (cmdLower.includes('user request:') && cmdLower.includes('document'));
    
    // Detect query type for special formatting
    const isCode = cmd.includes('code') || cmd.includes('algorithm') || cmd.includes('algo') || cmd.includes('function') || cmd.includes('program') || cmd.includes('dsa');
    const isTable = cmd.includes('table') || cmd.includes('list') || cmd.includes('compare') || cmd.includes('design');
    const isQuestion = cmd.match(/^(?:who|what|when|where|why|how)\s+/i);
    
    // For document analysis, send directly to LLM with special handling
    if (isDocumentAnalysis) {
      addLog('system', `📄 Analyzing Document...`);
      try {
        const result = await llmAPI.ask(cmd);
        if (result.success) {
          speak(result.answer);
          addLog('system', `💡 ${result.answer}`);
          return;
        } else {
          addLog('error', `LLM error: ${result.error}`);
          speak('Let me analyze that document. ' + (result.error || 'Could not process document.'));
        }
      } catch (e: any) {
        addLog('error', `Error: ${e.message}`);
        speak('Document analysis in progress. Please wait.');
      }
      return;
    }
    
    // For all other queries
    let query = cmd;
    
    // Remove common keywords but preserve core content
    query = query
      .replace(/^(?:code\s+)?for\s+/i, '')
      .replace(/^(?:tell|show|give|explain|describe|discuss|design|create|make|build|generate|write|code|code\s+for|write\s+code\s+for)\s+(?:me\s+)?(?:a\s+)?(?:something\s+)?(?:about\s+)?/i, '')
      .replace(/^(?:who|what|when|where|why|how)\s+(?:is|are|the|a|an)?\s*/i, '')
      .replace(/^(?:search|find|look\s+up|google|define|ask|question)\s+(?:me\s+)?(?:for\s+)?/i, '')
      .trim();
    
    // Apply spell correction
    query = correctSpelling(query);
    query = expandAbbreviations(query);
    
    // If we have content, send to LLM
    if (query && query.length > 1) {
      addLog('system', `🤖 Thinking...`);
      try {
        let fullQuery = query;
        
        // Format based on detected type
        if (isCode) {
          fullQuery = `Provide code for: ${query}

Please provide:
1. Complete, production-ready, optimized code
2. Step-by-step explanation
3. Time Complexity Analysis
4. Space Complexity Analysis
5. Example usage/test case
6. Alternative approaches

Format code in clear blocks with language hints.`;
        } else if (isTable) {
          fullQuery = `${query}

Please format as a well-structured table or organized list with clear headers and proper formatting.`;
        } else if (isQuestion) {
          fullQuery = query;
        } else {
          fullQuery = query;
        }
        
        const result = await llmAPI.ask(fullQuery);
        if (result.success) {
          speak(result.answer);
          addLog('system', `💡 ${result.answer}`);
          return;
        } else {
          addLog('error', `LLM error: ${result.error}`);
          speak('Sorry, I could not process that. Please try again.');
        }
      } catch (e: any) {
        addLog('error', `Error: ${e.message}`);
        speak('An error occurred. Please try again.');
      }
      return;
    }

    // ===== FALLBACK: Send to LLM as a general query =====
    // If nothing matched, try LLM anyway - this is our catch-all
    addLog('system', `🤖 Processing...`);
    try {
      const result = await llmAPI.ask(cmd);
      if (result.success) {
        speak(result.answer);
        addLog('system', `💡 ${result.answer}`);
        return;
      }
    } catch (e: any) {
      // Silent fallback
    }
    
    // Only show error if everything failed
    addLog('error', `Unable to process: ${cmd}`);
    speak('I could not process that request. Try asking a question or uploading a document.');
  };

  const startListening = () => {
    if (!recognitionGlobal) return;
    try {
      continuousModeGlobal = true;
      setState(s => ({ ...s, isListening: true }));
      addLog('system', '🎤 Listening...');
      recognitionGlobal.start();
    } catch (e) { }
  };

  const stopListening = () => {
    continuousModeGlobal = false;
    if (recognitionGlobal) try { recognitionGlobal.abort(); } catch (e) { }
    setState(s => ({ ...s, isListening: false }));
  };

  const toggleListening = () => {
    continuousModeGlobal ? stopListening() : startListening();
  };

  const submitTextCommand = (text: string) => {
    if (!text.trim()) return;
    executeCommand(text);
  };

  useEffect(() => {
    const SpeechRecognitionAPI = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    
    if (!SpeechRecognitionAPI) {
      if (addLogRef.current) {
        addLogRef.current('error', 'Speech recognition not available in this browser');
        addLogRef.current('system', '💡 Use text input instead (type commands below)');
      }
      return;
    }

    const SpeechRecognition = SpeechRecognitionAPI;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.language = 'en-US';

    recognition.onstart = () => setState(s => ({ ...s, isListening: true }));
    recognition.onend = () => {
      setState(s => ({ ...s, isListening: false }));
      if (continuousModeGlobal) setTimeout(() => { try { recognition.start(); } catch (e) { } }, 200);
    };

    recognition.onresult = (event: any) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) transcript += event.results[i][0].transcript + ' ';
      }
      if (transcript.trim()) executeCommand(transcript);
    };

    recognition.onerror = (event: any) => {
      setState(s => ({ ...s, isListening: false }));
      if (continuousModeGlobal) setTimeout(() => { try { recognition.start(); } catch (e) { } }, 300);
    };

    recognitionGlobal = recognition;

    if (!hasGreetedGlobal) {
      hasGreetedGlobal = true;
      setTimeout(() => {
        const randomGreeting = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
        if (addLogRef.current) {
          addLogRef.current('system', '⚡ JARVIS ONLINE');
        }
        // Give browser time to load voices and prepare speech synthesis
        setTimeout(() => {
          speak(randomGreeting + ' I am JARVIS, your AI assistant. Click the microphone to begin!');
        }, 500);
      }, 800);
    }

    return () => { if (recognitionGlobal) try { recognitionGlobal.abort(); } catch (e) { } };
  }, []);

  return { state, logs, startListening, stopListening, toggleListening, stopSpeaking, submitTextCommand };
}
