---

## 🚀 Setup & Run

### Prerequisites
- Node.js v18 or higher
- npm v9 or higher

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/virtual-cosmos.git
cd virtual-cosmos
```

### 2. Start the backend
```bash
cd server
npm install
npm run dev
```
Server runs at: `http://localhost:3001`

### 3. Start the frontend
```bash
cd client
npm install
npm run dev
```
Frontend runs at: `http://localhost:5173`

### 4. Test multiplayer
Open **two or more browser tabs** at `http://localhost:5173`
- Enter different names and avatars
- Move players close together with WASD
- Watch chat connect and disconnect automatically

---

## 🎮 Controls

| Key          | Action              |
|--------------|---------------------|
| W / ↑        | Move up             |
| S / ↓        | Move down           |
| A / ←        | Move left           |
| D / →        | Move right          |
| 1 – 5        | Send emoji reaction |

---

## 🔌 Socket Events

### Client → Server
| Event          | Payload                  | Description              |
|----------------|--------------------------|--------------------------|
| `join`         | `{ username, avatar }`   | User enters the cosmos   |
| `move`         | `{ x, y }`               | Player position update   |
| `chat-message` | `{ toId, message }`      | Send message to nearby user |

### Server → Client
| Event            | Payload                        | Description                    |
|------------------|--------------------------------|--------------------------------|
| `init`           | user object                    | Your own data on connect       |
| `all-users`      | users map                      | All existing users             |
| `user-joined`    | user object                    | Someone new joined             |
| `user-moved`     | `{ id, x, y }`                 | Another user moved             |
| `user-left`      | socket id                      | Someone disconnected           |
| `receive-message`| `{ fromId, fromName, message }`| Incoming chat message          |

---
