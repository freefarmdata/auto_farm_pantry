const proto = require('auto_farm_protos');

const influx = require('../clients/influx');
const logger = require('../util/logger');
const ioState = require('../io');

function buildState(req, res, next) {
  const { data } = req.body;

  req.state = {
    data: data,
    states: [],
  }

  return next();
}

function parseBody(req, res, next) {
  const { data } = req.state;

  data.forEach((bytes) => {
    const package = bytes.data;

    const software = Buffer.from(package.slice(0, 4)).readInt32LE();
    const version = Buffer.from(package.slice(4, 8)).readInt32LE();
    const id = Buffer.from(package.slice(8, 24)).toString();
    const length = Buffer.from(package.slice(24, 28)).readInt32LE();
    const buffer = Buffer.from(package.slice(28, length+28));

    const message = proto.readState(version, buffer);
    const measurements = proto.mapToInflux(version, message);

    const state = {
      id,
      software,
      version,
      message,
      measurements
    };
    
    req.state.states.push(state);
  });

  res.status(200).end();

  return next();
}

function setIOState(req, res, next) {
  const { states } = req.state;

  if (states.length) {
    const { message, version, id } = states[states.length-1];

    const now = Date.now();
    message.ingestTime = now;

    ioState.setState(id, {
      version,
      message
    });
  }

  return next();
}

async function sendToInflux(req) {
  const { states } = req.state;

  await Promise.all(states.map(({ measurements }) => influx.writePoints(measurements)));
}

module.exports = [buildState, parseBody, setIOState, sendToInflux];