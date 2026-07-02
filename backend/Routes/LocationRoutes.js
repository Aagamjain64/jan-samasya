const express = require('express');
const router = express.Router();
const {
  getIndianStates,
  getCitiesByState,
} = require('../utils/locationHelper');
const { canAddGovtEmployeeToCity } = require('../utils/govtEmployeeLimit');

router.get('/states', (req, res) => {
  try {
    const states = getIndianStates();
    res.json(states);
  } catch (err) {
    console.error('❌ States fetch error:', err);
    res.status(500).json({ msg: 'Failed to fetch states' });
  }
});

router.get('/cities', (req, res) => {
  try {
    const { state } = req.query;
    if (!state) {
      return res.status(400).json({ msg: 'State query parameter is required' });
    }

    const cities = getCitiesByState(state);
    if (!cities) {
      return res.status(404).json({ msg: 'Invalid state' });
    }

    res.json(cities);
  } catch (err) {
    console.error('❌ Cities fetch error:', err);
    res.status(500).json({ msg: 'Failed to fetch cities' });
  }
});

router.get('/govt-employee-count', async (req, res) => {
  try {
    const { city } = req.query;
    if (!city) {
      return res.status(400).json({ msg: 'City query parameter is required' });
    }

    const result = await canAddGovtEmployeeToCity(city);
    res.json(result);
  } catch (err) {
    console.error('❌ Govt employee count error:', err);
    res.status(500).json({ msg: 'Failed to fetch government employee count' });
  }
});

module.exports = router;
