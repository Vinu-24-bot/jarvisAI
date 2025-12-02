import { useEffect, useRef } from "react";
import { CommandLog } from "@/hooks/use-jarvis";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Copy, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generatePDF } from "@/services/pdf-generator";
import { useState } from "react";

interface TerminalProps {
  logs: CommandLog[];
}

export function Terminal({ logs }: TerminalProps) {
  const endRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const downloadResponseAsPDF = (content: string, timestamp: Date) => {
    const filename = `jarvis-response-${timestamp.getTime()}.pdf`;
    generatePDF(content, filename);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-gradient-to-b from-slate-900/30 to-transparent">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-6 p-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <AnimatePresence initial={false}>
          {logs.map((log, index) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className={`flex gap-4 ${log.type === 'user' ? 'justify-end' : 'justify-start'}`}
              onHoverStart={() => setHoveredId(log.id)}
              onHoverEnd={() => setHoveredId(null)}
            >
              {log.type !== 'user' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 text-xs font-bold shadow-lg"
                >
                  J
                </motion.div>
              )}
              
              <motion.div
                className={`max-w-2xl group px-5 py-4 rounded-2xl backdrop-blur-lg transition-all ${
                  log.type === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-3xl rounded-tr-sm shadow-lg hover:shadow-xl'
                    : log.type === 'error'
                    ? 'bg-red-900/30 border border-red-500/50 text-red-200 shadow-lg'
                    : 'bg-white/8 border border-white/20 text-gray-100 shadow-lg hover:bg-white/12 hover:border-white/30'
                }`}
                whileHover={{ y: -2 }}
              >
                <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                  {log.text.replace(/^[💡🤖⏹️🎤#>]+ /, '')}
                </p>
                
                {log.type === 'system' && log.text.startsWith('💡') && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: hoveredId === log.id ? 1 : 0, y: hoveredId === log.id ? 0 : -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex gap-2 mt-4 pt-4 border-t border-white/10"
                  >
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-auto px-3 py-2 text-xs hover:bg-white/20 transition-all rounded-lg"
                        onClick={() => downloadResponseAsPDF(log.text.replace('💡 ', ''), log.timestamp)}
                        data-testid="button-download-pdf"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        PDF
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-auto px-3 py-2 text-xs hover:bg-white/20 transition-all rounded-lg"
                        onClick={() => copyToClipboard(log.text.replace('💡 ', ''), log.id)}
                        data-testid="button-copy"
                      >
                        {copied === log.id ? (
                          <>
                            <Check className="w-4 h-4 mr-1" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-1" />
                            Copy
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={endRef} />
      </div>
    </div>
  );
}
