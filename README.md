# 🏛️ AI-Based Smart Complaint Management System

> B.Tech 4th Semester ESE Project | AI Driven Full Stack Development (AI308B)

A production-ready MERN Stack application that allows citizens to register complaints online with AI-powered categorization, priority detection, department routing, and automated responses.

---

## 🚀 Live Demo
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5001/api

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📝 Complaint Registration | Submit complaints with name, email, title, description, category, location |
| 🤖 AI Analysis | Auto-detect priority, recommend department, generate summary & response |
| 📊 Dashboard | Real-time stats with charts (bar + pie) |
| 🔍 Search & Filter | Search by location, filter by category and status |
| 📋 Complaint Tracking | Track status: Pending → In Progress → Resolved |
| 🔐 JWT Auth | Secure login/signup with bcrypt password hashing |
| ⚙️ Admin Panel | Admin can update status and delete complaints |
| 📱 Responsive | Works on mobile, tablet, desktop |
| 🌙 Dark Mode | Beautiful dark glassmorphism UI |

---

## 🛠️ Tech Stack

- **Frontend:** React.js + Vite + Tailwind CSS + Recharts
- **Backend:** Node.js + Express.js
- **Database:** MongoDB Atlas
- **Auth:** JWT + bcryptjs
- **AI:** OpenRouter API (GPT-3.5-turbo)
- **HTTP Client:** Axios

---

## 📁 Folder Structure

```
complaint-system/
├── server/                    # Backend
│   ├── controllers/           # Business logic
│   │   ├── authController.js
│   │   ├── complaintController.js
│   │   └── aiController.js
│   ├── routes/                # API routes
│   │   ├── auth.js
│   │   ├── complaints.js
│   │   └── ai.js
│   ├── models/                # MongoDB schemas
│   │   ├── User.js
│   │   └── Complaint.js
│   ├── middleware/
│   │   └── auth.js            # JWT middleware
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── .env
│   └── server.js
│
└── client/                    # Frontend
    └── src/
        ├── components/        # Reusable components
        │   ├── Navbar.jsx
        │   ├── Footer.jsx
        │   ├── ComplaintCard.jsx
        │   └── LoadingSpinner.jsx
        ├── pages/             # Page components
        │   ├── Home.jsx
        │   ├── Login.jsx
        │   ├── Signup.jsx
        │   ├── Dashboard.jsx
        │   ├── Complaints.jsx
        │   ├── RegisterComplaint.jsx
        │   └── NotFound.jsx
        ├── context/
        │   └── AuthContext.jsx
        ├── services/
        │   └── api.js         # Axios API calls
        ├── routes/
        │   └── ProtectedRoute.jsx
        └── App.jsx
```

---

## 🔌 API Endpoints

### Auth APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |

### Complaint APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/complaints` | Add complaint |
| GET | `/api/complaints` | Get all complaints |
| PUT | `/api/complaints/:id` | Update complaint |
| DELETE | `/api/complaints/:id` | Delete complaint |
| GET | `/api/complaints/search?location=Ghaziabad` | Search by location |
| GET | `/api/complaints/stats` | Get dashboard stats |

### AI APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/analyze` | AI complaint analysis |

---

## 🤖 AI Features

```json
{
  "priority": "High",
  "department": "Jal Board / Water Department",
  "summary": "Water pipeline damaged near market area causing flooding.",
  "autoResponse": "Thank you for reporting this issue. Our Water Department team will inspect and resolve this within 48 hours."
}
```

---

## ⚙️ Environment Variables

```env
PORT=5001
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
OPENROUTER_API_KEY=your_openrouter_key
```

---

## 🚀 Installation & Setup

```bash
# Clone / navigate to project
cd complaint-system

# Install backend
cd server && npm install

# Install frontend
cd ../client && npm install

# Start backend
cd ../server && node server.js

# Start frontend (new terminal)
cd ../client && npm run dev
```

Or just double-click **`🚀 START COMPLAINT SYSTEM.bat`**

---

## 🧪 Test Cases

| Test | Expected Output |
|------|----------------|
| Add valid complaint | Complaint stored successfully |
| Missing title field | Validation error |
| Invalid email | Error message |
| Filter by location | Matching complaints displayed |
| Valid login | JWT token generated |
| Invalid password | Unauthorized error |
| Access without token | Access denied |

---

## 👤 Demo Credentials

- **Admin:** admin@demo.com / admin123
- **User:** Create via signup page

---

*B.Tech 4th Semester | AI Driven Full Stack Development | Even Sem 2025-26*
