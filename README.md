# Zumé — ATS-Friendly Resume Builder

> Build professional, ATS-optimized resumes for free. No subscriptions. No limits.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)

---

## Overview

**Zumé** is a full-stack web application that helps job seekers create professional resumes optimized for Applicant Tracking Systems (ATS). Over 99% of Fortune 500 companies use ATS to screen resumes — poorly formatted resumes often get filtered out before reaching recruiters. This tool ensures your resume is structured for both humans and machines, and it's **100% free**.

### Why Zumé?

- **Free forever** — Unlike Zety, Resume.io, Novorésumé, and similar tools that lock core features behind paywalls
- **ATS-optimized** — Clean structure and semantic formatting for reliable parsing
- **User-friendly** — Modern, responsive UI with real-time preview
- **Full control** — Create and manage unlimited resumes without limits

---

## Features

| Feature | Description |
|--------|-------------|
| **Authentication** | Secure signup and login with JWT |
| **Multiple Resumes** | Create, edit, and manage multiple resumes from one dashboard |
| **Real-time Editor** | Live preview as you type |
| **3 Templates** | Choose from minimalist, modern, and academic styles |
| **PDF Export** | One-click download as PDF |
| **Image Upload** | Add profile photos and custom assets |
| **Theme Customization** | Customize colors and layout |
| **Responsive Design** | Works on desktop, tablet, and mobile |

---

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React 19, Vite 7, Tailwind CSS 4, React Router, Axios |
| **Backend** | Node.js, Express 5 |
| **Database** | MongoDB with Mongoose |
| **Auth** | JWT (jsonwebtoken), bcryptjs |
| **File Upload** | Multer |
| **PDF Export** | html2pdf.js |

---

## Project Structure

```
resume-builder/
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── EditResume.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── SignUp.jsx
│   │   │   ├── TemplateOne.jsx
│   │   │   ├── TemplateTwo.jsx
│   │   │   ├── TemplateThree.jsx
│   │   │   └── ...
│   │   ├── context/        # React Context (UserContext)
│   │   ├── pages/          # LandingPage, Dashboard
│   │   ├── utils/          # API paths, axios instance, helpers
│   │   └── App.jsx
│   └── package.json
├── backend/
│   ├── config/             # Database connection
│   ├── controllers/        # User & resume controllers
│   ├── middleware/         # Auth middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── uploads/            # Uploaded images (gitignored)
│   ├── server.js
│   └── package.json
└── README.md
```

---

## Prerequisites

