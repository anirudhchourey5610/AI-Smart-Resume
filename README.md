# Smart Job Application & AI Resume Optimizer (Frontend)

A modern **React 18 + Vite + Tailwind CSS** frontend for the AI Smart Resume platform.

Built for a **fast, clean, SaaS-style experience** with authentication, resume management, and AI-powered workflows.

---

## ✨ Overview

This frontend is the user-facing layer of the platform.

It is responsible for:
- Rendering UI and dashboards  
- Managing routes and protected navigation  
- Handling forms and validation  
- Communicating with backend APIs via Axios  
- Displaying real-time feedback (success/error/loading)  

---

## 🏛️ Architecture (A to Z)

### 🔹 Core Layers

- **UI Layer** → React components and pages  
- **Routing Layer** → React Router with protected routes  
- **State Layer** → Local state + AuthContext  
- **Service Layer** → Axios + API config  
- **Styling Layer** → Tailwind CSS  

---

## 🏛️ Architecture Diagram

```mermaid
flowchart LR
    A[User] --> B[React UI]
    B --> C[Axios Services]
    C --> D[Spring Boot Backend]
    D --> E[Response / Error]
    E --> B

Frontend acts as the bridge between user interactions and backend services.

🔄 Data Flow

All actions follow a predictable request → response → UI update cycle.

🔐 Authentication Flow

Authentication state controls access to protected routes.

📁 Resume Upload Flow

Uses multipart uploads with Axios and updates UI instantly.

🤖 AI Optimization Flow

AI output is returned and can be edited before final use.

✨ Key Features
🔒 Secure Authentication (Login / Register)
📁 Resume Vault (Upload, Download, Delete)
🤖 AI Resume Optimization
📊 Dashboard Experience
⚠️ Real-time Error & Success Feedback
🧭 Protected Navigation
🛠️ Tech Stack
React 18
Vite
Tailwind CSS
React Router DOM
Axios
Lucide React
🚀 Getting Started
1. Environment Variables
VITE_API_BASE_URL=https://smart-job-backend-dtqd.onrender.com
2. Run Locally
npm install
npm run dev
3. Deployment
Connect GitHub repo to Vercel
Add VITE_API_BASE_URL
Push to main → auto deploy
🧩 Project Structure
src/
├── assets/
├── components/
│   └── dashboard/
├── config/
├── context/
├── pages/
├── services/
├── utils/
├── App.jsx
└── main.jsx
🧠 State & API Handling
Local state → forms, loading, UI feedback
Context → authentication state
Axios → API communication
Centralized API config → clean endpoints
📝 Form Handling & Validation
Controlled inputs
Prevent default form submission
Client-side validation (e.g., password match)
Backend errors displayed directly in UI
⚠️ Error Handling
Inline form error messages
Backend error surfacing
Toast-style feedback for actions
Disabled buttons during requests
⚙️ Performance Optimizations
⚡ Vite fast builds + HMR
📦 Lazy loading (React.lazy)
⏳ Suspense fallback
🔁 Minimal re-renders
🔐 Security Practices
Token-based protected routes
Controlled inputs
Environment-based API config
Logout clears stored auth data
🤝 Repositories
Backend: smart-job-backend
Frontend: AI-Smart-Resume
