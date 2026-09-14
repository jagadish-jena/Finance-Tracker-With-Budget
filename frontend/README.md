# Personal Finance Tracker - Next.js + Tailwind CSS

Simple monthly personal finance tracker built with Next.js, React, Express, MongoDB and Tailwind CSS.

## Frontend

```bash
cd frontend
npm install
copy .env.local.example .env.local
npm run dev
```

PowerShell alternative:

```powershell
Copy-Item .env.local.example .env.local
```

## Backend

Create `backend/.env`:

```env
MONGO_URI=mongodb://127.0.0.1:27017/finance_tracker
JWT_SECRET=my_finance_tracker_secret
PORT=5000
```

Then:

```bash
cd backend
npm install
npm run dev
```

## Tailwind CSS

The frontend uses Tailwind CSS utility classes. There is no custom component/layout styling in `globals.css`; it only contains the Tailwind directives needed by the build.

## Features

- Register/login/logout with JWT
- Month and year selection
- Month-wise income, expenses and balance
- Month-wise budgets
- Add/edit/delete transactions
- Separate income and expense categories
- Responsive desktop/tablet/mobile UI
