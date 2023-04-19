const authController = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const salt = bcrypt.genSaltSync(10);

//register
authController.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const isExisting = await User.findOne({ email: req.body.email });
    if (isExisting) {
      throw new Error("email already exists!...");
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = await User.create({
      ...req.body,
      password: hashedPassword,
    });
    const { password, ...others } = newUser._doc;
    const token = jwt.sign(
      { id: newUser._id, isAdmin: newUser.isAdmin },
      process.env.JWT_SECRET, 
      {}
    );

    return res.status(201).json({ others, token });
  } catch (error) {
    res.status(500).json(error.message);
  }
});

// LOGIN
authController.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      throw new Error("user credentials are wrong");
    }
    const comparePass = await bcrypt.compare(req.body.password, user.password);
    if (!comparePass) {
      throw new Error("user credentials are wrong");
    }
    const { password, ...others } = user._doc;
    const token =  jwt.sign(
      { id: user._id, isAdmin: user._isAdmin },
      process.env.JWT_SECRET,
      {}
    );
    res.status(201).json({ others, token });
  } catch (error) {
    res.status(500).json(error.message);
  }
});

module.exports = authController;
