import React, { useState, useEffect } from 'react';
import { ShipState, ChatMessage, Tribe, CrewMember, Quest, BattleReport } from './types';
import LoginScreen from './components/LoginScreen';
import BattleSection from './components/BattleSection';
import { Shield, Coins, Anchor, Flame, Sparkles, Wrench, Gauge, Package, X, Fish, Clock, Zap, Sword, Compass } from 'lucide-react';
import { audioEngine } from './components/AudioEngine';

export interface ShopShipSpec {
  level: number;
  name: string;
  subName: string;
  hook: number;
  cargo: number;
  heart: number;
  durationStr: string;
  power: number;
  armor: number;
  fishTypes: string[];
  price: number;
  emoji: string;
  rarity?: string;
  attackStat?: number;
  defenseStat?: number;
  speedStat?: number;
  capacityStat?: number;
  description?: string;
}

export const SHOP_SHIPS: ShopShipSpec[] = [
  { level: 1, name: 'قارب الصياد', subName: 'قارب صيد خشبي تقليدي', hook: 50, cargo: 5000, heart: 500, durationStr: '01:00', power: 10, armor: 10, fishTypes: ['سردين', 'أنشوجة'], price: 400, emoji: '🛶' },
  { level: 2, name: 'قارب شراعي صغير', subName: 'قارب شراعي خفيف سريع', hook: 100, cargo: 10000, heart: 1000, durationStr: '09:14', power: 20, armor: 20, fishTypes: ['سردين', 'رنجة', 'سمك ذوب'], price: 1500, emoji: '⛵' },
  { level: 3, name: 'مركب شراعي', subName: 'مركب شراعي متين للبحار القريبة', hook: 200, cargo: 20000, heart: 2000, durationStr: '17:29', power: 40, armor: 40, fishTypes: ['بلم', 'بوري', 'أنشوجة'], price: 4000, emoji: '⛵' },
  { level: 4, name: 'مركب شراعي متوسط', subName: 'مركب شراعي عريض ومستقر', hook: 400, cargo: 40000, heart: 4000, durationStr: '25:43', power: 80, armor: 80, fishTypes: ['روبيان', 'سلطعون صغير', 'سردين'], price: 9000, emoji: '⛵' },
  { level: 5, name: 'سفينة تجارية صغيرة', subName: 'سفينة تجارية بحجم مدمج للربح السريع', hook: 800, cargo: 80000, heart: 8000, durationStr: '33:58', power: 160, armor: 160, fishTypes: ['بوري', 'روبيان', 'رنجة'], price: 18000, emoji: '🚢' },
  { level: 6, name: 'سفينة تجارية متوسطة', subName: 'سفينة تجارية بسعة تخزين مضاعفة', hook: 1500, cargo: 150000, heart: 15000, durationStr: '42:12', power: 300, armor: 300, fishTypes: ['ماكريل', 'قاروص', 'روبيان'], price: 35000, emoji: '🚢' },
  { level: 7, name: 'سفينة حربية خفيفة', subName: 'حراقة سريعة ومسلحة بمدافع خفيفة', hook: 3000, cargo: 300000, heart: 30000, durationStr: '50:27', power: 600, armor: 600, fishTypes: ['نهاش', 'ماكريل'], price: 60000, emoji: '⚔️' },
  { level: 8, name: 'سفينة حربية متوسطة', subName: 'فرقاطة حديدية للهجوم والدفاع المتوازن', hook: 6000, cargo: 600000, heart: 60000, durationStr: '58:41', power: 1200, armor: 1200, fishTypes: ['تروتة', 'سلمون', 'قاروص'], price: 100000, emoji: '⚔️' },
  { level: 9, name: 'سفينة ملكية', subName: 'سفينة التاج المزينة بأفخم الأخشاب', hook: 10000, cargo: 1000000, heart: 100000, durationStr: '1h 6m', power: 2000, armor: 2000, fishTypes: ['حبار', 'نهاش', 'قد'], price: 160000, emoji: '👑' },
  { level: 10, name: 'سفينة أسطول', subName: 'سفينة قيادة الأساطيل البحرية الكبرى', hook: 20000, cargo: 2000000, heart: 200000, durationStr: '1h 15m', power: 4000, armor: 4000, fishTypes: ['سلمون', 'حبار', 'تروتة'], price: 250000, emoji: '⚓' },
  { level: 11, name: 'سفينة أسطورية', subName: 'سفينة خارقة يتردد صداها في البحار السبعة', hook: 40000, cargo: 4000000, heart: 400000, durationStr: '1h 23m', power: 8000, armor: 8000, fishTypes: ['سلمون', 'هامور', 'تونة'], price: 380000, emoji: '🌌' },
  { level: 12, name: 'سفينة التنين', subName: 'مدمرة مصممة على شكل رأس تنين مهيب', hook: 80000, cargo: 8000000, heart: 800000, durationStr: '1h 31m', power: 16000, armor: 16000, fishTypes: ['أخطبوط', 'كركند', 'حبار'], price: 550000, emoji: '🐉' },
  { level: 13, name: 'سفينة الإمبراطور', subName: 'سفينة الحرب والسطوة الإمبراطورية العظمى', hook: 160000, cargo: 16000000, heart: 1600000, durationStr: '1h 39m', power: 32000, armor: 32000, fishTypes: ['هامور', 'موسى', 'ثعبان بحر'], price: 750000, emoji: '🔱' },
  { level: 14, name: 'سفينة التيتان', subName: 'جبل عائم من الفولاذ الحربي المدمر', hook: 320000, cargo: 32000000, heart: 3200000, durationStr: '1h 48m', power: 64000, armor: 64000, fishTypes: ['كارب', 'تونة', 'ثعبان بحر'], price: 1000000, emoji: '🏛️' },
  { level: 15, name: 'سفينة المحيط العظيم', subName: 'حاكمة المحيطات العميقة والرياح العاتية', hook: 640000, cargo: 64000000, heart: 6400000, durationStr: '1h 56m', power: 128000, armor: 128000, fishTypes: ['موسى', 'كارب', 'أخطبوط'], price: 1250000, emoji: '🌊' },
  { level: 16, name: 'سفينة الأساطير', subName: 'درع الأساطير الحصين ضد كافة المخاطر', hook: 1280000, cargo: 126000000, heart: 12800000, durationStr: '2h 4m', power: 256000, armor: 256000, fishTypes: ['كركند', 'أبو سيف', 'مارلين'], price: 1450000, emoji: '🛡️' },
  { level: 17, name: 'سفينة الملوك', subName: 'جوهرة الأسطول المخصصة لملوك السلالات البحرية', hook: 2560000, cargo: 256000000, heart: 25600000, durationStr: '2h 12m', power: 512000, armor: 512000, fishTypes: ['أبو شراع', 'باراكودا', 'مارلين'], price: 1650000, emoji: '👑' },
  { level: 18, name: 'سفينة الفاتح', subName: 'سفينة الفاتح الأسطورية', hook: 5120000, cargo: 512000000, heart: 51200000, durationStr: '2h 20m', power: 102400, armor: 102400, fishTypes: ['مارلين', 'باراكودا', 'الحوت الأزرق العملاق'], price: 1800000, emoji: '🎖️', rarity: 'ملحمي', description: 'سفينة الفتح العظيم، تقود طلائع الحرب لفتح الممرات البحرية المغلقة وتأمين مسارات الصيد...' },
  { level: 19, name: 'سفينة النصر', subName: 'راية النصر التي لا تنكس في معركة', hook: 10240000, cargo: 1024000000, heart: 102400000, durationStr: '2h 28m', power: 204800, armor: 204800, fishTypes: ['أبو شراع', 'الحوت الأزرق العملاق', 'سمك التنين'], price: 2100000, emoji: '🏆', rarity: 'ملحمي', description: 'تأخذ نصرها بقوتها الضاربة ومقاومتها الاستثنائية للضربات وتجهيزها الحربي الأحدث...' },
  { level: 20, name: 'سفينة الهيمنة', subName: 'الهيمنة والسيطرة المطلقة على المياه', hook: 20480000, cargo: 2048000000, heart: 204800000, durationStr: '2h 36m', power: 409600, armor: 409600, fishTypes: ['الحوت الأزرق العملاق', 'سمك التنين', 'حبار الأعماق المضغوط'], price: 2700000, emoji: '✊', rarity: 'ملحمي', description: 'تفرض قوتها الساحقة وسيطرتها على جميع السفن الأخرى في الميدان بفضل المدافع المطورة...' },
  { level: 21, name: 'سفينة الإعصار', subName: 'الإعصار المدمر الذي يبتلع الأعداء', hook: 40960000, cargo: 4096000000, heart: 409600000, durationStr: '2h 44m', power: 819200, armor: 819200, fishTypes: ['سمك التنين', 'حبار الأعماق المضغوط', 'قرش الميجالودون'], price: 3000000, emoji: '🌀', rarity: 'ملحمي', description: 'سرعة وقدرة دوران فائقة تجعلها تتحرك كالإعصار الهائج في قلب المعركة وتبتلع السفن المهاجمة...' },
  { level: 22, name: 'سفينة الظلام', subName: 'شبح الظلام الهامس الحالك', hook: 81920000, cargo: 8192000000, heart: 819200000, durationStr: '2h 52m', power: 1638400, armor: 1638400, fishTypes: ['حبار الأعماق المضغوط', 'قرش الميجالودون', 'أخطبوط الكراكن'], price: 3400000, emoji: '🖤', rarity: 'ملحمي', description: 'تندمج مع الليل والظلام لتباغت الأعداء والوحوش بضربات دقيقة خاطفة وساحقة...' },
  { level: 23, name: 'سفينة البحرية الملكية', subName: 'فخر البحرية التاجية وحارسة الثغور', hook: 163840000, cargo: 16384000000, heart: 1638400000, durationStr: '3h 0m', power: 3276800, armor: 3276800, fishTypes: ['قرش الميجالودون', 'أخطبوط الكراكن', 'سمكة الفانوس الكونية'], price: 3900000, emoji: '⚜️', rarity: 'ملحمي', description: 'سلاح النخبة في البحرية الملكية، تحمل دروعاً فولاذية سميكة جداً ونظام دفاعي متقدم...' },
  { level: 24, name: 'سفينة المحيط الأزرق', subName: 'مروضة أمواج المحيط الزرقاء العميقة', hook: 327680000, cargo: 32768000000, heart: 3276800000, durationStr: '3h 8m', power: 6553600, armor: 6553600, fishTypes: ['أخطبوط الكراكن', 'سمكة الفانوس الكونية', 'الأوركا المدمرة'], price: 4300000, emoji: '🌊', rarity: 'ملحمي', description: 'قادرة على الملاحة في أصعب الظروف والأمواج دون أي تأثر بالهجمات والأعاصير المحيطية...' },
  { level: 25, name: 'سفينة الرعد', subName: 'صاعقة الرعد الغاضبة من السماء', hook: 655360000, cargo: 65536000000, heart: 6553600000, durationStr: '3h 16m', power: 13107200, armor: 13107200, fishTypes: ['سمكة الفانوس الكونية', 'الأوركا المدمرة', 'الحوت الأبيض الأسطوري'], price: 4800000, emoji: '⚡', rarity: 'ملحمي', description: 'تطلق صواعقها النارية الفائقة، مسببة تدميراً هائلاً ومذيباً لجميع قوى الأعداء...' },
  { level: 26, name: 'سفينة التنين الذهبي', subName: 'التنين الذهبي المجنح حارس الكنز', hook: 1310720000, cargo: 131072000000, heart: 13107200000, durationStr: '3h 24m', power: 26214400, armor: 26214400, fishTypes: ['الأوركا المدمرة', 'الحوت الأبيض الأسطوري', 'أخطبوط الكراكن'], price: 5500000, emoji: '🐉', rarity: 'أسطوري', description: 'تنانين ذهبية تزين هيكلها الحصين، تعزز هجومها ودفاعها لطراز أسطوري مهيب...' },
  { level: 27, name: 'سفينة العاصفة الكبرى', subName: 'غضب الطبيعة المتجسد في سفينة حربية', hook: 2621440000, cargo: 262144000000, heart: 26214400000, durationStr: '3h 32m', power: 52428800, armor: 52428800, fishTypes: ['الحوت الأبيض الأسطوري', 'سمكة الفانوس الكونية', 'قرش الميجالودون'], price: 6200000, emoji: '⛈️', rarity: 'أسطوري', description: 'تمخر عباب أعنف الأعاصير والعواصف دون تردد، زارعاً الرعب في قلوب المهاجمين...' },
  { level: 28, name: 'سفينة القيصر', subName: 'الحصن القيصري المصفح الفخم', hook: 5242880000, cargo: 524288000000, heart: 52428800000, durationStr: '3h 40m', power: 104857600, armor: 104857600, fishTypes: ['أخطبوط الكراكن', 'قرش الميجالودون', 'سمك التنين'], price: 7000000, emoji: '👑', rarity: 'أسطوري', description: 'بنيت لتكون قلعة عائمة غير قابلة للاختراق، تحمي كنوز الإمبراطورية وتجمع الذهب بلا حدود...' },
  { level: 29, name: 'سفينة أساطير البحر', subName: 'ملحمة أساطير البحر الغابرة', hook: 10485760000, cargo: 1048576000000, heart: 104857600000, durationStr: '3h 48m', power: 209715200, armor: 209715200, fishTypes: ['سمك التنين', 'الحوت الأزرق العملاق', 'أبو شراع'], price: 8000000, emoji: '🔱', rarity: 'أسطوري', description: 'سفينة حيكت حولها مئات الأساطير، تكتسح مياه المحيط بمهابة وجبروت وتجذب أندر الكائنات...' },
  { level: 30, name: 'سفينة سيد البحار', subName: 'الحاكم والمسيطر الأوحد على أعماق المحيط', hook: 20971520000, cargo: 2097152000000, heart: 209715200000, durationStr: '3h 56m', power: 419430400, armor: 419430400, fishTypes: ['الأوركا المدمرة', 'الحوت الأبيض الأسطوري', 'سمكة الفانوس الكونية'], price: 9500000, emoji: '🌊', rarity: 'أسطوري', description: 'يرتجف المحيط خوفاً من هدير محركاتها وقوتها التدميرية المطلقة وسعتها العملاقة للذهب...' },
  { level: 31, name: 'سفينة ملوك المحيط', subName: 'مفخرة ملوك المحيط الخارقة والنهائية', hook: 41943040000, cargo: 4194304000000, heart: 419430400000, durationStr: '4h 5m', power: 838860800, armor: 838860800, fishTypes: ['الحوت الأبيض الأسطوري', 'قرش الميجالودون', 'الأوركا المدمرة'], price: 12000000, emoji: '👑', rarity: 'أسطورة', description: 'أعظم سفينة صُنعت في التاريخ، قوة دمار شامل وسعة ذهب أسطورية غير متناهية تمثل التتويج الأقصى لأي قبطان محترف للبحار السبعة الكبرى...' }
];

export const FISH_REWARD_DATA: Record<string, { fullName: string; valPerFish: number }> = {
  'أنشوجة': { fullName: 'أنشوجة المياه الدافئة 🐟', valPerFish: 2.5 },
  'سردين': { fullName: 'سردين ملوك القرصنة 🐟', valPerFish: 4.5 },
  'رنجة': { fullName: 'سمك رنجة ذهبي 🐟', valPerFish: 7 },
  'سمك ذوب': { fullName: 'سمك ذوب نادر 🐠', valPerFish: 11 },
  'بلم': { fullName: 'سمك بلم المياه العذبة 🐟', valPerFish: 16 },
  'بوري': { fullName: 'بوري البحار الدافئة 🐟', valPerFish: 24 },
  'روبيان': { fullName: 'روبيان أحمر ملكي 🦐', valPerFish: 38 },
  'سلطعون صغير': { fullName: 'سلطعون المرجان الصغير 🦀', valPerFish: 55 },
  'ماكريل': { fullName: 'سمك ماكريل مخطط 🐟', valPerFish: 80 },
  'قاروص': { fullName: 'قاروص الصخور العملاق 🐟', valPerFish: 120 },
  'نهاش': { fullName: 'نهاش أحمر أسطوري 🐟', valPerFish: 175 },
  'تروتة': { fullName: 'تروتة قوس قزح 🐟', valPerFish: 260 },
  'سلمون': { fullName: 'سلمون الأعماق الأطلسي 🐟', valPerFish: 380 },
  'قد': { fullName: 'سمك قد بحر الشمال 🐟', valPerFish: 550 },
  'حبار': { fullName: 'حبار الأعماق العملاق 🦑', valPerFish: 800 },
  'هامور': { fullName: 'هامور الخليج الملكي 🐟', valPerFish: 1200 },
  'تونة': { fullName: 'تونة بلوفين العملاقة 🐟', valPerFish: 1800 },
  'أخطبوط': { fullName: 'أخطبوط البحار السبعة 🐙', valPerFish: 2600 },
  'كركند': { fullName: 'كركند الأعماق النادر 🦞', valPerFish: 3800 },
  'ثعبان بحر': { fullName: 'ثعبان بحر كهربائي 🐍', valPerFish: 5500 },
  'موسى': { fullName: 'سمك موسى الفاخر 🐠', valPerFish: 8000 },
  'كارب': { fullName: 'سمك كارب كوي إمبراطوري 🐟', valPerFish: 12000 },
  'أبو سيف': { fullName: 'سمك أبو سيف العملاق ⚔️', valPerFish: 18000 },
  'مارلين': { fullName: 'سمك مارلين الأزرق السريع 🦈', valPerFish: 26000 },
  'باراكودا': { fullName: 'سمك باراكودا الفتاك 🦈', valPerFish: 38000 },
  'أبو شراع': { fullName: 'سمك أبو شراع الملكي السريع ⛵', valPerFish: 55000 },
  'الحوت الأزرق العملاق': { fullName: 'الحوت الأزرق العملاق 🐋', valPerFish: 75000 },
  'سمك التنين': { fullName: 'سمك تنين الأعماق الأسطوري 🐉', valPerFish: 100000 },
  'حبار الأعماق المضغوط': { fullName: 'حبار الأعماق المضغوط 🦑', valPerFish: 140000 },
  'قرش الميجالودون': { fullName: 'قرش الميجالودون العملاق 🦈', valPerFish: 200000 },
  'أخطبوط الكراكن': { fullName: 'أخطبوط الكراكن المدمر 🐙', valPerFish: 300000 },
  'سمكة الفانوس الكونية': { fullName: 'سمكة الفانوس الكونية 🏮', valPerFish: 450000 },
  'الأوركا المدمرة': { fullName: 'الأوركا المدمرة القاتلة 🐋', valPerFish: 650000 },
  'الحوت الأبيض الأسطوري': { fullName: 'الحوت الأبيض الأسطوري (موبي ديك) 🐋', valPerFish: 1000000 },
};

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

export const ShipImage: React.FC<{ level: number; style?: React.CSSProperties }> = ({ level, style }) => {
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
  // اختيار الرابط على المستوى
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
        backgroundSize: '600% auto',
        backgroundRepeat: 'no-repeat',
        margin: '0 auto',
        ...style
      }}
    />
  );
};

