# CareerPath — Frontend

The frontend for **CareerPath**, a full-stack MERN job portal connecting job seekers with verified employers. Built as a final assignment project.

**Author:** Tawhidul Islam

## Project Overview

CareerPath lets job seekers browse and apply for jobs (with support for custom application requirements like portfolio links, CV uploads, or short answers), track applications through a full status pipeline, save jobs for later, and view company profiles with earned badges. Employers can post and manage jobs, review applicants (per-job or across all their listings), and build out their own company profile. Both roles can submit testimonials that may be featured on the homepage.

## Technologies Used

- **React** (Vite)
- **Tailwind CSS v4**
- **Zustand** — auth state management (persisted)
- **React Router** — client-side routing
- **Axios** — API requests
- **Framer Motion** — animations
- **Lucide React** — icons
- **React Hot Toast** — notifications

## Installation Guide

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd job-portal-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** — copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
   When deploying, point this at your deployed backend's URL instead (e.g. `https://your-api.onrender.com/api`).

4. **Run the dev server**
   ```bash
   npm run dev
   ```
   Runs at `http://localhost:5173` by default. Make sure the backend (see the backend repo's README) is running too.

5. **Build for production**
   ```bash
   npm run build
   ```

## Key Features

- Role-based registration (Job Seeker / Employer) with protected, role-gated routes
- Job search, filtering, and pagination
- Custom application requirements (links, file uploads, text answers) with a dynamic apply flow
- Full application status pipeline: Pending → Shortlisted → Interview → Hired / Rejected
- Saved jobs, application withdrawal, and dashboard stats for job seekers
- Job duplication, bulk applicant status updates, and a cross-job applicant view for employers
- Company profile pages (cover image, history, badges) accessible by clicking any company name
- User-submitted testimonials shown on the homepage

## Live Demo

- **Frontend:** https://job-portal-frontend-nine-beta.vercel.app
- **API:** https://job-portal-backend-poyk.onrender.com
