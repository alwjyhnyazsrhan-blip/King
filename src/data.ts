import { Ship, FishSpot, CrewMember, ChatMessage, LeaderboardEntry, Quest } from './types';

export const FISH_SPOTS: FishSpot[] = [
  {
    id: 'spot1',
    name: 'Shallow Waters',
    arName: 'المياه الضحلة 🌊',
    depth: 'Shallow',
    arDepth: 'ضحلة (قريبة)',
    duration: 10, // seconds
    minLevel: 1,
    icon: '🐟',
    rewards: [
      { fishType: 'anchovy', arName: 'أنشوجة', chance: 60, minQty: 10, maxQty: 30, icon: '🐟', price: 2 },
      { fishType: 'sardine', arName: 'سردين', chance: 40, minQty: 5, maxQty: 15, icon: '🐟', price: 4 }
    ]
  },
  {
    id: 'spot2',
    name: 'Deep Reefs',
    arName: 'الشعاب العميقة 🪸',
    depth: 'Medium',
    arDepth: 'متوسطة (صخرية)',
    duration: 25, // seconds
    minLevel: 2,
    icon: '🦀',
    rewards: [
      { fishType: 'salmon', arName: 'سلمون', chance: 50, minQty: 4, maxQty: 12, icon: '🐟', price: 8 },
      { fishType: 'clownfish', arName: 'سمكة المهرج', chance: 30, minQty: 3, maxQty: 8, icon: '🐠', price: 15 },
      { fishType: 'crab', arName: 'سلطعون الأزرق', chance: 20, minQty: 2, maxQty: 5, icon: '🦀', price: 25 }
    ]
  },
  {
    id: 'spot3',
    name: 'Open Ocean',
    arName: 'أعالي البحار 🌊☠️',
    depth: 'Deep',
    arDepth: 'عميقة ومكشوفة',
    duration: 50, // seconds
    minLevel: 3,
    icon: '🦈',
    rewards: [
      { fishType: 'tuna', arName: 'تونة عملاقة', chance: 60, minQty: 3, maxQty: 8, icon: '🐟', price: 22 },
      { fishType: 'swordfish', arName: 'سمكة السيف', chance: 30, minQty: 1, maxQty: 4, icon: '🐡', price: 45 },
      { fishType: 'shark', arName: 'قرش النمر', chance: 10, minQty: 1, maxQty: 2, icon: '🦈', price: 120 }
    ]
  },
  {
    id: 'spot4',
    name: 'Mysterious Abyss',
    arName: 'الخندق الغامض 🔮🏺',
    depth: 'Abyssal',
    arDepth: 'سحيقة جداً',
    duration: 90, // seconds
    minLevel: 4,
    icon: '🦑',
    rewards: [
      { fishType: 'squid', arName: 'حبار الأعماق', chance: 50, minQty: 2, maxQty: 6, icon: '🦑', price: 55 },
      { fishType: 'pearl', arName: 'محار اللؤلؤ', chance: 35, minQty: 1, maxQty: 3, icon: '🦪', price: 150 },
      { fishType: 'golden_fish', arName: 'السمكة الذهبية الأسطورية', chance: 15, minQty: 1, maxQty: 1, icon: '🔱', price: 500 }
    ]
  }
];

export const CREW_MEMBERS: CrewMember[] = [
  {
    id: 'crew1',
    name: 'سندباد',
    role: 'قبطان محنك',
    modifier: 'speed',
    value: 1.3, // +30% Speed
    cost: 150,
    avatar: '👨‍✈️'
  },
  {
    id: 'crew2',
    name: 'صالح الصياد',
    role: 'رائد الشباك',
    modifier: 'capacity',
    value: 1.4, // +40% capacity
    cost: 180,
    avatar: '🧔'
  },
  {
    id: 'crew3',
    name: 'ريما الملاحة',
    role: 'عالمة خرائط',
    modifier: 'multiplier',
    value: 1.25, // +25% fish value
    cost: 250,
    avatar: '👩‍✈️'
  },
  {
    id: 'crew4',
    name: 'سليم الهادئ',
    role: 'ميكانيكي سفن',
    modifier: 'speed',
    value: 1.15, // +15% Speed
    cost: 80,
    avatar: '👨‍🔧'
  }
];

