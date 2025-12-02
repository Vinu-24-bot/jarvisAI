import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface OrbitalAIProps {
  isActive: boolean;
}

export function OrbitalAI({ isActive }: OrbitalAIProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 flex items-center justify-center pointer-events-none z-5 overflow-hidden"
    >
      {/* Central bright glow */}
      <motion.div
        animate={{ scale: [1, 1.4, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-40 h-40 rounded-full bg-blue-400 blur-3xl opacity-80"
      />

      {/* Main orbiting sphere */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute w-96 h-96"
      >
        {/* Outer orbit ring - BRIGHT */}
        <div 
          className="absolute inset-0 rounded-full border-2 border-cyan-300"
          style={{
            boxShadow: '0 0 40px rgba(34, 211, 238, 1), inset 0 0 40px rgba(34, 211, 238, 0.5)'
          }}
        />

        {/* Inner orbit ring */}
        <div 
          className="absolute inset-16 rounded-full border-2 border-blue-300"
          style={{
            boxShadow: '0 0 30px rgba(96, 165, 250, 1)'
          }}
        />

        {/* AI node 1 - Blue */}
        <motion.div
          className="absolute w-7 h-7 rounded-full bg-blue-300"
          style={{ 
            top: "-10px", 
            left: "50%", 
            transform: "translateX(-50%)",
            boxShadow: "0 0 25px rgba(96, 165, 250, 1), 0 0 50px rgba(96, 165, 250, 0.8)"
          }}
          animate={{
            boxShadow: [
              "0 0 25px rgba(96, 165, 250, 1), 0 0 50px rgba(96, 165, 250, 0.8)",
              "0 0 40px rgba(96, 165, 250, 1), 0 0 70px rgba(96, 165, 250, 1)",
              "0 0 25px rgba(96, 165, 250, 1), 0 0 50px rgba(96, 165, 250, 0.8)",
            ],
          }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />

        {/* AI node 2 - Cyan */}
        <motion.div
          className="absolute w-7 h-7 rounded-full bg-cyan-300"
          style={{ 
            top: "50%", 
            right: "-10px", 
            transform: "translateY(-50%)",
            boxShadow: "0 0 25px rgba(34, 211, 238, 1), 0 0 50px rgba(34, 211, 238, 0.8)"
          }}
          animate={{
            boxShadow: [
              "0 0 25px rgba(34, 211, 238, 1), 0 0 50px rgba(34, 211, 238, 0.8)",
              "0 0 40px rgba(34, 211, 238, 1), 0 0 70px rgba(34, 211, 238, 1)",
              "0 0 25px rgba(34, 211, 238, 1), 0 0 50px rgba(34, 211, 238, 0.8)",
            ],
          }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 0.83 }}
        />

        {/* AI node 3 - Purple */}
        <motion.div
          className="absolute w-7 h-7 rounded-full bg-purple-300"
          style={{ 
            bottom: "-10px", 
            left: "50%", 
            transform: "translateX(-50%)",
            boxShadow: "0 0 25px rgba(192, 132, 250, 1), 0 0 50px rgba(192, 132, 250, 0.8)"
          }}
          animate={{
            boxShadow: [
              "0 0 25px rgba(192, 132, 250, 1), 0 0 50px rgba(192, 132, 250, 0.8)",
              "0 0 40px rgba(192, 132, 250, 1), 0 0 70px rgba(192, 132, 250, 1)",
              "0 0 25px rgba(192, 132, 250, 1), 0 0 50px rgba(192, 132, 250, 0.8)",
            ],
          }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 1.67 }}
        />
      </motion.div>

      {/* Inner faster rotating ring */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        className="absolute w-56 h-56"
      >
        <div className="absolute inset-0 rounded-full border border-blue-400/60" />
      </motion.div>

      {/* Center AI icon - EXTREMELY BRIGHT */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [1, 1, 1],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-20 h-20 rounded-full bg-gradient-to-br from-cyan-300 to-blue-400 flex items-center justify-center"
        style={{
          boxShadow: "0 0 50px rgba(34, 211, 238, 1), 0 0 100px rgba(96, 165, 250, 0.8), 0 0 150px rgba(34, 211, 238, 0.5)"
        }}
      >
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>
          <Sparkles className="w-10 h-10 text-white drop-shadow-2xl" />
        </motion.div>
      </motion.div>

      {/* Floating particles - BRIGHT CYAN */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-full bg-cyan-300"
          initial={{
            x: Math.cos((i * Math.PI) / 6) * 140,
            y: Math.sin((i * Math.PI) / 6) * 140,
          }}
          animate={{
            x: Math.cos((i * Math.PI) / 6) * 170,
            y: Math.sin((i * Math.PI) / 6) * 170,
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut"
          }}
          style={{
            boxShadow: "0 0 12px rgba(34, 211, 238, 1)"
          }}
        />
      ))}

      {/* Outer expanding pulse ring */}
      <motion.div
        animate={{ scale: [1, 3], opacity: [1, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute w-72 h-72 rounded-full border-2 border-cyan-400"
      />
    </motion.div>
  );
}