export default function App() {
  // --- Authentication State ---
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('pirate_is_logged_in') === 'true';
  });

  // --- Game Currencies & Captain Stats ---
  const [gold, setGold] = useState<number>(() => {
    return parseInt(localStorage.getItem('gold') || '500');
  });
  const [gems, setGems] = useState<number>(() => {
    return parseInt(localStorage.getItem('gems') || '25');
  });
  const [exp, setExp] = useState<number>(() => {
    return parseInt(localStorage.getItem('pirate_exp') || '0');
  });

  // --- Profile Settings ---
  const [username, setUsername] = useState(() => localStorage.getItem('pirate_username') || 'سياف_البحار');
  const [avatar, setAvatar] = useState(() => localStorage.getItem('pirate_avatar') || '☠️');
  const [server, setServer] = useState(() => localStorage.getItem('pirate_server') || 'سيرفر الأسطورة 1');
  const [pirateClass, setPirateClass] = useState(() => localStorage.getItem('pirate_class') || 'صياد البحار');

  // --- Active Tab ---
  // 'harbor' = Harbor/Main Map, 'battle' = Battles, 'shop' = Shop, 'tribes' = Tribes, 'chat' = Chat, 'leaderboard' = Leaderboard, 'reports' = Battle Reports, 'settings' = Settings
  const [activeTab, setActiveTab] = useState<'harbor' | 'battle' | 'shop' | 'tribes' | 'chat' | 'leaderboard' | 'reports' | 'settings'>('harbor');
  const [shopSubTab, setShopSubTab] = useState<'hamour' | 'thihn' | 'crew_services'>('hamour');

  // --- Crew Services (Luck and Services Shop) ---
  const [crewServices, setCrewServices] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('pirate_crew_services');
    return saved ? JSON.parse(saved) : {
      luck: false,
      sailors: false,
      guide: false,
      police: false,
    };
  });

  useEffect(() => {
    localStorage.setItem('pirate_crew_services', JSON.stringify(crewServices));
  }, [crewServices]);

  // --- Ships State ---
  const [ships, setShips] = useState<ShipState[]>(() => {
    const saved = localStorage.getItem('pirate_ships_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 3) {
          const s1 = parsed.find(s => s.id === 's1') || parsed[0];
          const s2 = parsed.find(s => s.id === 's2') || parsed[1];
          const s3 = parsed.find(s => s.id === 's3') || parsed[2];
          return [
            { ...s1, id: 's1', exists: true, left: '54%', top: '41%' },
            { ...s2, id: 's2', exists: true, left: '54%', top: '48%' },
            { ...s3, id: 's3', exists: true, left: '54%', top: '63%' },
          ];
        }
      } catch (e) {
        console.error("Error parsing pirate_ships_v2:", e);
      }
    }
    return [
      { id: 's1', name: 'قارب الصياد', status: 'docked', left: '54%', top: '41%', scaleX: 1, moving: false, exists: true, crewPower: 0, hasNetUpgrade: false, hasEngineUpgrade: false, level: 1, hook: 50, cargo: 5000, heart: 500, durationStr: '01:00', power: 10, armor: 10, fishTypes: ['سردين', 'أنشوجة'], imgEmoji: '🛶' },
      { id: 's2', name: 'قارب شراعي صغير', status: 'docked', left: '54%', top: '48%', scaleX: 1, moving: false, exists: true, crewPower: 0, hasNetUpgrade: false, hasEngineUpgrade: false, level: 2, hook: 100, cargo: 10000, heart: 1000, durationStr: '09:14', power: 20, armor: 20, fishTypes: ['سردين', 'رنجة', 'سمك ذوب'], imgEmoji: '⛵' },
      { id: 's3', name: 'مركب شراعي', status: 'docked', left: '54%', top: '63%', scaleX: 1, moving: false, exists: true, crewPower: 0, hasNetUpgrade: false, hasEngineUpgrade: false, level: 3, hook: 200, cargo: 20000, heart: 2000, durationStr: '17:29', power: 40, armor: 40, fishTypes: ['بلم', 'بوري', 'أنشوجة'], imgEmoji: '⛵' },
    ];
  });

  // --- Crew State ---
  const [crew, setCrew] = useState<CrewMember[]>([
    { id: 'c1', name: 'القبطان صخر', role: 'قبطان البحار', power: 30, cost: 150, avatar: '👨‍✈️', hired: false },
    { id: 'c2', name: 'الملاح رعد', role: 'ملاح الميناء', power: 15, cost: 80, avatar: '🧭', hired: false },
    { id: 'c3', name: 'المدفعجي غضب', role: 'رئيس المدفعية', power: 45, cost: 250, avatar: '💣', hired: false },
    { id: 'c4', name: 'البحار سندباد', role: 'مستكشف الجزر', power: 20, cost: 120, avatar: '🌊', hired: false },
  ]);

  // --- Tribes State ---
  const [tribes, setTribes] = useState<Tribe[]>([
    { name: 'تحالف ملوك الكاريبي', members: 49, power: 345000, rank: 1, joined: false, level: 5, donations: 12000 },
    { name: 'تحالف أسياد البحار', members: 35, power: 210000, rank: 2, joined: false, level: 3, donations: 4500 },
    { name: 'قراصنة الموت الأحمر', members: 22, power: 145000, rank: 3, joined: false, level: 2, donations: 1800 },
    { name: 'تحالف أساطير الشرق', members: 12, power: 67000, rank: 4, joined: false, level: 1, donations: 300 },
  ]);

  // --- Quests State ---
  const [quests, setQuests] = useState<Quest[]>([
    { id: 'q1', title: 'صياد الأنشوجة النشيط', target: 'أرسل السفن للصيد 3 مرات', progress: 0, max: 3, rewardGold: 100, rewardGems: 2, completed: false, claimed: false },
    { id: 'q2', title: 'توسيع طاقم القيادة', target: 'قم بتعيين بحار واحد على الأقل', progress: 0, max: 1, rewardGold: 150, rewardGems: 5, completed: false, claimed: false },
    { id: 'q3', title: 'دعم التحالف الحليف', target: 'تبرع للتحالف بـ 50 ذهب', progress: 0, max: 50, rewardGold: 80, rewardGems: 1, completed: false, claimed: false },
  ]);

  // --- Battle Reports State ---
  const [battleReports, setBattleReports] = useState<BattleReport[]>(() => {
    const saved = localStorage.getItem('pirate_battle_reports');
    return saved ? JSON.parse(saved) : [];
  });

  // --- Chat Messages ---
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: 'm1', sender: 'قاهر_البحار', avatar: '🧙‍♂️', text: 'شباب من مستعد لغزو الوحش البحري ليفل 15 الليلة؟', time: '10:50' },
    { id: 'm2', sender: 'اللحية_السوداء', avatar: '🧔', text: 'أنا جاهز بأسطولي المطور! سفينتي الأسطورية تدمّر أي وحش.', time: '10:51' },
    { id: 'm3', sender: 'أميرة_البحر', avatar: '🧝‍♀️', text: 'هل هناك تحالف فعال لكي أنضم له؟ مستواي 45.', time: '10:52' },
    { id: 'm4', sender: 'الملاح_الصغير', avatar: '👦', text: 'كيف أحصل على المزيد من الذهب بسرعة؟', time: '10:53' },
    { id: 'm5', sender: 'قبطان_السيرفر', avatar: '🦁', text: 'يا ملاح، قم بترقية شباك الصيد من المتجر وسيزداد كسبك بشكل كبير!', time: '10:54' },
  ]);

  // --- Selection and Overlay states ---
  const [currentShipId, setCurrentShipId] = useState<string | null>(null);
  const [menu, setMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    shipId: string;
    status: 'docked' | 'fishing';
  }>({
    visible: false,
    x: 0,
    y: 0,
    shipId: '',
    status: 'docked'
  });

  const [confirmModal, setConfirmModal] = useState(false);
  const [rewardModal, setRewardModal] = useState(false);
  const [rewardFish, setRewardFish] = useState({ name: 'أنشوجة', amount: 80, value: 120 });
  const [crewModal, setCrewModal] = useState(false);
  const [activeReport, setActiveReport] = useState<BattleReport | null>(null);

  // --- Warehouses & Tower ---
  const [fishStorageLevel, setFishStorageLevel] = useState<number>(() => {
    return parseInt(localStorage.getItem('fish_storage_level') || '1');
  });
  const [shipTowerLevel, setShipTowerLevel] = useState<number>(() => {
    return parseInt(localStorage.getItem('ship_tower_level') || '1');
  });
  const [fishStorageModal, setFishStorageModal] = useState<boolean>(false);
  const [shipTowerModal, setShipTowerModal] = useState<boolean>(false);
  const [shipMarketModal, setShipMarketModal] = useState<boolean>(false);
  const [fishInventory, setFishInventory] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('pirate_fish_inventory');
    if (saved) return JSON.parse(saved);
    return {
      'أنشوجة المياه الدافئة': 15,
      'سردين ملوك القرصنة الأسطوري': 8,
      'تونة بحر الكاريبي': 3,
      'سلمون الأعماق الذهبي': 1
    };
  });

  // --- Weapons and Red Gems States (Shabek 360 Shop Integration) ---
  const [redGems, setRedGems] = useState<number>(() => {
    return parseInt(localStorage.getItem('pirate_red_gems') || '2450');
  });
  const [weapons, setWeapons] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('pirate_weapons');
    return saved ? JSON.parse(saved) : {
      smallRocket: 0,
      mediumRocket: 0,
      largeRocket: 0,
      atomicBomb: 0,
      smallRepair: 0,
      mediumRepair: 0,
      largeRepair: 0,
      legendaryRepair: 0,
    };
  });

  // --- Mute Sound ---
  const [isMuted, setIsMuted] = useState(false);

  // --- Captain Level Calculation ---
  const playerLevel = Math.floor(exp / 100) + 1;
  const expToNextLevel = playerLevel * 100;

  // --- Player Power calculation ---
  const activeShipsCount = ships.filter(s => s.exists).length;
  const crewPowerTotal = ships.filter(s => s.exists).reduce((acc, s) => acc + s.crewPower, 0);
  const shipUpgradesPower = ships
    .filter(s => s.exists)
    .reduce((acc, s) => acc + ((s.speedLevel || 1) - 1) * 1 + ((s.capacityLevel || 1) - 1) * 1 + ((s.defenseLevel || 1) - 1) * 4, 0);
  const playerPower = 10 + activeShipsCount * 5 + crewPowerTotal + (pirateClass === 'مقاتل الأساطيل' ? 15 : 0) + (shipTowerLevel - 1) * 10 + shipUpgradesPower;

  // --- Save states on change ---
  useEffect(() => {
    localStorage.setItem('gold', gold.toString());
  }, [gold]);

  useEffect(() => {
    localStorage.setItem('gems', gems.toString());
  }, [gems]);

  useEffect(() => {
    localStorage.setItem('pirate_exp', exp.toString());
  }, [exp]);

  useEffect(() => {
    localStorage.setItem('pirate_ships_v2', JSON.stringify(ships));
  }, [ships]);

  useEffect(() => {
    localStorage.setItem('pirate_username', username);
  }, [username]);

  useEffect(() => {
    localStorage.setItem('pirate_avatar', avatar);
  }, [avatar]);

  useEffect(() => {
    localStorage.setItem('pirate_server', server);
  }, [server]);

  useEffect(() => {
    localStorage.setItem('pirate_class', pirateClass);
  }, [pirateClass]);

  useEffect(() => {
    localStorage.setItem('pirate_is_logged_in', isLoggedIn.toString());
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem('fish_storage_level', fishStorageLevel.toString());
  }, [fishStorageLevel]);

  useEffect(() => {
    localStorage.setItem('ship_tower_level', shipTowerLevel.toString());
  }, [shipTowerLevel]);

  useEffect(() => {
    localStorage.setItem('pirate_fish_inventory', JSON.stringify(fishInventory));
  }, [fishInventory]);

  useEffect(() => {
    localStorage.setItem('pirate_red_gems', redGems.toString());
  }, [redGems]);

  useEffect(() => {
    localStorage.setItem('pirate_weapons', JSON.stringify(weapons));
  }, [weapons]);

  // --- Automatic ship coordinate migration on page load ---
  useEffect(() => {
    setShips(prev => prev.map(s => {
      if (s.status === 'docked') {
        const correctDock = docks[s.id];
        if (correctDock && (s.left !== correctDock.l || s.top !== correctDock.t)) {
          return { ...s, left: correctDock.l, top: correctDock.t };
        }
      } else if (s.status === 'fishing') {
        const correctFish = fishSpots[s.id];
        if (correctFish && (s.left !== correctFish.l || s.top !== correctFish.t)) {
          return { ...s, left: correctFish.l, top: correctFish.t };
        }
      }
      return s;
    }));
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem('pirate_battle_reports', JSON.stringify(battleReports));
  }, [battleReports]);

  // --- Dock & Fishing spot positions ---
  const docks: Record<string, { l: string; t: string }> = {
    s1: { l: '54%', t: '41%' },
    s2: { l: '54%', t: '48%' },
    s3: { l: '54%', t: '63%' },
    s4: { l: '54%', t: '55%' },
    s5: { l: '54%', t: '70%' },
  };

  const fishSpots: Record<string, { l: string; t: string }> = {
    s1: { l: '80%', t: '41%' },
    s2: { l: '80%', t: '48%' },
    s3: { l: '80%', t: '63%' },
    s4: { l: '80%', t: '55%' },
    s5: { l: '80%', t: '70%' },
  };

  // --- Handle global clicks to close custom menus ---
  useEffect(() => {
    const handleOutsideClick = () => {
      setMenu(prev => ({ ...prev, visible: false }));
    };
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  // --- Handle Login ---
  const handleLoginSuccess = (user: string, av: string, serv: string, pCl: string) => {
    setUsername(user);
    setAvatar(av);
    setServer(serv);
    setPirateClass(pCl);
    setIsLoggedIn(true);
  };

  // --- Handle Logout ---
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem('pirate_is_logged_in', 'false');
  };

  // --- Open Action Menu for ship ---
  const showMenu = (event: React.MouseEvent, ship: ShipState) => {
    event.stopPropagation();
    setCurrentShipId(ship.id);
    setMenu({
      visible: true,
      x: Math.min(event.clientX - 50, window.innerWidth - 150),
      y: event.clientY - 80,
      shipId: ship.id,
      status: ship.status
    });
  };

  // --- Perform Ship Actions ---
  const act = (type: 'crew' | 'sell' | 'fish' | 'collect') => {
    setMenu(prev => ({ ...prev, visible: false }));
    if (!currentShipId) return;

    if (type === 'sell') {
      setConfirmModal(true);
    } else if (type === 'crew') {
      setCrewModal(true);
    } else if (type === 'fish') {
      // Advance fish quest progress
      updateQuestProgress('q1', 1);

      setShips(prev =>
        prev.map(s => {
          if (s.id === currentShipId) {
            return {
              ...s,
              scaleX: 1,
              moving: true,
              status: 'fishing',
              left: fishSpots[s.id]?.l || '70%',
              top: fishSpots[s.id]?.t || '38%'
            };
          }
          return s;
        })
      );
    } else if (type === 'collect') {
      const selectedShip = ships.find(s => s.id === currentShipId);
      const isEngineUpgraded = selectedShip?.hasEngineUpgrade;
      const isNetUpgraded = selectedShip?.hasNetUpgrade;
      const crewPowerBonus = selectedShip?.crewPower || 0;

      setShips(prev =>
        prev.map(s => {
          if (s.id === currentShipId) {
            return {
              ...s,
              moving: false,
              scaleX: -1
            };
          }
          return s;
        })
      );

      // Return trip duration: default 2 seconds, upgraded engine takes 1 second. speedLevel reduces it even further!
      let returnTripDuration = isEngineUpgraded ? 1000 : 2000;
      const speedLvl = selectedShip?.speedLevel || 1;
      // Each speed level reduces duration by 8% (up to 80% speed increase!)
      const speedMultiplier = 1 + (speedLvl - 1) * 0.08;
      returnTripDuration = Math.max(200, Math.floor(returnTripDuration / speedMultiplier));

      if (crewServices.sailors) {
        returnTripDuration = Math.floor(returnTripDuration * 0.5);
      }

      setTimeout(() => {
        setShips(prev =>
          prev.map(s => {
            if (s.id === currentShipId) {
              return {
                ...s,
                left: docks[s.id]?.l || '45%',
                top: docks[s.id]?.t || '38%'
              };
            }
            return s;
          })
        );

        setTimeout(() => {
          setShips(prev =>
            prev.map(s => {
              if (s.id === currentShipId) {
                return {
                  ...s,
                  scaleX: 1,
                  status: 'docked'
                };
              }
              return s;
            })
          );

          // Calculate dynamic reward fish details based on ship level and specs
          const shipLevel = selectedShip?.level || 1;
          const capacityLvl = selectedShip?.capacityLevel || 1;
          // Each capacity level adds +15% cargo capacity!
          const capacityMultiplier = 1 + (capacityLvl - 1) * 0.15;
          const cargo = Math.floor((selectedShip?.cargo || 80) * capacityMultiplier);
          const shipFishTypes = selectedShip?.fishTypes && selectedShip.fishTypes.length > 0 
            ? selectedShip.fishTypes 
            : ['سردين', 'أنشوجة'];

          const randomFishName = shipFishTypes[Math.floor(Math.random() * shipFishTypes.length)];
          const fishInfo = FISH_REWARD_DATA[randomFishName] || { fullName: `${randomFishName} 🐟`, valPerFish: 3.5 };

          // Base amount caught is proportional to the ship's cargo capacity!
          const baseAmount = Math.floor(cargo * (0.8 + Math.random() * 0.2));
          let totalAmount = (isNetUpgraded ? baseAmount * 2 : baseAmount) + crewPowerBonus;
          if (pirateClass === 'صياد البحار') {
            totalAmount = Math.floor(totalAmount * 1.15);
          }

          // Apply Luck (الحظ) booster: +30% fish amount caught!
          if (crewServices.luck) {
            totalAmount = Math.floor(totalAmount * 1.3);
          }
          
          // Apply fish storage multiplier (+10% gold per level above level 1)
          let storageMultiplier = 1 + (fishStorageLevel - 1) * 0.1;
          if (crewServices.luck) {
            storageMultiplier += 0.20; // Extra 20% value from luck!
          }
          if (crewServices.sailors) {
            storageMultiplier += 0.15; // Extra 15% value from sailors logistics!
          }

          const goldReward = Math.floor(totalAmount * fishInfo.valPerFish * storageMultiplier);
          
          // Guide (المرشد) booster: doubles EXP gained!
          let expReward = Math.floor(5 + Math.random() * 5);
          if (crewServices.guide) {
            expReward = expReward * 2;
          }

          // Update fish inventory counts
          setFishInventory(prev => ({
            ...prev,
            [fishInfo.fullName]: (prev[fishInfo.fullName] || 0) + totalAmount
          }));

          setRewardFish({
            name: fishInfo.fullName,
            amount: totalAmount,
            value: goldReward
          });

          setGold(prev => prev + goldReward);
          setExp(prev => prev + expReward);
          setRewardModal(true);
        }, returnTripDuration);
      }, 500);
    }
  };

  // --- Sell Ship Confirmation ---
  const confirmSell = () => {
    if (!currentShipId) return;
    setGold(prev => prev + 250);
    setShips(prev =>
      prev.map(s => {
        if (s.id === currentShipId) {
          return { ...s, exists: false };
        }
        return s;
      })
    );
    setConfirmModal(false);
  };

  // --- Hire and assign Crew ---
  const hireCrew = (cMember: CrewMember) => {
    if (!currentShipId) return;
    if (gold < cMember.cost) {
      alert('الذهب غير كافٍ لتعيين هذا البحار!');
      return;
    }

    setGold(prev => prev - cMember.cost);
    setCrew(prev => prev.map(item => item.id === cMember.id ? { ...item, hired: true, shipId: currentShipId } : item));

    setShips(prev => prev.map(s => {
      if (s.id === currentShipId) {
        return {
          ...s,
          crewPower: s.crewPower + cMember.power
        };
      }
      return s;
    }));

    updateQuestProgress('q2', 1);
  };

  // --- Purchase Upgrades or Ships from Shop ---
  const buyShopItem = (type: 'ship' | 'net' | 'engine' | 'gold_pack', costGold: number, costGems: number, extraId?: string) => {
    if (gold < costGold) {
      alert('الذهب غير كافٍ!');
      return;
    }
    if (gems < costGems) {
      alert('الجواهر غير كافية!');
      return;
    }

    setGold(prev => prev - costGold);
    setGems(prev => prev - costGems);

    if (type === 'ship') {
      const activeCount = ships.filter(s => s.exists).length;
      if (activeCount >= 5) {
        alert('لقد وصلت للحد الأقصى من السفن في الميناء (5 سفن)!');
        return;
      }

      // Check if there is an inactive ship slot to re-enable, or create a new slot
      const existingInactive = ships.find(s => !s.exists);
      if (existingInactive) {
        setShips(prev => prev.map(s => s.id === existingInactive.id ? { ...s, exists: true, status: 'docked', left: docks[s.id].l, top: docks[s.id].t, scaleX: 1, moving: false, crewPower: 0, hasNetUpgrade: false, hasEngineUpgrade: false } : s));
      } else {
        const nextId = `s${ships.length + 1}`;
        const newShip: ShipState = {
          id: nextId,
          name: extraId === 'royal' ? 'المدمرة الملكية الأسطورية' : 'سفينة المغامر المطورة',
          status: 'docked',
          left: docks[nextId]?.l || '75%',
          top: docks[nextId]?.t || '41%',
          scaleX: 1,
          moving: false,
          exists: true,
          crewPower: extraId === 'royal' ? 30 : 0,
          hasNetUpgrade: false,
          hasEngineUpgrade: false
        };
        setShips(prev => [...prev, newShip]);
      }
      alert('تم شراء سفينة جديدة بنجاح في الميناء!');
    } else if (type === 'net') {
      setShips(prev => prev.map(s => ({ ...s, hasNetUpgrade: true })));
      alert('تمت ترقية شباك جميع السفن إلى شباك ملوك القرصنة المزدوجة!');
    } else if (type === 'engine') {
      setShips(prev => prev.map(s => ({ ...s, hasEngineUpgrade: true })));
      alert('تمت ترقية المحركات لجميع السفن بنجاح! زادت سرعة الإياب بشكل مضاعف.');
    } else if (type === 'gold_pack') {
      setGold(prev => prev + 1500);
      alert('تم شراء باقة ذهب ملوك القرصنة (+1500 ذهب)!');
    }
  };

  const buyShipLevel = (spec: ShopShipSpec) => {
    if (gold < spec.price) {
      alert(`⚠️ الذهب غير كافٍ! تحتاج إلى ${spec.price.toLocaleString('en-US')} ذهب لشراء هذه السفينة.`);
      return;
    }

    const activeCount = ships.filter(s => s.exists).length;
    const maxActive = 3;
    const warehouseCapacity = Math.floor(shipTowerLevel / 3) + 1;
    const warehouseCount = ships.filter(s => !s.exists).length;

    let goesToActive = activeCount < maxActive;

    if (!goesToActive) {
      if (warehouseCount >= warehouseCapacity) {
        alert(`⚠️ لقد امتلأ مستودع ومخزن السفن لديك (${warehouseCount}/${warehouseCapacity})! يرجى بيع بعض السفن لتوفير مساحة.`);
        return;
      }
    }

    setGold(prev => prev - spec.price);
    audioEngine.playCoin();

    const inactiveIndex = ships.findIndex(s => !s.exists);
    if (inactiveIndex !== -1) {
      setShips(prev => {
        const copy = [...prev];
        const slotId = copy[inactiveIndex].id;
        copy[inactiveIndex] = {
          id: slotId,
          name: spec.name,
          status: 'docked',
          left: docks[slotId]?.l || '54%',
          top: docks[slotId]?.t || '41%',
          scaleX: 1,
          moving: false,
          exists: goesToActive,
          crewPower: spec.power,
          hasNetUpgrade: false,
          hasEngineUpgrade: false,
          level: spec.level,
          hook: spec.hook,
          cargo: spec.cargo,
          heart: spec.heart,
          durationStr: spec.durationStr,
          power: spec.power,
          armor: spec.armor,
          fishTypes: spec.fishTypes,
          imgEmoji: spec.emoji
        };
        return copy;
      });
    } else {
      const nextId = `s${ships.length + 1}`;
      const newShip: ShipState = {
        id: nextId,
        name: spec.name,
        status: 'docked',
        left: docks[nextId]?.l || '54%',
        top: docks[nextId]?.t || '41%',
        scaleX: 1,
        moving: false,
        exists: goesToActive,
        crewPower: spec.power,
        hasNetUpgrade: false,
        hasEngineUpgrade: false,
        level: spec.level,
        hook: spec.hook,
        cargo: spec.cargo,
        heart: spec.heart,
        durationStr: spec.durationStr,
        power: spec.power,
        armor: spec.armor,
        fishTypes: spec.fishTypes,
        imgEmoji: spec.emoji
      };
      setShips(prev => [...prev, newShip]);
    }

    if (goesToActive) {
      alert(`🎉 تم شراء ${spec.name} وإضافتها لأسطولك النشط بنجاح!`);
    } else {
      alert(`🎉 تم شراء ${spec.name} وإرسالها لمستودع ومخزن السفن بنجاح!`);
    }
  };

  const toggleShipActive = (shipId: string) => {
    const targetShip = ships.find(s => s.id === shipId);
    if (!targetShip) return;

    if (targetShip.exists) {
      const warehouseCapacity = Math.floor(shipTowerLevel / 3) + 1;
      const warehouseCount = ships.filter(s => !s.exists).length;
      if (warehouseCount >= warehouseCapacity) {
        alert(`⚠️ لا يمكن إلغاء تفعيل السفينة! مستودع السفن ممتلئ (${warehouseCount}/${warehouseCapacity}).`);
        return;
      }
      setShips(prev => prev.map(s => s.id === shipId ? { ...s, exists: false } : s));
      alert(`📥 تم إرسال ${targetShip.name} إلى مستودع ومخزن السفن.`);
    } else {
      const activeCount = ships.filter(s => s.exists).length;
      const maxActive = 3;
      if (activeCount >= maxActive) {
        alert(`⚠️ لقد وصلت للحد الأقصى من السفن النشطة (3 سفن)! يرجى إلغاء تفعيل إحدى سفنك النشطة أولاً.`);
        return;
      }
      setShips(prev => prev.map(s => s.id === shipId ? { ...s, exists: true } : s));
      alert(`⛵ تم تفعيل ${targetShip.name} وإضافتها إلى الأسطول النشط.`);
    }
  };

  // --- Purchase Weapons or Repairs from Shabek 360 Shop ---
  const buyWeaponItem = (itemId: string, costType: 'gold' | 'blueGems', costValue: number) => {
    if (costType === 'gold' && gold < costValue) {
      alert('الذهب غير كافٍ لشراء هذا الصنف!');
      return;
    }
    if (costType === 'blueGems' && gems < costValue) {
      alert('الجواهر غير كافية لشراء هذا الصنف!');
      return;
    }

    if (costType === 'gold') {
      setGold(prev => prev - costValue);
    } else {
      setGems(prev => prev - costValue);
    }

    setWeapons(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));

    alert('تم الشراء بنجاح! تم إضافة السلاح/المصلح إلى ترسانتك النشطة.');
  };

  // --- Purchase Crew / Services (Luck and Services Shop) ---
  const buyCrewService = (key: string, name: string, price: number) => {
    if (crewServices[key]) {
      alert(`لقد قمت بتعيين وتفعيل ${name} بالفعل وهو نشط حالياً!`);
      return;
    }
    if (gems < price) {
      alert(`الجواهر الزرقاء غير كافية لتعيين ${name}! تحتاج إلى ${price} جوهرة.`);
      return;
    }
    setGems(prev => prev - price);
    setCrewServices(prev => ({
      ...prev,
      [key]: true
    }));
    alert(`🎉 تهانينا! تم تعيين وتفعيل ${name} في أسطولك بنجاح!`);
  };

  // --- Stealing / Pirate Raid Simulation (الشرطي حارس من السرقة) ---
  useEffect(() => {
    if (!isLoggedIn) return;

    const interval = setInterval(() => {
      // 25% chance of a raid
      if (Math.random() > 0.25) return;

      if (crewServices.police) {
        // FOILED RAID!
        const alertMsg = "👮 أحبط شرطي البحرية محاولة تسلل لصوص البحر وسرقة مخازن الأسماك والذهب وحمى الميناء بنجاح!";
        alert(alertMsg);

        // Send a system message to chat as well
        setChatMessages(prev => [...prev, {
          id: `m_raid_${Date.now()}`,
          sender: '🛡️ شرطي الميناء',
          avatar: '👮',
          text: `🚨 تم إحباط محاولة تسلل أسطول قراصنة معادي إلى ميناء القبطان @${username}! تم تأمين جميع الخزائن والمخازن بنجاح بفضل حراسة الشرطي للميناء.`,
          time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
        }]);
      } else {
        // SUCCESSFUL THEFT! Player loses gold
        const lostGold = Math.min(gold, 150);
        if (lostGold > 0) {
          setGold(prev => Math.max(0, prev - lostGold));
          const alertMsg = `🏴‍☠️ تسلل قراصنة لصوص إلى مينائك وسرقوا ${lostGold} عملة ذهبية من خزائنك! اشترِ "الشرطي" من متجر الحظ والخدمات لحماية مينائك.`;
          alert(alertMsg);

          setChatMessages(prev => [...prev, {
            id: `m_raid_${Date.now()}`,
            sender: '🏴‍☠️ قراصنة اللصوص',
            avatar: '💀',
            text: `🔥 نجحنا في التسلل لنهب ميناء القبطان @${username} وسرقنا ${lostGold} ذهبة لعدم وجود حراسة كافية! هاهاها!`,
            time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
          }]);
        }
      }
    }, 50000); // Check every 50 seconds

    return () => clearInterval(interval);
  }, [isLoggedIn, crewServices, gold, username]);

  // --- Handle Join Tribe ---
  const joinTribe = (tribeName: string) => {
    setTribes(prev => prev.map(t => {
      if (t.name === tribeName) {
        return { ...t, joined: !t.joined, members: t.joined ? t.members - 1 : t.members + 1 };
      }
      return { ...t, joined: false }; // Can only be in one tribe
    }));
  };

  // --- Tribe Donation ---
  const donateToTribe = (tribeName: string) => {
    if (gold < 50) {
      alert('الذهب غير كافٍ للتبرع (الحد الأدنى للتبرع هو 50 ذهب)!');
      return;
    }
    setGold(prev => prev - 50);
    setTribes(prev => prev.map(t => {
      if (t.name === tribeName) {
        const nextDonations = t.donations + 50;
        const nextLevel = Math.floor(nextDonations / 2000) + 1;
        return { ...t, donations: nextDonations, level: nextLevel, power: t.power + 1500 };
      }
      return t;
    }));
    updateQuestProgress('q3', 50);
    alert('شكرًا لتبرعك! لقد ساهمت في ترقية قوة تحالفك.');
  };

  // --- Update Quest Progress ---
  const updateQuestProgress = (id: string, amount: number) => {
    setQuests(prev => prev.map(q => {
      if (q.id === id && !q.completed) {
        const nextProgress = Math.min(q.progress + amount, q.max);
        return {
          ...q,
          progress: nextProgress,
          completed: nextProgress >= q.max
        };
      }
      return q;
    }));
  };

  // --- Claim Quest Rewards ---
  const claimQuestReward = (qId: string, rGold: number, rGems: number) => {
    setQuests(prev => prev.map(q => q.id === qId ? { ...q, claimed: true } : q));
    setGold(prev => prev + rGold);
    setGems(prev => prev + rGems);
    alert(`تهانينا! حصلت على ${rGold} ذهب و ${rGems} جواهر.`);
  };

  // --- Send Chat Message ---
  const sendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg: ChatMessage = {
      id: `m_${Date.now()}`,
      sender: username,
      avatar: avatar,
      text: chatInput,
      time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };

    setChatMessages(prev => [...prev, newMsg]);
    const originalInput = chatInput;
    setChatInput('');

    // Simulated response from other players after 1.5 seconds to feel like active multiplayer
    setTimeout(() => {
      const replies = [
        'كفو يا بطل! أسطولك قوي جداً.',
        'قريباً سأشتري سفينة ملوك القرصنة الأسطورية ونقضي على الوحش البحري معاً.',
        'تبرع للتحالف لكي نرفع من مستوانا في سيرفر الأسطورة.',
        'صيد رائع يا كابتن!',
        'اللعبة اليوم فيها حماس غير طبيعي بعد تحديث البحر الجديد.'
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      const randomSender = ['كابتن_تيتش', 'سياف_الأعماق', 'مارينا', 'القرصان_الأحمر'][Math.floor(Math.random() * 4)];
      const randomAvatar = ['🧔', '🧙', '👩‍🎤', '🥷'][Math.floor(Math.random() * 4)];

      setChatMessages(prev => [...prev, {
        id: `m_rep_${Date.now()}`,
        sender: randomSender,
        avatar: randomAvatar,
        text: `@${username} ${randomReply}`,
        time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1500);
  };

  // --- Calculate User Rank based on Gold ---
  const getUserRank = () => {
    if (gold > 5000) return 'الأول 🥇';
    if (gold > 2000) return 'الثاني 🥈';
    if (gold > 1000) return 'السادس';
    if (gold > 500) return 'التاسع';
    return 'الخامس عشر';
  };

  // --- Handle Battle Complete ---
  const handleBattleEnd = (report: BattleReport) => {
    setBattleReports(prev => [report, ...prev]);
    const addedExp = crewServices.guide ? report.expGained * 2 : report.expGained;
    setExp(prev => prev + addedExp);
    
    // Check if quest active for battling
    updateQuestProgress('q1', 1);
  };

  // RENDER LOGIN SCREEN
  if (!isLoggedIn) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div style={{ margin: 0, background: '#080604', overflow: 'hidden', fontFamily: 'sans-serif', width: '100vw', height: '100vh', position: 'relative' }}>
      <style>{`
        #harbor-viewport { 
            position: fixed; 
            top: 0;
            left: 0;
            width: 100vw; 
            height: 100vh; 
            z-index: 1;
            background: #080604;
            overflow: hidden;
        }

        #map-canvas { 
            position: relative; 
            width: 100%;
            height: 100%;
            background: url('https://raw.githubusercontent.com/alwjyhnyazsrhan-blip/my-game-assets/refs/heads/main/IMG_20260704_201124.jpg') center center / 100% 100% no-repeat; 
        }

        .building-hotspot {
            position: absolute;
            cursor: pointer;
            z-index: 5;
            transition: transform 0.2s ease, filter 0.2s ease;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .building-hotspot:hover {
            transform: scale(1.1);
            filter: drop-shadow(0 0 10px rgba(254, 240, 138, 0.8));
        }
        .building-label {
            background: rgba(30, 15, 5, 0.98);
            border: 3.5px solid #ca8a04;
            color: #fef08a;
            border-radius: 12px;
            padding: 10px 24px;
            font-size: 19px;
            font-weight: 1000;
            white-space: nowrap;
            box-shadow: 0 6px 20px rgba(0,0,0,0.9);
            display: flex;
            align-items: center;
            gap: 8px;
            direction: rtl;
            text-shadow: 1px 1px 2px #000;
        }
        .building-icon {
            font-size: 38px;
            filter: drop-shadow(0 4px 6px rgba(0,0,0,0.5));
            margin-bottom: 2px;
        }

        .top-bar { position: fixed; top: 10px; width: 95%; left: 2.5%; display: flex; justify-content: space-between; z-index: 15; }
        .resource-box { background: rgba(40, 30, 20, 0.9); border: 2px solid #5d4037; padding: 5px; border-radius: 4px; display: flex; flex-direction: column; align-items: center; min-width: 80px; color: #fff; cursor: pointer; transition: all 0.2s ease; }
        .resource-box:hover { background: rgba(55, 40, 30, 0.95); transform: scale(1.05); }
        .res-icon { width: 30px; height: 30px; }
        .res-label { font-size: 11px; border-top: 1px solid #5d4037; padding-top: 4px; margin-top: 4px; width: 100%; text-align: center; font-weight: bold; color: #fef08a; }

        .ship { 
            position: absolute; 
            width: 25%; 
            max-width: 220px;
            min-width: 100px;
            z-index: 2; 
            cursor: pointer; 
            transition: left 2s ease-in-out, top 2s ease-in-out, transform 0.5s ease-in-out; 
            filter: drop-shadow(0 10px 8px rgba(0,0,0,0.5));
        }

        .ship.moving {
            animation: boat-sway 4s infinite ease-in-out;
        }

        @keyframes boat-sway {
            0%, 100% { transform: translateY(0px) scaleX(1); }
            50% { transform: translateY(-4px) scaleX(1); }
        }

        #ship-menu { position: absolute; display: none; background: rgba(20, 30, 40, 0.95); border: 2px solid #3498db; border-radius: 8px; padding: 5px; z-index: 25; flex-direction: row; gap: 5px; width: auto; box-shadow: 0 4px 15px rgba(0,0,0,0.8); }
        .menu-btn { display: flex; flex-direction: column; align-items: center; color: #fff; font-size: 10px; cursor: pointer; min-width: 45px; transition: transform 0.1s; }
        .menu-btn:hover { transform: scale(1.1); }
        .menu-icon { width: 30px; height: 30px; background: #d35400; border-radius: 6px; margin-bottom: 2px; display: flex; align-items: center; justify-content: center; font-size: 16px; border: 1px solid #fef08a; }

        .modal { display: none; position: absolute; z-index: 100; left: 50%; top: 50%; transform: translate(-50%, -50%); background: #0a1929; border: 2px solid #3498db; padding: 15px; border-radius: 12px; color: #fff; text-align: center; width: 250px; box-shadow: 0 4px 15px rgba(0,0,0,0.5); }
        
        .bottom-nav { position: fixed; bottom: 0; width: 100%; height: 80px; display: flex; justify-content: space-around; align-items: center; background: rgba(40, 20, 10, 0.95); border-top: 2px solid #5d4037; z-index: 15; }
        .nav-item { display: flex; flex-direction: column; align-items: center; cursor: pointer; transition: all 0.2s ease; position: relative; width: 60px; }
        .nav-item:hover { transform: translateY(-4px) scale(1.08); }
        .nav-item.active { border-bottom: 3px solid #facc15; padding-bottom: 4px; }
        .nav-icon { width: 35px; height: 35px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5)); }
        .label { color: #fef08a; font-size: 10px; margin-top: 2px; font-weight: bold; }

        /* Custom Fullscreen Overlay panels for tabs */
        .tab-overlay {
            position: fixed;
            top: 75px;
            bottom: 85px;
            left: 2.5%;
            width: 95%;
            background: rgba(15, 12, 9, 0.72);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 3px solid #ca8a04;
            border-radius: 12px;
            z-index: 20;
            color: #fff;
            padding: 16px;
            overflow-y: auto;
            direction: rtl;
            box-shadow: 0 15px 35px rgba(0,0,0,0.9);
        }
        .tab-title {
            font-size: 18px;
            font-weight: bold;
            color: #facc15;
            text-align: center;
            border-bottom: 2px solid #ca8a04;
            padding-bottom: 8px;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .close-tab-btn {
            background: #991b1b;
            color: #fff;
            border: 1px solid #ef4444;
            border-radius: 5px;
            padding: 2px 8px;
            font-size: 12px;
            cursor: pointer;
        }

        /* Lists and layout */
        .grid-cards {
            display: grid;
            grid-template-columns: 1fr;
            gap: 12px;
        }
        @media(min-width: 600px) {
            .grid-cards { grid-template-columns: 1fr 1fr; }
        }
        .shop-card {
            background: rgba(30, 24, 18, 0.9);
            border: 1px solid #78350f;
            border-radius: 8px;
            padding: 10px;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .upgrade-btn {
            background: #ca8a04;
            color: #fff;
            border: 1px solid #fef08a;
            border-radius: 4px;
            padding: 6px 10px;
            font-size: 11px;
            cursor: pointer;
            font-weight: bold;
            transition: background 0.2s;
        }
        .upgrade-btn:hover {
            background: #eab308;
        }
      `}</style>

      {/* ----------------- GAME BACKGROUND AND HARBOR VIEW ----------------- */}
      <div id="harbor-viewport">
        <div id="map-canvas">
          {activeTab === 'harbor' && (
            <>
              {/* Interactive Building Hotspots */}
              <div 
                className="building-hotspot" 
                style={{ left: '19%', top: '21%' }} 
                onClick={() => setFishStorageModal(true)}
                title="مخزن الأسماك"
              >
                <div className="building-label" style={{ marginBottom: '6px' }}>
                  <span>🐟 مخزن الأسماك</span>
                </div>
                <span className="building-icon">🏠</span>
              </div>

              <div 
                className="building-hotspot" 
                style={{ left: '52%', top: '15%' }} 
                onClick={() => setShipTowerModal(true)}
                title="برج السفن الحربية"
              >
                <div className="building-label" style={{ marginBottom: '6px' }}>
                  <span style={{ color: '#ef4444' }}>🏰</span>
                  <span>برج السفن</span>
                </div>
                <span className="building-icon">🏰</span>
              </div>

              <div 
                className="building-hotspot" 
                style={{ left: '80%', top: '24%' }} 
                onClick={() => setShipMarketModal(true)}
                title="سوق ومستودع السفن"
              >
                <div className="building-label" style={{ marginBottom: '6px' }}>
                  <span style={{ color: '#fbbf24' }}>⛵</span>
                  <span>سوق السفن</span>
                </div>
                <span className="building-icon">⛵</span>
              </div>



              {/* Active Ships swimming on Harbor Map */}
              {ships.map((ship) => {
                if (!ship.exists) return null;
                const sSpeed = ship.speedLevel || 1;
                const sCap = ship.capacityLevel || 1;
                const sDef = ship.defenseLevel || 1;
                const isUpgraded = sSpeed > 1 || sCap > 1 || sDef > 1;

                // Create a beautiful, soft glow shadow depending on which stat is upgraded the most
                let mapAuraFilter = 'drop-shadow(0 10px 8px rgba(0,0,0,0.5))';
                if (isUpgraded) {
                  if (sSpeed >= sCap && sSpeed >= sDef) {
                    mapAuraFilter = `drop-shadow(0 0 8px rgba(6, 182, 212, 0.95)) drop-shadow(0 6px 6px rgba(0,0,0,0.6))`;
                  } else if (sCap >= sSpeed && sCap >= sDef) {
                    mapAuraFilter = `drop-shadow(0 0 8px rgba(234, 179, 8, 0.95)) drop-shadow(0 6px 6px rgba(0,0,0,0.6))`;
                  } else {
                    mapAuraFilter = `drop-shadow(0 0 8px rgba(16, 185, 129, 0.95)) drop-shadow(0 6px 6px rgba(0,0,0,0.6))`;
                  }
                }

                return (
                  <React.Fragment key={ship.id}>
                    <div
                      id={ship.id}
                      className={`ship ${ship.moving ? 'moving' : ''}`}
                      style={{
                        left: ship.left,
                        top: ship.top,
                        transform: `scaleX(${ship.scaleX})`,
                        filter: mapAuraFilter,
                        border: isUpgraded ? '2px solid #ca8a04' : undefined,
                        borderRadius: isUpgraded ? '14px' : undefined,
                        padding: isUpgraded ? '2px' : undefined,
                        background: isUpgraded ? 'rgba(251, 191, 36, 0.08)' : undefined,
                        transition: 'left 2s ease-in-out, top 2s ease-in-out, transform 0.5s ease-in-out, filter 0.3s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      onClick={(e) => showMenu(e, ship)}
                    >
                      <ShipImage level={ship.level || 1} />
                    </div>
                    <div
                      style={{
                        position: 'absolute',
                        left: `calc(${ship.left} + 20px)`,
                        top: `calc(${ship.top} - 16px)`,
                        background: isUpgraded ? 'linear-gradient(135deg, #ca8a04 0%, #78350f 100%)' : 'linear-gradient(135deg, #78350f 0%, #451a03 100%)',
                        color: isUpgraded ? '#fff' : '#fde047',
                        border: isUpgraded ? '1.5px solid #fbbf24' : '1.5px solid #ca8a04',
                        borderRadius: '6px',
                        padding: '2px 6px',
                        fontSize: '9px',
                        fontWeight: 'bold',
                        pointerEvents: 'none',
                        zIndex: 20,
                        boxShadow: isUpgraded ? '0 0 8px rgba(251, 191, 36, 0.5), 0 2px 4px rgba(0,0,0,0.4)' : '0 2px 4px rgba(0,0,0,0.4)',
                        whiteSpace: 'nowrap',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                        transition: 'left 1s, top 1s',
                      }}
                    >
                      <span>{ship.imgEmoji || '⛵'}</span>
                      <span>م.{ship.level || 1}</span>
                      {isUpgraded && (
                        <span style={{ color: '#fbbf24', marginLeft: '1px', fontSize: '8px' }}>★</span>
                      )}
                    </div>
                  </React.Fragment>
                );
              })}
            </>
          )}
        </div>
      </div>

      {/* ----------------- PORTFOLIO / DRAWER TAB (البروفايل) ----------------- */}
      {activeTab === 'settings' && (
        <div className="tab-overlay">
          <div className="tab-title">
            <span>⚙️ إعدادات اللعبة وحسابك</span>
            <button className="close-tab-btn" onClick={() => setActiveTab('harbor')}>إغلاق</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ background: '#1c1917', padding: '12px', borderRadius: '8px', border: '1px solid #ca8a04' }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#facc15' }}>👤 ملف قبطان الأسطول</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                <div><strong>اسم القبطان المستعار:</strong> {username} {avatar}</div>
                <div><strong>رتبة القبطان (المستوى):</strong> مستوى {playerLevel} (الخبرة: {exp}/{expToNextLevel})</div>
                <div><strong>التخصص الحربي:</strong> {pirateClass}</div>
                <div><strong>خادم السيرفر الحالي:</strong> {server}</div>
                <div><strong>التحالف الحليف:</strong> {tribes.find(t => t.joined)?.name || 'مستقل (لا توجد قبيلة)'}</div>
                <div><strong>الترتيب المحلي:</strong> {getUserRank()}</div>
              </div>
            </div>

            <div style={{ background: '#1c1917', padding: '12px', borderRadius: '8px', border: '1px solid #ca8a04' }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#facc15' }}>✏️ تعديل بيانات الملف الشخصي</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                <label>تعديل الاسم المستعار:</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{ background: '#292524', border: '1px solid #ca8a04', padding: '8px', borderRadius: '4px', color: '#fff' }}
                />

                <label style={{ marginTop: '6px' }}>رمز الأفاتار:</label>
                <select 
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  style={{ background: '#292524', border: '1px solid #ca8a04', padding: '8px', borderRadius: '4px', color: '#fff' }}>
                  <option value="☠️">☠️ جمجمة الموت</option>
                  <option value="🧔">🧔 كابتن ملتحي</option>
                  <option value="🥷">🥷 نينجا البحار</option>
                  <option value="🏴‍☠️">🏴‍☠️ علم القراصنة</option>
                  <option value="🦜">🦜 ببغاء القرصان</option>
                </select>
              </div>
            </div>

            <div style={{ background: '#1c1917', padding: '12px', borderRadius: '8px', border: '1px solid #ca8a04', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: '0', color: '#facc15' }}>🔊 المؤثرات والموسيقى</h4>
                <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#d6d3d1' }}>كتم أو تفعيل أصوات أمواج البحر والسفن.</p>
              </div>
              <button 
                onClick={() => setIsMuted(!isMuted)}
                style={{ background: isMuted ? '#991b1b' : '#16a34a', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                {isMuted ? 'مكتوم 🔇' : 'مفعّل 🔊'}
              </button>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => {
                  if (window.confirm('هل تريد حقاً تسجيل الخروج والعودة لشاشة البدء؟')) {
                    handleLogout();
                  }
                }}
                style={{ flex: 1, background: '#ca8a04', color: '#000', border: 'none', borderRadius: '6px', padding: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                🚪 تسجيل الخروج
              </button>

              <button 
                onClick={() => {
                  if (window.confirm('هل تريد حقاً إعادة تعيين اللعبة والبدء من جديد برصيد افتراضي؟')) {
                    localStorage.clear();
                    window.location.reload();
                  }
                }}
                style={{ flex: 1, background: '#991b1b', color: '#fff', border: '1px solid #ef4444', borderRadius: '6px', padding: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                ⚠️ إعادة التعيين الكامل
              </button>
            </div>
          </div>
        </div>
      )}



      {/* ----------------- SHOP TAB (متجر شابك 360) ----------------- */}
      {activeTab === 'shop' && (
        <div className="tab-overlay" style={{
          zIndex: 105,
          maxWidth: '1080px',
          margin: '0 auto',
          background: '#1d0f04',
          border: '8px solid #5c3a21',
          borderRadius: '20px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9)',
          padding: '0',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '92vh'
        }} dir="rtl">
          
          {/* Header Bar */}
          <div style={{
            background: 'linear-gradient(to bottom, #7f1d1d, #450a0a)',
            borderBottom: '4px solid #b45309',
            padding: '12px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '24px' }}>🎪</span>
              <h2 style={{
                margin: 0,
                color: '#fff',
                fontSize: '22px',
                fontWeight: 'bold',
                fontFamily: 'Cairo, sans-serif',
                textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                letterSpacing: '1px'
              }}>متجر شابك 360 الإمبراطوري</h2>
            </div>
            
            {/* Close Button (X) */}
            <button 
              onClick={() => setActiveTab('harbor')}
              style={{
                background: '#991b1b',
                color: '#fff',
                border: '3px solid #fecaca',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 6px rgba(0,0,0,0.4)',
                transition: 'all 0.2s',
                zIndex: 10
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.background = '#b91c1c'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1.0)'; e.currentTarget.style.background = '#991b1b'; }}
            >
              ✕
            </button>
          </div>

          {/* Currencies Plaques bar */}
          <div style={{
            background: '#2b1a09',
            padding: '10px 20px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
            borderBottom: '2px solid #78350f'
          }}>
            {/* Gold Plaque */}
            <div style={{
              background: '#451a03',
              border: '2px solid #ca8a04',
              borderRadius: '8px',
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.6)'
            }}>
              <span style={{ color: '#fcd34d', fontWeight: 'bold', fontSize: '13px' }}>🪙 الذهب:</span>
              <strong style={{ color: '#fff', fontSize: '15px' }}>{gold.toLocaleString('ar-EG')}</strong>
            </div>

            {/* Blue Gems Plaque */}
            <div style={{
              background: '#0c223c',
              border: '2px solid #3b82f6',
              borderRadius: '8px',
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.6)'
            }}>
              <span style={{ color: '#93c5fd', fontWeight: 'bold', fontSize: '13px' }}>💎 الجواهر الزرقاء:</span>
              <strong style={{ color: '#fff', fontSize: '15px' }}>{gems.toLocaleString('ar-EG')}</strong>
            </div>

            {/* Red Gems Plaque */}
            <div style={{
              background: '#450a0a',
              border: '2px solid #ef4444',
              borderRadius: '8px',
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.6)'
            }}>
              <span style={{ color: '#fca5a5', fontWeight: 'bold', fontSize: '13px' }}>🔴 الجواهر الحمراء:</span>
              <strong style={{ color: '#fff', fontSize: '15px' }}>{redGems.toLocaleString('ar-EG')}</strong>
            </div>
          </div>

          {/* Main Body: Left Content Grid + Right Info Column */}
          <div style={{
            display: 'flex',
            flex: 1,
            background: 'linear-gradient(135deg, #f7e1bd 0%, #e1bd8d 100%)',
            overflowY: 'auto',
            minHeight: '400px'
          }}>
            
            {/* LEFT AREA: Items Grid */}
            <div style={{
              flex: 1,
              padding: '20px',
              overflowY: 'auto'
            }}>
              {shopSubTab === 'hamour' && (
                <div>
                  <div style={{ color: '#3d2314', fontWeight: 'bold', fontSize: '16px', marginBottom: '14px', borderBottom: '2px solid #a16207', paddingBottom: '4px' }}>
                    🚀 ترسانة الأسلحة النشطة وأدوات صيانة أسطول شابك
                  </div>
                  
                  {/* Grid of 8 Items */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                    gap: '16px'
                  }}>
                    {/* Item 1: صاروخ صغير */}
                    <div style={{
                      background: '#eedcb3',
                      border: '2px solid #854d0e',
                      borderRadius: '12px',
                      padding: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      position: 'relative',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}>
                      <div style={{ color: '#451a03', fontWeight: 'bold', fontSize: '14px', marginBottom: '8px' }}>صاروخ صغير</div>
                      
                      {/* Rocket SVG */}
                      <svg width="70" height="70" viewBox="0 0 100 100" style={{ margin: '8px 0' }}>
                        <defs>
                          <linearGradient id="rocketBody" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#cbd5e1" />
                            <stop offset="100%" stopColor="#64748b" />
                          </linearGradient>
                          <linearGradient id="fire" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#facc15" />
                            <stop offset="50%" stopColor="#f97316" />
                            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        {/* Flame */}
                        <path d="M 35 65 L 20 85 L 45 75 Z" fill="url(#fire)" />
                        <path d="M 45 75 L 25 90 L 50 80 Z" fill="url(#fire)" />
                        {/* Fins */}
                        <path d="M 30 50 L 15 65 L 35 65 Z" fill="#b91c1c" />
                        <path d="M 50 30 L 65 15 L 65 35 Z" fill="#b91c1c" />
                        {/* Body */}
                        <rect x="35" y="35" width="20" height="40" rx="4" transform="rotate(-45 45 55)" fill="url(#rocketBody)" stroke="#334155" strokeWidth="2" />
                        {/* Nose Cone */}
                        <path d="M 60 20 L 75 25 L 65 40 Z" fill="#ef4444" />
                        {/* Window */}
                        <circle cx="53" cy="47" r="4" fill="#38bdf8" stroke="#1e293b" strokeWidth="1.5" />
                      </svg>

                      {/* Power Circle Badge */}
                      <div style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        background: '#fef08a',
                        border: '2.5px dashed #ca8a04',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '9px',
                        fontWeight: 'bold',
                        color: '#78350f',
                        margin: '6px 0'
                      }}>
                        <span>⚔️</span>
                        <span>100K</span>
                      </div>

                      {/* Buy Button */}
                      <button 
                        onClick={() => buyWeaponItem('smallRocket', 'gold', 250000)}
                        style={{
                          width: '100%',
                          background: 'linear-gradient(to bottom, #d97706, #b45309)',
                          color: '#fff',
                          border: '1.5px solid #fef08a',
                          borderRadius: '8px',
                          padding: '6px 8px',
                          fontWeight: 'bold',
                          fontSize: '12px',
                          cursor: 'pointer',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                          marginTop: '8px'
                        }}
                      >
                        250,000 ذهب
                      </button>
                      <div style={{ fontSize: '10px', color: '#78350f', marginTop: '4px' }}>لديك: <strong>{weapons.smallRocket || 0}</strong></div>
                    </div>

                    {/* Item 2: صاروخ متوسط */}
                    <div style={{
                      background: '#eedcb3',
                      border: '2px solid #854d0e',
                      borderRadius: '12px',
                      padding: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      position: 'relative',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}>
                      <div style={{ color: '#451a03', fontWeight: 'bold', fontSize: '14px', marginBottom: '8px' }}>صاروخ متوسط</div>
                      
                      {/* Medium Rocket SVG */}
                      <svg width="70" height="70" viewBox="0 0 100 100" style={{ margin: '8px 0' }}>
                        <defs>
                          <linearGradient id="rocketBodyMed" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#94a3b8" />
                            <stop offset="100%" stopColor="#475569" />
                          </linearGradient>
                        </defs>
                        {/* Flame */}
                        <path d="M 35 65 L 10 90 L 45 75 Z" fill="url(#fire)" />
                        <path d="M 45 75 L 15 95 L 55 80 Z" fill="url(#fire)" />
                        {/* Fins */}
                        <path d="M 28 48 L 10 70 L 35 65 Z" fill="#ea580c" />
                        <path d="M 50 28 L 72 10 L 68 35 Z" fill="#ea580c" />
                        {/* Body */}
                        <rect x="32" y="32" width="24" height="42" rx="4" transform="rotate(-45 44 53)" fill="url(#rocketBodyMed)" stroke="#1e293b" strokeWidth="2" />
                        {/* Stripes */}
                        <path d="M 43 35 L 53 45" stroke="#ea580c" strokeWidth="4" />
                        <path d="M 48 40 L 58 50" stroke="#ea580c" strokeWidth="4" />
                        {/* Nose Cone */}
                        <path d="M 59 18 L 78 22 L 67 41 Z" fill="#ea580c" />
                        {/* Window */}
                        <circle cx="51" cy="49" r="5" fill="#e0f2fe" stroke="#1e293b" strokeWidth="1.5" />
                      </svg>

                      {/* Power Circle Badge */}
                      <div style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        background: '#fef08a',
                        border: '2.5px dashed #ca8a04',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '9px',
                        fontWeight: 'bold',
                        color: '#78350f',
                        margin: '6px 0'
                      }}>
                        <span>⚔️</span>
                        <span>500K</span>
                      </div>

                      {/* Buy Button */}
                      <button 
                        onClick={() => buyWeaponItem('mediumRocket', 'gold', 500000)}
                        style={{
                          width: '100%',
                          background: 'linear-gradient(to bottom, #d97706, #b45309)',
                          color: '#fff',
                          border: '1.5px solid #fef08a',
                          borderRadius: '8px',
                          padding: '6px 8px',
                          fontWeight: 'bold',
                          fontSize: '12px',
                          cursor: 'pointer',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                          marginTop: '8px'
                        }}
                      >
                        500,000 ذهب
                      </button>
                      <div style={{ fontSize: '10px', color: '#78350f', marginTop: '4px' }}>لديك: <strong>{weapons.mediumRocket || 0}</strong></div>
                    </div>

                    {/* Item 3: صاروخ كبير */}
                    <div style={{
                      background: '#eedcb3',
                      border: '2px solid #854d0e',
                      borderRadius: '12px',
                      padding: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      position: 'relative',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}>
                      <div style={{ color: '#451a03', fontWeight: 'bold', fontSize: '14px', marginBottom: '8px' }}>صاروخ كبير</div>
                      
                      {/* Large Rocket SVG */}
                      <svg width="70" height="70" viewBox="0 0 100 100" style={{ margin: '8px 0' }}>
                        <defs>
                          <linearGradient id="rocketBodyHvy" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#f1f5f9" />
                            <stop offset="100%" stopColor="#475569" />
                          </linearGradient>
                        </defs>
                        {/* Flame */}
                        <path d="M 30 70 L 5 95 L 45 80 Z" fill="url(#fire)" />
                        <path d="M 45 80 L 10 100 L 55 85 Z" fill="url(#fire)" />
                        {/* Wings/Boosters */}
                        <path d="M 22 45 L 2 68 L 28 62 Z" fill="#dc2626" />
                        <path d="M 52 22 L 78 2 L 68 28 Z" fill="#dc2626" />
                        {/* Body */}
                        <rect x="28" y="28" width="28" height="46" rx="6" transform="rotate(-45 42 51)" fill="url(#rocketBodyHvy)" stroke="#0f172a" strokeWidth="2.5" />
                        {/* Hazard Lines */}
                        <path d="M 40 32 L 50 42" stroke="#facc15" strokeWidth="3" />
                        <path d="M 44 36 L 54 46" stroke="#0f172a" strokeWidth="3" />
                        <path d="M 48 40 L 58 50" stroke="#facc15" strokeWidth="3" />
                        {/* Nose Cone */}
                        <path d="M 58 16 L 82 20 L 70 44 Z" fill="#dc2626" />
                        {/* Double Window */}
                        <circle cx="48" cy="48" r="4" fill="#38bdf8" stroke="#0f172a" strokeWidth="1" />
                        <circle cx="53" cy="53" r="4" fill="#38bdf8" stroke="#0f172a" strokeWidth="1" />
                      </svg>

                      {/* Power Circle Badge */}
                      <div style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        background: '#fef08a',
                        border: '2.5px dashed #ca8a04',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '9px',
                        fontWeight: 'bold',
                        color: '#78350f',
                        margin: '6px 0'
                      }}>
                        <span>⚔️</span>
                        <span>1.5M</span>
                      </div>

                      {/* Buy Button */}
                      <button 
                        onClick={() => buyWeaponItem('largeRocket', 'gold', 1000000)}
                        style={{
                          width: '100%',
                          background: 'linear-gradient(to bottom, #d97706, #b45309)',
                          color: '#fff',
                          border: '1.5px solid #fef08a',
                          borderRadius: '8px',
                          padding: '6px 8px',
                          fontWeight: 'bold',
                          fontSize: '12px',
                          cursor: 'pointer',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                          marginTop: '8px'
                        }}
                      >
                        1,000,000 ذهب
                      </button>
                      <div style={{ fontSize: '10px', color: '#78350f', marginTop: '4px' }}>لديك: <strong>{weapons.largeRocket || 0}</strong></div>
                    </div>

                    {/* Item 4: قنبلة ذرية */}
                    <div style={{
                      background: '#eedcb3',
                      border: '2px solid #854d0e',
                      borderRadius: '12px',
                      padding: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      position: 'relative',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}>
                      <div style={{ color: '#451a03', fontWeight: 'bold', fontSize: '14px', marginBottom: '8px' }}>قنبلة ذرية</div>
                      
                      {/* Atomic Bomb SVG */}
                      <svg width="70" height="70" viewBox="0 0 100 100" style={{ margin: '8px 0' }}>
                        <defs>
                          <linearGradient id="nukeBody" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#3f6212" />
                            <stop offset="100%" stopColor="#1a2e05" />
                          </linearGradient>
                        </defs>
                        {/* Tail fins */}
                        <path d="M 25 25 L 45 45" stroke="#1e293b" strokeWidth="6" />
                        <path d="M 20 40 L 40 40 L 20 20 Z" fill="#ef4444" stroke="#1e293b" />
                        <path d="M 40 20 L 40 40 L 20 20 Z" fill="#ef4444" stroke="#1e293b" />
                        {/* Round Body */}
                        <circle cx="55" cy="55" r="24" fill="url(#nukeBody)" stroke="#111827" strokeWidth="2.5" />
                        {/* Radiation Badge */}
                        <circle cx="55" cy="55" r="9" fill="#facc15" stroke="#111827" strokeWidth="1" />
                        <path d="M 55 55 L 51 49 L 59 49 Z" fill="#111827" />
                        <path d="M 55 55 L 49 59 L 51 51 Z" fill="#111827" />
                        <path d="M 55 55 L 61 59 L 59 51 Z" fill="#111827" />
                        <circle cx="55" cy="55" r="2.5" fill="#facc15" />
                      </svg>

                      {/* Power Circle Badge */}
                      <div style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        background: '#93c5fd',
                        border: '2.5px dashed #1d4ed8',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '9px',
                        fontWeight: 'bold',
                        color: '#1e3a8a',
                        margin: '6px 0'
                      }}>
                        <span>💥</span>
                        <span>10M</span>
                      </div>

                      {/* Buy Button */}
                      <button 
                        onClick={() => buyWeaponItem('atomicBomb', 'blueGems', 100)}
                        style={{
                          width: '100%',
                          background: 'linear-gradient(to bottom, #1d4ed8, #1e3a8a)',
                          color: '#fff',
                          border: '1.5px solid #93c5fd',
                          borderRadius: '8px',
                          padding: '6px 8px',
                          fontWeight: 'bold',
                          fontSize: '12px',
                          cursor: 'pointer',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                          marginTop: '8px'
                        }}
                      >
                        100 جوهرة
                      </button>
                      <div style={{ fontSize: '10px', color: '#1e3a8a', marginTop: '4px' }}>لديك: <strong>{weapons.atomicBomb || 0}</strong></div>
                    </div>

                    {/* Item 5: مصلح صغير */}
                    <div style={{
                      background: '#eedcb3',
                      border: '2px solid #854d0e',
                      borderRadius: '12px',
                      padding: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      position: 'relative',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}>
                      <div style={{ color: '#451a03', fontWeight: 'bold', fontSize: '14px', marginBottom: '2px' }}>1 - مصلح صغير</div>
                      <div style={{ color: '#78350f', fontSize: '10px', marginBottom: '4px' }}>يحيي السفينة 1000 نقطة</div>
                      
                      {/* Toolbox SVG */}
                      <svg width="70" height="70" viewBox="0 0 100 100" style={{ margin: '8px 0' }}>
                        <defs>
                          <linearGradient id="woodBox" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#a16207" />
                            <stop offset="100%" stopColor="#78350f" />
                          </linearGradient>
                        </defs>
                        {/* Saw & Hammer sticking out */}
                        <path d="M 30 40 L 20 15 L 35 20 Z" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" />
                        <path d="M 45 40 L 55 10 L 65 15 L 50 42 Z" fill="#64748b" stroke="#334155" strokeWidth="1.5" />
                        <rect x="52" y="8" width="6" height="16" fill="#78350f" rx="1" />
                        {/* Wooden Chest */}
                        <rect x="25" y="38" width="50" height="34" rx="4" fill="url(#woodBox)" stroke="#451a03" strokeWidth="2.5" />
                        {/* Metal Brackets */}
                        <rect x="25" y="38" width="8" height="8" fill="#cbd5e1" />
                        <rect x="67" y="38" width="8" height="8" fill="#cbd5e1" />
                        <rect x="25" y="64" width="8" height="8" fill="#cbd5e1" />
                        <rect x="67" y="64" width="8" height="8" fill="#cbd5e1" />
                        {/* Handle */}
                        <path d="M 40 38 Q 50 25 60 38" fill="none" stroke="#451a03" strokeWidth="3" />
                      </svg>

                      {/* Power Badge */}
                      <div style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        background: '#fef08a',
                        border: '2.5px dashed #ca8a04',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '9px',
                        fontWeight: 'bold',
                        color: '#78350f',
                        margin: '6px 0'
                      }}>
                        <span>❤️</span>
                        <span>1,000</span>
                      </div>

                      {/* Buy Button */}
                      <button 
                        onClick={() => buyWeaponItem('smallRepair', 'gold', 250000)}
                        style={{
                          width: '100%',
                          background: 'linear-gradient(to bottom, #d97706, #b45309)',
                          color: '#fff',
                          border: '1.5px solid #fef08a',
                          borderRadius: '8px',
                          padding: '6px 8px',
                          fontWeight: 'bold',
                          fontSize: '12px',
                          cursor: 'pointer',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                          marginTop: '8px'
                        }}
                      >
                        250,000 ذهب
                      </button>
                      <div style={{ fontSize: '10px', color: '#78350f', marginTop: '4px' }}>لديك: <strong>{weapons.smallRepair || 0}</strong></div>
                    </div>

                    {/* Item 6: مصلح متوسط */}
                    <div style={{
                      background: '#eedcb3',
                      border: '2px solid #854d0e',
                      borderRadius: '12px',
                      padding: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      position: 'relative',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}>
                      <div style={{ color: '#451a03', fontWeight: 'bold', fontSize: '14px', marginBottom: '2px' }}>2 - مصلح متوسط</div>
                      <div style={{ color: '#78350f', fontSize: '10px', marginBottom: '4px' }}>يحيي السفينة 5000 نقطة</div>
                      
                      {/* Red Toolbox SVG */}
                      <svg width="70" height="70" viewBox="0 0 100 100" style={{ margin: '8px 0' }}>
                        <defs>
                          <linearGradient id="redBox" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#ef4444" />
                            <stop offset="100%" stopColor="#991b1b" />
                          </linearGradient>
                        </defs>
                        {/* Wrench sticking out */}
                        <path d="M 32 35 L 20 12 Q 15 15 18 20 L 28 40" stroke="#475569" strokeWidth="4" fill="none" />
                        <circle cx="18" cy="15" r="4" fill="#eedcb3" stroke="#475569" strokeWidth="1.5" />
                        {/* Red metal tool box */}
                        <rect x="22" y="35" width="56" height="38" rx="5" fill="url(#redBox)" stroke="#450a0a" strokeWidth="2.5" />
                        {/* Handle & Lock */}
                        <rect x="44" y="25" width="12" height="10" fill="none" stroke="#cbd5e1" strokeWidth="3" />
                        <rect x="46" y="48" width="8" height="10" fill="#ca8a04" rx="1" />
                        {/* Pressure gauge */}
                        <circle cx="34" cy="54" r="7" fill="#fff" stroke="#1e293b" strokeWidth="1.5" />
                        <line x1="34" y1="54" x2="38" y2="50" stroke="#ef4444" strokeWidth="1.5" />
                      </svg>

                      {/* Power Badge */}
                      <div style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        background: '#fef08a',
                        border: '2.5px dashed #ca8a04',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '9px',
                        fontWeight: 'bold',
                        color: '#78350f',
                        margin: '6px 0'
                      }}>
                        <span>❤️</span>
                        <span>5,000</span>
                      </div>

                      {/* Buy Button */}
                      <button 
                        onClick={() => buyWeaponItem('mediumRepair', 'gold', 500000)}
                        style={{
                          width: '100%',
                          background: 'linear-gradient(to bottom, #d97706, #b45309)',
                          color: '#fff',
                          border: '1.5px solid #fef08a',
                          borderRadius: '8px',
                          padding: '6px 8px',
                          fontWeight: 'bold',
                          fontSize: '12px',
                          cursor: 'pointer',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                          marginTop: '8px'
                        }}
                      >
                        500,000 ذهب
                      </button>
                      <div style={{ fontSize: '10px', color: '#78350f', marginTop: '4px' }}>لديك: <strong>{weapons.mediumRepair || 0}</strong></div>
                    </div>

                    {/* Item 7: مصلح كبير */}
                    <div style={{
                      background: '#eedcb3',
                      border: '2px solid #854d0e',
                      borderRadius: '12px',
                      padding: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      position: 'relative',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}>
                      {/* NEW RIBBON */}
                      <div style={{
                        position: 'absolute',
                        top: '8px',
                        left: '-8px',
                        background: '#ef4444',
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: '9px',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        boxShadow: '2px 2px 4px rgba(0,0,0,0.25)',
                        transform: 'rotate(-10deg)',
                        border: '1px solid #fecaca'
                      }}>جديد</div>

                      <div style={{ color: '#451a03', fontWeight: 'bold', fontSize: '14px', marginBottom: '2px' }}>3 - مصلح كبير</div>
                      <div style={{ color: '#78350f', fontSize: '10px', marginBottom: '4px' }}>يحيي السفينة 10000 نقطة</div>
                      
                      {/* Blue Technical Chest SVG */}
                      <svg width="70" height="70" viewBox="0 0 100 100" style={{ margin: '8px 0' }}>
                        <defs>
                          <linearGradient id="blueBox" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#2563eb" />
                            <stop offset="100%" stopColor="#1e3a8a" />
                          </linearGradient>
                        </defs>
                        {/* Screwdrivers/wires */}
                        <path d="M 28 35 L 18 10" stroke="#ef4444" strokeWidth="3" />
                        <path d="M 35 35 L 42 15" stroke="#facc15" strokeWidth="2.5" />
                        {/* Blue high tech tool box */}
                        <rect x="20" y="34" width="60" height="40" rx="6" fill="url(#blueBox)" stroke="#172554" strokeWidth="2.5" />
                        {/* Built-in Oscilloscope monitor */}
                        <rect x="28" y="42" width="22" height="15" fill="#022c22" stroke="#10b981" strokeWidth="1.5" rx="1" />
                        {/* Sine wave */}
                        <path d="M 30 50 Q 33 44 36 50 T 42 50 T 48 50" fill="none" stroke="#34d399" strokeWidth="1.5" />
                        {/* Knobs */}
                        <circle cx="58" cy="46" r="2" fill="#ef4444" />
                        <circle cx="64" cy="46" r="2" fill="#3b82f6" />
                        <circle cx="58" cy="52" r="2.5" fill="#ca8a04" />
                        {/* Chrome handle */}
                        <path d="M 40 24 H 60" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />
                        <path d="M 40 24 V 34 M 60 24 V 34" stroke="#475569" strokeWidth="2.5" />
                      </svg>

                      {/* Power Badge */}
                      <div style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        background: '#fef08a',
                        border: '2.5px dashed #ca8a04',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '9px',
                        fontWeight: 'bold',
                        color: '#78350f',
                        margin: '6px 0'
                      }}>
                        <span>❤️</span>
                        <span>10,000</span>
                      </div>

                      {/* Buy Button */}
                      <button 
                        onClick={() => buyWeaponItem('largeRepair', 'gold', 1000000)}
                        style={{
                          width: '100%',
                          background: 'linear-gradient(to bottom, #d97706, #b45309)',
                          color: '#fff',
                          border: '1.5px solid #fef08a',
                          borderRadius: '8px',
                          padding: '6px 8px',
                          fontWeight: 'bold',
                          fontSize: '12px',
                          cursor: 'pointer',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                          marginTop: '8px'
                        }}
                      >
                        1,000,000 ذهب
                      </button>
                      <div style={{ fontSize: '10px', color: '#78350f', marginTop: '4px' }}>لديك: <strong>{weapons.largeRepair || 0}</strong></div>
                    </div>

                    {/* Item 8: مصلح اسطوري */}
                    <div style={{
                      background: '#eedcb3',
                      border: '2px solid #854d0e',
                      borderRadius: '12px',
                      padding: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      position: 'relative',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}>
                      <div style={{ color: '#451a03', fontWeight: 'bold', fontSize: '14px', marginBottom: '2px' }}>4 - مصلح اسطوري</div>
                      <div style={{ color: '#78350f', fontSize: '10px', marginBottom: '4px' }}>يصلح السفينة 70-الف نقطة</div>
                      
                      {/* Legendary Sea-Chest SVG */}
                      <svg width="70" height="70" viewBox="0 0 100 100" style={{ margin: '8px 0' }}>
                        <defs>
                          <linearGradient id="legendaryChest" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#a855f7" />
                            <stop offset="100%" stopColor="#581c87" />
                          </linearGradient>
                          <radialGradient id="magicalGlow" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#ca8a04" stopOpacity="0" />
                          </radialGradient>
                        </defs>
                        {/* Magical Glow */}
                        <circle cx="50" cy="55" r="35" fill="url(#magicalGlow)" />
                        
                        {/* Seaweed */}
                        <path d="M 22 75 Q 15 55 18 35" fill="none" stroke="#15803d" strokeWidth="4" strokeLinecap="round" />
                        <path d="M 78 75 Q 85 60 80 40" fill="none" stroke="#15803d" strokeWidth="4" strokeLinecap="round" />
                        
                        {/* Purple Chest */}
                        <rect x="24" y="38" width="52" height="34" rx="6" fill="url(#legendaryChest)" stroke="#2e1065" strokeWidth="2.5" />
                        {/* Gold Anchor plate */}
                        <circle cx="50" cy="55" r="9" fill="#facc15" stroke="#451a03" strokeWidth="1.5" />
                        <path d="M 50 49 V 61 M 46 58 H 54 M 46 51 H 54" stroke="#451a03" strokeWidth="2.5" strokeLinecap="round" />
                        {/* Floating Bubbles */}
                        <circle cx="35" cy="25" r="3" fill="#ca8a04" opacity="0.7" />
                        <circle cx="65" cy="20" r="4" fill="#ca8a04" opacity="0.6" />
                        <circle cx="50" cy="15" r="2.5" fill="#ca8a04" opacity="0.8" />
                      </svg>

                      {/* Power Badge */}
                      <div style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        background: '#93c5fd',
                        border: '2.5px dashed #1d4ed8',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '9px',
                        fontWeight: 'bold',
                        color: '#1e3a8a',
                        margin: '6px 0'
                      }}>
                        <span>❤️</span>
                        <span>70,000</span>
                      </div>

                      {/* Buy Button */}
                      <button 
                        onClick={() => buyWeaponItem('legendaryRepair', 'blueGems', 60)}
                        style={{
                          width: '100%',
                          background: 'linear-gradient(to bottom, #1d4ed8, #1e3a8a)',
                          color: '#fff',
                          border: '1.5px solid #93c5fd',
                          borderRadius: '8px',
                          padding: '6px 8px',
                          fontWeight: 'bold',
                          fontSize: '12px',
                          cursor: 'pointer',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                          marginTop: '8px'
                        }}
                      >
                        60 جوهرة
                      </button>
                      <div style={{ fontSize: '10px', color: '#1e3a8a', marginTop: '4px' }}>لديك: <strong>{weapons.legendaryRepair || 0}</strong></div>
                    </div>
                  </div>
                </div>
              )}

              {shopSubTab === 'thihn' && (
                <div>
                  <div style={{ color: '#3d2314', fontWeight: 'bold', fontSize: '16px', marginBottom: '14px', borderBottom: '2px solid #a16207', paddingBottom: '4px' }}>
                    ⚙️ ترقيات أسطول الصيد ومخازن الذهب
                  </div>
                  
                  <div className="grid-cards" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {/* Upgrade 1: شباك ملوك القرصنة الأسطورية */}
                    <div style={{
                      background: '#eedcb3',
                      border: '2px solid #854d0e',
                      borderRadius: '12px',
                      padding: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}>
                      <span style={{ fontSize: '40px' }}>🕸️</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 'bold', color: '#451a03', fontSize: '15px' }}>شباك ملوك القرصنة الأسطورية</div>
                        <div style={{ color: '#78350f', fontSize: '12px', marginTop: '4px' }}>تضاعف صيد الأسماك والذهب لجميع السفن بنسبة 100%!</div>
                        <div style={{ marginTop: '6px', fontWeight: 'bold', color: '#ca8a04', fontSize: '13px' }}>السعر: 150 ذهب</div>
                      </div>
                      <button 
                        onClick={() => buyShopItem('net', 150, 0)}
                        style={{
                          background: 'linear-gradient(to bottom, #ca8a04, #854d0e)',
                          color: '#fff',
                          border: '1.5px solid #fef08a',
                          borderRadius: '8px',
                          padding: '10px 20px',
                          fontWeight: 'bold',
                          cursor: 'pointer'
                        }}
                      >
                        شراء
                      </button>
                    </div>

                    {/* Upgrade 2: محركات الدفع التوربيني */}
                    <div style={{
                      background: '#eedcb3',
                      border: '2px solid #854d0e',
                      borderRadius: '12px',
                      padding: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}>
                      <span style={{ fontSize: '40px' }}>⚙️</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 'bold', color: '#451a03', fontSize: '15px' }}>محركات الدفع التوربيني</div>
                        <div style={{ color: '#78350f', fontSize: '12px', marginTop: '4px' }}>تزيد من سرعة عودة السفينة من رحلة الصيد بمقدار الضعف!</div>
                        <div style={{ marginTop: '6px', fontWeight: 'bold', color: '#3b82f6', fontSize: '13px' }}>السعر: 5 جواهر</div>
                      </div>
                      <button 
                        onClick={() => buyShopItem('engine', 0, 5)}
                        style={{
                          background: 'linear-gradient(to bottom, #3b82f6, #1d4ed8)',
                          color: '#fff',
                          border: '1.5px solid #93c5fd',
                          borderRadius: '8px',
                          padding: '10px 20px',
                          fontWeight: 'bold',
                          cursor: 'pointer'
                        }}
                      >
                        شراء
                      </button>
                    </div>

                    {/* Upgrade 3: خزنة الذهب العملاقة */}
                    <div style={{
                      background: '#eedcb3',
                      border: '2px solid #854d0e',
                      borderRadius: '12px',
                      padding: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}>
                      <span style={{ fontSize: '40px' }}>🪙</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 'bold', color: '#451a03', fontSize: '15px' }}>خزنة الذهب العملاقة</div>
                        <div style={{ color: '#78350f', fontSize: '12px', marginTop: '4px' }}>تحتوي على 1500 عملة ذهبية لتطوير التحالف والأسطول.</div>
                        <div style={{ marginTop: '6px', fontWeight: 'bold', color: '#3b82f6', fontSize: '13px' }}>السعر: 10 جواهر</div>
                      </div>
                      <button 
                        onClick={() => buyShopItem('gold_pack', 0, 10)}
                        style={{
                          background: 'linear-gradient(to bottom, #3b82f6, #1d4ed8)',
                          color: '#fff',
                          border: '1.5px solid #93c5fd',
                          borderRadius: '8px',
                          padding: '10px 20px',
                          fontWeight: 'bold',
                          cursor: 'pointer'
                        }}
                      >
                        شراء
                      </button>
                    </div>
                  </div>
                </div>
              )}

              

              {shopSubTab === 'crew_services' && (
                <div>
                  <div style={{ color: '#064e3b', fontWeight: 'bold', fontSize: '16px', marginBottom: '14px', borderBottom: '2px solid #057857', paddingBottom: '4px' }}>
                    🍀 توظيف طواقم الدعم وخدمات الحظ لحماية وتسريع الصيد
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                    {/* Item 1: الحظ */}
                    <div style={{
                      background: '#d1fae5',
                      border: '2px solid #057857',
                      borderRadius: '12px',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                      position: 'relative'
                    }}>
                      {crewServices.luck && (
                        <div style={{ position: 'absolute', top: '8px', left: '8px', background: '#10b981', color: '#fff', fontSize: '10px', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>
                          نشط 🟢
                        </div>
                      )}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <span style={{ fontSize: '32px' }}>🎁</span>
                          <span style={{ fontWeight: 'bold', color: '#064e3b', fontSize: '16px' }}>تميمة الحظ البحري</span>
                        </div>
                        <div style={{ color: '#047857', fontSize: '12px', lineHeight: '1.4' }}>
                          تعطي بركة وأمواج مواتية لأسطولك لتزيد كمية الصيد بنسبة <strong>30%</strong> وترفع أرباح الذهب بنسبة <strong>20%</strong> إضافية!
                        </div>
                      </div>
                      <div style={{ marginTop: '12px' }}>
                        <div style={{ fontWeight: 'bold', color: '#065f46', fontSize: '13px', marginBottom: '8px' }}>السعر: 10 جواهر زرقاء</div>
                        <button 
                          onClick={() => buyCrewService('luck', 'تميمة الحظ البحري', 10)}
                          disabled={crewServices.luck}
                          style={{
                            width: '100%',
                            background: crewServices.luck ? '#9ca3af' : 'linear-gradient(to bottom, #10b981, #057857)',
                            color: '#fff',
                            border: '1.5px solid #a7f3d0',
                            borderRadius: '8px',
                            padding: '8px 12px',
                            fontWeight: 'bold',
                            cursor: crewServices.luck ? 'not-allowed' : 'pointer',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                          }}
                        >
                          {crewServices.luck ? 'تم التفعيل والتوظيف' : 'توظيف وتفعيل 💎 10'}
                        </button>
                      </div>
                    </div>

                    {/* Item 2: البحارة */}
                    <div style={{
                      background: '#d1fae5',
                      border: '2px solid #057857',
                      borderRadius: '12px',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                      position: 'relative'
                    }}>
                      {crewServices.sailors && (
                        <div style={{ position: 'absolute', top: '8px', left: '8px', background: '#10b981', color: '#fff', fontSize: '10px', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>
                          نشط 🟢
                        </div>
                      )}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <span style={{ fontSize: '32px' }}>👥</span>
                          <span style={{ fontWeight: 'bold', color: '#064e3b', fontSize: '16px' }}>طاقم البحارة المحترفين</span>
                        </div>
                        <div style={{ color: '#047857', fontSize: '12px', lineHeight: '1.4' }}>
                          طاقم ملاحة فائق الذكاء والسرعة يسرع عمليات الصيد والرحلة بنسبة <strong>50%</strong> ويضيف <strong>15%</strong> أرباح ذهب إضافية لسرعة النقل والتفريغ!
                        </div>
                      </div>
                      <div style={{ marginTop: '12px' }}>
                        <div style={{ fontWeight: 'bold', color: '#065f46', fontSize: '13px', marginBottom: '8px' }}>السعر: 15 جوهرة زرقاء</div>
                        <button 
                          onClick={() => buyCrewService('sailors', 'طاقم البحارة المحترفين', 15)}
                          disabled={crewServices.sailors}
                          style={{
                            width: '100%',
                            background: crewServices.sailors ? '#9ca3af' : 'linear-gradient(to bottom, #10b981, #057857)',
                            color: '#fff',
                            border: '1.5px solid #a7f3d0',
                            borderRadius: '8px',
                            padding: '8px 12px',
                            fontWeight: 'bold',
                            cursor: crewServices.sailors ? 'not-allowed' : 'pointer',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                          }}
                        >
                          {crewServices.sailors ? 'تم التفعيل والتوظيف' : 'توظيف وتفعيل 💎 15'}
                        </button>
                      </div>
                    </div>

                    {/* Item 3: المرشد */}
                    <div style={{
                      background: '#d1fae5',
                      border: '2px solid #057857',
                      borderRadius: '12px',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                      position: 'relative'
                    }}>
                      {crewServices.guide && (
                        <div style={{ position: 'absolute', top: '8px', left: '8px', background: '#10b981', color: '#fff', fontSize: '10px', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>
                          نشط 🟢
                        </div>
                      )}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <span style={{ fontSize: '32px' }}>🧭</span>
                          <span style={{ fontWeight: 'bold', color: '#064e3b', fontSize: '16px' }}>المرشد البحري الأسطوري</span>
                        </div>
                        <div style={{ color: '#047857', fontSize: '12px', lineHeight: '1.4' }}>
                          خبير بحار ذو معرفة فائقة بالطرق والمناورات يضاعف كسب نقاط الخبرة <strong>(EXP x2)</strong> بالكامل من الصيد لتسريع رفع مستوى قبطانك!
                        </div>
                      </div>
                      <div style={{ marginTop: '12px' }}>
                        <div style={{ fontWeight: 'bold', color: '#065f46', fontSize: '13px', marginBottom: '8px' }}>السعر: 12 جواهر زرقاء</div>
                        <button 
                          onClick={() => buyCrewService('guide', 'المرشد البحري الأسطوري', 12)}
                          disabled={crewServices.guide}
                          style={{
                            width: '100%',
                            background: crewServices.guide ? '#9ca3af' : 'linear-gradient(to bottom, #10b981, #057857)',
                            color: '#fff',
                            border: '1.5px solid #a7f3d0',
                            borderRadius: '8px',
                            padding: '8px 12px',
                            fontWeight: 'bold',
                            cursor: crewServices.guide ? 'not-allowed' : 'pointer',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                          }}
                        >
                          {crewServices.guide ? 'تم التفعيل والتوظيف' : 'توظيف وتفعيل 💎 12'}
                        </button>
                      </div>
                    </div>

                    {/* Item 4: الشرطي */}
                    <div style={{
                      background: '#d1fae5',
                      border: '2px solid #057857',
                      borderRadius: '12px',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                      position: 'relative'
                    }}>
                      {crewServices.police && (
                        <div style={{ position: 'absolute', top: '8px', left: '8px', background: '#10b981', color: '#fff', fontSize: '10px', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>
                          حارس نشط 👮
                        </div>
                      )}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <span style={{ fontSize: '32px' }}>👮</span>
                          <span style={{ fontWeight: 'bold', color: '#064e3b', fontSize: '16px' }}>شرطي حراسة الميناء</span>
                        </div>
                        <div style={{ color: '#047857', fontSize: '12px', lineHeight: '1.4' }}>
                          حراسة مخصصة ودوريات أمنية مستمرة تحمي ميناء قبطانك ومخازنك وثروتك من أي محاولة سرقة أو هجوم تسلل للقراصنة اللصوص بنسبة <strong>100%</strong>!
                        </div>
                      </div>
                      <div style={{ marginTop: '12px' }}>
                        <div style={{ fontWeight: 'bold', color: '#065f46', fontSize: '13px', marginBottom: '8px' }}>السعر: 18 جوهرة زرقاء</div>
                        <button 
                          onClick={() => buyCrewService('police', 'شرطي حراسة الميناء', 18)}
                          disabled={crewServices.police}
                          style={{
                            width: '100%',
                            background: crewServices.police ? '#9ca3af' : 'linear-gradient(to bottom, #10b981, #057857)',
                            color: '#fff',
                            border: '1.5px solid #a7f3d0',
                            borderRadius: '8px',
                            padding: '8px 12px',
                            fontWeight: 'bold',
                            cursor: crewServices.police ? 'not-allowed' : 'pointer',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                          }}
                        >
                          {crewServices.police ? 'شرطي نشط يحمي الميناء' : 'توظيف وتفعيل 💎 18'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: Brand Crest + Sunset Scene + Navigation Buttons */}
            <div style={{
              width: '260px',
              background: '#23150b',
              borderRight: '4px solid #5c3a21',
              display: 'flex',
              flexDirection: 'column',
              padding: '16px',
              boxShadow: 'inset 4px 0 10px rgba(0,0,0,0.5)'
            }}>
              {/* Crest "شابك 360" */}
              <div style={{
                textAlign: 'center',
                background: 'linear-gradient(135deg, #b45309 0%, #78350f 100%)',
                border: '2px solid #fcd34d',
                borderRadius: '8px',
                padding: '10px 6px',
                color: '#fff',
                fontFamily: 'Cairo, sans-serif',
                fontWeight: 'bold',
                fontSize: '15px',
                textShadow: '0 2px 3px rgba(0,0,0,0.4)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                marginBottom: '12px'
              }}>
                ⚓ أسطول شابك 360 🔱
              </div>

              {/* Subtitle Banner "الهامور" */}
              <div style={{
                textAlign: 'center',
                background: '#451a03',
                border: '1.5px solid #ca8a04',
                color: '#fcd34d',
                padding: '4px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 'bold',
                marginBottom: '14px'
              }}>
                {shopSubTab === 'hamour' ? 'قسم الأسلحة والصيانة' : shopSubTab === 'thihn' ? 'قسم ترقية الأسطول' : 'قسم الحظ والخدمات'}
              </div>

              {/* Beautiful Sunset Galleon Illustration */}
              <div style={{
                height: '140px',
                borderRadius: '8px',
                border: '2px solid #78350f',
                background: 'linear-gradient(to bottom, #ea580c, #fcd34d)',
                position: 'relative',
                overflow: 'hidden',
                marginBottom: '20px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
              }}>
                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {/* Sun */}
                  <circle cx="50" cy="70" r="22" fill="#fef08a" opacity="0.9" />
                  
                  {/* Sea Waves */}
                  <path d="M 0 75 Q 25 70 50 75 T 100 75 L 100 100 L 0 100 Z" fill="#1e3a8a" opacity="0.6" />
                  <path d="M 0 82 Q 25 78 50 82 T 100 82 L 100 100 L 0 100 Z" fill="#172554" />
                  
                  {/* Pirate Galleon Ship Silhouette */}
                  <g transform="translate(15, 30) scale(0.6)">
                    {/* Hull */}
                    <path d="M 20 55 L 75 55 L 85 40 L 10 40 Z" fill="#451a03" />
                    {/* Sails */}
                    <path d="M 25 35 Q 35 15 45 35 Z" fill="#fff" stroke="#451a03" strokeWidth="1" />
                    <path d="M 50 35 Q 60 10 70 35 Z" fill="#fff" stroke="#451a03" strokeWidth="1" />
                    {/* Masts */}
                    <line x1="35" y1="40" x2="35" y2="15" stroke="#451a03" strokeWidth="2.5" />
                    <line x1="60" y1="40" x2="60" y2="10" stroke="#451a03" strokeWidth="2.5" />
                    {/* Flag */}
                    <path d="M 35 15 L 25 18 L 35 21 Z" fill="#dc2626" />
                  </g>
                </svg>
                {/* Floating label overlay */}
                <div style={{
                  position: 'absolute',
                  bottom: '4px',
                  width: '100%',
                  textAlign: 'center',
                  color: '#fff',
                  fontSize: '9px',
                  fontWeight: 'bold',
                  textShadow: '1px 1px 2px #000'
                }}>ميناء ملوك البحار</div>
              </div>

              {/* Navigation Tabs (Stacked vertically) */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                flex: 1
              }}>
                {/* Tab 1: الهامور */}
                <button
                  onClick={() => setShopSubTab('hamour')}
                  style={{
                    background: shopSubTab === 'hamour' 
                      ? 'linear-gradient(to bottom, #ca8a04, #854d0e)' 
                      : '#3a200e',
                    color: shopSubTab === 'hamour' ? '#fff' : '#eedcb3',
                    border: shopSubTab === 'hamour' ? '2.5px solid #fef08a' : '2.5px solid #5c3a21',
                    borderRadius: '8px',
                    padding: '12px 10px',
                    fontWeight: 'bold',
                    fontSize: '13px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.15)',
                    transition: 'all 0.2s',
                    textAlign: 'center',
                    fontFamily: 'Cairo, sans-serif'
                  }}
                >
                  🔱 أسلحة الهامور
                </button>

                {/* Tab 2: الذهن */}
                <button
                  onClick={() => setShopSubTab('thihn')}
                  style={{
                    background: shopSubTab === 'thihn' 
                      ? 'linear-gradient(to bottom, #ca8a04, #854d0e)' 
                      : '#3a200e',
                    color: shopSubTab === 'thihn' ? '#fff' : '#eedcb3',
                    border: shopSubTab === 'thihn' ? '2.5px solid #fef08a' : '2.5px solid #5c3a21',
                    borderRadius: '8px',
                    padding: '12px 10px',
                    fontWeight: 'bold',
                    fontSize: '13px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.15)',
                    transition: 'all 0.2s',
                    textAlign: 'center',
                    fontFamily: 'Cairo, sans-serif'
                  }}
                >
                  ⚙️ ترقيات الذهن
                </button>



                {/* Tab 4: طاقم وخدمات الحظ */}
                <button
                  onClick={() => setShopSubTab('crew_services')}
                  style={{
                    background: shopSubTab === 'crew_services' 
                      ? 'linear-gradient(to bottom, #10b981, #047857)' 
                      : '#3a200e',
                    color: shopSubTab === 'crew_services' ? '#fff' : '#eedcb3',
                    border: shopSubTab === 'crew_services' ? '2.5px solid #a7f3d0' : '2.5px solid #5c3a21',
                    borderRadius: '8px',
                    padding: '12px 10px',
                    fontWeight: 'bold',
                    fontSize: '13px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.15)',
                    transition: 'all 0.2s',
                    textAlign: 'center',
                    fontFamily: 'Cairo, sans-serif'
                  }}
                >
                  🍀 خدمات الحظ والشرطي
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ----------------- TRIBES TAB (القبائل والتحالفات) ----------------- */}
      {activeTab === 'tribes' && (
        <div className="tab-overlay">
          <div className="tab-title">
            <span>🛡️ القبائل والتحالفات</span>
            <button className="close-tab-btn" onClick={() => setActiveTab('harbor')}>إغلاق</button>
          </div>
          <p style={{ fontSize: '13px', color: '#d6d3d1', marginBottom: '12px' }}>
            انضم إلى أقوى قبائل ملوك القرصنة للمشاركة في الحروب المشتركة والتبرع للحصول على مكافآت مضاعفة!
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {tribes.map(t => (
              <div key={t.name} style={{ background: t.joined ? 'rgba(234, 179, 8, 0.15)' : 'rgba(30, 24, 18, 0.9)', border: t.joined ? '2px dashed #facc15' : '1px solid #78350f', padding: '12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '13px' }}>
                  <div style={{ fontWeight: 'bold', color: '#fef08a', fontSize: '14px' }}>
                    {t.name} <span style={{ fontSize: '11px', background: '#ca8a04', color: '#000', padding: '2px 6px', borderRadius: '4px', marginRight: '5px' }}>مستوى {t.level}</span>
                  </div>
                  <div style={{ color: '#d6d3d1', marginTop: '4px' }}>
                    الأعضاء: {t.members}/50 | قوة التحالف: 🛡️ {t.power.toLocaleString()}
                  </div>
                  {t.joined && (
                    <div style={{ color: '#facc15', fontSize: '11px', marginTop: '2px', fontWeight: 'bold' }}>
                      إجمالي تبرعاتك: 🪙 {t.donations} ذهب
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {t.joined && (
                    <button 
                      onClick={() => donateToTribe(t.name)}
                      style={{ background: '#ca8a04', color: '#fff', border: '1px solid #fef08a', borderRadius: '4px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold' }}>
                      تبرع (50🪙)
                    </button>
                  )}
                  <button 
                    onClick={() => joinTribe(t.name)}
                    style={{ background: t.joined ? '#991b1b' : '#1e3a8a', color: '#fff', border: 'none', borderRadius: '4px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold' }}>
                    {t.joined ? 'مغادرة' : 'انضمام'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ----------------- CHAT TAB (الشات والدردشة العامة) ----------------- */}
      {activeTab === 'chat' && (
        <div className="tab-overlay" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="tab-title">
            <span>💬 شات ملوك القرصنة العام</span>
            <button className="close-tab-btn" onClick={() => setActiveTab('harbor')}>إغلاق</button>
          </div>

          {/* Messages Container */}
          <div style={{ flex: 1, background: '#1c1917', borderRadius: '8px', padding: '10px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', minHeight: '180px', maxHeight: '300px', border: '1px solid #78350f' }}>
            {chatMessages.map(msg => (
              <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignSelf: msg.isMe ? 'flex-end' : 'flex-start', maxWidth: '85%', background: msg.isMe ? '#ca8a04' : '#292524', padding: '8px 12px', borderRadius: '12px', color: msg.isMe ? '#000' : '#fff', border: msg.isMe ? '1px solid #fef08a' : '1px solid #444' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 'bold', marginBottom: '2px', color: msg.isMe ? '#1e1b4b' : '#ca8a04' }}>
                  <span>{msg.avatar}</span>
                  <span>{msg.sender}</span>
                  <span style={{ fontSize: '9px', opacity: 0.7, marginRight: 'auto' }}>{msg.time}</span>
                </div>
                <div style={{ fontSize: '13px', wordBreak: 'break-word', fontWeight: msg.isMe ? 'bold' : 'normal' }}>{msg.text}</div>
              </div>
            ))}
          </div>

          {/* Send Input Panel */}
          <form onSubmit={sendChatMessage} style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
            <input 
              type="text" 
              placeholder="اكتب رسالة في الدردشة العامة للميناء..." 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              style={{ flex: 1, background: '#292524', border: '2px solid #ca8a04', borderRadius: '6px', padding: '10px', color: '#fff', fontSize: '13px', outline: 'none' }}
            />
            <button 
              type="submit" 
              style={{ background: '#ca8a04', border: '1px solid #fef08a', borderRadius: '6px', padding: '10px 18px', color: '#000', fontWeight: 'bold', cursor: 'pointer' }}>
              إرسال
            </button>
          </form>
        </div>
      )}

      {/* ----------------- LEADERBOARD TAB (لوحة المتصدرين) ----------------- */}
      {activeTab === 'leaderboard' && (
        <div className="tab-overlay">
          <div className="tab-title">
            <span>🏆 قائمة متصدري السيرفر</span>
            <button className="close-tab-btn" onClick={() => setActiveTab('harbor')}>إغلاق</button>
          </div>
          <p style={{ fontSize: '13px', color: '#d6d3d1', marginBottom: '12px', textAlign: 'center' }}>
            لوحة شرف ملوك القرصنة - تصنيف اللاعبين حسب رصيد الذهب الإجمالي!
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', background: '#ca8a04', color: '#000', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold', fontSize: '12px' }}>
              <span style={{ width: '10%' }}>المركز</span>
              <span style={{ width: '50%' }}>القرصان / القبطان</span>
              <span style={{ width: '40%', textAlign: 'left' }}>رصيد الذهب</span>
            </div>

            <div style={{ display: 'flex', background: '#292524', padding: '8px 12px', borderRadius: '6px', fontSize: '13px', border: '1px solid #a16207' }}>
              <span style={{ width: '10%', fontWeight: 'bold', color: '#facc15' }}>1 🥇</span>
              <span style={{ width: '50%' }}>🧔 القبطان باربوسا [ملك الكاريبي]</span>
              <span style={{ width: '40%', textAlign: 'left', color: '#fef08a' }}>💰 12,450 ذهب</span>
            </div>

            <div style={{ display: 'flex', background: '#292524', padding: '8px 12px', borderRadius: '6px', fontSize: '13px' }}>
              <span style={{ width: '10%', fontWeight: 'bold', color: '#d1d5db' }}>2 🥈</span>
              <span style={{ width: '50%' }}>🧙‍♂️ سياف الأعماق [قراصنة الموت]</span>
              <span style={{ width: '40%', textAlign: 'left', color: '#fef08a' }}>💰 9,800 ذهب</span>
            </div>

            <div style={{ display: 'flex', background: '#292524', padding: '8px 12px', borderRadius: '6px', fontSize: '13px' }}>
              <span style={{ width: '10%', fontWeight: 'bold', color: '#b45309' }}>3 🥉</span>
              <span style={{ width: '50%' }}>👸 أميرة البحر [أسياد البحار]</span>
              <span style={{ width: '40%', textAlign: 'left', color: '#fef08a' }}>💰 7,150 ذهب</span>
            </div>

            {/* Current user's row positioned dynamically */}
            <div style={{ display: 'flex', background: 'rgba(234, 179, 8, 0.2)', padding: '10px 12px', borderRadius: '6px', fontSize: '13px', border: '2px solid #facc15', marginTop: '8px' }}>
              <span style={{ width: '10%', fontWeight: 'bold', color: '#facc15' }}>{getUserRank()}</span>
              <span style={{ width: '50%', fontWeight: 'bold' }}>{avatar} {username} (أنت)</span>
              <span style={{ width: '40%', textAlign: 'left', color: '#fef08a', fontWeight: 'bold' }}>💰 {gold.toLocaleString()} ذهب</span>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- REPORTS TAB (تقارير المعارك والرحلات) ----------------- */}
      {activeTab === 'reports' && (
        <div className="tab-overlay">
          <div className="tab-title">
            <span>📊 تقارير المعارك والرحلات الحربية</span>
            <button className="close-tab-btn" onClick={() => setActiveTab('harbor')}>إغلاق</button>
          </div>
          <p style={{ fontSize: '13px', color: '#d6d3d1', marginBottom: '14px' }}>
            سجل غزواتك وغنائم الحرب ضد وحوش البحار والخصوم. انقر على أي تقرير لقراءة التفاصيل الكاملة!
          </p>

          {battleReports.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: '#a8a29e', background: '#1c1917', borderRadius: '8px' }}>
              📭 لا توجد تقارير معارك حالياً. ابدأ شن الغزوات من ساحة المعركة!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {battleReports.map(report => (
                <div 
                  key={report.id} 
                  onClick={() => setActiveReport(report)}
                  style={{ 
                    background: report.isVictory ? 'rgba(22, 163, 74, 0.1)' : 'rgba(220, 38, 38, 0.1)', 
                    border: report.isVictory ? '1px solid #16a34a' : '1px solid #dc2626', 
                    padding: '12px', 
                    borderRadius: '8px', 
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'transform 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.01)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '24px' }}>{report.opponentAvatar}</span>
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '13px' }}>
                        غزوة ضد: {report.opponentName}
                      </div>
                      <div style={{ fontSize: '11px', color: '#a8a29e', marginTop: '2px' }}>
                        التوقيت: {report.time} | الخبرة: +{report.expGained} XP
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <span style={{ 
                      fontSize: '11px', 
                      background: report.isVictory ? '#16a34a' : '#dc2626', 
                      color: '#fff', 
                      padding: '2px 8px', 
                      borderRadius: '4px',
                      fontWeight: 'bold' 
                    }}>
                      {report.isVictory ? 'نصر ساحق 🏆' : 'هزيمة 💀'}
                    </span>
                    {report.isVictory && (
                      <div style={{ fontSize: '11px', color: '#facc15', marginTop: '4px', fontWeight: 'bold' }}>
                        +💰 {report.goldChange} | +💎 {report.gemsChange}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ----------------- QUESTS MENU DRAWER (مهمات اليوم) ----------------- */}
      {activeTab === 'harbor' && (
        <div style={{
          position: 'fixed',
          top: '80px',
          left: '2.5%',
          width: '240px',
          background: 'rgba(15, 12, 9, 0.95)',
          border: '2px solid #ca8a04',
          borderRadius: '8px',
          padding: '10px',
          zIndex: 10,
          color: '#fff',
          fontSize: '12px',
          maxHeight: '260px',
          overflowY: 'auto'
        }} dir="rtl">
          <div style={{ fontWeight: 'bold', color: '#facc15', borderBottom: '1px solid #ca8a04', paddingBottom: '4px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
            <span>🎯 المهام النشطة اليوم</span>
            <span style={{ fontSize: '10px', color: '#a8a29e' }}>مستوى {playerLevel}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {quests.map(q => (
              <div key={q.id} style={{ background: '#292524', padding: '6px', borderRadius: '4px', border: '1px solid #57534e' }}>
                <div style={{ fontWeight: 'bold', color: '#fef08a' }}>{q.title}</div>
                <div style={{ color: '#d6d3d1', fontSize: '10px', margin: '2px 0' }}>{q.target}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                  <span>التقدم: {q.progress}/{q.max}</span>
                  {q.completed && !q.claimed && (
                    <button 
                      onClick={() => claimQuestReward(q.id, q.rewardGold, q.rewardGems)}
                      style={{ background: '#16a34a', color: '#fff', border: 'none', borderRadius: '3px', padding: '2px 6px', fontSize: '10px', cursor: 'pointer', fontWeight: 'bold' }}>
                      اجمع الجائزة
                    </button>
                  )}
                  {q.claimed && <span style={{ color: '#16a34a', fontWeight: 'bold' }}>تم ✓</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ----------------- TAVERN / CREW RECRUITMENT MODAL (إدارة الطاقم) ----------------- */}
      {crewModal && (
        <div id="crew-modal" className="tab-overlay" style={{ zIndex: 120 }}>
          <div className="tab-title">
            <span>👥 حانة توظيف البحارة والمستكشفين</span>
            <button className="close-tab-btn" onClick={() => setCrewModal(false)}>إغلاق</button>
          </div>
          <p style={{ fontSize: '13px', color: '#d6d3d1', marginBottom: '14px' }}>
            وظّف القراصنة المحترفين وعينهم في سفينتك النشطة لرفع كفاءة وقيمة صيد الأسماك والذهب!
          </p>

          <div style={{ background: '#ca8a04', color: '#000', padding: '6px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', marginBottom: '12px', textAlign: 'center' }}>
            السفينة المحددة الحالية: {ships.find(s => s.id === currentShipId)?.name}
          </div>

          <div className="grid-cards">
            {crew.map(cMember => {
              const assignedShip = ships.find(s => s.id === cMember.shipId);
              return (
                <div key={cMember.id} style={{ background: 'rgba(30, 24, 18, 0.9)', border: '1px solid #78350f', padding: '10px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '32px' }}>{cMember.avatar}</span>
                  <div style={{ flex: 1, fontSize: '12px' }}>
                    <div style={{ fontWeight: 'bold', color: '#fef08a' }}>{cMember.name}</div>
                    <div style={{ color: '#d6d3d1' }}>الدور: {cMember.role}</div>
                    <div style={{ color: '#facc15', fontWeight: 'bold' }}>القوة الإضافية: 🛡️ +{cMember.power} صيد وتقارب حربي</div>
                    <div style={{ marginTop: '2px', fontWeight: 'bold' }}>السعر: {cMember.cost} ذهب</div>
                  </div>
                  <div>
                    {cMember.hired ? (
                      <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 'bold' }}>
                        معين على: {assignedShip?.name || 'سفينة'}
                      </span>
                    ) : (
                      <button 
                        onClick={() => hireCrew(cMember)}
                        style={{ background: '#ca8a04', color: '#fff', border: '1px solid #fef08a', borderRadius: '4px', padding: '6px 10px', fontSize: '11px', cursor: 'pointer', fontWeight: 'bold' }}>
                        تعيين
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ----------------- VIEW REPORT DETAILED MODAL ----------------- */}
      {activeReport && (
        <div className="tab-overlay" style={{ zIndex: 110, maxWidth: '500px', margin: '0 auto' }}>
          <div className="tab-title">
            <span>📜 تفاصيل تقرير المعركة</span>
            <button className="close-tab-btn" onClick={() => setActiveReport(null)}>إغلاق</button>
          </div>
          <div style={{ background: '#1c1917', border: '1px solid #ca8a04', borderRadius: '8px', padding: '14px', fontSize: '13px' }}>
            <div style={{ textAlign: 'center', marginBottom: '14px' }}>
              <div style={{ fontSize: '50px' }}>{activeReport.opponentAvatar}</div>
              <h3 style={{ margin: '6px 0 0 0', color: '#facc15' }}>غزوة ضد: {activeReport.opponentName}</h3>
              <span style={{ 
                fontSize: '11px', 
                background: activeReport.isVictory ? '#16a34a' : '#dc2626', 
                color: '#fff', 
                padding: '2px 8px', 
                borderRadius: '4px',
                fontWeight: 'bold',
                display: 'inline-block',
                marginTop: '6px'
              }}>
                {activeReport.isVictory ? 'نصر مؤزر 🏆' : 'هزيمة منكرة 💀'}
              </span>
            </div>

            <div style={{ borderTop: '1px solid #292524', paddingTop: '10px', marginBottom: '12px' }}>
              <div style={{ fontWeight: 'bold', color: '#ca8a04', marginBottom: '6px' }}>💰 الغنائم الحربية المكتسبة:</div>
              <div>الذهب: <span style={{ color: '#facc15', fontWeight: 'bold' }}>+{activeReport.goldChange} ذهب</span></div>
              <div>الجواهر: <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>+{activeReport.gemsChange} جواهر</span></div>
              <div>نقاط الخبرة: <span style={{ color: '#10b981', fontWeight: 'bold' }}>+{activeReport.expGained} XP</span></div>
            </div>

            <div style={{ fontWeight: 'bold', color: '#ca8a04', marginBottom: '6px' }}>📝 مجريات المعركة بالتفصيل:</div>
            <div style={{ background: '#0a0806', border: '1px solid #78350f', padding: '8px', borderRadius: '4px', maxHeight: '150px', overflowY: 'auto', fontFamily: 'monospace', fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {activeReport.log.map((line, idx) => (
                <div key={idx} style={{ color: '#fff', borderBottom: '1px solid #1a1510', paddingBottom: '2px' }}>{line}</div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ----------------- CONFIRM SELL MODAL ----------------- */}
      {confirmModal && (
        <div id="confirm-modal" className="modal" style={{ display: 'block' }}>
          <div style={{ fontSize: '30px' }}>⚓</div>
          <h3>بيع السفينة</h3>
          <p>هل أنت متأكد من بيع هذه السفينة لصالح ميناء ملوك القرصنة؟</p>
          <div style={{ margin: '15px 0', fontWeight: 'bold', color: '#fcd34d' }}>+ 250 ذهب</div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setConfirmModal(false)} style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '5px', background: '#444', color: '#fff', cursor: 'pointer' }}>إلغاء</button>
            <button onClick={confirmSell} style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '5px', background: '#d35400', color: '#fff', cursor: 'pointer' }}>تأكيد</button>
          </div>
        </div>
      )}

      {/* ----------------- REWARD COLLECT MODAL ----------------- */}
      {rewardModal && (
        <div id="reward-modal" className="modal" style={{ display: 'block' }}>
          <div style={{ fontSize: '14px', marginBottom: '5px' }}>نتيجة رحلة الصيد بنجاح</div>
          <div style={{ fontSize: '50px' }}>🐟</div>
          <h3>{rewardFish.name}</h3>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#fcd34d' }}>{rewardFish.amount}x سمكة</div>
          <div style={{ margin: '8px 0', fontWeight: 'bold', color: '#27ae60' }}>+ {rewardFish.value} ذهب لأسطولك</div>
          <button onClick={() => setRewardModal(false)} style={{ width: '100%', padding: '10px', marginTop: '10px', border: 'none', borderRadius: '5px', background: '#27ae60', color: '#fff', cursor: 'pointer' }}>موافق</button>
        </div>
      )}

      {/* ----------------- FISH STORAGE MODAL (مخزن الأسماك) ----------------- */}
      {fishStorageModal && (
        <div className="tab-overlay" style={{ zIndex: 110, maxWidth: '500px', margin: '0 auto' }}>
          <div className="tab-title">
            <span>📦 مخازن الأسماك الإمبراطورية (البيوت الخشبية)</span>
            <button className="close-tab-btn" onClick={() => setFishStorageModal(false)}>إغلاق</button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }} dir="rtl">
            <div style={{ background: '#1c1917', border: '1px solid #ca8a04', borderRadius: '8px', padding: '12px', fontSize: '13px' }}>
              <h3 style={{ margin: '0 0 8px 0', color: '#facc15', fontSize: '15px' }}>ℹ️ معلومات البيوت الخشبية</h3>
              <p style={{ margin: '4px 0', color: '#d6d3d1', lineHeight: '1.4' }}>
                تم تعيين **البيتين الخشبيين** في الميناء ليعملا كمخزن مركزي لأسماك الأسطول:
              </p>
              <ul style={{ paddingRight: '20px', margin: '6px 0', color: '#fef08a' }}>
                <li><strong>البيت الأول (الشرقي):</strong> مخصص لفرز وتبريد الأسماك الطازجة.</li>
                <li><strong>البيت الثاني (الغربي):</strong> مخصص للتجفيف، التمليح، وتجهيز أسماك التصدير.</li>
              </ul>
              <p style={{ margin: '6px 0 0 0', fontSize: '12px', color: '#facc15' }}>
                📈 مستوى المخازن الحالي: **مستوى {fishStorageLevel}** (مكافأة ذهب صيد إضافية: <span style={{ color: '#27ae60', fontWeight: 'bold' }}>+{Math.round((fishStorageLevel - 1) * 10)}%</span>)
              </p>
            </div>

            <div style={{ background: '#1c1917', border: '1px solid #ca8a04', borderRadius: '8px', padding: '12px' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#facc15', fontSize: '14px' }}>🐟 جرد الأسماك المخزنة حالياً</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {Object.entries(fishInventory).map(([name, count]) => (
                  <div key={name} style={{ background: '#292524', padding: '8px', borderRadius: '6px', border: '1px solid #57534e', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', fontWeight: 'bold' }}>{name}</span>
                    <span style={{ color: '#facc15', fontWeight: 'bold', fontSize: '12px' }}>{count}x 🐟</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: '#1c1917', border: '1px solid #ca8a04', borderRadius: '8px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: '0', color: '#facc15', fontSize: '13px' }}>🔨 ترقية وتوسيع البيتين</h4>
                <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#a8a29e' }}>ترقية السعة ووسائل الحفظ لتزيد أرباح الصيد بنسبة +10%.</p>
                <div style={{ color: '#facc15', fontWeight: 'bold', fontSize: '12px', marginTop: '4px' }}>التكلفة: {fishStorageLevel * 200} ذهب</div>
              </div>
              <button 
                onClick={() => {
                  const cost = fishStorageLevel * 200;
                  if (gold >= cost) {
                    setGold(prev => prev - cost);
                    setFishStorageLevel(prev => prev + 1);
                    alert(`تمت ترقية مخزن الأسماك (البيتين) بنجاح إلى مستوى ${fishStorageLevel + 1}! مكافأة الذهب أصبحت +${Math.round(fishStorageLevel * 10)}%`);
                  } else {
                    alert('الذهب غير كافٍ لترقية مخزن الأسماك!');
                  }
                }}
                className="upgrade-btn"
              >
                ترقية المخزن ⚡
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- SHIP TOWER MODAL (برج السفن) ----------------- */}
      {shipTowerModal && (
        <div className="tab-overlay" style={{ zIndex: 110, maxWidth: '500px', margin: '0 auto' }}>
          <div className="tab-title">
            <span>🏰 برج الأسطول الإمبراطوري</span>
            <button className="close-tab-btn" onClick={() => setShipTowerModal(false)}>إغلاق</button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }} dir="rtl">
            <div style={{ background: '#1c1917', border: '1px solid #ca8a04', borderRadius: '8px', padding: '12px', fontSize: '13px' }}>
              <h3 style={{ margin: '0 0 8px 0', color: '#facc15', fontSize: '15px' }}>ℹ️ معلومات برج السفن الحربية</h3>
              <p style={{ margin: '4px 0', color: '#d6d3d1', lineHeight: '1.4' }}>
                برج الأسطول يعزز الدفاعات العامة والهجوم العام لجميع سفنك النشطة بنسب مضاعفة:
              </p>
              <p style={{ margin: '6px 0 0 0', fontSize: '12px', color: '#facc15' }}>
                📈 مستوى البرج الحالي: **مستوى {shipTowerLevel}** (زيادة قوة هجوم الأسطول: <span style={{ color: '#ef4444', fontWeight: 'bold' }}>+{Math.round((shipTowerLevel - 1) * 10)} نقطة هجومية</span>)
              </p>
            </div>

            <div style={{ background: '#1c1917', border: '1px solid #ca8a04', borderRadius: '8px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: '0', color: '#facc15', fontSize: '13px' }}>🔨 ترقية وتطوير البرج</h4>
                <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#a8a29e' }}>ترقية البرج تزيد من قوة أسطولك بمعدل +10 نقاط هجومية لكل مستوى.</p>
                <div style={{ color: '#facc15', fontWeight: 'bold', fontSize: '12px', marginTop: '4px' }}>التكلفة: {shipTowerLevel * 300} ذهب</div>
              </div>
              <button 
                onClick={() => {
                  const cost = shipTowerLevel * 300;
                  if (gold >= cost) {
                    setGold(prev => prev - cost);
                    setShipTowerLevel(prev => prev + 1);
                    audioEngine.playBell();
                    alert(`تمت ترقية برج السفن بنجاح إلى مستوى ${shipTowerLevel + 1}! قوة أسطولك الحربي ازدادت بشكل كبير.`);
                  } else {
                    alert('الذهب غير كافٍ لترقية البرج!');
                  }
                }}
                className="upgrade-btn"
              >
                ترقية البرج ⚡
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- SHIP MARKET MODAL (سوق السفن) ----------------- */}
      {shipMarketModal && (() => {
        const warehouseCount = ships.filter(s => !s.exists).length;
        const warehouseCapacity = Math.floor(shipTowerLevel / 3) + 1;
        const activeCount = ships.filter(s => s.exists).length;
        const totalCargoActive = ships.filter(s => s.exists).reduce((acc, s) => acc + (s.cargo || 0), 0);
        
        return (
          <div className="tab-overlay" style={{ 
            zIndex: 110, 
            position: 'fixed',
            top: '50%',
            left: '50%',
            bottom: 'auto',
            right: 'auto',
            transform: 'translate(-50%, -50%)',
            width: '95%',
            maxWidth: '700px', 
            height: '90vh',
            maxHeight: '90vh', 
            display: 'flex', 
            flexDirection: 'column', 
            background: 'rgba(2, 13, 20, 0.82)', 
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '3px solid #142834', 
            borderRadius: '16px', 
            overflow: 'hidden' 
          }}>
            <div className="tab-title" style={{ borderBottom: '2px solid #142834', color: '#38bdf8', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>⛵ سوق ومستودع شراء السفن الكبرى</span>
              <button className="close-tab-btn" onClick={() => setShipMarketModal(false)} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '18px', cursor: 'pointer', fontWeight: 'bold' }}>إغلاق</button>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }} dir="rtl">
              {/* Top Upgrade Section */}
              <div style={{ 
                background: '#041017', 
                border: '1.5px solid #142834', 
                borderRadius: '16px', 
                padding: '16px', 
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #142834', paddingBottom: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 'bold' }}>المستوى الحالي</span>
                  <strong style={{ fontSize: '16px', color: '#fff' }}>{shipTowerLevel}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #142834', paddingBottom: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 'bold' }}>المستوى التالي</span>
                  <strong style={{ fontSize: '16px', color: '#10b981' }}>{shipTowerLevel + 1}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #142834', paddingBottom: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 'bold' }}>تكلفة الذهب</span>
                  <strong style={{ fontSize: '14px', color: '#eab308' }}>
                    {(shipTowerLevel * 100000 + 50000).toLocaleString('en-US')}
                  </strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #142834', paddingBottom: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 'bold' }}>المدة</span>
                  <strong style={{ fontSize: '14px', color: '#fff' }}>
                    {Math.floor((shipTowerLevel * 6) / 60)}h {Math.floor((shipTowerLevel * 6) % 60)}m
                  </strong>
                </div>
                <div style={{ marginTop: '4px' }}>
                  <button 
                    onClick={() => {
                      const cost = shipTowerLevel * 100000 + 50000;
                      if (gold >= cost) {
                        setGold(prev => prev - cost);
                        setShipTowerLevel(prev => prev + 1);
                        audioEngine.playBell();
                        alert(`🎉 تهانينا! تم زيادة الحد الأقصى لمستويات الأسطول بنجاح إلى مستوى ${shipTowerLevel + 1}!`);
                      } else {
                        alert('الذهب غير كافٍ لترقية الأسطول!');
                      }
                    }}
                    style={{ 
                      background: 'none', 
                      color: '#22d3ee', 
                      border: '2.5px solid #22d3ee', 
                      borderRadius: '50px', 
                      padding: '10px 24px', 
                      fontSize: '14px', 
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      boxShadow: '0 0 15px rgba(6, 182, 212, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      width: '100%',
                      justifyContent: 'center',
                      transition: 'all 0.2s'
                    }}
                  >
                    بدء الترقية ⚙️
                  </button>
                </div>
              </div>

              {/* Yellow/Gold Capsule (مخزن السفن) */}
              <div style={{
                background: 'rgba(234, 179, 8, 0.04)',
                border: '1.5px dashed rgba(234, 179, 8, 0.3)',
                borderRadius: '16px',
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#facc15', fontSize: '13px', fontWeight: 'bold' }}>📦 مخزن السفن ({warehouseCount}/{warehouseCapacity})</span>
                  <span style={{ color: '#facc15', fontSize: '13px', fontWeight: 'bold' }}>النشطة: {activeCount} / 3</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#ca8a04', fontSize: '11px' }}>السعة: {totalCargoActive.toLocaleString('en-US')} / 380,000</span>
                </div>
                {/* Progress bar */}
                <div style={{ width: '100%', height: '8px', background: 'rgba(234,179,8,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(100, (totalCargoActive / 380000) * 100)}%`, height: '100%', background: '#eab308', borderRadius: '4px', transition: 'width 0.3s' }} />
                </div>
              </div>

              {/* Header: أسطول الشراء */}
              <div style={{ textAlign: 'right', marginTop: '4px', borderTop: '1.5px solid #142834', paddingTop: '16px' }}>
                <h3 style={{ margin: 0, color: '#fff', fontSize: '16px', fontWeight: 'bold' }}>أسطول الشراء</h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#64748b', lineHeight: '1.4' }}>
                  يظهر حسب مستوى السوق الحالي، مع عروض فخمة وحالة الاستلام لكل سفينة.
                </p>
              </div>

              {/* List of SHOP_SHIPS */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {SHOP_SHIPS.map((spec) => {
                  const ownedShip = ships.find(s => s.level === spec.level);
                  const isLockedByTower = spec.level > shipTowerLevel;

                  return (
                    <div 
                      key={spec.level}
                      style={{
                        background: 'linear-gradient(135deg, #041017 0%, #020d14 100%)',
                        border: '2px solid #142834',
                        borderRadius: '16px',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        position: 'relative',
                        boxShadow: '0 4px 25px rgba(0,0,0,0.5)'
                      }}
                    >
                      {/* Top Action & Price Row */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        {/* Left button: purchase / toggle / lock */}
                        <div>
                          {isLockedByTower ? (
                            <div style={{ 
                              background: 'rgba(239, 68, 68, 0.1)', 
                              color: '#fca5a5', 
                              border: '1.5px solid #ef4444', 
                              borderRadius: '25px', 
                              padding: '6px 14px', 
                              fontSize: '12px',
                              fontWeight: 'bold'
                            }}>
                              🔒 يتطلب {spec.level}
                            </div>
                          ) : ownedShip ? (
                            ownedShip.exists ? (
                              <button 
                                onClick={() => toggleShipActive(ownedShip.id)}
                                style={{
                                  background: 'linear-gradient(to right, #d97706, #b45309)',
                                  color: '#fff',
                                  border: '1px solid #f59e0b',
                                  borderRadius: '25px',
                                  padding: '6px 14px',
                                  fontSize: '12px',
                                  fontWeight: 'bold',
                                  cursor: 'pointer'
                                }}
                              >
                                تعطيل (للمخزن) 📥
                              </button>
                            ) : (
                              <button 
                                onClick={() => toggleShipActive(ownedShip.id)}
                                style={{
                                  background: 'linear-gradient(to right, #059669, #047857)',
                                  color: '#fff',
                                  border: '1px solid #10b981',
                                  borderRadius: '25px',
                                  padding: '6px 14px',
                                  fontSize: '12px',
                                  fontWeight: 'bold',
                                  cursor: 'pointer'
                                }}
                              >
                                تفعيل (للأسطول) ⛵
                              </button>
                            )
                          ) : (
                            <button 
                              onClick={() => buyShipLevel(spec)}
                              style={{
                                  background: 'linear-gradient(to right, #2563eb, #1d4ed8)',
                                  color: '#fff',
                                  border: '1px solid #3b82f6',
                                  borderRadius: '25px',
                                  padding: '6px 14px',
                                  fontSize: '12px',
                                  fontWeight: 'bold',
                                  cursor: 'pointer'
                              }}
                            >
                              شراء (للمخزن) 💰
                            </button>
                          )}
                        </div>

                        {/* Right side: Price or Owned Badge */}
                        <div>
                          {ownedShip ? (
                            <span style={{ color: '#10b981', fontSize: '13px', fontWeight: 'bold' }}>مملوكة ✅</span>
                          ) : (
                            <strong style={{ color: '#eab308', fontSize: '14px', background: '#0a1a24', border: '1px solid #14354c', padding: '4px 12px', borderRadius: '10px' }}>
                              {spec.price.toLocaleString('en-US')} 🪙
                            </strong>
                          )}
                        </div>
                      </div>

                      {/* Ship Image Container with level pill */}
                      <div style={{
                        position: 'relative',
                        width: '100%',
                        height: spec.level <= 15 ? '220px' : '140px',
                        background: 'radial-gradient(circle, #081d29 0%, transparent 75%)',
                        borderRadius: '12px',
                        border: '1.5px solid #0f2430',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        overflow: 'hidden'
                      }}>
                        <span style={{ 
                          position: 'absolute',
                          top: '10px',
                          left: '10px',
                          fontSize: '11px',
                          background: 'rgba(56, 189, 248, 0.1)',
                          color: '#38bdf8',
                          padding: '3px 8px',
                          borderRadius: '12px',
                          fontWeight: 'bold',
                          border: '1px solid #0284c7',
                          zIndex: 10
                        }}>
                          Lvl {spec.level}
                        </span>
                        <ShipImage 
                          level={spec.level} 
                          style={spec.level <= 15 ? { 
                            width: '100%', 
                            height: '100%', 
                            margin: '0 auto', 
                            borderRadius: '12px' 
                          } : { 
                            width: 'auto', 
                            height: '100%', 
                            aspectRatio: '1/1', 
                            margin: '0 auto', 
                            borderRadius: '12px' 
                          }} 
                        />
                      </div>

                      {/* Name & Subname */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'right' }}>
                        <h4 style={{ margin: 0, color: '#fff', fontSize: '16px', fontWeight: 'bold' }}>{spec.name}</h4>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>{spec.subName}</span>
                      </div>

                      {/* Stats Table (Horizontal Style) */}
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(4, 1fr)', 
                        gap: '6px', 
                        background: '#03141f', 
                        padding: '10px', 
                        borderRadius: '12px',
                        border: '1px solid #0f2430',
                        textAlign: 'center'
                      }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span style={{ fontSize: '13px' }}>🎣</span>
                          <strong style={{ fontSize: '12px', color: '#fff' }}>{spec.hook}</strong>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span style={{ fontSize: '13px' }}>📦</span>
                          <strong style={{ fontSize: '12px', color: '#fff' }}>{spec.cargo.toLocaleString('en-US')}</strong>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span style={{ fontSize: '13px' }}>⚔️</span>
                          <strong style={{ fontSize: '12px', color: '#fff' }}>{spec.power}</strong>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span style={{ fontSize: '13px' }}>⏱️</span>
                          <strong style={{ fontSize: '11px', color: '#fff' }}>{spec.durationStr}</strong>
                        </div>
                      </div>

                      {/* Fish types list */}
                      <div style={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: '8px', 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        fontSize: '12px',
                        color: '#94a3b8' 
                      }}>
                        {spec.fishTypes?.map((fish, idx) => (
                          <span key={idx} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ color: '#f97316' }}>•</span>
                            <span>{fish}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })()}



      {/* ----------------- SHIP SELECTION ACTION MENU ----------------- */}
      {menu.visible && (
        <div id="ship-menu" style={{ display: 'flex', left: `${menu.x}px`, top: `${menu.y}px` }}>
          {menu.status === 'docked' ? (
            <div className="menu-btn" onClick={() => act('fish')}><div className="menu-icon">🎣</div>صيد</div>
          ) : (
            <div className="menu-btn" onClick={() => act('collect')}><div className="menu-icon">🪣</div>اجمع</div>
          )}
          <div className="menu-btn" onClick={() => act('crew')}><div className="menu-icon">👥</div>طاقم</div>
          <div className="menu-btn" onClick={() => act('sell')}><div className="menu-icon">💰</div>بيع</div>
        </div>
      )}

      {/* ----------------- TOP BAR / RESOURCES HUD ----------------- */}
      <div className="top-bar" dir="rtl">
        <div className="resource-box" onClick={() => setActiveTab('settings')}>
          <img className="res-icon" src="https://raw.githubusercontent.com/alwjyhnyazsrhan-blip/my-game-assets/refs/heads/main/IMG_20260702_004120.jpg" alt="Menu" />
          <div className="res-label">القائمة (مستوى {playerLevel})</div>
        </div>
        <div className="resource-box" onClick={() => setActiveTab('shop')}>
          <img className="res-icon" src="https://raw.githubusercontent.com/alwjyhnyazsrhan-blip/my-game-assets/refs/heads/main/IMG_20260702_004010.png" alt="Gems" />
          <div className="res-label">جواهر: <span id="gems-count">{gems}</span></div>
        </div>
        <div className="resource-box" onClick={() => setActiveTab('shop')}>
          <img className="res-icon" src="https://raw.githubusercontent.com/alwjyhnyazsrhan-blip/my-game-assets/refs/heads/main/copilot_image_1782936949624.jpeg" alt="Gold" />
          <div className="res-label">ذهب: <span id="gold-count">{gold}</span></div>
        </div>
      </div>

      {/* ----------------- BOTTOM NAV TABS ----------------- */}
      <div className="bottom-nav">
        <div className={`nav-item ${activeTab === 'shop' ? 'active' : ''}`} onClick={() => setActiveTab('shop')}>
          <img className="nav-icon" src="https://raw.githubusercontent.com/alwjyhnyazsrhan-blip/my-game-assets/refs/heads/main/IMG_20260702_001434.png" alt="Shop" />
          <div className="label">المتجر</div>
        </div>
        <div className={`nav-item ${activeTab === 'tribes' ? 'active' : ''}`} onClick={() => setActiveTab('tribes')}>
          <img className="nav-icon" src="https://raw.githubusercontent.com/alwjyhnyazsrhan-blip/my-game-assets/refs/heads/main/IMG_20260702_001729.png" alt="Tribes" />
          <div className="label">القبائل</div>
        </div>
        <div className={`nav-item ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => setActiveTab('chat')}>
          <img className="nav-icon" src="https://raw.githubusercontent.com/alwjyhnyazsrhan-blip/my-game-assets/refs/heads/main/IMG_20260702_002020.png" alt="Chat" />
          <div className="label">الشات</div>
        </div>
        <div className={`nav-item ${activeTab === 'leaderboard' ? 'active' : ''}`} onClick={() => setActiveTab('leaderboard')}>
          <img className="nav-icon" src="https://raw.githubusercontent.com/alwjyhnyazsrhan-blip/my-game-assets/refs/heads/main/IMG_20260702_002239.png" alt="Leaderboard" />
          <div className="label">الترتيب</div>
        </div>

        <div className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
          <img className="nav-icon" src="https://raw.githubusercontent.com/alwjyhnyazsrhan-blip/my-game-assets/refs/heads/main/IMG_20260702_002451.png" alt="Settings" />
          <div className="label">الإعدادات</div>
        </div>
      </div>
    </div>
  );
}
