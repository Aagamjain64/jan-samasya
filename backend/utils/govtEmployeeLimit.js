const User = require('../models/signup');
const Registration = require('../models/Registartion');

const MAX_GOVT_EMPLOYEES_PER_CITY = 5;

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function countGovtEmployeesInCity(city, excludeUserId = null) {
  if (!city) return 0;

  const cityRegex = new RegExp(`^${escapeRegex(city.trim())}$`, 'i');
  const govtUsers = await User.find({ role: 'govt_employee' }).select('_id').lean();
  let userIds = govtUsers.map((u) => u._id);

  if (excludeUserId) {
    userIds = userIds.filter((id) => id.toString() !== excludeUserId.toString());
  }

  if (userIds.length === 0) return 0;

  return Registration.countDocuments({
    user: { $in: userIds },
    city: { $regex: cityRegex },
  });
}

async function canAddGovtEmployeeToCity(city, excludeUserId = null) {
  const count = await countGovtEmployeesInCity(city, excludeUserId);
  return {
    count,
    max: MAX_GOVT_EMPLOYEES_PER_CITY,
    available: count < MAX_GOVT_EMPLOYEES_PER_CITY,
  };
}

module.exports = {
  MAX_GOVT_EMPLOYEES_PER_CITY,
  countGovtEmployeesInCity,
  canAddGovtEmployeeToCity,
};
