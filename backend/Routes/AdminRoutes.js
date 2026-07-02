const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { verifyUser, requireRole } = require('../middleware/VerifyUser');
const User = require('../models/signup');
const Problem = require('../models/problem');
const Registration = require('../models/Registartion');
const {
  MAX_GOVT_EMPLOYEES_PER_CITY,
  canAddGovtEmployeeToCity,
} = require('../utils/govtEmployeeLimit');

router.get('/admin/users', verifyUser, requireRole('admin'), async (req, res) => {
  try {
    const users = await User.find({}, 'username email role createdAt').lean();
    const registrations = await Registration.find({}, 'user city state').lean();
    const cityByUser = {};
    registrations.forEach((reg) => {
      cityByUser[reg.user.toString()] = { city: reg.city, state: reg.state };
    });

    const result = users.map((user) => ({
      ...user,
      city: cityByUser[user._id.toString()]?.city || '—',
      state: cityByUser[user._id.toString()]?.state || '—',
    }));

    res.json(result);
  } catch (err) {
    console.error('❌ Admin users fetch error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.patch('/admin/users/:id/role', verifyUser, requireRole('admin'), async (req, res) => {
  try {
    const { role } = req.body;
    const allowedRoles = ['user', 'admin', 'mla', 'govt_employee'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ msg: 'Invalid role' });
    }

    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (role === 'govt_employee' && targetUser.role !== 'govt_employee') {
      const registration = await Registration.findOne({ user: targetUser._id });
      if (!registration?.city) {
        return res.status(400).json({
          msg: 'User must complete registration with a city before becoming a government employee.',
        });
      }

      const quota = await canAddGovtEmployeeToCity(registration.city, targetUser._id);
      if (!quota.available) {
        return res.status(403).json({
          msg: `${registration.city} already has ${MAX_GOVT_EMPLOYEES_PER_CITY} government employees.`,
        });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, select: 'username email role createdAt' }
    );

    res.json(user);
  } catch (err) {
    console.error('❌ Admin role update error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.delete('/admin/users/:id', verifyUser, requireRole('admin'), async (req, res) => {
  try {
    const targetId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(targetId)) {
      return res.status(400).json({ msg: 'Invalid user id' });
    }

    if (targetId.toString() === req.userId?.toString()) {
      return res.status(403).json({ msg: 'You cannot delete your own admin account.' });
    }

    const user = await User.findById(targetId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    await Registration.deleteOne({ user: targetId });
    await Problem.deleteMany({ PostedBy: targetId });
    await User.findByIdAndDelete(targetId);

    res.json({ msg: 'User deleted successfully' });
  } catch (err) {
    console.error('❌ Admin user delete error:', err);
    res.status(500).json({ msg: 'Server error while deleting user', error: err.message });
  }
});

router.get('/admin/stats', verifyUser, requireRole('admin'), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProblems = await Problem.countDocuments();
    const pending = await Problem.countDocuments({ status: 'Pending' });
    const inProgress = await Problem.countDocuments({ status: 'In Progress' });
    const resolved = await Problem.countDocuments({ status: 'Resolved' });
    const rejected = await Problem.countDocuments({ status: 'Rejected' });

    res.json({
      totalUsers,
      totalProblems,
      pending,
      inProgress,
      resolved,
      rejected
    });
  } catch (err) {
    console.error('❌ Admin stats fetch error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
