<<<<<<< HEAD
# RideU

A modern, full-stack bus pass booking application designed for Vimal Jyothi Engineering College (VJEC). 

## Technology Stack
- **Frontend**: React, Vite, Tailwind CSS, React Router, React-Leaflet, Recharts, Lucide React.
- **Backend**: Node.js, Express, express-session (with cookies).
- **Database**: MySQL (using `mysql2/promise` pool).

## Features
- **Student Portal**: Book 1-day passes, view digital QR tickets, live tracking (mock), and booking history.
- **Role-based Auth**: Students, Admin, and SuperAdmin tiers.
- **Admin Dashboard**: Manage bus fleets, view passenger metrics, flag/ban users, and send mass notifications.
- **Emails**: Built-in Nodemailer integration for booking confirmations and flag alerts.

---

## Local Development

### 1. Database Setup
1. Ensure MySQL is running on your machine.
2. Create a database (e.g., `rideu_db`).
3. CD into `server` and install dependencies: `npm install`
4. Copy `server/.env.example` to `server/.env` and update your MySQL credentials.
5. Run the seed script to create tables and mock data:
   ```bash
   npm run db:seed
   ```
   *This creates a SuperAdmin account and populates cities, routes, and buses.*

### 2. Backend Server
From the `server` directory:
```bash
npm run dev
```
The API will run on `http://localhost:5000`.

### 3. Frontend App
From the `client` directory:
```bash
npm install
npm run dev
```
The React app will run on `http://localhost:5173`. Make sure `client/.env` has `VITE_API_URL=http://localhost:5000/api`.

---

## Deployment Guide

### Frontend (Vercel)
Vercel is perfect for our Vite SPA frontend.
1. Push your code to a GitHub repository.
2. In Vercel, import the repository and select the **`client`** directory as your Root Directory.
3. Vercel will auto-detect Vite. Let the build command be `npm run build` and output directory `dist`.
4. **Environment Variables**: Add `VITE_API_URL` pointing to your deployed Railway backend URL (e.g., `https://rideu-api.up.railway.app/api`).
5. The `vercel.json` file we included handles SPA routing (redirecting all paths to `index.html`).

### Backend & Database (Railway)
Railway makes it incredibly easy to host both the MySQL database and the Node.js API.
1. Create a new Railway project.
2. Provision a **MySQL Template** service. This will give you your production DB credentials (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`).
3. Connect your GitHub Repo and deploy the **`server`** folder. 
   *(In Railway, go to Settings -> Root Directory and type `/server`)*
4. Railway will automatically detect Node.js and run `npm start` (which we configured in `server/package.json` to run `node server.js`).
5. **Environment Variables Config in Railway**:
   - `PORT`: (Railway provides this automatically, but leave our fallback).
   - `CLIENT_URL`: Your Vercel domain (e.g., `https://rideu.vercel.app`) for CORS.
   - Database Variables from Step 2.
   - `SESSION_SECRET`: A long random string.
   - `SMTP_...`: Your email provider details (SendGrid, Mailgun, or Gmail App Password).

**Seed Production DB**:
Once the Railway MySQL instance is up, you can connect to it using a local tool (like MySQL Workbench, or via Railway CLI `railway run`) and execute the `setup.sql` script, or temporarily run `npm run db:seed` against the prod DB credentials.
=======
# RIDEU
>>>>>>> afa32795dbb42febe4403f7fa82756ef870e177b
