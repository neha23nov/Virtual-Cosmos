const SCALE = 0.12;

const MiniMap = ({ users, myId, myPos }) => {
  const W = window.innerWidth  * SCALE;
  const H = window.innerHeight * SCALE;

  return (
    <div style={{
      position: 'absolute', bottom: 24, left: 24,
      width: W, height: H,
      background: 'rgba(13,15,20,0.85)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 12, overflow: 'hidden',
      backdropFilter: 'blur(8px)',
      boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
    }} className="z-10">
      {/* Label */}
      <div style={{ position: 'absolute', top: 5, left: 7,
        fontSize: 8, color: '#6b7280', fontFamily: 'Syne', fontWeight: 700, letterSpacing: 1 }}>
        MAP
      </div>

      {/* Grid dots */}
      {Array.from({ length: 4 }).map((_, i) => (
        Array.from({ length: 4 }).map((_, j) => (
          <div key={`${i}-${j}`} style={{
            position: 'absolute',
            left: (W / 4) * i + W / 8,
            top:  (H / 4) * j + H / 8,
            width: 1, height: 1,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
          }} />
        ))
      ))}

      {/* Players */}
      {Object.values(users).map((u) => {
        const isSelf = u.id === myId;
        const px = (isSelf ? myPos.x : u.x) * SCALE;
        const py = (isSelf ? myPos.y : u.y) * SCALE;
        return (
          <div key={u.id} style={{
            position: 'absolute',
            left: px - 3, top: py - 3,
            width: isSelf ? 8 : 6,
            height: isSelf ? 8 : 6,
            borderRadius: '50%',
            background: isSelf ? '#5b8dee' : '#e85d8a',
            boxShadow: isSelf ? '0 0 6px #5b8dee' : '0 0 4px #e85d8a',
            transition: 'left 0.1s, top 0.1s',
          }} />
        );
      })}
    </div>
  );
};

export default MiniMap;