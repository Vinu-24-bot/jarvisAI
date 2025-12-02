import { useJarvis } from "@/hooks/use-jarvis";
import { Terminal } from "@/components/jarvis/Terminal";
import { OrbitalAI } from "@/components/jarvis/OrbitalAI";
import { Button } from "@/components/ui/button";
import { Mic, Send, MoreVertical, Settings, Square, Upload, X, Sparkles, StopCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { formatFileSize } from "@/services/file-reader";
import { parseDocument } from "@/services/document-parser";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function Home() {
  const { state, logs, toggleListening, submitTextCommand, stopSpeaking } = useJarvis();
  const [textInput, setTextInput] = useState("");
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string; content: string; docType?: string; summary?: string; metadata?: Record<string, any> } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showOrbital, setShowOrbital] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Show greeting toast after 1.2 seconds
    const greetingTimer = setTimeout(() => {
      const greetings = [
        "Welcome back, champion!",
        "Hey hero, let's make today legendary!",
        "Rise and shine, legend!",
        "Welcome, superstar!",
        "You're back! Time to crush it!",
        "Welcome, brilliant mind!",
        "Hello champion! Your day, your rules!"
      ];
      const greeting = greetings[Math.floor(Math.random() * greetings.length)];
      toast.success(greeting, {
        description: "JARVIS is ready. Click the microphone or type below!",
        duration: 4000,
      });
    }, 1200);
    return () => clearTimeout(greetingTimer);
  }, []);

  useEffect(() => {
    // Show orbital intelligently based on conversation state
    // Always show if no messages yet OR file is uploaded and no command sent
    if (logs.length === 0 || (uploadedFile && logs.length === 0)) {
      setShowOrbital(true);
      return;
    }
    
    // Get the last log to understand state
    const lastLog = logs[logs.length - 1];
    
    // Hide ONLY if last message is a user command (they just sent something)
    if (lastLog?.type === 'user') {
      setShowOrbital(false);
      return;
    }
    
    // Hide if AI is thinking (🤖 Thinking, ⏰ processing, etc)
    if (lastLog?.text.includes('🤖') || lastLog?.text.includes('⏰') || lastLog?.text.includes('Thinking')) {
      setShowOrbital(false);
      return;
    }
    
    // Show in ALL other states - complete response, idle, file uploaded
    setShowOrbital(true);
  }, [logs, uploadedFile]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const parsed = await parseDocument(file);
      setUploadedFile({
        name: parsed.title,
        size: formatFileSize(file.size),
        content: parsed.content,
        docType: parsed.type,
        summary: parsed.summary,
        metadata: parsed.metadata
      });
    } catch (error) {
      console.error("File upload error:", error);
      alert("Failed to parse file");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = () => {
    let finalQuery = textInput.trim();
    
    if (uploadedFile && uploadedFile.content) {
      const prompt = `You are an expert document analyst like ChatGPT and Gemini. Analyze this document thoroughly and answer the user's question.

DOCUMENT: ${uploadedFile.name} (${uploadedFile.docType})
DETAILS: ${uploadedFile.summary}

FULL DOCUMENT CONTENT:
${uploadedFile.content}

USER QUESTION: "${finalQuery}"

ANALYSIS INSTRUCTIONS:
• Thoroughly analyze the ENTIRE document provided above
• Answer based ONLY on the document content
• If user asks "what's in this document", "summarize", or similar - provide COMPLETE overview:
  - Main purpose and topics
  - All key facts, figures, and details
  - Important sections and conclusions
• For specific questions: extract ALL relevant information from the document
• Use clear formatting: bullet points for lists, bold for important info
• For data/tables: format as structured information clearly
• Be comprehensive and thorough - include all important details
• If information is not in the document, state this clearly
• Provide end-to-end, complete analysis without truncation

RESPOND WITH YOUR COMPLETE ANALYSIS:`;

      finalQuery = prompt;
    }
    
    if (finalQuery) {
      submitTextCommand(finalQuery);
      setTextInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 overflow-hidden flex flex-col">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Orbital Background - Only shows when idle */}
      <AnimatePresence>
        {showOrbital && (
          <OrbitalAI isActive={true} />
        )}
      </AnimatePresence>

      {/* Welcome Screen */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-gradient-to-b from-slate-950 to-blue-950 flex items-center justify-center z-50"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Sparkles className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              </motion.div>
              <h1 className="text-4xl font-bold text-white mb-2">Welcome to JARVIS</h1>
              <p className="text-blue-200">Your AI Assistant</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-blue-500/20 backdrop-blur-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center">
              <span className="text-white font-bold">J</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">JARVIS</h1>
              <p className="text-blue-300 text-xs">AI Assistant</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="text-blue-400 hover:text-white">
              <Settings className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-blue-400 hover:text-white">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Terminal */}
        <div className="flex-1 overflow-y-auto">
          <Terminal logs={logs} />
        </div>

        {/* File Upload Indicator */}
        {uploadedFile && (
          <div className="px-4 py-3 border-t border-blue-500/20 backdrop-blur-lg">
            <div className="flex items-center justify-between bg-gradient-to-r from-blue-500/20 to-cyan-500/10 border border-blue-500/30 rounded-lg px-4 py-3">
              <div className="flex items-center gap-3 flex-1">
                <Upload className="w-5 h-5 text-blue-400" />
                <div className="flex-1">
                  <p className="text-white font-medium text-sm">{uploadedFile.name}</p>
                  <p className="text-blue-300 text-xs">{uploadedFile.size} • {uploadedFile.summary}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setUploadedFile(null)}
                className="text-blue-400 hover:text-red-400"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        )}

        {/* Status Indicator */}
        <div className="px-4 py-2 flex items-center justify-center gap-2">
          <div className={`w-2 h-2 rounded-full ${state.isListening ? 'bg-green-500 animate-pulse' : 'bg-blue-400'}`} />
          <p className="text-blue-300 text-xs">{state.isListening ? '🎙️ Listening' : '✓ Ready'}</p>
        </div>

        {/* Input Area */}
        <div className="px-6 py-4 border-t border-blue-500/20 backdrop-blur-xl bg-gradient-to-r from-slate-950 to-slate-900">
          <div className="flex gap-3 items-end">
            {/* Text Input */}
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask JARVIS anything... or upload a document"
              className="flex-1 bg-gradient-to-br from-slate-800 to-slate-900 border border-blue-400/30 rounded-xl px-5 py-4 text-white placeholder-blue-300/40 focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-400/30 resize-none max-h-28 shadow-lg transition-all duration-200 font-medium text-base"
              rows={1}
              data-testid="input-query"
            />

            {/* Upload Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="bg-gradient-to-br from-slate-700 to-slate-800 border border-blue-400/40 text-blue-300 hover:text-blue-100 hover:border-blue-300 transition-all duration-200 h-11 w-11"
              data-testid="button-upload"
            >
              {uploading ? <span className="animate-spin">⏳</span> : <Upload className="w-5 h-5" />}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt,.csv,.json,.md"
              onChange={handleFileUpload}
              className="hidden"
              data-testid="input-file"
            />

            {/* Microphone Button */}
            <Button
              onClick={() => toggleListening()}
              className={`h-11 w-11 rounded-xl font-semibold transition-all duration-200 shadow-lg ${state.isListening ? 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white' : 'bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'}`}
              data-testid="button-microphone"
            >
              {state.isListening ? <Square className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </Button>

            {/* Stop Button - Shows when speaking */}
            {state.isSpeaking && (
              <Button
                onClick={stopSpeaking}
                className="h-11 w-11 bg-gradient-to-br from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg"
                data-testid="button-stop"
              >
                <StopCircle className="w-5 h-5" />
              </Button>
            )}

            {/* Send Button */}
            <Button
              onClick={handleSubmit}
              disabled={!textInput.trim() && !state.isListening}
              className="h-11 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 shadow-lg"
              data-testid="button-send"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
