const ioState = require('../io');

function getStats(req, res) {
  return res.status(200).send(ioState.getStats());
}

module.exports = [getStats];