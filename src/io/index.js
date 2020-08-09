const state = {
  states: {},
  stats: {
    totalHealthy: 0,
    totalAlarms: 0,
    totalFarms: 0,
    totalDry: 0,
    ingestRates: []
  }
}

function getStates() {
  return state.states;
}

function setState(id, { software, message }) {
  const data = { id, software, message };
  state.states[id] = data;

  // emits to the specific farms room
  global.io.to(id).emit('state', JSON.stringify(data));
}

function getStats() {
  return state.stats;
}

function setStat(key, value) {
  state.stats[key] = value;
}

function initialize() {
  const stats = require('./stats');
  stats.startInterval();
}

module.exports = {
  setState,
  getStates,
  setStat,
  getStats,
  initialize,
}