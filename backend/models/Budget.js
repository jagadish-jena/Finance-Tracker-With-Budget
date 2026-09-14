const mongoose = require("mongoose");
module.exports = mongoose.model(
  "Budget",
  new mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      month: { type: Number, required: true, min: 1, max: 12 },
      year: { type: Number, required: true },
      amount: { type: Number, required: true, min: 0 },
    },
    { timestamps: true },
  ),
);
