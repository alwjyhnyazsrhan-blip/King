export interface ShipState {
  id: string;
  name: string;
  status: 'docked' | 'fishing';
  left: string;
  top: string;
  scaleX: number;
  moving: boolean;
  exists: boolean;
  crewPower: number;
  hasNetUpgrade: boolean;
  hasEngineUpgrade: boolean;
  level?: number;
  hook?: number;
  cargo?: number;
  heart?: number;
  durationStr?: string;
  power?: number;
  armor?: number;
  fishTypes?: string[];
  imgEmoji?: string;
  speedLevel?: number;
  capacityLevel?: number;
  defenseLevel?: number;
}

export interface Ship {
  id: string;
  name: string;
  status: 'docked' | 'fishing' | 'returning' | 'ready';
  level: number;
  type: string;
  imgUrl: string;
  speed: number;
  capacity: number;
  assignedCrew: string[];
  upgrades: { speedLevel: number; capacityLevel: number; netLevel: number };
}

export interface FishSpot {
  id: string;
  name: string;
  arName: string;
  depth: string;
  arDepth: string;
  duration: number;
  minLevel: number;
  icon: string;
  rewards: { fishType: string; arName: string; chance: number; minQty: number; maxQty: number; icon: string; price: number }[];
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  gold: number;
  shipsCount: number;
  isPlayer?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: string;
  avatar?: string;
  text?: string;
  time?: string;
  isMe?: boolean;
  message?: string;
  timestamp?: string;
  isPlayer?: boolean;
}

export interface Tribe {
  name: string;
  members: number;
  power: number;
  rank: number;
  joined: boolean;
  level: number;
  donations: number;
}

export interface CrewMember {
  id: string;
  name: string;
  role: string;
  power?: number;
  cost: number;
  avatar: string;
  hired?: boolean;
  shipId?: string;
  modifier?: string;
  value?: number;
}

export interface Quest {
  id: string;
  title?: string;
  target?: string;
  progress?: number;
  max?: number;
  rewardGold: number;
  rewardGems: number;
  completed: boolean;
  claimed?: boolean;
  description?: string;
  targetFish?: string;
  targetQty?: number;
  currentQty?: number;
}

export interface BattleReport {
  id: string;
  opponentName: string;
  opponentAvatar: string;
  isVictory: boolean;
  goldChange: number;
  gemsChange: number;
  expGained: number;
  time: string;
  log: string[];
}

export interface Monster {
  id: string;
  name: string;
  avatar: string;
  level: number;
  hp: number;
  maxHp: number;
  power: number;
  rewardGold: number;
  rewardGems: number;
  rewardExp: number;
}

export interface OpponentPlayer {
  id: string;
  name: string;
  avatar: string;
  level: number;
  power: number;
  goldReward: number;
  gemsReward: number;
  expReward: number;
}
