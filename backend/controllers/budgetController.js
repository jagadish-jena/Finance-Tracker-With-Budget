const Budget = require("../models/Budget");

function selectedPeriod(req) {
  const now = new Date();
  const month = Number(req.query.month || req.body.month || now.getMonth() + 1);
  const year = Number(req.query.year || req.body.year || now.getFullYear());
  return {
    month: month >= 1 && month <= 12 ? month : now.getMonth() + 1,
    year: year >= 2000 ? year : now.getFullYear(),
  };
}

exports.get = async (req, res) => {
  try {
    const { month, year } = selectedPeriod(req);
    const b = await Budget.findOne({ userId: req.userId, month, year });
    res.json(b || { amount: 0, month, year });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.set = async (req, res) => {
  try {
    const { month, year } = selectedPeriod(req);
    const b = await Budget.findOneAndUpdate(
      { userId: req.userId, month, year },
      { amount: req.body.amount, month, year, userId: req.userId },
      { new: true, upsert: true, runValidators: true },
    );
    res.json(b);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
