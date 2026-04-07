import { useEffect, useState } from 'react';

const Toast = ({ message, avatar, type = 'join', onDone }) => {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setExiting(true), 2800);
    const t2 = setTimeout(() => onDone?.(), 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const color = type === 'join' ? '#3ecf8e' : '#e85d8a';
  const icon  = type === 'join' ? '→' : '←';

  return (
    <div className={exiting ? 'toast-exit' : 'toast-enter'}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        background: 'rgba(13,15,20,0.92)',
        border: `1px solid ${color}40`,
        borderRadius: 14, padding: '10px 16px',
        backdropFilter: 'blur(12px)',
        boxShadow: `0 8px 24px rgba(0,0,0,0.4), 0 0 0 1px ${color}20`,
        minWidth: 220,
      }}>
      <span style={{ fontSize: 20 }}>{avatar || '🧑'}</span>
      <div>
        <p style={{ fontSize: 12, color: '#6b7280', fontFamily: 'DM Sans' }}>
          {icon} {type === 'join' ? 'joined' : 'left'}
        </p>
        <p style={{ fontSize: 13, color: '#e8eaf0', fontFamily: 'Syne', fontWeight: 600 }}>
          {message}
        </p>
      </div>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, marginLeft: 'auto' }} />
    </div>
  );
};

export default Toast;