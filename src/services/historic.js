const route = require('express').Router();

route.post('/', function(req, res) {
  const { data, type } = req.body;

  return res.status(200).send();
});

module.exports = route;