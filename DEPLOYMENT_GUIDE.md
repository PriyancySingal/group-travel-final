# 🚀 Deployment Guide

Complete guide to deploy the Group Travel application to production.

## Architecture Overview

- **Backend**: Node.js/Express API deployed on Render
- **Frontend**: React/Vite SPA deployed on Vercel/Netlify
- **Database**: MongoDB Atlas (cloud)

---

## Step 1: Deploy Backend to Render

### 1.1 Create Render Account
1. Go to [render.com](https://render.com) and sign up/login
2. Connect your GitHub repository

### 1.2 Deploy Web Service
1. Click **New +** → **Web Service**
2. Select your repository
3. Configure:
   - **Name**: `group-travel-backend`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### 1.3 Set Environment Variables

In Render dashboard → Your Service → Environment:

| Variable | Value | Source |
|----------|-------|--------|
| `NODE_ENV` | `production` | - |
| `PORT` | `10000` | - |
| `MONGODB_URI` | Your MongoDB Atlas URI | MongoDB Atlas |
| `JWT_SECRET` | Random 64-char string | Generate |
| `TBO_API_URL` | `https://api.tbotechnology.in/hotelapi_v7/hotelservice.svc/hotels/available` | TBO |
| `TBO_USERNAME` | `hackathontest` | TBO |
| `TBO_PASSWORD` | `Hackathon@12345` | TBO |
| `FRONTEND_URL` | (leave empty for now) | Will update later |

**Generate JWT Secret**:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 1.4 Get MongoDB URI
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click **Connect** on your cluster
3. Choose **Drivers** → **Node.js**
4. Copy connection string, replace `<password>`

### 1.5 Deploy
Click **Create Web Service**. Wait for deployment (~2-3 minutes).

**Copy your backend URL**: `https://group-travel-backend.onrender.com`

---

## Step 2: Update Frontend Environment

### 2.1 Update `.env.production`
```env
VITE_API_URL=https://your-backend-url.onrender.com
```

Replace `your-backend-url` with the actual URL from Step 1.5.

### 2.2 Commit Changes
```bash
git add .
git commit -m "chore: update production API URL"
git push
```

---

## Step 3: Deploy Frontend to Vercel

### 3.1 Create Vercel Account
1. Go to [vercel.com](https://vercel.com) and sign up/login with GitHub

### 3.2 Import Project
1. Click **Add New...** → **Project**
2. Select your repository
3. Vercel auto-detects Vite settings

### 3.3 Configure Build
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### 3.4 Environment Variables
Add in Vercel dashboard → Settings → Environment Variables:

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://your-backend-url.onrender.com` |

### 3.5 Deploy
Click **Deploy**. Wait for build (~1-2 minutes).

**Copy your frontend URL**: `https://your-project.vercel.app`

---

## Step 4: Configure CORS (Important!)

### 4.1 Update Backend CORS
Go back to Render dashboard:

1. Add environment variable:
   - `FRONTEND_URL` = `https://your-project.vercel.app`

2. Click **Manual Deploy** → **Clear Build Cache & Deploy**

---

## Quick Deploy Commands

### Alternative: Deploy via CLI

**Backend (Render)**:
```bash
# Install render CLI
curl -fsSL https://raw.githubusercontent.com/render-oss/render-cli/main/install.sh | bash

# Deploy
render blueprint apply
```

**Frontend (Vercel)**:
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

---

## Environment Variables Reference

### Backend (Render)
```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/group-travel
JWT_SECRET=your-64-char-secret
TBO_API_URL=https://api.tbotechnology.in/hotelapi_v7/hotelservice.svc/hotels/available
TBO_USERNAME=hackathontest
TBO_PASSWORD=Hackathon@12345
FRONTEND_URL=https://your-frontend.vercel.app
```

### Frontend (Vercel/Netlify)
```env
VITE_API_URL=https://your-backend.onrender.com
```

---

## Troubleshooting

### CORS Errors
```
Access to fetch at '...' has been blocked by CORS policy
```
**Fix**: Update `FRONTEND_URL` in backend environment variables

### MongoDB Connection Failed
```
MongoNetworkError: connection timed out
```
**Fix**: 
- Whitelist Render IP in MongoDB Atlas (Security → Network Access)
- Check `MONGODB_URI` format

### 404 on API Routes
**Fix**: Ensure `render.yaml` has correct `rootDir: backend`

### Frontend Shows "API request failed"
**Fix**: Check `VITE_API_URL` is correct in frontend env vars

---

## Post-Deployment Checklist

- [ ] Backend health check passes (`/` returns HTML page)
- [ ] MongoDB connected (check Render logs)
- [ ] Frontend loads without errors
- [ ] API calls work (test login/bookings)
- [ ] CORS headers correct (check Network tab)

---

## URLs After Deployment

| Service | URL Example |
|---------|-------------|
| Backend API | `https://group-travel-backend.onrender.com` |
| Frontend App | `https://group-travel.vercel.app` |
| MongoDB | `mongodb+srv://...mongodb.net` |

---

## Support

- Render Docs: [docs.render.com](https://docs.render.com)
- Vercel Docs: [vercel.com/docs](https://vercel.com/docs)
- MongoDB Atlas: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
