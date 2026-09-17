# Personal Finance Tracker

A full-stack personal finance tracker for managing monthly income, expenses, and budgets. The app helps users track spending, monitor budget usage, and stay on top of their financial goals.

## Live Demo

[Open the deployed app](https://finance-tracker-with-budget.vercel.app/login)

## Tech Stack

### Frontend
- Next.js 14
- React 18
- Tailwind CSS
- JavaScript / JSX

### Backend
- Node.js
- Express.js
- JWT for authentication
- bcryptjs for password hashing
- Cookie-based refresh token handling

### Database
- MongoDB
- Mongoose ODM

### Tools & Patterns
- REST API architecture
- Environment-based configuration
- Responsive UI design
- Secure auth flow with access and refresh tokens

## Features

- Register and login
- JWT access token + refresh token authentication
- Refresh token stored in an HTTP-only cookie
- Access token stored only in frontend memory
- Automatic access-token refresh
- Add, edit and delete transactions
- Separate income and expense categories
- Month and year selection
- Month-wise income, expenses and balance
- Separate budget for every month
- Budget usage and remaining amount
- Responsive Tailwind CSS UI
- No separate `middleware.js` file
- Backend uses ES modules (`import` / `export`)
- Mongoose schemas are created first and converted to models at the end

## Project structure

```text
finance-tracker/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── budgetController.js
│   │   └── transactionController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Transaction.js
│   │   └── Budget.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── budgetRoutes.js
│   │   └── transactionRoutes.js
│   ├── utils/
│   │   └── auth.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── app/
    │   ├── (auth)/
    │   │   ├── login/page.jsx
    │   │   └── register/page.jsx
    │   ├── dashboard/page.jsx
    │   ├── transactions/page.jsx
    │   ├── budget/page.jsx
    │   ├── globals.css
    │   ├── layout.js
    │   └── page.js
    ├── components/
    │   ├── Navbar.jsx
    │   ├── Sidebar.jsx
    │   └── Shell.jsx
    ├── lib/
    │   └── api.js
    ├── .env.local.example
    ├── package.json
    ├── postcss.config.js
    └── tailwind.config.js
```

## Backend setup

Open a terminal:

```bash
cd finance-tracker/backend
npm install
```

Create `.env` from `.env.example`.

Windows CMD:

```bash
copy .env.example .env
```

Then configure `.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/finance_tracker
FRONTEND_URL=http://localhost:3000
ACCESS_TOKEN_SECRET=change_this_access_secret
REFRESH_TOKEN_SECRET=change_this_refresh_secret
NODE_ENV=development
```

Start the backend:

```bash
npm run dev
```

You should see:

```text
MongoDB connected
Server running on 5000
```

Test the API:

```text
http://localhost:5000/api/health
```

## Frontend setup

Open a second terminal:

```bash
cd finance-tracker/frontend
npm install
```

Create `.env.local` from `.env.local.example`.

Windows CMD:

```bash
copy .env.local.example .env.local
```

The file should contain:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start Next.js:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Authentication design

The project uses two JWTs:

1. **Access token** — short-lived (15 minutes), stored only in a JavaScript variable in `frontend/lib/api.js`.
2. **Refresh token** — long-lived (7 days), stored by the browser in an HTTP-only cookie.

The refresh token is not accessible through JavaScript.

When an API request receives a 401 response, the frontend calls:

```text
POST /api/auth/refresh
```

The backend reads the refresh-token cookie and returns a new access token. The access token is then kept in memory.

The frontend does **not** put the access token in `localStorage`.

## API endpoints

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
```

### Transactions

```text
GET    /api/transactions?month=9&year=2026
POST   /api/transactions
PUT    /api/transactions/:id
DELETE /api/transactions/:id
```

### Budget

```text
GET  /api/budget?month=9&year=2026
POST /api/budget
```

## Monthly tracking

If September 2026 is selected, the frontend requests:

```text
GET /api/transactions?month=9&year=2026
GET /api/budget?month=9&year=2026
```

Only September's transactions and September's budget are used.

October has its own budget and transactions.

## Income categories

- Salary
- Freelance
- Business
- Investment
- Bonus
- Other

## Expense categories

- Food
- Transport
- Shopping
- Bills
- Entertainment
- Health
- Education
- Other
