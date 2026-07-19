import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Ship } from '../types';
import { Anchor, Users, TrendingUp, DollarSign, Compass, Inbox } from 'lucide-react';
import { audioEngine } from './AudioEngine';

interface ShipMenuProps {
  ship: Ship;
  position: { x: number; y: number };
  onClose: () => void;
  onAction: (actionType: 'fish' | 'collect' | 'crew' | 'upgrade' | 'sell') => void;
}

export const ShipMenu: React.FC<ShipMenuProps> = ({ ship, position, onClose, onAction }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Adjust x and y so it stays inside screen boundaries
  const adjustedX = Math.min(position.x - 60, window.innerWidth - 220);
  const adjustedY = Math.min(position.y - 100, window.innerHeight - 180);

  const handleBtnClick = (action: 'fish' | 'collect' | 'crew' | 'upgrade' | 'sell') => {
    audioEngine.playBubble();
    onAction(action);
    onClose();
  };

  return (
    <motion.div
      ref={menuRef}
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.85, opacity: 0 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      style={{
        left: `${adjustedX}px`,
        top: `${adjustedY}px`,
      }}
      className="absolute bg-slate-950/95 border-2 border-amber-500 rounded-2xl p-2.5 shadow-2xl z-50 flex gap-2.5 items-center pointer-events-auto backdrop-blur-md"
      dir="rtl"
    >
      {/* Dynamic Main Action: Fish or Collect */}
      {ship.status === 'docked' && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleBtnClick('fish')}
          className="flex flex-col items-center justify-center p-2 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 font-black cursor-pointer shadow-md min-w-[55px]"
        >
          <div className="w-9 h-9 rounded-full bg-slate-950/25 flex items-center justify-center mb-1 text-lg">
            🎣
          </div>
          <span className="text-[10px]">إبحار وصيد</span>
        </motion.button>
      )}

      {ship.status === 'ready_to_collect' && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleBtnClick('collect')}
          className="flex flex-col items-center justify-center p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-black cursor-pointer shadow-md min-w-[55px] animate-pulse"
        >
          <div className="w-9 h-9 rounded-full bg-slate-950/25 flex items-center justify-center mb-1 text-lg">
            🪣
          </div>
          <span className="text-[10px]">جني المحصول</span>
        </motion.button>
      )}

      {/* Crew management */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleBtnClick('crew')}
        className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-amber-500/50 text-white cursor-pointer min-w-[50px]"
      >
        <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center mb-1 text-amber-400">
          <Users size={16} />
        </div>
        <span className="text-[9px]">الطاقم</span>
      </motion.button>

      {/* Upgrades */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleBtnClick('upgrade')}
        className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-amber-500/50 text-white cursor-pointer min-w-[50px]"
      >
        <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center mb-1 text-yellow-400">
          <TrendingUp size={16} />
        </div>
        <span className="text-[9px]">ترقية</span>
      </motion.button>

      {/* Sell Ship */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleBtnClick('sell')}
        className="flex flex-col items-center justify-center p-2 rounded-xl bg-rose-950/40 border border-rose-800/60 hover:bg-rose-900/60 text-rose-300 cursor-pointer min-w-[50px]"
      >
        <div className="w-8 h-8 rounded-lg bg-rose-900/40 flex items-center justify-center mb-1">
          <DollarSign size={14} />
        </div>
        <span className="text-[9px]">بيع</span>
      </motion.button>
    </motion.div>
  );
};
