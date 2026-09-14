const Transaction = require("../models/Transaction");

exports.getAll = async (req, res) => {
  try {
    const filter = { userId: req.userId };
    const month = Number(req.query.month);
    const year = Number(req.query.year);

    if (month >= 1 && month <= 12 && year >= 2000) {
      const start = new Date(Date.UTC(year, month - 1, 1));
      const end = new Date(Date.UTC(year, month, 1));
      filter.date = { $gte: start, $lt: end };
    }

    res.json(await Transaction.find(filter).sort({ date: -1 }));
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.create = async (req, res) => {
  try {
    const t = await Transaction.create({ ...req.body, userId: req.userId });
    res.status(201).json(t);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

exports.update = async (req, res) => {
  try {
    const t = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true, runValidators: true },
    );
    if (!t) return res.status(404).json({ message: "Transaction not found" });
    res.json(t);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const t = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!t) return res.status(404).json({ message: "Transaction not found" });
    res.json({ message: "Deleted" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
