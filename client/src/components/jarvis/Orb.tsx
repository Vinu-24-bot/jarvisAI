import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface OrbProps {
  state: {
    isListening: boolean;
    isSpeaking: boolean;
    isProcessing: boolean;
  };
  onClick: () => void;
}

export function Orb({ state, onClick }: OrbProps) {
  const [rotation, setRotation] = useState(0);

  // Constantly rotate slowly
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(r => (r + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Determine visual state variants
  const getOrbColor = () => {
    if (state.isProcessing) return "rgb(188, 19, 254)"; // Purple
    if (state.isListening) return "rgb(255, 50, 50)"; // Red/Orange (Listening mode often warm in sci-fi, or stick to cyan) -> Actually let's do Red for active listening input
    if (state.isSpeaking) return "rgb(0, 243, 255)"; // Cyan
    return "rgba(0, 243, 255, 0.5)"; // Dim Cyan idle
  };

  return (
    <div className="relative flex items-center justify-center w-64 h-64 md:w-96 md:h-96 cursor-pointer" onClick={onClick}>
      
      {/* Outer Ring - Rotating */}
      <motion.div 
        className="absolute w-full h-full border border-primary/30 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{ borderTopColor: 'transparent', borderBottomColor: 'transparent' }}
      />

      {/* Middle Ring - Counter Rotating */}
      <motion.div 
        className="absolute w-[80%] h-[80%] border-2 border-secondary/30 rounded-full border-dashed"
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />

      {/* Core Glow */}
      <motion.div
        className="absolute w-[40%] h-[40%] rounded-full blur-xl"
        animate={{
          scale: state.isSpeaking ? [1, 1.5, 1] : state.isListening ? [1, 1.2, 1] : 1,
          opacity: state.isSpeaking ? 0.8 : 0.4,
          backgroundColor: getOrbColor()
        }}
        transition={{ duration: state.isSpeaking ? 0.5 : 2, repeat: Infinity }}
      />

      {/* Solid Core */}
      <motion.div
        className="relative w-[30%] h-[30%] rounded-full bg-black border border-primary/50 flex items-center justify-center shadow-[0_0_30px_rgba(0,243,255,0.3)]"
        animate={{
          scale: state.isProcessing ? [0.9, 1.1, 0.9] : 1,
        }}
        transition={{ duration: 0.2, repeat: Infinity }}
      >
         <div className="text-[10px] text-primary font-mono tracking-widest opacity-70">
           {state.isListening ? "REC" : state.isProcessing ? "PROC" : "IDLE"}
         </div>
      </motion.div>

      {/* Particles/Waves visualization could go here */}
    </div>
  );
}
