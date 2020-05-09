global.__basedir = __dirname;

const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const config = require('config');
const protos = require('auto_farm_protos');
const services = require('./services');

const port = config.get('PORT');
const app = express();

protos.initialize();

app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '1mb' }));

app.use('/live', services.live);
app.use('/historic', services.historic);

app.listen(port, () => console.log('Server started on port: ' + port));