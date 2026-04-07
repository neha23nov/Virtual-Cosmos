import { useState, useCallback, useEffect, useRef } from 'react';
import CosmosCanvas from './components/CosmosCanvas';
import ChatPanel    from './components/ChatPanel';
import Toast        from './components/Toast';
import MiniMap      from './components/MiniMap';
import useSocket    from './hooks/useSocket';
import { AVATARS, EMOJI_REACTIONS } from './utils/constants';
import './index.css';

function App() {
  const [username,       setUsername]       = useState('');
  const [avatar,         setAvatar]         = useState('🧑‍💻');
  const [joined,         setJoined]         = useState(false);
  const [activeUsername, setActiveUsername] = useState('');
  const [nearbyUsers,    setNearbyUsers]    = useState([]);
  const [toasts,         setToasts]         = useState([]);
  const [reactions,      setReactions]      = useState([]);
  const [myPos,          setMyPos]          = useState({ x: 500, y: 350 });

  const { myId, users, emitMove, emitMessage, messages, clearMessages } =
    useSocket(joined ? activeUsername : null, avatar);

  // Track previous users for join/leave toasts
  const prevUsersRef = useRef({});
  useEffect(() => {
    const prev = prevUsersRef.current;
    const curr = users;

    Object.values(curr).forEach((u) => {
      if (!prev[u.id] && u.id !== myId) {
        addToast(u.username, u.avatar, 'join');
      }
    });
    Object.values(prev).forEach((u) => {
      if (!curr[u.id] && u.id !== myId) {
        addToast(u.username, u.avatar, 'leave');
      }
    });
    prevUsersRef.current = curr;
  }, [users]);

  const addToast = (name, emojiAvatar, type) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, name, avatar: emojiAvatar, type }]);
  };

  const handleJoin = () => {
    if (!username.trim()) return;
    setActiveUsername(username.trim());
    setJoined(true);
  };

  const handleProximityChange = useCallback((nearbyIds) => {
    setNearbyUsers(nearbyIds);
    if (nearbyIds.length === 0) clearMessages();
  }, [clearMessages]);

  const handleMove = useCallback((x, y) => {
    emitMove(x, y);
    setMyPos({ x, y });
  }, [emitMove]);

  // Emoji reaction keyboard shortcuts (keys 1–5)
  useEffect(() => {
    if (!joined || !myId) return;
    const handler = (e) => {
      const idx = parseInt(e.key) - 1;
      if (idx >= 0 && idx < EMOJI_REACTIONS.length) {
        const emoji = EMOJI_REACTIONS[idx];
        const pos   = myPos;
        const id    = Date.now();
        setReactions((prev) => [...prev, { id, emoji, x: pos.x, y: pos.y - 30, alpha: 1 }]);
        setTimeout(() => setReactions((prev) => prev.filter((r) => r.id !== id)), 1500);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [joined, myId, myPos]);

  if (!joined) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', background: 'radial-gradient(ellipse at 50% 40%, #13161e 0%, #0d0f14 70%)',
      }}>
        {/* Ambient orbs */}
        <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(91,141,238,0.08) 0%, transparent 70%)',
          top: '20%', left: '30%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(232,93,138,0.08) 0%, transparent 70%)',
          bottom: '25%', right: '25%', pointerEvents: 'none' }} />

        <div style={{
          background: 'rgba(19,22,30,0.9)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 24, padding: '40px 36px', width: 380,
          backdropFilter: 'blur(20px)',
          boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
        }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>🌌</div>
            <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 28,
              color: '#e8eaf0', letterSpacing: '-0.5px' }}>
              Virtual Cosmos
            </h1>
            <p style={{ color: '#6b7280', fontSize: 13, fontFamily: 'DM Sans', marginTop: 6 }}>
              Move close to others to connect
            </p>
          </div>

          {/* Avatar picker */}
          <div style={{ marginBottom: 20 }}>
            <p style={{ color: '#6b7280', fontSize: 11, fontFamily: 'Syne',
              fontWeight: 600, letterSpacing: 1, marginBottom: 10, textTransform: 'uppercase' }}>
              Pick your avatar
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {AVATARS.map((a) => (
                <button key={a} onClick={() => setAvatar(a)}
                  style={{
                    fontSize: 22, background: avatar === a ? 'rgba(91,141,238,0.2)' : 'rgba(26,30,42,0.6)',
                    border: `1px solid ${avatar === a ? 'rgba(91,141,238,0.5)' : 'rgba(255,255,255,0.06)'}`,
                    borderRadius: 10, padding: '6px 8px', cursor: 'pointer',
                    transform: avatar === a ? 'scale(1.15)' : 'scale(1)',
                    transition: 'all 0.2s',
                  }}>
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Name input */}
          <input
            style={{
              width: '100%', background: 'rgba(26,30,42,0.8)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12, padding: '12px 16px', color: '#e8eaf0',
              fontSize: 14, fontFamily: 'DM Sans', outline: 'none',
              marginBottom: 14, display: 'block',
            }}
            placeholder="Enter your name..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
            onFocus={(e)  => e.target.style.borderColor = 'rgba(91,141,238,0.5)'}
            onBlur={(e)   => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
          />

          <button onClick={handleJoin}
            style={{
              width: '100%', padding: '13px',
              background: 'linear-gradient(135deg, #5b8dee, #3a6fd8)',
              border: 'none', borderRadius: 12, color: '#fff',
              fontSize: 14, fontFamily: 'Syne', fontWeight: 700,
              cursor: 'pointer', letterSpacing: 0.5,
              boxShadow: '0 8px 24px rgba(91,141,238,0.35)',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseOver={(e) => { e.target.style.transform = 'translateY(-1px)'; e.target.style.boxShadow = '0 12px 28px rgba(91,141,238,0.45)'; }}
            onMouseOut={(e)  => { e.target.style.transform = 'translateY(0)';    e.target.style.boxShadow = '0 8px 24px rgba(91,141,238,0.35)'; }}
          >
            Enter Cosmos →
          </button>

          <p style={{ textAlign: 'center', color: '#3a3f52', fontSize: 11,
            fontFamily: 'DM Sans', marginTop: 16 }}>
            Press 1–5 to send reactions · WASD to move
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <CosmosCanvas
        myId={myId}
        users={users}
        onMove={handleMove}
        onProximityChange={handleProximityChange}
        reactions={reactions}
      />

      {/* Top bar */}
      <div style={{
        position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', alignItems: 'center', gap: 12,
        background: 'rgba(13,15,20,0.85)', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 100, padding: '8px 20px', backdropFilter: 'blur(12px)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
      }} className="z-10">
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3ecf8e',
          boxShadow: '0 0 8px #3ecf8e' }} />
        <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 13, color: '#e8eaf0' }}>
          {avatar} {activeUsername}
        </span>
        <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.1)' }} />
        <span style={{ fontSize: 12, color: '#6b7280', fontFamily: 'DM Sans' }}>
          👥 {Object.keys(users).length} online
        </span>
        {nearbyUsers.length > 0 && (
          <>
            <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.1)' }} />
            <span style={{ fontSize: 12, color: '#f5c542', fontFamily: 'DM Sans', fontWeight: 500 }}>
              ⚡ {nearbyUsers.length} nearby
            </span>
          </>
        )}
      </div>

      {/* Reaction bar */}
      <div style={{
        position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: 8,
        background: 'rgba(13,15,20,0.85)', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 100, padding: '8px 16px', backdropFilter: 'blur(12px)',
      }} className="z-10">
        {EMOJI_REACTIONS.map((e, i) => (
          <button key={e}
            title={`Press ${i + 1}`}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 20, padding: '2px 4px', borderRadius: 8,
              transition: 'transform 0.15s',
            }}
            onMouseOver={(ev) => ev.target.style.transform = 'scale(1.3)'}
            onMouseOut={(ev)  => ev.target.style.transform = 'scale(1)'}
            onClick={() => {
              const id = Date.now();
              setReactions((prev) => [...prev, { id, emoji: e, x: myPos.x, y: myPos.y - 30, alpha: 1 }]);
              setTimeout(() => setReactions((prev) => prev.filter((r) => r.id !== id)), 1500);
            }}
          >
            {e}
          </button>
        ))}
        <div style={{ width: 1, background: 'rgba(255,255,255,0.08)', margin: '0 4px' }} />
        <span style={{ fontSize: 11, color: '#3a3f52', fontFamily: 'DM Sans',
          alignSelf: 'center', whiteSpace: 'nowrap' }}>
          WASD · move
        </span>
      </div>

      {/* Toasts */}
      <div style={{
        position: 'absolute', top: 70, right: 20,
        display: 'flex', flexDirection: 'column', gap: 8,
      }} className="z-20">
        {toasts.map((t) => (
          <Toast key={t.id} message={t.name} avatar={t.avatar} type={t.type}
            onDone={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))} />
        ))}
      </div>

      {/* Mini map */}
      <MiniMap users={users} myId={myId} myPos={myPos} />

      {/* Chat */}
      <ChatPanel
        isOpen={nearbyUsers.length > 0}
        nearbyUsers={nearbyUsers}
        users={users}
        myId={myId}
        onSendMessage={emitMessage}
        messages={messages}
      />
    </div>
  );
}

export default App;