# Find Your Team local setup

This app runs as a separate local server on `http://localhost:3001`.

## 1. Install dependencies

```powershell
npm install
```

## 2. Create local env

Copy `.env.example` to `.env.local` and set a real PostgreSQL connection string.

## 3. Run Prisma setup

```powershell
npx prisma generate
npx prisma db push
```

## 4. Start the app

```powershell
npm run dev
```

Then open `http://localhost:3001`.
