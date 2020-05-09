const route = require('express').Router();
const proto = require('auto_farm_protos');

const logger = require('../util/logger');

function parseBody(data) {
  const headers = Buffer.from(data.data.slice(0, 8));
  const buffer = Buffer.from(data.data.slice(8, data.data.length));

  const software = headers.slice(0, 4).readInt32LE();
  const version = headers.slice(4, 8).readInt32LE();

  return { buffer, software, version };
}

function parseProto(state) {
  const { version, buffer } = state;

  const message = proto.readState(version, buffer);

  logger.log(`Proto State: `, JSON.stringify(message));

  return { ...state, message };
}

route.post('/', function(req, res) {
  const { data } = req.body;

  try {
    const state = parseProto(parseBody(data));
    return res.status(200).send();
  } catch (err) {
    logger.log(err);
    return res.status(400).send();
  }
});

module.exports = route;