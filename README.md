# 🏠 RealEstate Hub — Full Stack Property Listing Platform (MERN)

A complete MERN stack web application where property owners can list and manage
real estate (rent/sale), and buyers can browse, search, filter, save favorites,
and send inquiries directly to owners.

---

## 🧱 Tech Stack

- **Frontend:** React 18 (Vite), React Router v6, Tailwind CSS, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB + Mongoose
- **Auth:** JWT (JSON Web Token) + bcrypt password hashing
- **File Uploads:** Multer (local disk storage, served via Express static)

---

## ✨ Features

- JWT-based auth with two roles: **Owner** and **Buyer**
- Owners: create / edit / delete property listings, upload up to 6 images
- Buyers: search & filter properties (keyword, city, type, category, price, bedrooms)
- Property detail page with image gallery
- Inquiry system — buyers message owners, owners reply from an inbox
- Favorites / wishlist
- Owner dashboard to manage all their listings
- Pagination on the properties listing page
- Fully responsive UI (mobile + desktop)

---

## 📁 Project Structure

```
realestate-hub/
├── backend/
│   ├── config/db.js
│   ├── models/            (User, Property, Inquiry, Favorite)
│   ├── controllers/
│   ├── routes/
│   ├── middleware/         (auth.js, upload.js)
│   ├── uploads/             (uploaded images stored here)
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/     (Navbar, Footer, PropertyCard, PrivateRoute)
    │   ├── pages/           (Home, Login, Register, Properties, PropertyDetails,
    │   │                      AddProperty, EditProperty, Dashboard, MyInquiries, Favorites)
    │   ├── context/AuthContext.jsx
    │   ├── services/api.js
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── .env.example
```

---

## 🚀 Local Setup (Run in VS Code)

### 1. Prerequisites
- Node.js v18+ installed
- A MongoDB database — either:
  - Local MongoDB (`mongodb://localhost:27017/realestate-hub`), or
  - Free cloud DB at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (recommended)

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env` and set:
```
PORT=5000
MONGO_URI=<your MongoDB connection string>
JWT_SECRET=<any long random string>
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

Run the backend:
```bash
npm run dev
```
Backend will start at **http://localhost:5000**. Test it: visit `http://localhost:5000/api/health`.

### 3. Frontend Setup

Open a **new terminal**:
```bash
cd frontend
npm install
cp .env.example .env
```

`.env` already points to `http://localhost:5000/api` by default — fine for local dev.

Run the frontend:
```bash
npm run dev
```
Frontend will start at **http://localhost:5173**.

### 4. Try it out
1. Go to `http://localhost:5173/register`, create an account as **Property Owner**.
2. Click **Add Property**, fill details, upload images, publish.
3. Log out, register a second account as **Buyer**, browse `/properties`,
   open a listing, and send an inquiry.
4. Log back in as the owner → **Inquiries** tab → reply to the message.

---

## ☁️ Deployment Guide

You can deploy the backend and frontend separately (recommended) or serve the
frontend build from the same Express server.

### Option A — Separate Deployment (Recommended)

**Backend → Render.com / Railway.app**
1. Push this project to a GitHub repo.
2. Create a new **Web Service** on Render, pointing to the `backend/` folder
   (set root directory to `backend`).
3. Build command: `npm install` — Start command: `npm start`
4. Add environment variables (`MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRE`, `PORT`,
   `CLIENT_URL` = your deployed frontend URL).
5. Deploy — note the backend URL (e.g. `https://realestate-hub-api.onrender.com`).

**Database → MongoDB Atlas**
1. Create a free cluster at MongoDB Atlas.
2. Add a database user + allow access from anywhere (0.0.0.0/0) for simplicity.
3. Copy the connection string into `MONGO_URI` on your backend host.

**Frontend → Vercel / Netlify**
1. Import the repo, set root directory to `frontend`.
2. Build command: `npm run build` — Output directory: `dist`
3. Add environment variable: `VITE_API_URL=https://<your-backend-url>/api`
   and `VITE_UPLOADS_URL=https://<your-backend-url>`
4. Deploy.

### Option B — Single Server Deployment
The backend is already configured to serve the frontend build in production
(see the bottom of `backend/server.js`). To use this:
```bash
cd frontend
npm run build          # creates frontend/dist
cd ../backend
# set NODE_ENV=production in your .env
npm start
```
Then deploy just the `backend/` folder (with the built `frontend/dist` alongside
it) to any Node host (Render, Railway, a VPS, etc.) — everything is served
from one Express server on one port.

> ⚠️ Note on image uploads in production: this project stores uploaded images
> on local disk (`backend/uploads/`). Most hosting platforms (Render, Railway
> free tiers) use **ephemeral storage** — uploaded files can be lost on
> redeploy/restart. For a production-grade deployment, swap the `multer`
> disk storage in `backend/middleware/upload.js` for a cloud storage
> provider such as **Cloudinary** or **AWS S3**. The rest of the app
> (routes, models, frontend) will keep working unchanged — you'd only
> replace `upload.js` and the image URL building on the frontend.

---

## 🔑 API Overview

| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register user |
| POST | `/api/auth/login` | Public | Login |
| GET | `/api/auth/me` | Private | Get logged-in user |
| PUT | `/api/auth/me` | Private | Update profile |
| GET | `/api/properties` | Public | List/search/filter properties |
| GET | `/api/properties/:id` | Public | Property details |
| POST | `/api/properties` | Owner | Create property (multipart, field `images`) |
| PUT | `/api/properties/:id` | Owner | Update property |
| DELETE | `/api/properties/:id` | Owner | Delete property |
| GET | `/api/properties/my/listings` | Owner | My listings |
| POST | `/api/inquiries` | Private | Send inquiry `{ propertyId, message }` |
| GET | `/api/inquiries/sent` | Private | Inquiries I sent |
| GET | `/api/inquiries/received` | Private | Inquiries I received (as owner) |
| PUT | `/api/inquiries/:id/reply` | Private | Reply to an inquiry |
| POST | `/api/favorites/:propertyId` | Private | Add favorite |
| DELETE | `/api/favorites/:propertyId` | Private | Remove favorite |
| GET | `/api/favorites/my` | Private | My favorites |

---

## 🛠 Possible Enhancements
- Real-time inquiry notifications with Socket.io
- Cloudinary/S3 for image storage
- Map view with property location pins
- Admin panel to approve/reject listings
- Email notifications via Nodemailer

---

Built as a complete, deploy-ready MERN reference project. Happy shipping! 🚀
