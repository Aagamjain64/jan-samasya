const express = require('express');
const router = express.Router();
const Rdata = require('../models/Registartion');
const User = require('../models/signup'); // ✅ import User model
const { verifyUser } = require('../middleware/VerifyUser');
const {
  getCanonicalStateName,
  getCanonicalCityName,
  isValidStateCityPair,
} = require('../utils/locationHelper');
const {
  MAX_GOVT_EMPLOYEES_PER_CITY,
  canAddGovtEmployeeToCity,
} = require('../utils/govtEmployeeLimit');

router.post('/registration', verifyUser, async (req, res) => {
  const userId = req.userId;
  const { firstname, lastname, number, city, state, age, gender } = req.body;

  if (age < 18) {
    return res.status(403).json({ msg: "Age must be 18 or above to register." });
  }

  if (!state || !city) {
    return res.status(400).json({ msg: 'Please select both state and city.' });
  }

  if (!isValidStateCityPair(state, city)) {
    return res.status(400).json({ msg: 'Invalid state and city combination.' });
  }

  const canonicalState = getCanonicalStateName(state);
  const canonicalCity = getCanonicalCityName(city, state);

  try {
    const exist = await Rdata.findOne({ user: userId });
    if (exist) {
      return res.status(400).json({ msg: "This user is already registered" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (user.role === 'govt_employee') {
      const quota = await canAddGovtEmployeeToCity(canonicalCity);
      if (!quota.available) {
        return res.status(403).json({
          msg: `This city already has ${MAX_GOVT_EMPLOYEES_PER_CITY} government employees. Please choose another city.`,
        });
      }
    }

    const newReg = new Rdata({
      user: userId,
      firstname,
      lastname,
      number,
      city: canonicalCity,
      state: canonicalState,
      age,
      gender,
    });

    await newReg.save();

    // ✅ generate token now that registration is done
    const token = await user.generateToken();

    res.status(201).json({ msg: "Registration successful", token }); // ✅ return token to client
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).json({ msg: "Server error during registration" });
  }
});

module.exports = router;