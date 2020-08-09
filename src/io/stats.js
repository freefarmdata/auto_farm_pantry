const ioState = require('./index');

function startInterval() {
  setInterval(() => {
    calculateIngestionDelay();
    calculateTotalFarms();
    calculateTotalHealthy();
    calculateTotalAlarms();
    calculateDryFarms();
    global.io.emit('stats', ioState.getStats());
  }, 5000);
}

function calculateIngestionDelay() {
  const states = ioState.getStates();
  const ingestRates = Object.keys(states)
    .map((id) => {
      const { message } = states[id];
      return message.ingestTime - message.status.piStats.time;
    });
  
  ioState.setStat('ingestRates', ingestRates);
}

function calculateTotalFarms() {
  const states = ioState.getStates();
  const total = Object.keys(states).length;

  ioState.setStat('totalFarms', total);
}

function calculateTotalHealthy() {
  const states = ioState.getStates();
  const THIRTY_SECONDS = 30000;
  const now = Date.now();
  const totalHealthy = Object.keys(states)
    .filter((id) => now - states[id].message.ingestTime < THIRTY_SECONDS)
    .length;

  ioState.setStat('totalHealthy', totalHealthy);
}

function calculateTotalAlarms() {
  const states = ioState.getStates();
  const totalAlarms = Object.keys(states)
    .reduce((total, id) => {
      total += states[id].message.status.alarms.length;
      return total;
    }, 0);

  ioState.setStat('totalAlarms', totalAlarms);
}

function calculateDryFarms() {
  const states = ioState.getStates();

  const dry = Object.keys(states).filter((id) => {
    const sensors = states[id].message.status.currentSoil;

    const dry = sensors.filter((sensor) => {
      const { median, standardDev, reading } = sensor;
      return reading <= median-(standardDev*4)
    });

    return dry.length / sensors.length >= 0.75;
  });

  ioState.setStat('totalDry', dry.length);
}

module.exports = {
  startInterval
}