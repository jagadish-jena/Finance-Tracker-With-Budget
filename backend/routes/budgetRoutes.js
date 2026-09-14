const r = require("express").Router(),
  c = require("../controllers/budgetController"),
  a = require("../middleware/authMiddleware");
r.use(a);
r.get("/", c.get);
r.post("/", c.set);
module.exports = r;
