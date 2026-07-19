import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, DollarSign, Users, Award, Settings, MessageSquare, 
  Sparkles, Compass, Shield, ArrowRight, Play, CheckCircle2, Volume2, VolumeX, HelpCircle, UserPlus, RefreshCw, Trophy
} from 'lucide-react';
import { Ship, CrewMember, FishSpot, ChatMessage, Tribe, LeaderboardEntry, Quest } from '../types';
import { FISH_SPOTS, CREW_MEMBERS } from '../data';
import { audioEngine } from './AudioEngine';

interface ModalsProps {
  activeTab: string | null;
  onClose: () => void;
  gold: number;
  gems: number;
  level: number;
  fishInventory: Record<string, number>;
  ships: Ship[];
  hiredCrew: CrewMember[];
  chatMessages: ChatMessage[];
  tribes: Tribe[];
  leaderboard: LeaderboardEntry[];
  quests: Quest[];
  selectedShipForAction: Ship | null;
  fishingSpotSelectorOpen: boolean;
  upgradeSelectorOpen: boolean;
  crewSelectorOpen: boolean;
  sellConfirmOpen: boolean;
  rewardModalOpen: boolean;
  lastReward: { title: string; fishType: string; icon: string; quantity: number; goldGained: number } | null;
  isMuted: boolean;
  
  // State setters & Actions
  setGold: React.Dispatch<React.SetStateAction<number>>;
  setGems: React.Dispatch<React.SetStateAction<number>>;
  setFishInventory: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  setShips: React.Dispatch<React.SetStateAction<Ship[]>>;
  setHiredCrew: React.Dispatch<React.SetStateAction<CrewMember[]>>;
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  setTribes: React.Dispatch<React.SetStateAction<Tribe[]>>;
  setLeaderboard: React.Dispatch<React.SetStateAction<LeaderboardEntry[]>>;
  setQuests: React.Dispatch<React.SetStateAction<Quest[]>>;
  setIsMuted: (m: boolean) => void;
  
  onSendShipToFish: (shipId: string, spotId: string) => void;
  onConfirmCollect: (shipId: string) => void;
  onCloseFishingSpotSelector: () => void;
  onCloseUpgradeSelector: () => void;
  onCloseCrewSelector: () => void;
  onCloseSellConfirm: () => void;
  onCloseRewardModal: () => void;
  onResetGame: () => void;
}

const getShipImageUrl = (level: number): string | null => {
  if (level >= 1 && level <= 12) {
    const pad = level < 10 ? `0${level}` : `${level}`;
    return `https://raw.githubusercontent.com/alwjyhnyazsrhan-blip/my-game-assets/refs/heads/main/ship_${pad}.png`;
  }
  if (level === 13) {
    return 'https://raw.githubusercontent.com/alwjyhnyazsrhan-blip/my-game-assets/refs/heads/main/13_ship.png';
  }
  if (level === 14) {
    return 'https://raw.githubusercontent.com/alwjyhnyazsrhan-blip/my-game-assets/refs/heads/main/14_ship.png';
  }
  if (level === 15) {
    return 'https://raw.githubusercontent.com/alwjyhnyazsrhan-blip/my-game-assets/refs/heads/main/ship-15.png';
  }
  return null;
};

const ShipImage: React.FC<{ level: number; style?: React.CSSProperties }> = ({ level, style }) => {
  const imageUrl = getShipImageUrl(level);
  if (imageUrl) {
    return (
      <div
        style={{
          width: '100px',
          height: '100px',
          backgroundImage: `url('${imageUrl}')`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          margin: '0 auto',
          borderRadius: '8px',
          ...style
        }}
      />
    );
  }

  // الرابط المباشران من GitHub
  const URL_1_TO_17 = 'https://raw.githubusercontent.com/alwjyhnyazsrhan-blip/my-game-assets/refs/heads/main/IMG-20260705-WA0016.jpg';
  const URL_18_TO_31 = 'https://raw.githubusercontent.com/alwjyhnyazsrhan-blip/my-game-assets/refs/heads/main/IMG-20260705-WA0017.jpg';
  const isFirstSheet = level <= 17;
  const IMAGE_URL = isFirstSheet ? URL_1_TO_17 : URL_18_TO_31;
  // تعديل المستوى ليكون ضمن نطاق (1-17) للجنة الأولى أو (1-14) للجنة الثانية
  const normalizedLevel = isFirstSheet ? level : level - 17;
  const cols = 6;
  const col = (normalizedLevel - 1) % cols;
  const row = Math.floor((normalizedLevel - 1) / cols);

  const posX = col * 20; // 100 / (6 - 1) = 20%
  const posY = row * 50; // 100 / (3 - 1) = 50%

  return (
    <div
      style={{
        width: '100px',
        height: '100px',
        backgroundImage: `url('${IMAGE_URL}')`,
        backgroundPosition: `${posX}% ${posY}%`,
        backgroundSize: '600% 300%',
        backgroundRepeat: 'no-repeat',
        margin: '0 auto',
        ...style
      }}
    />
  );
};

