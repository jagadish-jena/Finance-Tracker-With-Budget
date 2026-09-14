const bcrypt = require("bcryptjs"),
  jwt = require("jsonwebtoken"),
  User = require("../models/User");
const token = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });
    if (await User.findOne({ email }))
      return res.status(400).json({ message: "Email already registered" });
    const user = await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 10),
    });
    res
      .status(201)
      .json({
        token: token(user._id),
        user: { id: user._id, name: user.name, email: user.email },
      });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body,
      user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(400).json({ message: "Invalid email or password" });
    res.json({
      token: token(user._id),
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
