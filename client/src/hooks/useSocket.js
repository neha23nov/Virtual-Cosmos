import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const SERVER_URL = 'http://localhost:3001';

const useSocket = (username, avatar) => {
  const socketRef = useRef(null);
  const [myId,     setMyId]     = useState(null);
  const [users,    setUsers]    = useState({});
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!username) return;
    const socket = io(SERVER_URL);
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('join', { username, avatar });
    });
    socket.on('init',       (me)          => { setMyId(me.id); setUsers((p) => ({ ...p, [me.id]: me })); });
    socket.on('all-users',  (all)         => setUsers(all));
    socket.on('user-joined',(user)        => setUsers((p) => ({ ...p, [user.id]: user })));
    socket.on('user-moved', ({ id, x, y })=> setUsers((p) => p[id] ? { ...p, [id]: { ...p[id], x, y } } : p));
    socket.on('user-left',  (id)          => setUsers((p) => { const u = { ...p }; delete u[id]; return u; }));
    socket.on('receive-message', (msg)    => setMessages((p) => [...p, msg]));

    return () => socket.disconnect();
  }, [username]);

  const emitMove    = (x, y)         => socketRef.current?.emit('move',         { x, y });
  const emitMessage = (toId, message) => socketRef.current?.emit('chat-message', { toId, message });
  const clearMessages = ()            => setMessages([]);

  return { myId, users, emitMove, emitMessage, messages, clearMessages };
};

export default useSocket;