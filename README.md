# CodeArena DSA — Intelligent Online Examination System

A complete, production-quality university examination platform built for **Data Structures and Algorithms** courses. Features React.js frontend, Node.js/Express backend, MongoDB database, JWT authentication, anti-cheating monitoring, interactive algorithm visualizers, and comprehensive performance analytics.

---

## 🚀 Quick Start

```bash
# 1. Install all dependencies
npm run install-all

# 2. Start both backend + frontend dev servers
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

> **Zero-Config Database**: No MongoDB installation required! The app automatically spins up an embedded in-memory MongoDB instance and seeds demo data on first boot.

---

## 🔑 Demo Credentials

| Role    | Email                   | Password     |
|---------|-------------------------|--------------|
| Admin   | admin@codearena.com     | Admin@123    |
| Faculty | faculty@codearena.com   | Faculty@123  |
| Student | student@codearena.com   | Student@123  |

You can also use the **1-Click Quick Demo Login** buttons on the Login page or the role switcher in the navbar.

---

## 🏗️ Tech Stack

| Layer      | Technology                                                    |
|------------|---------------------------------------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS, Recharts, Lucide Icons, Framer Motion |
| Backend    | Node.js, Express.js, Mongoose ODM                            |
| Database   | MongoDB (Atlas / Local / Embedded MongoMemoryServer)          |
| Auth       | JWT (JSON Web Tokens), bcryptjs                               |
| Security   | Helmet, CORS, Express Rate Limiter, Anti-Cheating Overlay     |
| Testing    | Custom test runner (32 algorithm + evaluation tests)          |

---

## 📁 Project Structure

```
├── package.json              # Root orchestrator scripts
├── .env                      # Environment variables
├── server/
│   ├── server.js             # Express entry point
│   ├── config/               # DB connection, JWT utilities
│   ├── models/               # Mongoose schemas (User, Question, Exam, ExamAttempt, Topic, Achievement, Notification)
│   ├── controllers/          # Route handlers (auth, user, topic, question, exam, attempt, analytics)
│   ├── routes/               # Express routers
│   ├── middleware/            # Auth, role, error handler, rate limiter, validator
│   ├── services/             # Randomization, evaluation, analytics engines
│   ├── algorithms/           # 12 DSA algorithm implementation files
│   ├── seed/                 # 22 topics, 120 questions, 3 exams, demo users
│   └── tests/                # Automated test suite (32 tests)
├── client/
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── src/
│       ├── main.jsx          # React entry point
│       ├── App.jsx           # Router + protected routes + layout
│       ├── index.css         # Tailwind + glassmorphism theme
│       ├── context/          # AuthContext with demo role switcher
│       ├── services/         # Axios API client with JWT injection
│       ├── algorithms/       # DSA code catalog (11 algorithms)
│       ├── components/
│       │   ├── common/       # Button, Badge, Card, Modal, Navbar, Sidebar
│       │   ├── exam/         # ExamHeader, QuestionCard, QuestionNavigator, AntiCheatingOverlay
│       │   └── visualizer/   # SortingVisualizer, GraphVisualizer
│       └── pages/            # 21 full pages (see below)
```

---

## 📄 All Pages

### Public
- **Landing Page** — Hero, features grid, syllabus preview, FAQ, footer
- **Login** — Email/password + 1-click demo role buttons
- **Register** — Student registration with academic details
- **Forgot Password / Reset Password** — Token-based password reset
- **Syllabus** — 22 DSA topics with category filters and search
- **Algorithm Visualizer** — Sorting animations + Graph BFS/DFS traversal
- **Algorithm Library** — Copyable code snippets with complexity analysis

### Student (Protected)
- **Dashboard** — KPIs, score trend chart, topic accuracy bars, weak area recommendations, badges
- **Practice Mode** — Topic/difficulty picker, instant answer verification, educational explanations
- **Exams List** — Active exams with instructions modal and attempt tracking
- **Exam Taking** — Fullscreen secure interface with timer, question palette, auto-save, anti-cheating
- **Exam Result** — Grade badge, topic breakdown chart, question-by-question review with explanations
- **Analytics** — Score progression, topic competency radar, weak/strong area diagnosis
- **Leaderboard** — Global/monthly/weekly rankings with top-3 podium
- **Profile** — Academic details editor, password change

### Admin & Faculty (Protected)
- **Admin Dashboard** — System-wide KPIs, topic accuracy chart, recent submissions with security flags
- **Question Bank** — CRUD table with search/filter, create/edit modal, difficulty/topic tagging
- **Exam Manager** — Create exams, pick questions, configure duration/passing/negative marks, publish/unpublish
- **Student Directory** — User listing, activate/deactivate accounts, delete users
- **Submissions Log** — All student attempts with security incident counts
- **Attempt Audit** — Anti-cheating event timeline, answer-by-answer inspection

---

## 🔒 Security Features

- **JWT Authentication** with role-based route protection (Student, Faculty, Admin)
- **Anti-Cheating Overlay**: Monitors tab switches, window blur, fullscreen exits, copy/paste, right-click
- **Server-Side Evaluation**: Answer keys never sent to the client during exams
- **Fisher-Yates Randomization**: Questions and options shuffled per student
- **Rate Limiting**: API endpoints protected against brute-force attacks
- **Helmet + CORS**: HTTP security headers and cross-origin policies

---

## 🧪 Testing

```bash
# Run the full algorithm + evaluation test suite (32 tests)
npm test
```

Tests cover: Array algorithms, Binary Search, Sorting (Merge/Quick/Bubble), Linked List reversal, Stack parentheses validation, Graph BFS/DFS/Dijkstra, Dynamic Programming (LCS/Knapsack), Grading system, Fisher-Yates randomization.

---

## 📦 Available Scripts

| Command             | Description                                     |
|---------------------|-------------------------------------------------|
| `npm run dev`       | Start backend + frontend concurrently            |
| `npm run server`    | Start only the Express backend                   |
| `npm run client`    | Start only the Vite frontend dev server           |
| `npm run seed`      | Seed database with demo data                     |
| `npm test`          | Run automated algorithm test suite               |
| `npm run build`     | Build production client bundle                   |
| `npm run install-all` | Install dependencies for root, server, and client |

---

## 🎨 Design System

- **Theme**: Dark navy glassmorphism with cyan accent glow
- **Typography**: Inter font family
- **Components**: Glass cards, gradient badges, glow shadows, animated transitions
- **Responsive**: Mobile-first layout with collapsible sidebar

---

## 📊 DSA Algorithms Implemented

12 algorithm modules with full implementations, complexity metadata, and test coverage:

1. **Array Algorithms** — Two Sum, Kadane's Max Subarray, Sliding Window
2. **Searching** — Binary Search (iterative + recursive), Rotated Array Search
3. **Sorting** — Merge Sort, Quick Sort, Bubble Sort, Selection Sort, Insertion Sort
4. **Linked Lists** — Reverse, Detect Cycle (Floyd's), Find Middle
5. **Stacks** — Valid Parentheses, Next Greater Element
6. **Queues** — Circular Queue, Priority Queue operations
7. **Trees** — BST Insert/Search/Delete, Inorder/Preorder/Postorder, Level Order, Height
8. **Graphs** — BFS, DFS, Dijkstra's Shortest Path
9. **Dynamic Programming** — LCS, 0/1 Knapsack, Fibonacci, Coin Change
10. **Greedy** — Activity Selection, Fractional Knapsack, Huffman Coding
11. **Recursion** — Factorial, Tower of Hanoi, Permutations
12. **Strings** — Reverse, Palindrome Check, Anagram Detection, KMP Pattern Matching

---

## 📝 License

Built as a university academic project. MIT License.
# codearena-dsa-online-examination-system
