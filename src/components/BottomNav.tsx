import React from 'react';
import { motion } from 'motion/react';
import { audioEngine } from './AudioEngine';

interface NavItem {
  id: string;
  label: string;
  iconUrl: string;
}

interface BottomNavProps {
  activeTab: string | null;
  onSelectTab: (tabId: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
  const items: NavItem[] = [
    {
      id: 'settings',
      label: 'الإعدادات',
      iconUrl: 'https://raw.githubusercontent.com/alwjyhnyazsrhan-blip/my-game-assets/refs/heads/main/IMG_20260702_002451.png',
    },
    {
      id: 'leaderboard',
      label: 'الترتيب',
      iconUrl: 'https://raw.githubusercontent.com/alwjyhnyazsrhan-blip/my-game-assets/refs/heads/main/IMG_20260702_002239.png',
    },
    {
      id: 'chat',
      label: 'الشات',
      iconUrl: 'https://raw.githubusercontent.com/alwjyhnyazsrhan-blip/my-game-assets/refs/heads/main/IMG_20260702_002020.png',
    },
    {
      id: 'tribes',
      label: 'القبائل',
      iconUrl: 'https://raw.githubusercontent.com/alwjyhnyazsrhan-blip/my-game-assets/refs/heads/main/IMG_20260702_001729.png',
    },
    {
      id: 'shop',
      label: 'المتجر',
      iconUrl: 'https://raw.githubusercontent.com/alwjyhnyazsrhan-blip/my-game-assets/refs/heads/main/IMG_20260702_001434.png',
    },
  ];

  const handleSelect = (id: string) => {
    audioEngine.playBubble();
    if (activeTab === id) {
      onSelectTab(''); // toggle close
    } else {
      onSelectTab(id);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 w-full h-20 bg-gradient-to-t from-amber-950 via-amber-950/95 to-amber-900 border-t-2 border-amber-700/60 flex justify-around items-center z-40 px-2 shadow-2xl backdrop-blur-md">
      {items.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => handleSelect(item.id)}
            className="flex flex-col items-center justify-center relative w-16 h-16 cursor-pointer focus:outline-none group select-none"
          >
            {/* Active Glow/Ring background */}
            {isActive && (
              <motion.div
                layoutId="activeGlow"
                className="absolute inset-0 bg-amber-500/10 rounded-xl border border-amber-500/30 blur-[2px]"
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              />
            )}

            <motion.div
              className="relative flex items-center justify-center"
              whileHover={{ scale: 1.15, y: -4 }}
              whileTap={{ scale: 0.9 }}
            >
              <img
                src={item.iconUrl}
                alt={item.label}
                className={`w-9 h-9 md:w-10 md:h-10 transition-all duration-300 filter drop-shadow-md ${
                  isActive ? 'brightness-125 scale-105' : 'opacity-85 group-hover:opacity-100 group-hover:brightness-110'
                }`}
                style={{
                  imageRendering: 'pixelated',
                }}
              />
              {/* Little red dot for visual polish on chat or tribes */}
              {(item.id === 'chat' || item.id === 'tribes') && !isActive && (
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 border border-slate-900 rounded-full animate-ping" />
              )}
            </motion.div>

            <span
              className={`text-[10px] md:text-xs font-bold transition-all mt-1 ${
                isActive ? 'text-amber-300 font-extrabold' : 'text-amber-100/70 group-hover:text-amber-200'
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
