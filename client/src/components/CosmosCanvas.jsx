import { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';
import useKeyboard from '../hooks/useKeyboard';
import { getDistance } from '../utils/proximity';
import { PLAYER_RADIUS, PROXIMITY_RADIUS, MOVE_SPEED, COLORS } from '../utils/constants';

const CosmosCanvas = ({ myId, users, onMove, onProximityChange, reactions }) => {
  const canvasRef       = useRef(null);
  const appRef          = useRef(null);
  const keys            = useKeyboard();
  const myPosRef        = useRef({ x: 500, y: 350 });
  const usersRef        = useRef(users);
  const reactionsRef    = useRef(reactions || []);
  const initializedRef  = useRef(false);
  const nearbyRef       = useRef([]);

  useEffect(() => { usersRef.current = users; },     [users]);
  useEffect(() => { reactionsRef.current = reactions || []; }, [reactions]);

  useEffect(() => {
    if (myId && users[myId]) {
      myPosRef.current = { x: users[myId].x, y: users[myId].y };
    }
  }, [myId]);

  useEffect(() => {
    if (initializedRef.current) return;
    if (!canvasRef.current) return;
    initializedRef.current = true;

    let app;
    let destroyed = false;

    const init = async () => {
      app = new PIXI.Application();
      await app.init({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: COLORS.background,
        antialias: true,
      });

      if (destroyed || !canvasRef.current) { app.destroy(true); return; }

      appRef.current = app;
      canvasRef.current.appendChild(app.canvas);

      const onResize = () => app.renderer.resize(window.innerWidth, window.innerHeight);
      window.addEventListener('resize', onResize);
      app._onResize = onResize;

      // ---- Floor tiles ----
      const floor = new PIXI.Graphics();
      const tileSize = 64;
      for (let x = 0; x < window.innerWidth + tileSize; x += tileSize) {
        for (let y = 0; y < window.innerHeight + tileSize; y += tileSize) {
          const shade = ((x / tileSize + y / tileSize) % 2 === 0) ? 0x13161e : 0x111420;
          floor.rect(x, y, tileSize, tileSize);
          floor.fill({ color: shade });
        }
      }
      // Grid lines
      for (let x = 0; x < window.innerWidth; x += tileSize) {
        floor.moveTo(x, 0); floor.lineTo(x, window.innerHeight);
      }
      for (let y = 0; y < window.innerHeight; y += tileSize) {
        floor.moveTo(0, y); floor.lineTo(window.innerWidth, y);
      }
      floor.stroke({ color: 0x1e2230, alpha: 0.8, width: 1 });
      app.stage.addChild(floor);

      // Game loop
      app.ticker.add(() => {
        let { x, y } = myPosRef.current;
        let moved = false;
        const W = window.innerWidth, H = window.innerHeight;

        if (keys.current['ArrowUp']    || keys.current['w'] || keys.current['W']) { y = Math.max(PLAYER_RADIUS, y - MOVE_SPEED); moved = true; }
        if (keys.current['ArrowDown']  || keys.current['s'] || keys.current['S']) { y = Math.min(H - PLAYER_RADIUS, y + MOVE_SPEED); moved = true; }
        if (keys.current['ArrowLeft']  || keys.current['a'] || keys.current['A']) { x = Math.max(PLAYER_RADIUS, x - MOVE_SPEED); moved = true; }
        if (keys.current['ArrowRight'] || keys.current['d'] || keys.current['D']) { x = Math.min(W - PLAYER_RADIUS, x + MOVE_SPEED); moved = true; }

        if (moved) { myPosRef.current = { x, y }; onMove(x, y); }

        checkProximity();
        drawPlayers();
      });
    };

    const checkProximity = () => {
      if (!myId) return;
      const myPos = myPosRef.current;
      const currentNearby = [];
      Object.values(usersRef.current).forEach((u) => {
        if (u.id === myId) return;
        if (getDistance(myPos, u) < PROXIMITY_RADIUS * 2) currentNearby.push(u.id);
      });
      const prev = [...nearbyRef.current].sort().join(',');
      const curr = [...currentNearby].sort().join(',');
      if (prev !== curr) {
        nearbyRef.current = currentNearby;
        if (onProximityChange) onProximityChange(currentNearby);
      }
    };

    const drawPlayers = () => {
      if (!appRef.current) return;
      const stage = appRef.current.stage;
      while (stage.children.length > 1) stage.removeChildAt(1);

      const myPos = myPosRef.current;

      // Connection lines
      Object.values(usersRef.current).forEach((u) => {
        if (u.id === myId) return;
        const dist = getDistance(myPos, u);
        if (dist < PROXIMITY_RADIUS * 2) {
          const alpha = (1 - dist / (PROXIMITY_RADIUS * 2)) * 0.5;
          const line = new PIXI.Graphics();
          line.moveTo(myPos.x, myPos.y);
          line.lineTo(u.x, u.y);
          line.stroke({ color: COLORS.connectionLine, alpha, width: 1.5 });
          stage.addChild(line);
        }
      });

      // Players
      Object.values(usersRef.current).forEach((user) => {
        const isSelf   = user.id === myId;
        const pos      = isSelf ? myPos : { x: user.x, y: user.y };
        const isNearby = !isSelf && getDistance(myPos, user) < PROXIMITY_RADIUS * 2;
        const color    = isSelf ? COLORS.self : isNearby ? COLORS.nearby : COLORS.other;

        // Shadow
        const shadow = new PIXI.Graphics();
        shadow.ellipse(pos.x, pos.y + PLAYER_RADIUS - 4, PLAYER_RADIUS * 0.9, 7);
        shadow.fill({ color: 0x000000, alpha: 0.3 });
        stage.addChild(shadow);

        // Proximity ring (self only)
        if (isSelf) {
          const ring = new PIXI.Graphics();
          ring.circle(pos.x, pos.y, PROXIMITY_RADIUS * 2);
          ring.stroke({ color: COLORS.proximityRing, alpha: 0.08, width: 1 });
          stage.addChild(ring);
        }

        // Outer glow
        const glow = new PIXI.Graphics();
        glow.circle(pos.x, pos.y, PLAYER_RADIUS + (isNearby ? 14 : 7));
        glow.fill({ color, alpha: isNearby ? 0.25 : 0.1 });
        stage.addChild(glow);

        // Body circle
        const body = new PIXI.Graphics();
        body.circle(pos.x, pos.y, PLAYER_RADIUS);
        body.fill({ color, alpha: 1 });
        stage.addChild(body);

        // Inner shine
        const shine = new PIXI.Graphics();
        shine.circle(pos.x - 5, pos.y - 5, PLAYER_RADIUS * 0.38);
        shine.fill({ color: 0xffffff, alpha: 0.18 });
        stage.addChild(shine);

        // Pulse ring when nearby
        if (isNearby) {
          const pulse = new PIXI.Graphics();
          pulse.circle(pos.x, pos.y, PLAYER_RADIUS + 8);
          pulse.stroke({ color: COLORS.nearby, alpha: 0.5, width: 2 });
          stage.addChild(pulse);
        }

        // Avatar emoji
        const avatar = new PIXI.Text({
          text: user.avatar || '🧑‍💻',
          style: { fontSize: 18 },
        });
        avatar.anchor.set(0.5, 0.5);
        avatar.x = pos.x;
        avatar.y = pos.y;
        stage.addChild(avatar);

        // Name tag background
        const nameText = user.username || 'User';
        const tag = new PIXI.Text({
          text: nameText,
          style: {
            fontSize: 11,
            fill: isSelf ? '#5b8dee' : isNearby ? '#f5c542' : '#e8eaf0',
            fontFamily: 'DM Sans',
            fontWeight: '600',
          },
        });
        tag.anchor.set(0.5, 0);
        tag.x = pos.x;
        tag.y = pos.y + PLAYER_RADIUS + 7;
        stage.addChild(tag);

        // Online dot
        const dot = new PIXI.Graphics();
        dot.circle(pos.x + PLAYER_RADIUS - 4, pos.y - PLAYER_RADIUS + 4, 5);
        dot.fill({ color: 0x3ecf8e, alpha: 1 });
        stage.addChild(dot);
      });

      // Floating emoji reactions
      reactionsRef.current.forEach((r) => {
        const emoji = new PIXI.Text({
          text: r.emoji,
          style: { fontSize: 24 },
        });
        emoji.anchor.set(0.5, 0.5);
        emoji.x = r.x;
        emoji.y = r.y;
        emoji.alpha = r.alpha ?? 1;
        stage.addChild(emoji);
      });
    };

    init();

    return () => {
      destroyed = true;
      initializedRef.current = false;
      if (appRef.current) {
        if (appRef.current._onResize) window.removeEventListener('resize', appRef.current._onResize);
        appRef.current.ticker.stop();
        appRef.current.destroy(true);
        appRef.current = null;
      }
    };
  }, [myId]);

  return (
    <div ref={canvasRef} className="absolute inset-0" style={{ cursor: 'crosshair' }} />
  );
};

export default CosmosCanvas;