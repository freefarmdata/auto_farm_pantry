const route = require('express').Router();
const proto = require('auto_farm_protos');

const influx = require('../clients/influx');
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

function mapToInflux(state) {
  const { version, message } = state;
  const now = Math.round(new Date().getTime() / 1000);
  const measurements = proto.mapToInflux(version, message);
  measurements.forEach((measurement) => {
    measurement.fields.ingestTime = now;
  });

  return { ...state, measurements };
}

async function sendToInflux(state) {
  const { measurements } = state;
  await influx.writePoints(measurements)

  return state;
}

route.post('/', async function(req, res) {
  const { data } = req.body;

  try {
    const state = await sendToInflux(mapToInflux(parseProto(parseBody(data))));

    // Do something with alarms!

    return res.status(200).send();
  } catch (err) {
    logger.log(err);
    return res.status(400).send();
  }
});

module.exports = route;