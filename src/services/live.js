const route = require('express').Router();
const proto = require('auto_farm_protos');

const logger = require('../util/logger');

route.post('/', function(req, res) {
  const { data } = req.body;

  const headers = Buffer.from(data.data.slice(0, 8));
  const buffer = Buffer.from(data.data.slice(8, data.data.length));
  const software = Buffer.from(headers.slice(0, 4)).readInt32LE();
  const version = Buffer.from(headers.slice(4, 8)).readInt32LE();

  logger.log(`Incoming Data Version: ${software}.${version}`, buffer.length);

  try {
    const state = proto.readState(version, buffer);

    logger.log(state);

    return res.status(200).send();
  } catch (err) {
    logger.log(err);
    return res.status(400).send();
  }
});

module.exports = route;