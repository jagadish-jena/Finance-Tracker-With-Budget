const r = require("express").Router(),
  c = require("../controllers/transactionController"),
  a = require("../middleware/authMiddleware");
r.use(a);
r.get("/", c.getAll);
r.post("/", c.create);
r.put("/:id", c.update);
r.delete("/:id", c.remove);
module.exports = r;
