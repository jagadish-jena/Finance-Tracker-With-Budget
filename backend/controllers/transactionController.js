import Transaction from '../models/Transaction.js';

export const getTransactions = async (req, res) => {
  try {
    const filter = { userId: req.userId };
    const month = Number(req.query.month);
    const year = Number(req.query.year);

    if (month >= 1 && month <= 12 && year >= 2000) {
      const start = new Date(Date.UTC(year, month - 1, 1));
      const end = new Date(Date.UTC(year, month, 1));
      filter.date = { $gte: start, $lt: end };
    }

    const transactions = await Transaction.find(filter).sort({ date: -1 });
    return res.json(transactions);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createTransaction = async (req, res) => {
  try {
    const { type, amount, category, description, date } = req.body;
    const transaction = await Transaction.create({
      userId: req.userId,
      type,
      amount,
      category,
      description,
      date
    });

    return res.status(201).json(transaction);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    return res.json(transaction);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    return res.json({ message: 'Transaction deleted' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
