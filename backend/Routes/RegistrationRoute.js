const express = require('express');
const router = express.Router();
const Rdata = require('../models/Registartion');
const User = require('../models/signup'); // ✅ import User model
const verifyUser = require('../middleware/VerifyUser');

router.post('/registration', verifyUser, async (req, res) => {
  const userId = req.userId;
  const { firstname, lastname, number, city, state, age, gender } = req.body;

  if (age < 18) {
    return res.status(403).json({ msg: "Age must be 18 or above to register." });
  }

  try {
    const exist = await Rdata.findOne({ user: userId });
    if (exist) {
      return res.status(400).json({ msg: "This user is already registered" });
    }

    const newReg = new Rdata({
      user: userId,
      firstname,
      lastname,
      number,
      city,
      state,
      age,
      gender,
    });

    await newReg.save();

    // ✅ generate token now that registration is done
    const user = await User.findById(userId);
    const token = await user.generateToken();

    res.status(201).json({ msg: "Registration successful", token }); // ✅ return token to client
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).json({ msg: "Server error during registration" });
  }
});

module.exports = router;