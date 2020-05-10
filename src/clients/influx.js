const Influx = require('influx')
const config = require('config');

const connection = `http://${config.get('INFLUX_HOST')}:${config.get('INFLUX_PORT')}/${config.get('INFLUX_DB')}`
const client = new Influx.InfluxDB(connection);

module.exports = client;