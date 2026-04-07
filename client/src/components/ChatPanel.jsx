import { useState, useEffect, useRef } from 'react';

const ChatPanel = ({ isOpen, nearbyUsers, users, myId, onSendMessage, messages }) => {
  const [input, setInput]     = useState('');
  const [visible, setVisible] = useState(false);
  const bottomRef             = useRef(null);

  useEffect(() => {
    if (isOpen) setVisible(true);
    else {
      const t = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    nearbyUsers.forEach((id) => onSendMessage(id, input.trim()));
    setInput('');
  };

  if (!visible) return null;

  return (
    <div
      className={`absolute bottom-6 right-6 z-20 flex flex-col rounded-2xl overflow-hidden
        ${isOpen ? 'fade-in' : 'toast-exit'}`}
      style={{
        width: '320px',
        height: '440px',
        background: 'rgba(13,15,20,0.92)',
        border: '1px solid rgba(245,197,66,0.35)',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 0 40px rgba(245,197,66,0.08), 0 20px 60px rgba(0,0,0,0.5)',
      }}
    >
      {/* Header */}
      <div style={{ background: 'rgba(245,197,66,0.07)', borderBottom: '1px solid rgba(245,197,66,0.15)' }}
        className="px-4 py-3 flex items-center gap-3">
        <div className="relative">
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f5c542' }} />
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f5c542', position: 'absolute', top: 0, left: 0, animation: 'ping 1.2s ease infinite' }} />
        </div>
        <span style={{ fontFamily: 'Syne', fontWeight: 700, color: '#f5c542', fontSize: 13 }}>
          PROXIMITY CHAT
        </span>
        <div className="ml-auto flex gap-1 flex-wrap">
          {nearbyUsers.map((id) => (
            <span key={id}
              style={{ fontSize: 10, background: 'rgba(232,93,138,0.15)', color: '#e85d8a', border: '1px solid rgba(232,93,138,0.25)', borderRadius: 20, padding: '2px 8px', fontFamily: 'DM Sans' }}>
              {users[id]?.avatar} {users[id]?.username}
            </span>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-2">
            <span style={{ fontSize: 32 }}>👋</span>
            <p style={{ color: '#6b7280', fontSize: 12, fontFamily: 'DM Sans' }}>
              You're connected — say hello!
            </p>
          </div>
        )}
        {messages.map((msg, i) => {
          const isMine = msg.fromId === myId;
          return (
            <div key={i} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
              <div className="flex items-center gap-1 mb-1">
                <span style={{ fontSize: 12 }}>
                  {users[msg.fromId]?.avatar || '🧑'}
                </span>
                <span style={{ fontSize: 10, color: '#6b7280', fontFamily: 'DM Sans' }}>
                  {isMine ? 'You' : msg.fromName}
                </span>
              </div>
              <div style={{
                padding: '8px 12px',
                borderRadius: isMine ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                background: isMine
                  ? 'linear-gradient(135deg,#5b8dee,#3a6fd8)'
                  : 'rgba(26,30,42,0.9)',
                border: isMine ? 'none' : '1px solid rgba(255,255,255,0.06)',
                color: '#e8eaf0',
                fontSize: 13,
                fontFamily: 'DM Sans',
                maxWidth: '82%',
                wordBreak: 'break-word',
                boxShadow: isMine ? '0 4px 12px rgba(91,141,238,0.3)' : 'none',
              }}>
                {msg.message}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '12px' }}
        className="flex gap-2">
        <input
          style={{
            flex: 1, background: 'rgba(26,30,42,0.8)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 12, padding: '8px 12px', color: '#e8eaf0', fontSize: 13,
            fontFamily: 'DM Sans', outline: 'none',
          }}
          placeholder="Message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          onFocus={(e) => e.target.style.borderColor = 'rgba(245,197,66,0.4)'}
          onBlur={(e)  => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
        />
        <button onClick={handleSend}
          style={{
            background: 'linear-gradient(135deg,#f5c542,#e0a800)',
            border: 'none', borderRadius: 12, padding: '8px 16px',
            color: '#0d0f14', fontWeight: 700, fontSize: 13,
            fontFamily: 'Syne', cursor: 'pointer',
          }}>
          ↑
        </button>
      </div>
    </div>
  );
};

export default ChatPanel;