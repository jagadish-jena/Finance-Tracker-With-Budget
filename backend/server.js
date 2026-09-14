require("dotenv").config();
const express = require("express"),
  cors = require("cors"),
  connectDB = require("./config/db");
const app = express();
app.use(cors());
app.use(express.json());
app.get("/api/health", (req, res) => res.json({ message: "API running" }));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/transactions", require("./routes/transactionRoutes"));
app.use("/api/budget", require("./routes/budgetRoutes"));
const PORT = process.env.PORT || 5000;
connectDB()
  .then(() => app.listen(PORT, () => console.log(`Server running on ${PORT}`)))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
