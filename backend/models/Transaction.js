const mongoose = require("mongoose");
module.exports = mongoose.model(
  "Transaction",
  new mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      type: { type: String, enum: ["income", "expense"], required: true },
      amount: { type: Number, required: true, min: 0 },
      category: { type: String, required: true },
      description: { type: String, default: "" },
      date: { type: Date, default: Date.now },
    },
    { timestamps: true },
  ),
);
