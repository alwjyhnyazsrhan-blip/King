import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Anchor, Sparkles } from 'lucide-react';
import { Ship } from '../types';

const ResponsiveShipImage: React.FC<{ level: number }> = ({ level }) => {
  const lvl = level || 1;
  if (lvl === 1) {
    return (
      <div
        style={{
          width: '100%',
          aspectRatio: '1/1',
          backgroundImage: `url('https://raw.githubusercontent.com/alwjyhnyazsrhan-blip/my-game-assets/refs/heads/main/ship_01.png')`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          borderRadius: '8px'
        }}
      />
    );
  }

  if (lvl === 2) {
    return (
      <div
        style={{
          width: '100%',
          aspectRatio: '1/1',
          backgroundImage: `url('https://raw.githubusercontent.com/alwjyhnyazsrhan-blip/my-game-assets/refs/heads/main/ship_02.png')`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          borderRadius: '8px'
        }}
      />
    );
  }

  if (lvl === 3) {
    return (
      <div
        style={{
          width: '100%',
          aspectRatio: '1/1',
          backgroundImage: `url('https://raw.githubusercontent.com/alwjyhnyazsrhan-blip/my-game-assets/refs/heads/main/ship_03.png')`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          borderRadius: '8px'
        }}
      />
    );
  }

  if (lvl === 4) {
    return (
      <div
        style={{
          width: '100%',
          aspectRatio: '1/1',
          backgroundImage: `url('https://raw.githubusercontent.com/alwjyhnyazsrhan-blip/my-game-assets/refs/heads/main/ship_04.png')`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          borderRadius: '8px'
        }}
      />
    );
  }

  if (lvl === 5) {
    return (
      <div
        style={{
          width: '100%',
          aspectRatio: '1/1',
          backgroundImage: `url('https://raw.githubusercontent.com/alwjyhnyazsrhan-blip/my-game-assets/refs/heads/main/ship_05.png')`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          borderRadius: '8px'
        }}
      />
    );
  }

  if (lvl === 6) {
    return (
      <div
        style={{
          width: '100%',
          aspectRatio: '1/1',
          backgroundImage: `url('https://raw.githubusercontent.com/alwjyhnyazsrhan-blip/my-game-assets/refs/heads/main/ship_06.png')`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          borderRadius: '8px'
        }}
      />
    );
  }

  if (lvl === 7) {
    return (
      <div
        style={{
          width: '100%',
          aspectRatio: '1/1',
          backgroundImage: `url('https://raw.githubusercontent.com/alwjyhnyazsrhan-blip/my-game-assets/refs/heads/main/ship_07.png')`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          borderRadius: '8px'
        }}
      />
    );
  }

  if (lvl === 8) {
    return (
      <div
        style={{
          width: '100%',
          aspectRatio: '1/1',
          backgroundImage: `url('https://raw.githubusercontent.com/alwjyhnyazsrhan-blip/my-game-assets/refs/heads/main/ship_08.png')`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          borderRadius: '8px'
        }}
      />
    );
  }

  if (lvl === 9) {
    return (
      <div
        style={{
          width: '100%',
          aspectRatio: '1/1',
          backgroundImage: `url('https://raw.githubusercontent.com/alwjyhnyazsrhan-blip/my-game-assets/refs/heads/main/ship_09.png')`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          borderRadius: '8px'
        }}
      />
    );
  }

  if (lvl === 10) {
    return (
      <div
        style={{
          width: '100%',
          aspectRatio: '1/1',
          backgroundImage: `url('https://raw.githubusercontent.com/alwjyhnyazsrhan-blip/my-game-assets/refs/heads/main/ship_10.png')`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          borderRadius: '8px'
        }}
      />
    );
  }

  if (lvl === 11) {
    return (
      <div
        style={{
          width: '100%',
          aspectRatio: '1/1',
          backgroundImage: `url('https://raw.githubusercontent.com/alwjyhnyazsrhan-blip/my-game-assets/refs/heads/main/ship_11.png')`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          borderRadius: '8px'
        }}
      />
    );
  }

  if (lvl === 12) {
    return (
      <div
        style={{
          width: '100%',
          aspectRatio: '1/1',
          backgroundImage: `url('https://raw.githubusercontent.com/alwjyhnyazsrhan-blip/my-game-assets/refs/heads/main/ship_12.png')`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          borderRadius: '8px'
        }}
      />
    );
  }

  if (lvl === 13) {
    return (
      <div
        style={{
          width: '100%',
          aspectRatio: '1/1',
          backgroundImage: `url('https://raw.githubusercontent.com/alwjyhnyazsrhan-blip/my-game-assets/refs/heads/main/13_ship.png')`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          borderRadius: '8px'
        }}
      />
    );
  }

  if (lvl === 14) {
    return (
      <div
        style={{
          width: '100%',
          aspectRatio: '1/1',
          backgroundImage: `url('https://raw.githubusercontent.com/alwjyhnyazsrhan-blip/my-game-assets/refs/heads/main/14_ship.png')`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          borderRadius: '8px'
        }}
      />
    );
  }

  const URL_1_TO_17 = 'https://raw.githubusercontent.com/alwjyhnyazsrhan-blip/my-game-assets/refs/heads/main/IMG-20260705-WA0016.jpg';
  const URL_18_TO_31 = 'https://raw.githubusercontent.com/alwjyhnyazsrhan-blip/my-game-assets/refs/heads/main/IMG-20260705-WA0017.jpg';
  const isFirstSheet = lvl <= 17;
  const IMAGE_URL = isFirstSheet ? URL_1_TO_17 : URL_18_TO_31;
  const normalizedLevel = isFirstSheet ? lvl : lvl - 17;
  
  const cols = 6;
  const col = (normalizedLevel - 1) % cols;
  const row = Math.floor((normalizedLevel - 1) / cols);
  
  const posX = col * 20; // 100 / (6 - 1) = 20%
  const posY = row * 50; // 100 / (3 - 1) = 50%

  return (
    <div
      style={{
        width: '100%',
        aspectRatio: '1/1',
        backgroundImage: `url('${IMAGE_URL}')`,
        backgroundPosition: `${posX}% ${posY}%`,
        backgroundSize: '600% 300%',
        backgroundRepeat: 'no-repeat',
        borderRadius: '8px'
      }}
    />
  );
};

