import React, { useState } from 'react';

interface LoginScreenProps {
  onLoginSuccess: (username: string, avatar: string, server: string, pClass: string) => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [server, setServer] = useState('سيرفر الأسطورة 1');
  const [avatar, setAvatar] = useState('☠️');
  const [pirateClass, setPirateClass] = useState('صياد البحار');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      alert('يرجى إدخال اسم الكابتن!');
      return;
    }
    if (!password.trim()) {
      alert('يرجى إدخال كلمة المرور!');
      return;
    }

    // Call success handler
    onLoginSuccess(username, avatar, server, pirateClass);
  };

  return (
    <div className="login-container" dir="rtl" style={{
      width: '100vw',
      height: '100vh',
      background: 'radial-gradient(circle, #2a1f14 0%, #0d0a07 100%)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflowY: 'auto',
      padding: '20px',
      position: 'relative'
    }}>
      {/* Decorative ocean grid background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `url('https://raw.githubusercontent.com/alwjyhnyazsrhan-blip/my-game-assets/refs/heads/main/IMG_20260704_201124.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center bottom',
        opacity: 0.5,
        pointerEvents: 'none',
        zIndex: 1
      }}></div>

      <div style={{
        width: '100%',
        maxWidth: '450px',
        background: 'rgba(23, 17, 11, 0.8)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '3px solid #ca8a04',
        borderRadius: '16px',
        padding: '30px 24px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.85), inset 0 0 15px rgba(202,138,4,0.2)',
        color: '#fff',
        zIndex: 5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        {/* Game Title Logo */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '36px', filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.7))', marginBottom: '4px' }}>🏴‍☠️</div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#facc15',
            textShadow: '2px 2px 4px #000, 0 0 20px rgba(234,179,8,0.4)',
            letterSpacing: '1px',
            margin: 0
          }}>ملوك القرصنة</h1>
          <p style={{ fontSize: '12px', color: '#a16207', fontWeight: 'bold', margin: '4px 0 0 0' }}>لعبة استراتيجية قتالية مجانية في البحار العربية</p>
        </div>

        {/* Server Selection Panel */}
        <div style={{
          width: '100%',
          background: '#1e1610',
          border: '1px solid #78350f',
          borderRadius: '8px',
          padding: '10px 14px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <span style={{ fontSize: '13px', color: '#fef08a', fontWeight: 'bold' }}>🌐 اختر السيرفر:</span>
          <select 
            value={server}
            onChange={(e) => setServer(e.target.value)}
            style={{
              background: '#0d0a07',
              border: '1px solid #ca8a04',
              borderRadius: '4px',
              color: '#fff',
              padding: '4px 10px',
              fontSize: '13px',
              outline: 'none',
              cursor: 'pointer'
            }}>
            <option value="سيرفر الأسطورة 1">🔥 سيرفر الأسطورة 1 (ممتلئ)</option>
            <option value="سيرفر الكاريبي 2">⚔️ سيرفر الكاريبي 2 (نشط)</option>
            <option value="سيرفر ملوك الأعماق 3">🌊 سيرفر ملوك الأعماق 3 (جديد)</option>
          </select>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#fef08a', marginBottom: '6px', fontWeight: 'bold' }}>اسم كابتن الأسطول:</label>
            <input 
              type="text"
              required
              placeholder="مثال: سياف_البحار"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                background: '#15100c',
                border: '1px solid #78350f',
                borderRadius: '6px',
                padding: '10px 12px',
                color: '#fff',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = '#ca8a04'}
              onBlur={(e) => e.target.style.borderColor = '#78350f'}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#fef08a', marginBottom: '6px', fontWeight: 'bold' }}>كلمة المرور السرية:</label>
            <input 
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                background: '#15100c',
                border: '1px solid #78350f',
                borderRadius: '6px',
                padding: '10px 12px',
                color: '#fff',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = '#ca8a04'}
              onBlur={(e) => e.target.style.borderColor = '#78350f'}
            />
          </div>

          {/* Registration extra options */}
          {isRegister && (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#fef08a', marginBottom: '6px', fontWeight: 'bold' }}>رمز علم السفينة / الأفاتار:</label>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-between' }}>
                  {['☠️', '🧔', '🥷', '🏴‍☠️', '🦜'].map(av => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => setAvatar(av)}
                      style={{
                        flex: 1,
                        fontSize: '22px',
                        padding: '6px',
                        background: avatar === av ? 'rgba(202,138,4,0.3)' : '#1a120b',
                        border: avatar === av ? '2px solid #facc15' : '1px solid #78350f',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}>
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#fef08a', marginBottom: '6px', fontWeight: 'bold' }}>تخصص قبطانك الأساسي:</label>
                <select
                  value={pirateClass}
                  onChange={(e) => setPirateClass(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#15100c',
                    border: '1px solid #78350f',
                    borderRadius: '6px',
                    padding: '10px 12px',
                    color: '#fff',
                    fontSize: '14px',
                    outline: 'none',
                    cursor: 'pointer'
                  }}>
                  <option value="صياد البحار">🎣 صياد البحار (+5% مكافآت صيد الأسماك)</option>
                  <option value="مقاتل الأساطيل">💣 مقاتل الأساطيل (+10% هجوم مدفعي في الحروب)</option>
                  <option value="مستكشف الجزر">🧭 مستكشف الجزر (-15% وقت عودة السفن)</option>
                </select>
              </div>
            </>
          )}

          {/* Action buttons */}
          <button
            type="submit"
            style={{
              width: '100%',
              background: 'linear-gradient(to bottom, #ca8a04, #854d0e)',
              border: '2px solid #fef08a',
              borderRadius: '6px',
              padding: '12px',
              color: '#fff',
              fontSize: '15px',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginTop: '10px',
              textShadow: '1px 1px 2px #000',
              boxShadow: '0 4px 10px rgba(0,0,0,0.4)',
              transition: 'transform 0.1s, opacity 0.2s'
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {isRegister ? 'أنشئ الأسطول وابدأ المغامرة ⚔️' : 'تسجيل دخول الكابتن ⚓'}
          </button>
        </form>

        {/* Toggle Mode */}
        <div style={{ marginTop: '24px', fontSize: '13px', color: '#d6d3d1' }}>
          {isRegister ? (
            <span>لديك حساب قبطان بالفعل؟ <span onClick={() => setIsRegister(false)} style={{ color: '#facc15', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }}>سجل دخولك هنا</span></span>
          ) : (
            <span>لا تملك حساب كابتن؟ <span onClick={() => setIsRegister(true)} style={{ color: '#facc15', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }}>سجل حساباً مجانياً الآن</span></span>
          )}
        </div>

        {/* Real-time server status counters */}
        <div style={{
          marginTop: '24px',
          width: '100%',
          borderTop: '1px solid #3f220f',
          paddingTop: '16px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
          fontSize: '11px',
          color: '#a8a29e',
          textAlign: 'center'
        }}>
          <div>
            <div style={{ fontWeight: 'bold', color: '#fef08a', fontSize: '13px' }}>14,582</div>
            <div>قبطان مسجل</div>
          </div>
          <div>
            <div style={{ fontWeight: 'bold', color: '#16a34a', fontSize: '13px' }}>● 542 متصل</div>
            <div>الحالة الآن</div>
          </div>
        </div>
      </div>
    </div>
  );
}
