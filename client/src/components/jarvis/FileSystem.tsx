import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Folder, File, HardDrive, X } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface FileSystemProps {
  isOpen: boolean;
  onClose: () => void;
  initialPath?: string;
}

export function FileSystem({ isOpen, onClose, initialPath = "root" }: FileSystemProps) {
  const [path, setPath] = useState<string[]>(['C:', 'Users', 'Jarvis']);
  
  // Mock file system structure
  const files = [
    { name: 'Documents', type: 'folder' },
    { name: 'Downloads', type: 'folder' },
    { name: 'Pictures', type: 'folder' },
    { name: 'Music', type: 'folder' },
    { name: 'Project_Alpha.txt', type: 'file' },
    { name: 'system_log.log', type: 'file' },
    { name: 'schematics.pdf', type: 'file' },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      >
        <div className="w-full max-w-2xl bg-card border border-primary/30 rounded-lg shadow-[0_0_30px_rgba(0,243,255,0.2)] overflow-hidden flex flex-col max-h-[600px]">
          {/* Header */}
          <div className="bg-primary/10 p-3 border-b border-primary/20 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-primary" />
              <span className="font-mono text-sm text-primary/80">{path.join(' > ')}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6 text-primary hover:bg-primary/20">
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6 grid grid-cols-3 sm:grid-cols-4 gap-4 overflow-y-auto bg-black/90">
            {files.map((file, i) => (
              <div key={i} className="flex flex-col items-center gap-2 p-3 hover:bg-primary/10 rounded-lg cursor-pointer transition-colors group">
                {file.type === 'folder' ? (
                  <Folder className="w-12 h-12 text-yellow-500/80 group-hover:text-yellow-400 transition-colors" />
                ) : (
                  <File className="w-10 h-10 text-blue-400/80 group-hover:text-blue-300 transition-colors my-1" />
                )}
                <span className="text-xs font-mono text-center truncate w-full text-primary/70 group-hover:text-primary">{file.name}</span>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-2 border-t border-primary/20 bg-primary/5 text-[10px] font-mono text-primary/50 flex justify-between px-4">
            <span>7 ITEMS</span>
            <span>FREE SPACE: 42TB</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
