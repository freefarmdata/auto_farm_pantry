global.__basedir = __dirname;

const express = require('express');
const http = require('http');
const cors = require('cors');
const compression = require('compression');
const config = require('config');
const socketio = require('socket.io');
const protos = require('auto_farm_protos');
const ioState = require('./io');
const services = require('./services');

protos.initialize();

const app = express();
const server = http.createServer(app);
const io = socketio(server);

global.io = io;

// debug
// ioState.setState('1234', { 
//   software: 1, 
//   message: { 
//     ...require('../sample.json'), 
//     ingestTime: Date.now()
//   } 
// });

ioState.initialize();

app.use(cors({ origin: '*' }));
app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '1mb' }));

app.use('/api', services);

io.on('connection', (client) => {
  client.emit('stats', ioState.getStats());
});

server.listen(config.get('PORT'), () => console.log('auto farm pantry booted'));