export const INITIAL_SHIPS: Ship[] = [
  {
    id: 's1',
    name: 'الفجر السعيد',
    status: 'docked',
    level: 1,
    type: 'small',
    imgUrl: 'https://raw.githubusercontent.com/alwjyhnyazsrhan-blip/my-game-assets/refs/heads/main/copilot_image_1782937110028.jpeg',
    speed: 1.0,
    capacity: 20,
    assignedCrew: [],
    upgrades: { speedLevel: 1, capacityLevel: 1, netLevel: 1 }
  },
  {
    id: 's2',
    name: 'موجة البحر',
    status: 'docked',
    level: 1,
    type: 'small',
    imgUrl: 'https://raw.githubusercontent.com/alwjyhnyazsrhan-blip/my-game-assets/refs/heads/main/copilot_image_1782937110028.jpeg',
    speed: 1.0,
    capacity: 20,
    assignedCrew: [],
    upgrades: { speedLevel: 1, capacityLevel: 1, netLevel: 1 }
  },
  {
    id: 's3',
    name: 'الصياد الصغير',
    status: 'docked',
    level: 1,
    type: 'small',
    imgUrl: 'https://raw.githubusercontent.com/alwjyhnyazsrhan-blip/my-game-assets/refs/heads/main/copilot_image_1782937110028.jpeg',
    speed: 1.0,
    capacity: 20,
    assignedCrew: [],
    upgrades: { speedLevel: 1, capacityLevel: 1, netLevel: 1 }
  }
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  { id: 'm1', sender: 'النوخذة منصور', message: 'يا شباب، مياه الخندق مليئة بمحار اللؤلؤ اليوم! 🦪', timestamp: '10:30' },
  { id: 'm2', sender: 'سيد البحار', message: 'هل قام أحد بترقية سفينته إلى السفينة الضخمة؟ سرعتها رهيبة ⚡', timestamp: '10:32' },
  { id: 'm3', sender: 'صقر الساحل', message: 'موج البحر هادئ، طاقمي حصل على سمكة ذهبية أسطورية! 🔱', timestamp: '10:35' },
  { id: 'm4', sender: 'البحار المغامر', message: 'أهلاً بكم في خليج الصيادين العظيم ⚓', timestamp: '10:36' }
];

export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: 'سيد البحار 👑', gold: 12500, shipsCount: 5 },
  { rank: 2, name: 'النوخذة منصور', gold: 8400, shipsCount: 4 },
  { rank: 3, name: 'صقر الساحل', gold: 5200, shipsCount: 3 },
  { rank: 4, name: 'البحار المغامر (أنت)', gold: 100, shipsCount: 3, isPlayer: true },
  { rank: 5, name: 'أمير الأمواج', gold: 90, shipsCount: 2 }
];

export const INITIAL_QUESTS: Quest[] = [
  { id: 'q1', description: 'اصطد 30 حبة سردين طازجة من المياه الضحلة', targetFish: 'sardine', targetQty: 30, currentQty: 0, rewardGold: 150, rewardGems: 2, completed: false },
  { id: 'q2', description: 'اجمع 10 أسماك السلمون المرجاني الفاخرة', targetFish: 'salmon', targetQty: 10, currentQty: 0, rewardGold: 300, rewardGems: 4, completed: false },
  { id: 'q3', description: 'اعثر على لؤلؤة ثمينة واحدة من الخندق الغامض', targetFish: 'pearl', targetQty: 1, currentQty: 0, rewardGold: 500, rewardGems: 10, completed: false }
];
