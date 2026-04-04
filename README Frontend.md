# 🎨 Smart Job Application & AI Resume Optimizer (Frontend)

Welcome to the sleek, high-performing frontend for the **AI Smart Resume** platform! This React 18 application is built with **Vite** for maximum developer speed and **Tailwind CSS** for a stunning, responsive design.

---

## 🏛️ Architecture (A to Z)

This frontend acts as the user's interactive control center for job applications and AI optimization. It communicates with a Spring Boot backend hosted on Render.

### 🏜️ The "Forever Free" Stack
- **Hosting**: Vercel (Global Edge).
- **Styling**: Tailwind CSS (Modern, Dark-Mode Ready).
- **Communication**: Axios (REST API calls to Render).
- **Drafting**: Real-time JSON editing for AI-optimized content.

---

## ✨ Key Features
- **📊 Interactive AI Editor**: View and live-edit the AI's optimized version of your resume before sending it to HR.
- **📁 Smart File Uploads**: Drag and drop PDF resumes for parsing and metadata extraction.
- **🚀 One-Click "Blast"**: The "Email to HR" button triggers a backend flow that renders a PDF and sends it via Resend API in one go.
- **🔒 Secure Authentication**: Login and Signup flow with session-aware headers.

---

## 🛠️ Tech Stack
- **React 18**
- **Vite** (Next-gen build tool)
- **Tailwind CSS** (Utility-first CSS)
- **Lucide React** (Iconography)
- **Axios** (HTTP Client)

---

## 🚀 Getting Started

### 1. Environment Variables
To connect this frontend to your cloud backend (Render), you **must** set this variable in the Vercel Dashboard:

| Variable | Description |
| :--- | :--- |
| `VITE_API_BASE_URL` | `https://smart-job-backend-dtqd.onrender.com` |

### 2. Deployment
Simply connect your GitHub repo to **Vercel** and it will auto-deploy. Every push to `main` will trigger a fresh build.

---

## 🏛️ Core Modules
- **`AiOptimizer.jsx`**: The core logic for interacting with the Groq AI optimization endpoint.
- **`ResumeUpload.jsx`**: Handles multi-part file uploads to the Spring Boot file storage service.
- **`Login.jsx` / `Signup.jsx`**: User onboarding and security.

---

## 🤝 Repositories
- **Backend**: [smart-job-backend](https://github.com/anirudhchourey5610/smart-job-backend)
- **Frontend**: [AI-Smart-Resume](https://github.com/anirudhchourey5610/AI-Smart-Resume)

---
Developed with ❤️ by **Anirudh Chourey**.
