# Run the frontend with the backend

The frontend sends authentication requests to `/api/backend/...`. Next.js proxies those requests to the backend at `http://127.0.0.1:5000` by default, so the browser and phone use the same frontend address.

## 1. Configure the backend

In PowerShell:

```powershell
cd D:\maidnannyproj\maid-nanny-service-platform\Backend
Copy-Item .env.example .env
```

Edit `Backend/.env` and set `MONGO_URI` to your MongoDB connection string. Replace `JWT_SECRET` with a long private value. Keep `.env` private and do not commit it.

Install the backend packages and start the backend:

```powershell
npm install
npm run dev
```

The backend listens on port `5000` by default.

## 2. Start the frontend

Open a second PowerShell window:

```powershell
cd D:\maidnannyproj\maid-nanny-service-platform\Frontend
npm run dev -- --hostname 0.0.0.0
```

Open `http://localhost:3000` on the computer. To open it on a phone on the same Wi-Fi, use the computer's Wi-Fi IPv4 address with port `3000`, for example `http://192.168.1.25:3000`.

If the backend runs on a different computer or port, set `BACKEND_URL` in `Frontend/.env.local` to its reachable address and restart Next.js.

Household accounts use `/api/auth/signup`. Helper accounts use `/api/auth/helper-register` and currently select either maid or nanny, as those are the helper types supported by the backend model. Both account types are signed in after successful registration. Login and the homepage use the returned JWT to fetch the user's profile.
