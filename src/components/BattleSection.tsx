import React, { useState, useRef } from 'react';
import { Monster, OpponentPlayer, BattleReport } from '../types';

interface BattleSectionProps {
  gold: number;
  setGold: React.Dispatch<React.SetStateAction<number>>;
  gems: number;
  setGems: React.Dispatch<React.SetStateAction<number>>;
  onBattleEnd: (report: BattleReport) => void;
  playerPower: number;
  playerLevel: number;
  playerName: string;
  playerAvatar: string;
  weapons?: Record<string, number>;
  setWeapons?: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}

const MONSTERS: Monster[] = [
  {
    id: 'm1',
    name: 'تنين البحار الأسطوري',
    avatar: '🐉',
    level: 3,
    hp: 120,
    maxHp: 120,
    power: 15,
    rewardGold: 120,
    rewardGems: 1,
    rewardExp: 35
  },
  {
    id: 'm2',
    name: 'وحش الكراكن العملاق',
    avatar: '🐙',
    level: 5,
    hp: 200,
    maxHp: 200,
    power: 28,
    rewardGold: 250,
    rewardGems: 2,
    rewardExp: 60
  },
  {
    id: 'm3',
    name: 'قرش الميجالودون الغاضب',
    avatar: '🦈',
    level: 2,
    hp: 80,
    maxHp: 80,
    power: 10,
    rewardGold: 60,
    rewardGems: 0,
    rewardExp: 20
  }
];

const OPPONENTS: OpponentPlayer[] = [
  {
    id: 'o1',
    name: 'القبطان تيتش [اللحية السوداء]',
    avatar: '🧔',
    level: 4,
    power: 22,
    goldReward: 150,
    gemsReward: 1,
    expReward: 40
  },
  {
    id: 'o2',
    name: 'سياف الأعماق [قراصنة الموت]',
    avatar: '🥷',
    level: 6,
    power: 35,
    goldReward: 300,
    gemsReward: 3,
    expReward: 80
  },
  {
    id: 'o3',
    name: 'القرصان سيلفر الماكر',
    avatar: '🦜',
    level: 2,
    power: 12,
    goldReward: 80,
    gemsReward: 0,
    expReward: 15
  }
];

