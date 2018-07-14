const express = require('express');
const router = express.Router();
const Player = require('../models/Player.js');

/* GET players listing. */
router.get('/', function(req, res, next) {
  Player.find({})
  .then(players => {
    res.json(players);
  });
});

module.exports = router;
