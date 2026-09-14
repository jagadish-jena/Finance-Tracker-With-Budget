# Finance Tracker with Budget Management

A full-stack personal finance tracker built to help users manage income, expenses, and monthly budgets in one place. The project combines a modern Next.js frontend with a Node.js/Express backend and MongoDB database for secure, scalable personal finance management.

## Tech Stack

- Frontend: Next.js, React, Tailwind CSS
- Backend: Node.js, Express.js
- Database: MongoDB, Mongoose
- Authentication: JWT + bcryptjs
- Styling: Tailwind CSS
- Development Tools: Nodemon, PostCSS, Autoprefixer

## Features

- User registration and login with secure JWT authentication
- Add, update, and delete financial transactions
- Support for income and expense tracking
- Predefined categories for both income and expenses
- Monthly and yearly transaction filtering
- Monthly budget creation and budget tracking
- Dashboard summary for income, expenses, remaining balance, and budget usage
- Responsive and clean user interface for desktop and mobile devices
- Simple and lightweight finance management workflow

## Project Structure

```bash
finance-tracker/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
├── README.md
└── package.json
```

## Prerequisites

Before running the project, make sure you have the following installed:

- Node.js (v18 or newer recommended)
- npm
- MongoDB running locally or a MongoDB Atlas connection

## Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder and add the following variables:

```env
MONGO_URI=mongodb://localhost:27017/finance-tracker
JWT_SECRET=your_super_secret_key
PORT=5000
```

Then start the backend:

```bash
npm run dev
```

The backend API will run on:

```bash
http://localhost:5000
```

## Frontend Setup

```bash
cd frontend
npm install
```

Start the Next.js frontend:

```bash
npm run dev
```

Open the app in your browser:

```bash
http://localhost:3000
```

## Application Workflow

1. Register a new account or log in.
2. Add income or expense entries with category and amount.
3. Filter transactions by month and year.
4. Create a budget for the selected month.
5. Monitor spending and remaining balance from the dashboard.

## Notes

- This app is designed for personal budgeting and simple household finance management.
- MongoDB must be running before starting the backend server.
- The project uses environment variables to keep sensitive data such as database credentials and JWT secrets secure.

## License

This project is intended for personal or educational use.
