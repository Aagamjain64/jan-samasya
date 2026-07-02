const { State, City } = require('country-state-city');

const INDIA_CODE = 'IN';

function getIndianStates() {
  return State.getStatesOfCountry(INDIA_CODE)
    .map((s) => ({ name: s.name, isoCode: s.isoCode }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function findState(stateNameOrCode) {
  const states = State.getStatesOfCountry(INDIA_CODE);
  return states.find(
    (s) =>
      s.name.toLowerCase() === String(stateNameOrCode).toLowerCase() ||
      s.isoCode.toLowerCase() === String(stateNameOrCode).toLowerCase()
  );
}

function getCitiesByState(stateNameOrCode) {
  const state = findState(stateNameOrCode);
  if (!state) return null;

  return City.getCitiesOfState(INDIA_CODE, state.isoCode)
    .map((c) => c.name)
    .sort((a, b) => a.localeCompare(b));
}

function getCanonicalStateName(stateName) {
  return findState(stateName)?.name || null;
}

function getCanonicalCityName(cityName, stateName) {
  const cities = getCitiesByState(stateName);
  if (!cities) return null;
  return cities.find((c) => c.toLowerCase() === String(cityName).toLowerCase()) || null;
}

function isValidStateCityPair(stateName, cityName) {
  return Boolean(getCanonicalCityName(cityName, stateName));
}

module.exports = {
  getIndianStates,  
  getCitiesByState,
  getCanonicalStateName,
  getCanonicalCityName,
  isValidStateCityPair,
};