interface ShipSpriteProps {
  ship: Ship;
  index: number;
  onClick: (e: React.MouseEvent, ship: Ship) => void;
  currentTime: number;
}

export const ShipSprite: React.FC<ShipSpriteProps> = ({ ship, index, onClick, currentTime }) => {
  // Determine positions based on index
  const baseTops = [32, 43, 56, 68, 79];
  const topPercent = baseTops[index % baseTops.length];

  // Dock position (next to the fish storage on the left shoreline)
  const dockLeft = 12 + (index % 3) * 4; // e.g. 12%, 16%, 20%
  // Fishing spot position (further right in the open sea)
  const fishingLeft = 68 + (index % 2) * 4; // e.g. 68%, 72%

  let leftPercent = dockLeft;
  let scaleX = 1;
  let isMoving = false;

  if (ship.status === 'fishing') {
    leftPercent = fishingLeft;
    scaleX = 1;
    isMoving = true;
  } else if (ship.status === 'returning') {
    // During return transition, we flip horizontally
    leftPercent = dockLeft;
    scaleX = -1;
    isMoving = true;
  } else if (ship.status === 'ready_to_collect') {
    leftPercent = fishingLeft;
    scaleX = 1;
  }

  // Calculate fishing progress
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (ship.status === 'fishing' && ship.fishingStartTime && ship.fishingDuration) {
      const interval = setInterval(() => {
        const elapsed = Date.now() - ship.fishingStartTime!;
        const remaining = Math.max(0, ship.fishingDuration! - elapsed);
        const percent = Math.min(100, (elapsed / ship.fishingDuration!) * 100);
        
        setProgress(percent);
        setTimeLeft(Math.ceil(remaining / 1000));
      }, 100);

      return () => clearInterval(interval);
    } else {
      setProgress(0);
      setTimeLeft(0);
    }
  }, [ship.status, ship.fishingStartTime, ship.fishingDuration]);

  // Premium tier skin / color filter based on level/type
  const getFilterStyle = () => {
    if (ship.type === 'large') {
      return 'hue-rotate-180 contrast-125 saturate-150 drop-shadow-[0_4px_12px_rgba(234,179,8,0.5)]';
    }
    if (ship.type === 'medium') {
      return 'hue-rotate-60 contrast-110 saturate-125 drop-shadow-[0_4px_8px_rgba(6,182,212,0.4)]';
    }
    return 'drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)]';
  };

  return (
    <motion.div
      style={{
        top: `${topPercent}%`,
      }}
      animate={{
        left: `${leftPercent}%`,
      }}
      transition={{
        duration: 3,
        ease: 'easeInOut',
      }}
      className="absolute w-24 md:w-32 z-20 cursor-pointer select-none"
    >
      {/* Visual Feedback on click target */}
      <div onClick={(e) => onClick(e, ship)} className="relative group">
        
        {/* Animated Water Ripples beneath the ship */}
        <div className="absolute -bottom-1 left-4 right-4 h-3 bg-cyan-400/20 rounded-full filter blur-[4px] animate-pulse">
          {isMoving && (
            <motion.div
              animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute inset-0 border-2 border-cyan-300 rounded-full"
            />
          )}
        </div>

        {/* Floating Ship Body */}
        <motion.div
          animate={isMoving ? {
            y: [-3, 3, -3],
            rotate: [-1.5, 1.5, -1.5]
          } : {
            y: [-1.5, 1.5, -1.5],
            rotate: [-0.5, 0.5, -0.5]
          }}
          transition={{
            repeat: Infinity,
            duration: isMoving ? 2.5 : 4,
            ease: 'easeInOut'
          }}
          style={{ transform: `scaleX(${scaleX})` }}
          className="relative transition-transform duration-500"
        >
          {/* Main Ship sprite */}
          <div className={`w-full h-auto rounded-xl border border-amber-950/20 overflow-hidden ${getFilterStyle()}`}>
            <ResponsiveShipImage level={ship.level} />
          </div>

          {/* Sparkles or Level Stars */}
          <div className="absolute top-1 right-2 flex gap-0.5 bg-slate-900/80 px-1 rounded border border-amber-500/30 text-[8px] text-amber-400">
            {Array.from({ length: Math.min(ship.level, 5) }).map((_, i) => (
              <span key={i}>★</span>
            ))}
          </div>
        </motion.div>

        {/* Status indicator and Nameplate */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center min-w-[90px] md:min-w-[110px] pointer-events-none">
          {/* Status Badge */}
          <AnimatePresence>
            {ship.status === 'fishing' && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="bg-cyan-950/95 border border-cyan-500/50 text-[9px] text-cyan-300 px-1.5 py-0.5 rounded-full shadow-md font-bold mb-1 flex items-center gap-0.5"
              >
                <span className="inline-block w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" />
                صيد... {timeLeft}ث
              </motion.div>
            )}

            {ship.status === 'returning' && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="bg-amber-950/95 border border-amber-500/50 text-[9px] text-amber-300 px-1.5 py-0.5 rounded-full shadow-md font-bold mb-1 flex items-center gap-0.5"
              >
                ⛵ عائد للمرفأ
              </motion.div>
            )}

            {ship.status === 'ready_to_collect' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="bg-emerald-900/95 border-2 border-emerald-400 text-[10px] text-emerald-100 px-2 py-0.5 rounded-full shadow-lg font-black mb-1 flex items-center gap-1 animate-bounce"
              >
                📥 اجمع الغلة!
                <Sparkles size={10} className="text-amber-300 animate-spin" />
              </motion.div>
            )}

            {ship.status === 'docked' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                className="bg-slate-900/90 border border-slate-700/60 text-[8px] text-slate-300 px-1.5 py-0.5 rounded-full shadow mb-1 flex items-center gap-0.5"
              >
                <Anchor size={8} />
                راسي بالميناء
              </motion.div>
            )}
          </AnimatePresence>

          {/* Nameplate */}
          <div className="bg-slate-900/95 border-2 border-amber-800/60 rounded-md px-1.5 py-0.5 text-center shadow-md w-full">
            <p className="text-[10px] md:text-xs text-amber-200 font-bold truncate leading-tight">
              {ship.name}
            </p>
            
            {/* Tiny stat preview */}
            <p className="text-[8px] text-slate-400 leading-none">
              سعة {ship.capacity} • {ship.assignedCrew.length > 0 ? `👥 ${ship.assignedCrew.length}` : 'بلا طاقم'}
            </p>
          </div>

          {/* Progress Bar inside Nameplate for fishing */}
          {ship.status === 'fishing' && (
            <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden mt-1 border border-slate-950">
              <motion.div
                className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>

      </div>
    </motion.div>
  );
};