export const Modals: React.FC<ModalsProps> = (props) => {
  const {
    activeTab, onClose, gold, gems, level, fishInventory, ships, hiredCrew,
    chatMessages, tribes, leaderboard, quests, selectedShipForAction,
    fishingSpotSelectorOpen, upgradeSelectorOpen, crewSelectorOpen, sellConfirmOpen,
    rewardModalOpen, lastReward, isMuted,
    setGold, setGems, setFishInventory, setShips, setHiredCrew, setChatMessages,
    setTribes, setLeaderboard, setQuests, setIsMuted,
    onSendShipToFish, onConfirmCollect, onCloseFishingSpotSelector, onCloseUpgradeSelector,
    onCloseCrewSelector, onCloseSellConfirm, onCloseRewardModal, onResetGame
  } = props;

  // Internal Tabs for Shop Modal
  const [shopTab, setShopTab] = useState<'buy_ships' | 'sell_fish' | 'exchange'>('sell_fish');
  const [chatInput, setChatInput] = useState('');
  const [gemMiningCooldown, setGemMiningCooldown] = useState(0);

  // Simulated gem mining cooldown
  useEffect(() => {
    if (gemMiningCooldown > 0) {
      const timer = setTimeout(() => setGemMiningCooldown(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [gemMiningCooldown]);

  // Handle ship purchase
  const handleBuyShip = (type: 'small' | 'medium' | 'large') => {
    let cost = 150;
    let name = 'قارب الصيد الجديد';
    let capacity = 20;
    let speed = 1.0;

    if (type === 'medium') {
      cost = 450;
      name = 'سفينة الأمواج الشراعية';
      capacity = 45;
      speed = 1.3;
    } else if (type === 'large') {
      cost = 1100;
      name = 'غليون الأعماق العملاق';
      capacity = 100;
      speed = 1.6;
    }

    if (gold < cost) {
      alert('الذهب غير كافٍ لشراء هذه السفينة!');
      return;
    }

    if (ships.length >= 5) {
      alert('لقد وصلت للحد الأقصى لعدد السفن (5 سفن)! بيع إحدى السفن أولاً.');
      return;
    }

    audioEngine.playUpgrade();
    setGold(prev => prev - cost);
    const newShip: Ship = {
      id: `s_new_${Date.now()}`,
      name: `${name} #${ships.length + 1}`,
      status: 'docked',
      level: 1,
      type,
      imgUrl: 'https://raw.githubusercontent.com/alwjyhnyazsrhan-blip/my-game-assets/refs/heads/main/copilot_image_1782937110028.jpeg',
      speed,
      capacity,
      assignedCrew: [],
      upgrades: { speedLevel: 1, capacityLevel: 1, netLevel: 1 }
    };

    setShips(prev => [...prev, newShip]);
  };

  // Sell individual fish
  const handleSellFish = (fishKey: string, price: number) => {
    const qty = fishInventory[fishKey] || 0;
    if (qty <= 0) return;

    audioEngine.playCoin();
    const goldEarned = qty * price;
    setGold(prev => prev + goldEarned);
    setFishInventory(prev => ({ ...prev, [fishKey]: 0 }));

    // Progress quests
    setQuests(prevQuests => prevQuests.map(q => {
      if (q.targetFish === fishKey && !q.completed) {
        const newQty = Math.min(q.targetQty, q.currentQty + qty);
        const completed = newQty >= q.targetQty;
        if (completed) {
          // Grant bonus rewards
          setTimeout(() => {
            setGold(g => g + q.rewardGold);
            setGems(gm => gm + q.rewardGems);
            audioEngine.playUpgrade();
          }, 100);
        }
        return { ...q, currentQty: newQty, completed };
      }
      return q;
    }));
  };

  // Sell all fish
  const handleSellAllFish = () => {
    let totalEarnings = 0;
    const newInventory = { ...fishInventory };

    FISH_SPOTS.forEach(spot => {
      spot.rewards.forEach(reward => {
        const qty = fishInventory[reward.fishType] || 0;
        if (qty > 0) {
          totalEarnings += qty * reward.price;
          newInventory[reward.fishType] = 0;
        }
      });
    });

    if (totalEarnings === 0) {
      alert('صندوق السمك فارغ! أرسل سفنك للصيد أولاً.');
      return;
    }

    audioEngine.playCoin();
    setGold(prev => prev + totalEarnings);
    setFishInventory(newInventory);

    // Update quest counts accordingly
    setQuests(prevQuests => prevQuests.map(q => {
      if (!q.completed) {
        const qtySold = fishInventory[q.targetFish] || 0;
        if (qtySold > 0) {
          const newQty = Math.min(q.targetQty, q.currentQty + qtySold);
          const completed = newQty >= q.targetQty;
          if (completed) {
            setTimeout(() => {
              setGold(g => g + q.rewardGold);
              setGems(gm => gm + q.rewardGems);
              audioEngine.playUpgrade();
            }, 100);
          }
          return { ...q, currentQty: newQty, completed };
        }
      }
      return q;
    }));
  };

  // Gem mining helper
  const handleMineGems = () => {
    if (gemMiningCooldown > 0) return;
    audioEngine.playCoin();
    const gemsMined = Math.floor(Math.random() * 3) + 1; // 1-3 gems
    setGems(prev => prev + gemsMined);
    setGemMiningCooldown(15); // 15s cooldown
  };

  // Send player message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    audioEngine.playBubble();
    const playerMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'البحار المغامر (أنت)',
      message: chatInput,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      isPlayer: true
    };

    setChatMessages(prev => [...prev, playerMsg]);
    setChatInput('');

    // Trigger funny NPC responder
    setTimeout(() => {
      const responses = [
        'يا قبطان، كلامك ذهب! البحر مليء بالخيرات اليوم.',
        'بالتوفيق في صيدك التالي! الشباك مجهزة.',
        'هل رأيتم السفينة الذهبية الأسطورية؟ قيمتها ٥٠٠ قطعة ذهبية!',
        'طاقمي جاهز للإبحار، سنلحق بكم قريباً.'
      ];
      const npcNames = ['النوخذة منصور', 'سيد البحار', 'صقر الساحل', 'البحارة ريما'];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      const randomNPC = npcNames[Math.floor(Math.random() * npcNames.length)];

      setChatMessages(prev => [...prev, {
        id: `npc_${Date.now()}`,
        sender: randomNPC,
        message: randomResponse,
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
      }]);
      audioEngine.playBubble();
    }, 2000);
  };

  // Tribe actions
  const handleJoinTribe = (tribeId: string) => {
    audioEngine.playUpgrade();
    setTribes(prev => prev.map(t => {
      if (t.id === tribeId) {
        return { ...t, isJoined: true, membersCount: t.membersCount + 1 };
      }
      return { ...t, isJoined: false }; // leave other tribes
    }));
  };

  // Upgrades
  const handleUpgradeAttr = (shipId: string, type: 'speed' | 'capacity' | 'net') => {
    const ship = ships.find(s => s.id === shipId);
    if (!ship) return;

    let cost = 100;
    let nextLevel = 1;

    if (type === 'speed') {
      nextLevel = ship.upgrades.speedLevel + 1;
      cost = nextLevel * 80;
    } else if (type === 'capacity') {
      nextLevel = ship.upgrades.capacityLevel + 1;
      cost = nextLevel * 70;
    } else if (type === 'net') {
      nextLevel = ship.upgrades.netLevel + 1;
      cost = nextLevel * 100;
    }

    if (gold < cost) {
      alert('الذهب غير كافٍ لترقية هذه الصفة!');
      return;
    }

    audioEngine.playUpgrade();
    setGold(prev => prev - cost);
    setShips(prevShips => prevShips.map(s => {
      if (s.id === shipId) {
        const updatedUpgrades = { ...s.upgrades };
        let updatedSpeed = s.speed;
        let updatedCapacity = s.capacity;

        if (type === 'speed') {
          updatedUpgrades.speedLevel = nextLevel;
          updatedSpeed += 0.15; // Speed boost
        } else if (type === 'capacity') {
          updatedUpgrades.capacityLevel = nextLevel;
          updatedCapacity += 10; // Capacity boost
        } else if (type === 'net') {
          updatedUpgrades.netLevel = nextLevel;
        }

        return {
          ...s,
          upgrades: updatedUpgrades,
          speed: Number(updatedSpeed.toFixed(2)),
          capacity: updatedCapacity,
          level: Math.max(s.level, Math.floor((updatedUpgrades.speedLevel + updatedUpgrades.capacityLevel + updatedUpgrades.netLevel) / 3))
        };
      }
      return s;
    }));
  };

  // Crew assignment
  const handleBuyCrew = (crew: CrewMember) => {
    if (gold < crew.cost) {
      alert('الذهب غير كافٍ لتوظيف هذا البحار!');
      return;
    }
    if (hiredCrew.some(c => c.id === crew.id)) {
      alert('هذا البحار ينتمي لطاقمك بالفعل!');
      return;
    }

    audioEngine.playUpgrade();
    setGold(prev => prev - crew.cost);
    setHiredCrew(prev => [...prev, crew]);
  };

  const handleAssignCrewToShip = (crewId: string, shipId: string) => {
    const crew = hiredCrew.find(c => c.id === crewId);
    const ship = ships.find(s => s.id === shipId);
    if (!crew || !ship) return;

    if (ship.assignedCrew.some(c => c.id === crewId)) {
      // Unassign
      audioEngine.playBubble();
      setShips(prevShips => prevShips.map(s => {
        if (s.id === shipId) {
          return {
            ...s,
            assignedCrew: s.assignedCrew.filter(c => c.id !== crewId)
          };
        }
        return s;
      }));
    } else {
      // Assign
      if (ship.assignedCrew.length >= 3) {
        alert('السفينة مكتظة! الحد الأقصى ٣ بحارة لكل سفينة.');
        return;
      }

      // Check if crew member is already assigned somewhere else, if so unassign from there
      audioEngine.playUpgrade();
      setShips(prevShips => prevShips.map(s => {
        let cleanCrew = s.assignedCrew.filter(c => c.id !== crewId);
        if (s.id === shipId) {
          cleanCrew = [...cleanCrew, crew];
        }
        return { ...s, assignedCrew: cleanCrew };
      }));
    }
  };

  // Sell ship confirm
  const handleConfirmSellShip = () => {
    if (!selectedShipForAction) return;
    audioEngine.playCoin();
    let reward = 200;
    if (selectedShipForAction.type === 'medium') reward = 400;
    if (selectedShipForAction.type === 'large') reward = 900;

    // Apply upgrade refund
    reward += (selectedShipForAction.upgrades.speedLevel + selectedShipForAction.upgrades.capacityLevel) * 20;

    setGold(prev => prev + reward);
    setShips(prev => prev.filter(s => s.id !== selectedShipForAction.id));
    onCloseSellConfirm();
  };

  return (
    <AnimatePresence>
      {/* ----------------- POPUP TABS MAIN MODALS ----------------- */}
      {activeTab && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 30, opacity: 0 }}
            className="bg-slate-900 border-2 border-amber-500 rounded-3xl w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden shadow-2xl relative"
            dir="rtl"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-l from-amber-950 via-amber-900/40 to-slate-900 border-b border-amber-600/30 flex justify-between items-center">
              <div className="flex items-center gap-2">
                {activeTab === 'shop' && <span className="text-xl">🏪</span>}
                {activeTab === 'tribes' && <span className="text-xl">🛡️</span>}
                {activeTab === 'chat' && <span className="text-xl">💬</span>}
                {activeTab === 'leaderboard' && <span className="text-xl">🏆</span>}
                {activeTab === 'settings' && <span className="text-xl">⚙️</span>}
                
                <h2 className="text-lg font-black text-amber-300">
                  {activeTab === 'shop' && 'المتجر البحري الفاخر'}
                  {activeTab === 'tribes' && 'اتحاد القبائل والصيادين'}
                  {activeTab === 'chat' && 'راديو وموجة الشات'}
                  {activeTab === 'leaderboard' && 'ترتيب عظماء البحار'}
                  {activeTab === 'settings' && 'إعدادات السفن'}
                </h2>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">

              {/* 1. SHOP TAB */}
              {activeTab === 'shop' && (
                <div className="space-y-4">
                  {/* Shop Subheaders */}
                  <div className="flex bg-slate-950 p-1 rounded-xl gap-1 border border-slate-800">
                    <button
                      onClick={() => setShopTab('sell_fish')}
                      className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        shopTab === 'sell_fish' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      🐟 بيع الأسماك
                    </button>
                    <button
                      onClick={() => setShopTab('buy_ships')}
                      className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        shopTab === 'buy_ships' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      ⛵ شراء السفن ({ships.length}/5)
                    </button>
                    <button
                      onClick={() => setShopTab('exchange')}
                      className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        shopTab === 'exchange' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      💎 مناجم الجواهر
                    </button>
                  </div>

                  {/* Sell Fish Inventory Panel */}
                  {shopTab === 'sell_fish' && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                        <div className="text-right">
                          <p className="text-xs text-slate-400">صندوق الصيد الخاص بك</p>
                          <p className="text-sm font-bold text-amber-200">بع الأسماك للحصول على الذهب وتحقيق المهام!</p>
                        </div>
                        <button
                          onClick={handleSellAllFish}
                          className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-black text-xs px-3 py-2 rounded-lg cursor-pointer transition-all shadow"
                        >
                          💸 بيع كل الغلة
                        </button>
                      </div>

                      {/* Fish list */}
                      <div className="grid grid-cols-1 gap-2">
                        {(() => {
                          const allRewards = FISH_SPOTS.flatMap(s => s.rewards);
                          // Unique by fishType
                          const uniqueRewards = allRewards.filter((v, i, a) => a.findIndex(t => t.fishType === v.fishType) === i);
                          
                          return uniqueRewards.map(reward => {
                            const count = fishInventory[reward.fishType] || 0;
                            return (
                              <div
                                key={reward.fishType}
                                className="flex justify-between items-center bg-slate-800/80 p-3 rounded-xl border border-slate-700/50"
                              >
                                <div className="flex items-center gap-2.5">
                                  <span className="text-2xl">{reward.icon}</span>
                                  <div className="text-right">
                                    <p className="text-sm font-bold text-white">{reward.arName}</p>
                                    <p className="text-xs text-slate-400">سعر الحبة: {reward.price} ذهب</p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3">
                                  <span className="text-sm font-extrabold text-cyan-400 bg-cyan-950/50 border border-cyan-800/30 px-2.5 py-1 rounded-lg">
                                    {count} حبة
                                  </span>
                                  <button
                                    onClick={() => handleSellFish(reward.fishType, reward.price)}
                                    disabled={count === 0}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                      count > 0 
                                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer shadow' 
                                        : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                                    }`}
                                  >
                                    بيع الغلة
                                  </button>
                                </div>
                              </div>
                            );
                          });
                        })()}
                      </div>
                    </div>
                  )}

                  {/* Buy Ships panel */}
                  {shopTab === 'buy_ships' && (
                    <div className="space-y-3">
                      {/* Ship Small */}
                      <div className="flex justify-between items-center bg-slate-800/80 p-3 rounded-2xl border border-slate-700/50">
                        <div className="flex items-center gap-3">
                          <div className="relative w-[100px] h-[100px] bg-slate-950/80 rounded-2xl overflow-hidden border border-amber-900/40 flex items-center justify-center">
                            <ShipImage level={1} />
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-amber-200">قارب صيد صغير (الافتراضي)</p>
                            <p className="text-xs text-slate-400">سعة: ٢٠ سمكة • سرعة: ١.٠</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleBuyShip('small')}
                          className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black px-3 py-2 rounded-xl transition-all cursor-pointer"
                        >
                          🪙 ١٥٠ ذهب
                        </button>
                      </div>

                      {/* Ship Medium */}
                      <div className="flex justify-between items-center bg-slate-800/80 p-3 rounded-2xl border border-slate-700/50">
                        <div className="flex items-center gap-3">
                          <div className="relative w-[100px] h-[100px] bg-slate-950/80 rounded-2xl overflow-hidden border border-amber-900/40 flex items-center justify-center">
                            <ShipImage level={8} />
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-cyan-300">سفينة الأمواج الشراعية</p>
                            <p className="text-xs text-slate-400">سعة: ٤٥ سمكة • سرعة: ١.٣</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleBuyShip('medium')}
                          className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black px-3 py-2 rounded-xl transition-all cursor-pointer"
                        >
                          🪙 ٤٥٠ ذهب
                        </button>
                      </div>

                      {/* Ship Large */}
                      <div className="flex justify-between items-center bg-slate-800/80 p-3 rounded-2xl border border-slate-700/50">
                        <div className="flex items-center gap-3">
                          <div className="relative w-[100px] h-[100px] bg-slate-950/80 rounded-2xl overflow-hidden border border-amber-900/40 flex items-center justify-center">
                            <ShipImage level={25} />
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1">
                              <p className="text-sm font-bold text-yellow-400">غليون الأعماق العملاق</p>
                              <span className="text-[9px] bg-yellow-950 text-yellow-400 border border-yellow-800 px-1 rounded">مميز</span>
                            </div>
                            <p className="text-xs text-slate-400">سعة: ١٠٠ سمكة • سرعة: ١.٦</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleBuyShip('large')}
                          className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black px-3 py-2 rounded-xl transition-all cursor-pointer"
                        >
                          🪙 ١,١٠٠ ذهب
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Exchange gems panel */}
                  {shopTab === 'exchange' && (
                    <div className="space-y-4">
                      <div className="bg-slate-950/80 p-4 rounded-2xl border border-amber-600/20 text-center">
                        <p className="text-2xl mb-1">💎⛏️</p>
                        <h4 className="text-sm font-bold text-cyan-300">التنقيب السريع عن الجواهر</h4>
                        <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                          انقر لحفر الصخور البحرية والحصول على جواهر مجانية فوراً! يمكنك الاستفادة من الجواهر لتسريع الصيد.
                        </p>
                        
                        <div className="mt-4">
                          <button
                            onClick={handleMineGems}
                            disabled={gemMiningCooldown > 0}
                            className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all ${
                              gemMiningCooldown > 0
                                ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 cursor-pointer shadow-lg shadow-cyan-500/20'
                            }`}
                          >
                            {gemMiningCooldown > 0 ? `الانتظار لإعادة الحفر (${gemMiningCooldown}ث)` : '⛏️ تنقيب (احصل على جواهر!)'}
                          </button>
                        </div>
                      </div>

                      {/* Trade gold for gems */}
                      <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50 flex justify-between items-center">
                        <div className="text-right">
                          <p className="text-xs text-slate-300">مبادلة الذهب بالجواهر</p>
                          <p className="text-[10px] text-slate-400">استبدل ٢٠٠ قطعة ذهبية مقابل ٢ جوهرة</p>
                        </div>
                        <button
                          onClick={() => {
                            if (gold < 200) {
                              alert('الذهب غير كافٍ للمبادلة!');
                              return;
                            }
                            audioEngine.playCoin();
                            setGold(prev => prev - 200);
                            setGems(prev => prev + 2);
                          }}
                          className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer"
                        >
                          المبادلة الآن
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 2. TRIBES TAB */}
              {activeTab === 'tribes' && (
                <div className="space-y-4">
                  <div className="bg-slate-950/60 p-3 rounded-2xl border border-amber-600/10 text-center">
                    <p className="text-xs text-slate-300">انضم لقبيلة صيادين لتشارك التحديات وترتقي بالترتيب العالمي!</p>
                  </div>

                  <div className="space-y-3">
                    {tribes.map((tribe) => (
                      <div
                        key={tribe.id}
                        className={`p-3.5 rounded-2xl border transition-all ${
                          tribe.isJoined 
                            ? 'bg-amber-950/30 border-amber-500 shadow-md shadow-amber-950/20' 
                            : 'bg-slate-800/80 border-slate-700/60'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="text-right">
                            <div className="flex items-center gap-2">
                              <span className="text-base">🛡️</span>
                              <h4 className="text-sm font-black text-white">{tribe.name}</h4>
                              {tribe.isJoined && (
                                <span className="text-[8px] bg-amber-500 text-slate-950 font-bold px-1.5 py-0.5 rounded-full">
                                  منضم
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 mt-1">{tribe.description}</p>
                            <p className="text-[10px] text-amber-500 mt-1">👑 إجمالي الكؤوس: {tribe.totalTrophies}</p>
                          </div>

                          <div className="flex flex-col items-end gap-2">
                            <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                              👥 {tribe.membersCount} صياد
                            </span>
                            {!tribe.isJoined && (
                              <button
                                onClick={() => handleJoinTribe(tribe.id)}
                                className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-3 py-1 rounded-lg cursor-pointer transition-all"
                              >
                                انضمام
                              </button>
                            )}
                          </div>
                        </div>

                        {/* If joined, show tribe collective project */}
                        {tribe.isJoined && (
                          <div className="mt-3 pt-3 border-t border-amber-900/30">
                            <div className="flex justify-between text-[10px] text-slate-300 mb-1">
                              <span>التحدي الجماعي: صيد 100 سمكة سلمون</span>
                              <span className="font-bold text-amber-400">42/100</span>
                            </div>
                            <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-amber-500 h-full rounded-full" style={{ width: '42%' }} />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. CHAT TAB */}
              {activeTab === 'chat' && (
                <div className="flex flex-col h-[50vh] space-y-3">
                  <div className="flex-1 overflow-y-auto space-y-2 bg-slate-950/80 p-3 rounded-2xl border border-slate-800/80">
                    {chatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-2.5 rounded-xl max-w-[85%] text-right text-xs leading-relaxed ${
                          msg.isPlayer
                            ? 'bg-amber-500 text-slate-950 mr-auto font-bold rounded-tr-none'
                            : 'bg-slate-800 text-slate-100 ml-auto rounded-tl-none border border-slate-700/40'
                        }`}
                      >
                        <div className="flex justify-between items-center gap-4 mb-0.5 text-[9px] opacity-75">
                          <span className="font-black">{msg.sender}</span>
                          <span>{msg.timestamp}</span>
                        </div>
                        <p>{msg.message}</p>
                      </div>
                    ))}
                  </div>

                  {/* Chat input form */}
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="اكتب رسالة للبحارة..."
                      className="flex-1 bg-slate-800 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white text-right focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="submit"
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-4 py-2 rounded-xl cursor-pointer"
                    >
                      إرسال
                    </button>
                  </form>
                </div>
              )}

              {/* 4. LEADERBOARD TAB */}
              {activeTab === 'leaderboard' && (
                <div className="space-y-3">
                  <div className="bg-slate-950/50 p-3 rounded-xl border border-amber-500/20 flex items-center justify-between">
                    <div className="text-right">
                      <p className="text-xs text-slate-400">رتبتك الحالية في الخليج</p>
                      <p className="text-sm font-black text-amber-300">المركز الرابع (4) ⚓</p>
                    </div>
                    <Trophy size={28} className="text-amber-400 animate-bounce" />
                  </div>

                  <div className="space-y-2">
                    {leaderboard.map((player) => (
                      <div
                        key={player.name}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                          player.isPlayer
                            ? 'bg-amber-950/40 border-amber-500'
                            : 'bg-slate-800/60 border-slate-700/40'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`text-sm font-black w-6 h-6 rounded-full flex items-center justify-center ${
                            player.rank === 1 ? 'bg-yellow-500 text-slate-950' :
                            player.rank === 2 ? 'bg-slate-300 text-slate-950' :
                            player.rank === 3 ? 'bg-amber-700 text-slate-950' :
                            'bg-slate-700 text-slate-300'
                          }`}>
                            {player.rank}
                          </span>
                          <div className="text-right">
                            <p className="text-xs font-black text-white">{player.name}</p>
                            <p className="text-[9px] text-slate-400">يمتلك {player.shipsCount} سفن نشطة</p>
                          </div>
                        </div>

                        <span className="text-xs font-bold text-amber-400 font-mono">
                          {player.gold} ذهب
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. SETTINGS TAB */}
              {activeTab === 'settings' && (
                <div className="space-y-4">
                  {/* Audio Toggle */}
                  <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 flex justify-between items-center">
                    <div className="text-right">
                      <h4 className="text-sm font-bold text-white">المؤثرات الصوتية والرياح</h4>
                      <p className="text-xs text-slate-400 mt-0.5">تشغيل أو كتم أصوات الصيد والأمواج</p>
                    </div>
                    <button
                      onClick={() => {
                        audioEngine.playBubble();
                        setIsMuted(!isMuted);
                      }}
                      className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                        !isMuted 
                          ? 'bg-emerald-950/60 border-emerald-500 text-emerald-400' 
                          : 'bg-rose-950/60 border-rose-900 text-rose-400'
                      }`}
                    >
                      {!isMuted ? <Volume2 size={20} /> : <VolumeX size={20} />}
                    </button>
                  </div>

                  {/* Tutorial Help Panel */}
                  <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 text-right">
                    <div className="flex items-center gap-1.5 text-amber-300 mb-2 font-black">
                      <HelpCircle size={16} />
                      <h3>دليل الصياد المبتدئ</h3>
                    </div>
                    <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
                      <li>انقر على أي سفينة راسية بالميناء لإظهار قائمة الخيارات.</li>
                      <li>انقر على زر <b>🎣 صيد</b> لاختيار منطقة الصيد وإرسال السفينة للبحر.</li>
                      <li>عند انتهاء مؤقت الصيد، انقر على السفينة واضغط <b>🪣 جني</b> لإعادتها.</li>
                      <li>بع الأسماك المصطادة في <b>المتجر</b> للحصول على الذهب والجواهر!</li>
                      <li>استفد من الذهب لترقية سرعة وحمولة سفنك أو توظيف طاقم محترف.</li>
                    </ul>
                  </div>

                  {/* Danger Zone */}
                  <div className="bg-rose-950/20 p-4 rounded-2xl border border-rose-900/40 text-right">
                    <h3 className="text-xs font-black text-rose-300 mb-1">منطقة الخطر</h3>
                    <p className="text-[11px] text-slate-400 mb-3">حذف وإعادة ضبط كافة تقدمك باللعبة والذهب الحالي.</p>
                    <button
                      onClick={() => {
                        if (confirm('هل أنت متأكد من إعادة ضبط اللعبة بالكامل والبدء من جديد؟')) {
                          onResetGame();
                          onClose();
                        }
                      }}
                      className="bg-rose-900 hover:bg-rose-800 text-white text-xs font-bold px-3 py-2 rounded-xl cursor-pointer transition-all shadow"
                    >
                      إعادة ضبط اللعبة
                    </button>
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        </div>
      )}

      {/* ----------------- FISHING SPOT SELECTOR OVERLAY ----------------- */}
      {fishingSpotSelectorOpen && selectedShipForAction && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-slate-900 border-2 border-amber-500 rounded-3xl w-full max-w-md p-5 text-right relative"
            dir="rtl"
          >
            <button
              onClick={onCloseFishingSpotSelector}
              className="absolute top-4 left-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🗺️</span>
              <h3 className="text-base font-black text-amber-300">
                أين تريد إرسال "{selectedShipForAction.name}"؟
              </h3>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              كل منطقة تحتوي على أسماك مميزة وأوقات إبحار مختلفة. تأكد من ملاءمة سعة سفينتك!
            </p>

            <div className="space-y-2.5">
              {FISH_SPOTS.map((spot) => {
                const isLocked = level < spot.minLevel;
                // Calculate modified duration based on ship speed upgrade & crew modifiers
                let speedMultiplier = selectedShipForAction.speed;
                selectedShipForAction.assignedCrew.forEach(c => {
                  if (c.modifier === 'speed') {
                    speedMultiplier *= c.value;
                  }
                });
                const actualDuration = Math.max(2, Math.round(spot.duration / speedMultiplier));

                return (
                  <div
                    key={spot.id}
                    className={`p-3 rounded-2xl border transition-all ${
                      isLocked 
                        ? 'bg-slate-950/50 border-slate-800 opacity-60' 
                        : 'bg-slate-800 hover:bg-slate-800/80 border-slate-700 cursor-pointer'
                    }`}
                    onClick={() => {
                      if (isLocked) {
                        alert(`هذه المنطقة تتطلب مستوى قبطان ${spot.minLevel} على الأقل!`);
                        return;
                      }
                      onSendShipToFish(selectedShipForAction.id, spot.id);
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{spot.icon}</span>
                        <div className="text-right">
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-sm font-bold text-white">{spot.arName}</h4>
                            {isLocked && (
                              <span className="text-[8px] bg-rose-950 text-rose-400 border border-rose-900 px-1.5 py-0.5 rounded">
                                مقفل
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            العمق: {spot.arDepth} • الوقت الفعلي: {actualDuration} ثوانٍ
                          </p>
                        </div>
                      </div>

                      {!isLocked && (
                        <Play size={16} className="text-amber-400 shrink-0" />
                      )}
                    </div>

                    {/* Fish caught preview */}
                    {!isLocked && (
                      <div className="mt-2.5 pt-2 border-t border-slate-700/50 flex flex-wrap gap-1">
                        {spot.rewards.map(r => (
                          <span key={r.fishType} className="text-[8px] bg-slate-950 text-slate-300 px-1.5 py-0.5 rounded border border-slate-800">
                            {r.icon} {r.arName}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}

      {/* ----------------- UPGRADE SELECTOR OVERLAY ----------------- */}
      {upgradeSelectorOpen && selectedShipForAction && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-slate-900 border-2 border-amber-500 rounded-3xl w-full max-w-md p-5 text-right relative"
            dir="rtl"
          >
            <button
              onClick={onCloseUpgradeSelector}
              className="absolute top-4 left-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🔧</span>
              <h3 className="text-base font-black text-amber-300">
                ترقية وتطوير "{selectedShipForAction.name}"
              </h3>
            </div>

            <div className="space-y-3">
              {/* Speed Upgrade */}
              <div className="p-3 bg-slate-800 rounded-2xl border border-slate-700 flex justify-between items-center">
                <div className="text-right">
                  <h4 className="text-xs font-bold text-white">سرعة الإبحار والمحرك</h4>
                  <p className="text-[10px] text-slate-400">المستوى الحالي: {selectedShipForAction.upgrades.speedLevel} (سرعة {selectedShipForAction.speed}x)</p>
                </div>
                <button
                  onClick={() => handleUpgradeAttr(selectedShipForAction.id, 'speed')}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-black px-3 py-1.5 rounded-xl cursor-pointer"
                >
                  🪙 {(selectedShipForAction.upgrades.speedLevel + 1) * 80} ذهب
                </button>
              </div>

              {/* Capacity Upgrade */}
              <div className="p-3 bg-slate-800 rounded-2xl border border-slate-700 flex justify-between items-center">
                <div className="text-right">
                  <h4 className="text-xs font-bold text-white">سعة خزان الصيد</h4>
                  <p className="text-[10px] text-slate-400">المستوى الحالي: {selectedShipForAction.upgrades.capacityLevel} (سعة {selectedShipForAction.capacity} سمكة)</p>
                </div>
                <button
                  onClick={() => handleUpgradeAttr(selectedShipForAction.id, 'capacity')}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-black px-3 py-1.5 rounded-xl cursor-pointer"
                >
                  🪙 {(selectedShipForAction.upgrades.capacityLevel + 1) * 70} ذهب
                </button>
              </div>

              {/* Net Quality Upgrade */}
              <div className="p-3 bg-slate-800 rounded-2xl border border-slate-700 flex justify-between items-center">
                <div className="text-right">
                  <h4 className="text-xs font-bold text-white">جودة وتماسك الشباك</h4>
                  <p className="text-[10px] text-slate-400">المستوى الحالي: {selectedShipForAction.upgrades.netLevel} (+{(selectedShipForAction.upgrades.netLevel - 1) * 10}% جودة صيد)</p>
                </div>
                <button
                  onClick={() => handleUpgradeAttr(selectedShipForAction.id, 'net')}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-black px-3 py-1.5 rounded-xl cursor-pointer"
                >
                  🪙 {(selectedShipForAction.upgrades.netLevel + 1) * 100} ذهب
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* ----------------- CREW SELECTOR OVERLAY ----------------- */}
      {crewSelectorOpen && selectedShipForAction && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-slate-900 border-2 border-amber-500 rounded-3xl w-full max-w-md p-5 text-right relative max-h-[85vh] flex flex-col overflow-hidden"
            dir="rtl"
          >
            <button
              onClick={onCloseCrewSelector}
              className="absolute top-4 left-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">👥</span>
              <h3 className="text-base font-black text-amber-300">
                إدارة طاقم "{selectedShipForAction.name}"
              </h3>
            </div>

            <p className="text-xs text-slate-400 mb-3">
              عيّن ما يصل إلى ٣ بحارة لزيادة كفاءة السفينة وقيمة الغلة المسترجعة!
            </p>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {/* Hired / Assignable Crew List */}
              <div className="space-y-2">
                <h4 className="text-xs font-black text-amber-200">👥 الطاقم المتاح للتعيين:</h4>
                {hiredCrew.length === 0 ? (
                  <p className="text-[11px] text-slate-500 bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                    لم تقم بتوظيف أي بحارة بعد. وظف بحارة مميزين من القائمة بالأسفل أولاً!
                  </p>
                ) : (
                  hiredCrew.map(crew => {
                    const isAssignedToThis = selectedShipForAction.assignedCrew.some(c => c.id === crew.id);
                    // Check if assigned to any other ship
                    const otherShipWithThisCrew = ships.find(s => s.id !== selectedShipForAction.id && s.assignedCrew.some(c => c.id === crew.id));

                    return (
                      <div key={crew.id} className="p-3 bg-slate-800 rounded-xl border border-slate-700/60 flex justify-between items-center">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl bg-slate-950 w-10 h-10 rounded-full flex items-center justify-center border border-slate-700">
                            {crew.avatar}
                          </span>
                          <div className="text-right">
                            <p className="text-xs font-bold text-white">{crew.name}</p>
                            <p className="text-[9px] text-slate-400">
                              {crew.role} • {
                                crew.modifier === 'speed' ? `سرعة إضافية +${Math.round((crew.value - 1) * 100)}%` :
                                crew.modifier === 'capacity' ? `سعة إضافية +${Math.round((crew.value - 1) * 100)}%` :
                                `مضاعف قيمة الصيد +${Math.round((crew.value - 1) * 100)}%`
                              }
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleAssignCrewToShip(crew.id, selectedShipForAction.id)}
                          className={`text-[10px] font-black px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                            isAssignedToThis
                              ? 'bg-rose-950/60 border border-rose-800 text-rose-300'
                              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                          }`}
                        >
                          {isAssignedToThis ? 'إلغاء التعيين' : otherShipWithThisCrew ? 'نقل لهذه السفينة' : 'تعيين بالسفينة'}
                        </button>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Hire list */}
              <div className="space-y-2 pt-3 border-t border-slate-800">
                <h4 className="text-xs font-black text-amber-200">⚓ نوادي التوظيف (بحارة للتعيين):</h4>
                {CREW_MEMBERS.filter(c => !hiredCrew.some(hc => hc.id === c.id)).map(crew => (
                  <div key={crew.id} className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/80 flex justify-between items-center">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{crew.avatar}</span>
                      <div className="text-right">
                        <p className="text-xs font-bold text-white">{crew.name}</p>
                        <p className="text-[9px] text-slate-400">
                          {crew.role} • {
                            crew.modifier === 'speed' ? `سرعة +${Math.round((crew.value - 1) * 100)}%` :
                            crew.modifier === 'capacity' ? `سعة +${Math.round((crew.value - 1) * 100)}%` :
                            `قيمة الغنائم +${Math.round((crew.value - 1) * 100)}%`
                          }
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleBuyCrew(crew)}
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-1.5 rounded-lg cursor-pointer"
                    >
                      🪙 {crew.cost} ذهب
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* ----------------- CONFIRM SELL OVERLAY ----------------- */}
      {sellConfirmOpen && selectedShipForAction && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.85 }}
            animate={{ scale: 1 }}
            className="bg-slate-900 border-2 border-rose-500 rounded-3xl p-5 text-center max-w-xs text-white"
            dir="rtl"
          >
            <div className="text-3xl mb-2">⚓💰</div>
            <h3 className="text-base font-black text-rose-400">بيع السفينة</h3>
            <p className="text-xs text-slate-300 mt-2">
              هل أنت متأكد من رغبتك في تفكيك وبيع سفينة "{selectedShipForAction.name}"؟
            </p>
            
            <div className="my-4 text-sm font-black text-amber-400 bg-amber-950/40 py-1.5 rounded-xl border border-amber-900/40">
              +{selectedShipForAction.type === 'large' ? 900 : selectedShipForAction.type === 'medium' ? 400 : 200} ذهب
            </div>

            <div className="flex gap-2">
              <button
                onClick={onCloseSellConfirm}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
              >
                إلغاء
              </button>
              <button
                onClick={handleConfirmSellShip}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                تأكيد البيع
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ----------------- REWARD RESULT MODAL ----------------- */}
      {rewardModalOpen && lastReward && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.8, rotate: -2 }}
            animate={{ scale: 1, rotate: 0 }}
            className="bg-slate-900 border-2 border-emerald-500 rounded-3xl p-6 text-center max-w-xs text-white shadow-2xl relative overflow-hidden"
            dir="rtl"
          >
            {/* Ambient gold glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent pointer-events-none" />

            <div className="text-sm text-emerald-400 font-bold mb-1">تمت عودة السفينة بالسلامة!</div>
            <div className="text-5xl my-3 animate-bounce">{lastReward.icon}</div>
            
            <h3 className="text-lg font-black text-white">{lastReward.title}</h3>
            
            <div className="text-2xl font-black text-amber-300 my-2">
              {lastReward.quantity}x حبة سمك
            </div>

            <p className="text-[11px] text-slate-400 max-w-xs">
              تم تخزين الأسماك بنجاح في مخزن الأسماك. يمكنك التوجه إلى <b>المتجر</b> لبيعها وجني الأرباح الكبيرة!
            </p>

            <button
              onClick={onCloseRewardModal}
              className="w-full py-2.5 mt-5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl cursor-pointer transition-all shadow-lg shadow-emerald-700/20"
            >
              موافق (الحمد لله)
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
