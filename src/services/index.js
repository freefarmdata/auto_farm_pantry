const route = require('express').Router();

const liveController = require('./live');
const historicController = require('./historic');
const statesController = require('./states');
const statsController = require('./stats');

route.post('/live', liveController);
route.get('/historic', historicController);
route.get('/states', statesController);
route.get('/stats', statsController);

module.exports = route;