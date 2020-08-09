const ioState = require('../io');

function getStateList(req, res) {
  const states = ioState.getStates();
  res.status(200).send(Object.keys(states).map((id) => states[id]));
}

module.exports = [getStateList];