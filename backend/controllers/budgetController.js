import Budget from '../models/Budget.js';

const getPeriod = (req) => {
  const now = new Date();
  const month = Number(req.query.month ?? req.body.month ?? now.getMonth() + 1);
  const year = Number(req.query.year ?? req.body.year ?? now.getFullYear());

  return {
    month: month >= 1 && month <= 12 ? month : now.getMonth() + 1,
    year: year >= 2000 ? year : now.getFullYear()
  };
};

export const getBudget = async (req, res) => {
  try {
    const { month, year } = getPeriod(req);
    const budget = await Budget.findOne({ userId: req.userId, month, year });
    return res.json(budget || { amount: 0, month, year });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const saveBudget = async (req, res) => {
  try {
    const { month, year } = getPeriod(req);
    const amount = Number(req.body.amount);

    if (Number.isNaN(amount) || amount < 0) {
      return res.status(400).json({ message: 'Budget must be a valid positive number' });
    }

    const budget = await Budget.findOneAndUpdate(
      { userId: req.userId, month, year },
      { userId: req.userId, month, year, amount },
      { new: true, upsert: true, runValidators: true }
    );

    return res.json(budget);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