- **Node.js** (v18 or higher recommended)
- **MongoDB** (local installation or [MongoDB Atlas](https://www.mongodb.com/atlas))
- **npm** or **yarn**

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/resume-builder.git
cd resume-builder
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
MONGO_URI=mongodb://localhost:27017/resume-builder
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

> **Note:** For MongoDB Atlas, use a connection string like:  
> `mongodb+srv://<username>:<password>@cluster.mongodb.net/resume-builder?retryWrites=true&w=majority`

### 3. Set up the frontend

```bash
cd ../frontend
npm install
```

The frontend expects the API at `http://localhost:4000`. Update `frontend/src/utils/apiPaths.js` if your backend runs on a different port or host.

### 4. Run the application

**Terminal 1 — Backend:**

```bash
cd backend
npm start
```

**Terminal 2 — Frontend:**

```bash
cd frontend
npm run dev
```

- **Backend:** http://localhost:4000  
- **Frontend:** http://localhost:5173  

---

## Environment Variables

### Backend (`.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/resume-builder` |
| `JWT_SECRET` | Secret key for JWT signing | Use a long random string in production |
| `GOOGLE_GEMINI_API_KEY` | API key for Google Gemini (preferred) | `AIza...` |
| `AI_API_KEY` | (Optional) Fallback API key env var name | `AIza...` |
| `GEMINI_MODEL` | (Optional) Gemini model name | `models/gemini-2.5-flash` |

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/profile` | Get current user (requires auth) |

### Resumes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/resume` | Get all resumes (auth) |
| POST | `/api/resume` | Create resume (auth) |
| GET | `/api/resume/:id` | Get resume by ID (auth) |
| PUT | `/api/resume/:id` | Update resume (auth) |
| DELETE | `/api/resume/:id` | Delete resume (auth) |
| POST | `/api/resume/:id/upload-images` | Upload images for resume (auth) |
### AI

All AI endpoints expect JSON and return structured JSON suitable for the frontend.

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/rewrite-bullet` | Improve a single resume bullet for a target role |
| POST | `/api/ai/generate-summary` | Generate a professional resume summary |
| POST | `/api/ai/suggest-skills` | Suggest missing skills/technologies based on resume content and target role |

#### Example: `POST /api/ai/rewrite-bullet`

Request body:

```json
{
  "bullet": "Built a trading bot",
  "targetRole": "Software Engineer"
}
```

Response body:

```json
{
  "improvedBullet": "Developed an algorithmic trading bot using Python that automated strategy execution and evaluated performance using historical market datasets.",
  "atsVersion": "Developed Python-based algorithmic trading bot to automate strategy execution and backtest performance on historical market data.",
  "keywordsAdded": ["Python", "Algorithmic Trading", "Backtesting", "Automation"]
}
```

#### Example: `POST /api/ai/generate-summary`

Request body:

```json
{
  "experiences": "2+ years building backend services and REST APIs, experience with microservices and distributed systems.",
  "skills": "Node.js, Express, MongoDB, Docker, Kubernetes, AWS",
  "targetRole": "Backend Software Engineer"
}
```

Response body:

```json
{
  "summary": "Backend Software Engineer with hands-on experience building scalable REST APIs and microservices using Node.js, Express, and MongoDB. Skilled in designing resilient distributed systems and deploying containerized workloads with Docker and Kubernetes on AWS."
}
```

#### Example: `POST /api/ai/suggest-skills`

Request body:

```json
{
  "resumeText": "Experience with Python, NumPy, Pandas, and scikit-learn. Built several machine learning models for classification tasks.",
  "targetRole": "Machine Learning Engineer"
}
```

Response body:

```json
{
  "suggestedSkills": [
    "TensorFlow",
    "PyTorch",
    "MLOps",
    "Docker",
    "Kubernetes",
    "Distributed Training",
    "Model Monitoring"
  ]
}
```

---

## AI Resume Assistant (Frontend)

On the resume editor page, an **AI Assistant Panel** is available to provide ATS-focused help:

- **AI Bullet Point Improvement** (`BulletRewriteBox`): Enter a bullet and target role, then click **Improve with AI** to receive:
  - Improved bullet
  - ATS-optimized version
  - Keywords added
- **AI Resume Summary Generator** (`SummaryGenerator`): Provide short descriptions of past experience, key skills, and a target role to generate a professional summary.
- **Skill Suggestions** (`SkillSuggestions`): Paste resume content and a target role to receive suggested missing skills and technologies.

All components use loading states, basic validation, and error handling around the `/api/ai` endpoints.
---

## Usage

1. **Sign up** or log in on the landing page.
2. **Create a resume** from your dashboard.
3. **Edit** sections (Experience, Education, Skills, etc.) with the real-time editor.
4. **Choose a template** and customize colors.
5. **Export** your resume as PDF when done.

---

## Roadmap

- [ ] **Enhance with AI** — Suggestions for bullet points, action verbs, and ATS keywords
- [ ] **Multiple templates** — Expand template gallery
- [ ] **Cover letter generator** — AI-assisted cover letters
- [ ] **ATS score** — Feedback on resume optimization
- [ ] **Job description parser** — Tailor resume to specific job postings

---

## Contributing

Contributions are welcome. Please open an issue or submit a pull request.

---

## License

ISC

---

**Built for job seekers, by job seekers.** 🚀
