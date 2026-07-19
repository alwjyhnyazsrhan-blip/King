import React from 'react';
import { motion } from 'motion/react';
import { Volume2, VolumeX, ShieldAlert } from 'lucide-react';
import { audioEngine } from './AudioEngine';

interface TopBarProps {
  gold: number;
  gems: number;
  level: number;
  isMuted: boolean;
  toggleMute: () => void;
  onOpenTutorial: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  gold,
  gems,
  level,
  isMuted,
  toggleMute,
  onOpenTutorial,
}) => {
  return (
    <div className="fixed top-2 left-1/2 -translate-x-1/2 w-[96%] max-w-4xl flex justify-between items-center z-40 gap-1.5 md:gap-3 pointer-events-auto">
      {/* Level / Guild Profile Item */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onOpenTutorial}
        className="cursor-pointer flex items-center bg-slate-900/95 border-2 border-amber-700/60 shadow-lg px-2.5 py-1 rounded-xl gap-2 backdrop-blur-md"
      >
        <img
          className="w-7 h-7 rounded-lg object-cover border border-amber-600/30"
          src="https://raw.githubusercontent.com/alwjyhnyazsrhan-blip/my-game-assets/refs/heads/main/IMG_20260702_004120.jpg"
          alt="Menu"
        />
        <div className="flex flex-col text-right">
          <span className="text-[10px] text-amber-400 font-bold leading-tight">قبطان الميناء</span>
          <span className="text-xs text-white font-black leading-none">مستوى {level}</span>
        </div>
      </motion.div>

      {/* Gems Display */}
      <div className="flex items-center bg-slate-900/95 border-2 border-amber-700/60 shadow-lg px-3 py-1.5 rounded-xl gap-2 backdrop-blur-md min-w-[90px] md:min-w-[120px] justify-between">
        <img
          className="w-7 h-7 object-contain animate-pulse"
          src="https://raw.githubusercontent.com/alwjyhnyazsrhan-blip/my-game-assets/refs/heads/main/IMG_20260702_004010.png"
          alt="Gems"
        />
        <div className="flex flex-col items-end">
          <span className="text-[9px] text-cyan-400 font-bold">الجواهر</span>
          <motion.span
            key={gems}
            initial={{ scale: 1.3, color: '#22d3ee' }}
            animate={{ scale: 1, color: '#ffffff' }}
            className="text-sm font-black"
          >
            {gems}
          </motion.span>
        </div>
      </div>

      {/* Gold Display */}
      <div className="flex items-center bg-slate-900/95 border-2 border-amber-700/60 shadow-lg px-3 py-1.5 rounded-xl gap-2 backdrop-blur-md min-w-[100px] md:min-w-[130px] justify-between">
        <img
          className="w-7 h-7 rounded-full object-cover border border-amber-500/50"
          src="https://raw.githubusercontent.com/alwjyhnyazsrhan-blip/my-game-assets/refs/heads/main/copilot_image_1782936949624.jpeg"
          alt="Gold"
        />
        <div className="flex flex-col items-end">
          <span className="text-[9px] text-amber-400 font-bold">الذهب</span>
          <motion.span
            key={gold}
            initial={{ scale: 1.3, color: '#fbbf24' }}
            animate={{ scale: 1, color: '#ffffff' }}
            className="text-sm font-black tracking-wide"
          >
            {gold.toLocaleString('ar-EG')}
          </motion.span>
        </div>
      </div>

      {/* Sound Controller */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleMute}
        className="p-2 rounded-xl bg-slate-900/95 border-2 border-amber-700/60 text-amber-400 cursor-pointer flex items-center justify-center shadow-lg backdrop-blur-md"
      >
        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </motion.button>
    </div>
  );
};
