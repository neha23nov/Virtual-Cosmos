# Virtual Cosmos

> A real-time 2D virtual space where proximity drives connection.  
> Move close to someone → chat opens. Move away → chat closes.
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

## 📁 Project Structure

```bash
virtual-cosmos/
│
├── server/                        # Backend
│   ├── index.js
│   ├── .env
│   └── package.json
│
├── client/                        # Frontend
│   ├── index.html
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── index.css
│
└── README.md


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


##  Environment Variables

### `server/.env`
```env
PORT=3001
```

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