export default function BattleSection({
  gold,
  setGold,
  gems,
  setGems,
  onBattleEnd,
  playerPower,
  playerLevel,
  playerName,
  playerAvatar,
  weapons,
  setWeapons
}: BattleSectionProps) {
  const [activeSubTab, setActiveSubTab] = useState<'monsters' | 'players'>('monsters');
  const [fighting, setFighting] = useState(false);
  
  // Fight State Variables
  const [battleLogs, setBattleLogs] = useState<string[]>([]);
  const [myHp, setMyHp] = useState(100);
  const [enemyHp, setEnemyHp] = useState(100);
  const [enemyMaxHp, setEnemyMaxHp] = useState(100);
  const [enemyName, setEnemyName] = useState('');
  const [enemyAvatar, setEnemyAvatar] = useState('');
  const [battleResult, setBattleResult] = useState<'win' | 'lose' | null>(null);
  const [round, setRound] = useState(1);
  const [currentAttackEffect, setCurrentAttackEffect] = useState<'none' | 'player' | 'enemy'>('none');

  // Refs for tracking in-fight live health values to support manual weapon/repair usage in interval
  const pHpRef = useRef(0);
  const eHpRef = useRef(0);

  const startMonsterFight = (monster: Monster) => {
    if (fighting) return;
    setFighting(true);
    setBattleResult(null);
    setRound(1);
    setBattleLogs([`⚔️ بدأت المعركة ضد وحش الأعماق: ${monster.name}!`]);
    
    const maxHp = 100 + playerLevel * 10;
    setMyHp(maxHp);
    setEnemyHp(monster.hp);
    setEnemyMaxHp(monster.maxHp);
    setEnemyName(monster.name);
    setEnemyAvatar(monster.avatar);

    pHpRef.current = maxHp;
    eHpRef.current = monster.hp;

    runSimulation(
      maxHp,
      monster.hp,
      monster.power,
      monster.rewardGold,
      monster.rewardGems,
      monster.rewardExp,
      monster.avatar,
      monster.name
    );
  };

  const startPlayerFight = (opp: OpponentPlayer) => {
    if (fighting) return;
    setFighting(true);
    setBattleResult(null);
    setRound(1);
    setBattleLogs([`⚔️ شققت طريقك وغزوت أسطول القرصان: ${opp.name}!`]);
    
    const maxHp = 100 + playerLevel * 10;
    const oppHp = 80 + opp.level * 15;
    setMyHp(maxHp);
    setEnemyHp(oppHp);
    setEnemyMaxHp(oppHp);
    setEnemyName(opp.name);
    setEnemyAvatar(opp.avatar);

    pHpRef.current = maxHp;
    eHpRef.current = oppHp;

    runSimulation(
      maxHp,
      oppHp,
      opp.power,
      opp.goldReward,
      opp.gemsReward,
      opp.expReward,
      opp.avatar,
      opp.name
    );
  };

  const runSimulation = (
    initialPlayerHp: number,
    initialEnemyHp: number,
    enemyDmgBase: number,
    goldPrize: number,
    gemsPrize: number,
    expPrize: number,
    oppAvatar: string,
    oppName: string
  ) => {
    let currentRound = 1;
    const localLogs: string[] = [];

    const interval = setInterval(() => {
      // Check if finished on start of round
      if (pHpRef.current <= 0 || eHpRef.current <= 0) {
        clearInterval(interval);
        const isWin = eHpRef.current <= 0;
        setFighting(false);
        setBattleResult(isWin ? 'win' : 'lose');

        if (isWin) {
          setGold(prev => prev + goldPrize);
          setGems(prev => prev + gemsPrize);
        }

        const report: BattleReport = {
          id: `rep_${Date.now()}`,
          opponentName: oppName,
          opponentAvatar: oppAvatar,
          isVictory: isWin,
          goldChange: isWin ? goldPrize : 0,
          gemsChange: isWin ? gemsPrize : 0,
          expGained: isWin ? expPrize : 5, // pity EXP for losing
          time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
          log: [...localLogs, isWin ? `🏆 انتصار ساحق! تم دحر خصمك وحصلت على ${goldPrize} ذهب!` : `💀 هزيمة نكراء! تضررت سفينتك بالكامل واضطررت للانسحاب.`]
        };

        onBattleEnd(report);
        return;
      }

      // Player attacks first
      const playerAttackDmg = Math.floor(10 + playerPower * 0.5 + Math.random() * 12);
      eHpRef.current = Math.max(0, eHpRef.current - playerAttackDmg);
      const playerMsg = `🎯 جولة ${currentRound}: أطلقت مدافع القبطان ${playerName} وألحقت بالعدو ${playerAttackDmg} ضرر!`;
      localLogs.push(playerMsg);
      setBattleLogs(prev => [...prev, playerMsg]);
      setEnemyHp(eHpRef.current);
      setCurrentAttackEffect('player');

      // Enemy attacks back if still alive
      setTimeout(() => {
        if (eHpRef.current > 0) {
          const enemyAttackDmg = Math.floor(5 + enemyDmgBase * 0.6 + Math.random() * 8);
          pHpRef.current = Math.max(0, pHpRef.current - enemyAttackDmg);
          const enemyMsg = `💥 جولة ${currentRound}: هاجم ${oppName} سفينتك بقوة وتسبّب بـ ${enemyAttackDmg} ضرر!`;
          localLogs.push(enemyMsg);
          setBattleLogs(prev => [...prev, enemyMsg]);
          setMyHp(pHpRef.current);
          setCurrentAttackEffect('enemy');
        }
      }, 500);

      setTimeout(() => {
        setCurrentAttackEffect('none');
      }, 900);

      currentRound++;
      setRound(currentRound);
    }, 1200);
  };

  const handleUseWeapon = (key: string, dmg: number, title: string) => {
    if (!weapons || !setWeapons || !weapons[key] || weapons[key] <= 0) {
      alert('لا تملك هذا السلاح حالياً! يمكنك شراؤه من المتجر.');
      return;
    }
    setWeapons(prev => ({ ...prev, [key]: prev[key] - 1 }));
    eHpRef.current = Math.max(0, eHpRef.current - dmg);
    setEnemyHp(eHpRef.current);
    const msg = `🚀 استخدام سلاح: أطلقت ${title} وألحقت بالعدو ${dmg} ضرر إضافي فوري!`;
    setBattleLogs(prev => [...prev, msg]);
  };

  const handleUseRepair = (key: string, heal: number, title: string) => {
    if (!weapons || !setWeapons || !weapons[key] || weapons[key] <= 0) {
      alert('لا تملك أداة الإصلاح هذه حالياً! يمكنك شراؤها من المتجر.');
      return;
    }
    setWeapons(prev => ({ ...prev, [key]: prev[key] - 1 }));
    const maxHp = 100 + playerLevel * 10;
    pHpRef.current = Math.min(maxHp, pHpRef.current + heal);
    setMyHp(pHpRef.current);
    const msg = `🔧 استخدام أداة صيانة: استخدمت ${title} واستعدت ${heal} نقاط صحة فوراً!`;
    setBattleLogs(prev => [...prev, msg]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {!fighting && !battleResult && (
        <>
          {/* Sub tabs selector */}
          <div style={{ display: 'flex', background: '#1c1917', border: '1px solid #78350f', borderRadius: '8px', padding: '4px' }}>
            <button
              onClick={() => setActiveSubTab('monsters')}
              style={{
                flex: 1,
                padding: '10px',
                background: activeSubTab === 'monsters' ? '#ca8a04' : 'transparent',
                color: activeSubTab === 'monsters' ? '#000' : '#d6d3d1',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}>
              🐉 وحوش الأعماق الكبرى
            </button>
            <button
              onClick={() => setActiveSubTab('players')}
              style={{
                flex: 1,
                padding: '10px',
                background: activeSubTab === 'players' ? '#ca8a04' : 'transparent',
                color: activeSubTab === 'players' ? '#000' : '#d6d3d1',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}>
              ⚔️ غزو قراصنة آخرين
            </button>
          </div>

          <div style={{ fontSize: '12px', color: '#a8a29e', background: '#1c1917', padding: '8px 12px', borderRadius: '6px', border: '1px solid #292524' }}>
            ⚔️ قوة أسطولك الحربي الحالية: <strong style={{ color: '#facc15' }}>{playerPower} نقطة هجومية</strong> (تزيد قوة هجومك بشراء السفن الحربية من المتجر وتوظيف قراصنة حانة البحارة).
          </div>

          {activeSubTab === 'monsters' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {MONSTERS.map(monster => (
                <div key={monster.id} style={{
                  background: 'rgba(30, 24, 18, 0.95)',
                  border: '1px solid #78350f',
                  padding: '12px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px'
                }}>
                  <div style={{ fontSize: '36px', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))' }}>{monster.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold', color: '#facc15', fontSize: '14px' }}>
                      {monster.name} <span style={{ fontSize: '10px', background: '#ef4444', color: '#fff', padding: '2px 6px', borderRadius: '4px', marginRight: '6px' }}>مستوى {monster.level}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#d6d3d1', marginTop: '4px' }}>
                      نقاط الصحة للوحش: ❤️ {monster.hp} | مكافأة النصر: 💰 {monster.rewardGold} ذهب {monster.rewardGems > 0 && `| 💎 ${monster.rewardGems} جوهرة`}
                    </div>
                  </div>
                  <button
                    onClick={() => startMonsterFight(monster)}
                    style={{
                      background: 'linear-gradient(to bottom, #ca8a04, #854d0e)',
                      color: '#fff',
                      border: '1px solid #fef08a',
                      borderRadius: '6px',
                      padding: '8px 14px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}>
                    قاتل ⚔️
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {OPPONENTS.map(opp => (
                <div key={opp.id} style={{
                  background: 'rgba(30, 24, 18, 0.95)',
                  border: '1px solid #78350f',
                  padding: '12px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px'
                }}>
                  <div style={{ fontSize: '36px' }}>{opp.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold', color: '#facc15', fontSize: '14px' }}>
                      {opp.name} <span style={{ fontSize: '10px', background: '#1e3a8a', color: '#fff', padding: '2px 6px', borderRadius: '4px', marginRight: '6px' }}>قوة {opp.power}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#d6d3d1', marginTop: '4px' }}>
                      مستوى الخصم: {opp.level} | غنائم الفوز: 💰 {opp.goldReward} ذهب {opp.gemsReward > 0 && `| 💎 ${opp.gemsReward} جوهرة`}
                    </div>
                  </div>
                  <button
                    onClick={() => startPlayerFight(opp)}
                    style={{
                      background: 'linear-gradient(to bottom, #ef4444, #991b1b)',
                      color: '#fff',
                      border: '1px solid #fca5a5',
                      borderRadius: '6px',
                      padding: '8px 14px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}>
                    اغزُ الأسطول 💣
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Battle Screen Simulation */}
      {fighting && (
        <div style={{
          background: '#0d0a08',
          border: '2px solid #ca8a04',
          borderRadius: '12px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: '0 8px 30px rgba(0,0,0,0.9)'
        }}>
          <div style={{ color: '#facc15', fontSize: '16px', fontWeight: 'bold', marginBottom: '14px' }}>⚡ الجولة الحالية: {round}</div>

          {/* Combat Animation visualizer */}
          <div style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-around',
            alignItems: 'center',
            height: '130px',
            background: 'radial-gradient(circle, #291a0c 0%, #0d0a08 100%)',
            border: '1px solid #78350f',
            borderRadius: '8px',
            marginBottom: '16px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Player ship */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              transform: currentAttackEffect === 'player' ? 'translateX(25px) scale(1.15)' : 'none',
              transition: 'transform 0.2s ease-in-out'
            }}>
              <span style={{ fontSize: '50px', filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.6))' }}>{playerAvatar}</span>
              <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#60a5fa', marginTop: '4px' }}>{playerName} (أنت)</span>
              <div style={{ width: '80px', background: '#334155', height: '6px', borderRadius: '3px', marginTop: '4px', overflow: 'hidden' }}>
                <div style={{ background: '#3b82f6', height: '100%', width: `${Math.max(0, (myHp / (100 + playerLevel * 10)) * 100)}%` }}></div>
              </div>
              <span style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>❤️ {myHp} HP</span>
            </div>

            {/* Battle indicator icon */}
            <div style={{ fontSize: '32px', animation: 'pulse 1s infinite' }}>⚡</div>

            {/* Opponent/Monster */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              transform: currentAttackEffect === 'enemy' ? 'translateX(-25px) scale(1.15)' : 'none',
              transition: 'transform 0.2s ease-in-out'
            }}>
              <span style={{ fontSize: '50px', filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.6))' }}>{enemyAvatar}</span>
              <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#f87171', marginTop: '4px' }}>{enemyName}</span>
              <div style={{ width: '80px', background: '#334155', height: '6px', borderRadius: '3px', marginTop: '4px', overflow: 'hidden' }}>
                <div style={{ background: '#ef4444', height: '100%', width: `${Math.max(0, (enemyHp / enemyMaxHp) * 100)}%` }}></div>
              </div>
              <span style={{ fontSize: '10px', color: '#f87171', marginTop: '2px' }}>❤️ {enemyHp} HP</span>
            </div>
          </div>

          {/* Logs Terminal */}
          <div style={{
            width: '100%',
            height: '140px',
            background: '#15100c',
            border: '1px solid #78350f',
            borderRadius: '6px',
            padding: '10px',
            fontSize: '12px',
            fontFamily: 'monospace',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}>
            {battleLogs.map((log, idx) => (
              <div key={idx} style={{
                color: log.includes('🏆') || log.includes('🎯') ? '#facc15' : log.includes('💥') || log.includes('💀') ? '#ef4444' : '#fff',
                borderBottom: '1px solid #292524',
                paddingBottom: '4px'
              }}>
                {log}
              </div>
            ))}
          </div>

          {/* Interactive Battle Weapons & Repairs Panel */}
          <div style={{
            width: '100%',
            marginTop: '14px',
            background: '#1d130a',
            border: '1px solid #ca8a04',
            borderRadius: '8px',
            padding: '12px',
            direction: 'rtl'
          }}>
            <div style={{
              fontSize: '13px',
              color: '#facc15',
              fontWeight: 'bold',
              borderBottom: '1px solid #451a03',
              paddingBottom: '6px',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              ⚔️ ترسانة المعركة السريعة (استخدم سلاحاً أو أداة إصلاح فورية!)
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {/* Weapons Column */}
              <div>
                <div style={{ fontSize: '11px', color: '#a8a29e', marginBottom: '6px', fontWeight: 'bold' }}>🚀 هجوم بالصواريخ والقنابل:</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {[
                    { key: 'smallRocket', title: 'صاروخ صغير (٢٥ ضرر)', dmg: 25, emoji: '🚀' },
                    { key: 'mediumRocket', title: 'صاروخ متوسط (٦٠ ضرر)', dmg: 60, emoji: '🚀' },
                    { key: 'largeRocket', title: 'صاروخ كبير (١٥٠ ضرر)', dmg: 150, emoji: '🚀' },
                    { key: 'atomicBomb', title: 'قنبلة نووية (٥٠٠ ضرر)', dmg: 500, emoji: '💣' }
                  ].map(w => {
                    const count = weapons ? (weapons[w.key] || 0) : 0;
                    const hasItems = count > 0;
                    return (
                      <button
                        key={w.key}
                        disabled={!hasItems}
                        onClick={() => handleUseWeapon(w.key, w.dmg, w.title)}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          width: '100%',
                          background: hasItems ? 'linear-gradient(to bottom, #991b1b, #7f1d1d)' : '#292524',
                          border: hasItems ? '1px solid #ef4444' : '1px solid #44403c',
                          color: hasItems ? '#fff' : '#78716c',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          cursor: hasItems ? 'pointer' : 'not-allowed',
                          transition: 'transform 0.1s ease',
                          opacity: hasItems ? 1 : 0.5
                        }}
                      >
                        <span>{w.emoji} {w.title}</span>
                        <span style={{
                          background: hasItems ? '#fca5a5' : '#44403c',
                          color: hasItems ? '#7f1d1d' : '#a8a29e',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '10px'
                        }}>{count}x</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Repairs Column */}
              <div>
                <div style={{ fontSize: '11px', color: '#a8a29e', marginBottom: '6px', fontWeight: 'bold' }}>🔧 إصلاحات وصيانة فورية:</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {[
                    { key: 'smallRepair', title: 'مصلح صغير (+١٥ صحة)', heal: 15, emoji: '🔧' },
                    { key: 'mediumRepair', title: 'مصلح متوسط (+٤٥ صحة)', heal: 45, emoji: '🔧' },
                    { key: 'largeRepair', title: 'مصلح كبير (+١٠٠ صحة)', heal: 100, emoji: '🔧' },
                    { key: 'legendaryRepair', title: 'مصلح أسطوري (+٣٠٠ صحة)', heal: 300, emoji: '🏆' }
                  ].map(r => {
                    const count = weapons ? (weapons[r.key] || 0) : 0;
                    const hasItems = count > 0;
                    return (
                      <button
                        key={r.key}
                        disabled={!hasItems}
                        onClick={() => handleUseRepair(r.key, r.heal, r.title)}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          width: '100%',
                          background: hasItems ? 'linear-gradient(to bottom, #16a34a, #15803d)' : '#292524',
                          border: hasItems ? '1px solid #4ade80' : '1px solid #44403c',
                          color: hasItems ? '#fff' : '#78716c',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          cursor: hasItems ? 'pointer' : 'not-allowed',
                          transition: 'transform 0.1s ease',
                          opacity: hasItems ? 1 : 0.5
                        }}
                      >
                        <span>{r.emoji} {r.title}</span>
                        <span style={{
                          background: hasItems ? '#bbf7d0' : '#44403c',
                          color: hasItems ? '#14532d' : '#a8a29e',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '10px'
                        }}>{count}x</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '14px', fontSize: '12px', color: '#ca8a04', fontWeight: 'bold', animation: 'pulse 1.5s infinite' }}>
            ⏳ المدافع تشتعل والاشتباك مستمر...
          </div>
        </div>
      )}

      {/* Battle Outcome Result Screen */}
      {battleResult && (
        <div style={{
          background: '#0d0a08',
          border: '3px solid #ca8a04',
          borderRadius: '12px',
          padding: '24px',
          textAlign: 'center',
          boxShadow: '0 8px 35px rgba(0,0,0,0.95)'
        }}>
          {battleResult === 'win' ? (
            <>
              <div style={{ fontSize: '60px', marginBottom: '8px' }}>🏆</div>
              <h2 style={{ color: '#facc15', margin: '0 0 10px 0' }}>انتصار ساحق!</h2>
              <p style={{ fontSize: '13px', color: '#d6d3d1', marginBottom: '16px' }}>
                لقد تغلّبت على <strong style={{ color: '#fff' }}>{enemyName}</strong> ودمرت أسطول دفاعه بنجاح!
              </p>
            </>
          ) : (
            <>
              <div style={{ fontSize: '60px', marginBottom: '8px' }}>💀</div>
              <h2 style={{ color: '#ef4444', margin: '0 0 10px 0' }}>هزيمة نكراء!</h2>
              <p style={{ fontSize: '13px', color: '#d6d3d1', marginBottom: '16px' }}>
                تفوّق عليك <strong style={{ color: '#fff' }}>{enemyName}</strong> بقوته النارية الهائلة وتراجعت سفنك مكسورة الأشرعة.
              </p>
            </>
          )}

          <button
            onClick={() => setBattleResult(null)}
            style={{
              background: 'linear-gradient(to bottom, #ca8a04, #854d0e)',
              color: '#fff',
              border: '1px solid #fef08a',
              borderRadius: '6px',
              padding: '10px 24px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}>
            العودة للميناء ⚓
          </button>
        </div>
      )}
    </div>
  );
}
