# Virtual Cosmos

> A real-time 2D virtual space where proximity drives connection.  
> Move close to someone → chat opens. Move away → chat closes.

---

## 📸 Preview

![Virtual Cosmos Preview](https://i.imgur.com/placeholder.png)

> Two users in proximity — chat panel auto-connects, yellow glow activates, connection line appears.

---

##  Features

### Core Features
| Feature | Description |
|---|---|
| 🎮 2D Movement | Move your avatar using WASD or Arrow keys in real time |
| 👥 Real-Time Multiplayer | All connected users visible and synced live |
| 📡 Proximity Detection | Euclidean distance checked every frame at 60fps |
| 💬 Auto Chat | Chat panel opens when close, closes when far |

### Bonus Features
| Feature | Description |
|---|---|
| 🎭 Avatar Picker | Choose from 8 emoji avatars on the join screen |
| 🗺️ Mini-Map | Live bottom-left overview of all player positions |
| 🔔 Toast Notifications | Slide-in alerts when users join or leave |
| 😀 Emoji Reactions | Press keys 1–5 or click the reaction bar to react |
| ✨ Tile Floor Canvas | Checkerboard floor with shadows, glow and shine effects |
| 🟢 Online Dot | Green status indicator on every player |
| 🎨 Glassmorphism UI | Blurred, layered panels with custom animations |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18+ | Component-based UI and state management |
| Vite | 5+ | Fast dev server and build tool |
| PixiJS | v8 | WebGL-accelerated 2D canvas rendering |
| Tailwind CSS | v4 | Utility-first styling |
| Socket.IO Client | 4+ | Real-time WebSocket communication |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | 18+ | JavaScript runtime |
| Express | 4+ | HTTP server and routing |
| Socket.IO | 4+ | Real-time bidirectional event system |
| dotenv | - | Environment variable management |

---

## 📁 Project Structure
virtual-cosmos/
│
├── server/                        # Backend
│   ├── index.js                   # Express + Socket.IO server
│   ├── .env                       # Environment variables
│   └── package.json
│
├── client/                        # Frontend
│   ├── index.html                 # App entry + Google Fonts
│   ├── src/
│   │   ├── components/
│   │   │   ├── CosmosCanvas.jsx   # PixiJS canvas + 60fps game loop
│   │   │   ├── ChatPanel.jsx      # Proximity-triggered chat UI
│   │   │   ├── MiniMap.jsx        # Live minimap overlay
│   │   │   └── Toast.jsx          # Join/leave notifications
│   │   │
│   │   ├── hooks/
│   │   │   ├── useSocket.js       # Socket.IO state + event handling
│   │   │   └── useKeyboard.js     # Keyboard input tracking via ref
│   │   │
│   │   ├── utils/
│   │   │   ├── constants.js       # Colors, radii, speeds, avatars
│   │   │   └── proximity.js       # Euclidean distance calculation
│   │   │
│   │   ├── App.jsx                # Root — state, layout, orchestration
│   │   └── index.css              # Global styles + keyframe animations
│   │
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
└── README.md

---

## 🚀 Getting Started

### Prerequisites

Make sure you have these installed:
```bash
node --version   # v18 or higher
npm --version    # v9 or higher
```

---

### 1. Clone the Repository
```bash
git clone https://github.com/neha23nov/Virtual-Cosmos.git
cd virtual-cosmos
```

---

### 2. Setup and Run the Backend
```bash
cd server
npm install
npm run dev
```

You should see:
Server running on http://localhost:3001

Verify it works by opening: `http://localhost:3001`  
You should see: `{ "status": "Virtual Cosmos server running" }`

---

### 3. Setup and Run the Frontend

Open a new terminal window:
```bash
cd client
npm install
npm run dev
```

You should see:
VITE ready on http://localhost:5173

---

### 4. Test Multiplayer

1. Open **two browser tabs** at `http://localhost:5173`
2. Enter different names and pick different avatars in each tab
3. Move one player toward the other using **WASD**
4. Watch the chat panel appear automatically when they get close
5. Type a message — it appears in both tabs instantly
6. Move apart — chat disconnects automatically
---

## 🔄 Data Flow Diagrams

### Player Movement
Key held down (WASD)
→ useKeyboard ref detects it
→ Game loop reads ref (60fps)
→ x/y position updated
→ emitMove(x, y) called
→ Socket sends 'move' to server
→ Server broadcasts 'user-moved'
→ All other tabs update that user's position
→ Canvas redraws at new position

### Chat Connect
Distance < 260px detected in game loop
→ onProximityChange([userId]) called
→ App.jsx sets nearbyUsers state
→ ChatPanel receives isOpen=true
→ Fade-in animation plays
→ Yellow glow + pulse ring on other player
→ Connection line drawn between players

### Chat Disconnect
Distance ≥ 260px detected
→ onProximityChange([]) called
→ App.jsx sets nearbyUsers = []
→ clearMessages() wipes chat history
→ ChatPanel receives isOpen=false
→ Fade-out animation plays → unmounts
→ Glow and connection line disappear

### Message Send
User types message + hits Enter
→ ChatPanel loops through nearbyUsers
→ emitMessage(id, text) for each nearby user
→ Socket sends 'chat-message' to server
→ Server relays to target socket ID
→ Server also echoes back to sender
→ Both tabs receive 'receive-message'
→ messages state updated in useSocket
→ ChatPanel re-renders + auto-scrolls

---

##  Key Technical Decisions

| Decision | Reason |
|---|---|
| `useRef` for keyboard state | Avoids re-render on every keypress — game loop reads it directly |
| `usersRef` inside game loop | useEffect closure captures initial value — ref stays current |
| Proximity check every frame | Instant response with no polling delay or debounce needed |
| `initializedRef` guard | Prevents PixiJS double-init from React 18 StrictMode |
| In-memory user store | Positions are ephemeral — reset on disconnect anyway |
| Echo message to sender | Sender sees their own message without optimistic UI tricks |
| PixiJS `app.init()` async | PixiJS v8 changed from sync constructor to async init |

---

##  Environment Variables

### `server/.env`
```env
PORT=3001
```

---

##  Common Issues & Fixes

### Tailwind CSS PostCSS error
```bash
npm install @tailwindcss/postcss
```
Update `postcss.config.js`:
```js
export default {
  plugins: { '@tailwindcss/postcss': {}, autoprefixer: {} }
}
```

### PixiJS `appendChild of null` error
Remove `<React.StrictMode>` from `main.jsx` — StrictMode double-fires effects which breaks PixiJS async init.

### Canvas not showing
Make sure both terminals are running — server on port `3001` and client on port `5173`.

### Players not syncing
Check browser console for CORS errors — ensure server CORS origin matches `http://localhost:5173`.

---

##  Demo Video

>  [Watch Demo](https://www.youtube.com/watch?v=BAQokpCGDug))

Covers:
- Join screen with avatar picker
- Real-time multiplayer (two tabs)
- Proximity chat connect and disconnect
- Emoji reactions
- Mini-map
- Toast notifications

---

