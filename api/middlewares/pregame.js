const express = require('express');
const router = express.Router();
require('dotenv').config();
const Promises = require('es6-promise').Promise;
const Player = require('../models/Player.js');
const client = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

router.post('/', function(req, res, next) {
  const players = req.body.temp.filter(player =>
    typeof player["value"] === 'string' &&
    /^\d+$/.test(player["value"]) === true &&
    player["isDisabled"] === false &&
    player['value'].length === 10);
    let playersNums = players.map(player => player.value);

    if (players.length < 3 || players.length > 12) {
      console.log("3-12 players are required.")
      res.send({"error" : "Need 3-12 players enabled with 10-digit phone numbers."});
      res.status(500);
    } else if (playersNums.length !== new Set(playersNums).size) {
      console.log("There was a duplicate phone number.")
      res.send({"error" : "There was a duplicate phone number entry."});
      res.status(500);
    } else {
      const promises = players.map(player => new Player(player).save());
      Promises.all(promises);
      res.send({ "success" : "Players successfully entered.",
    "playersstatuses" : players});
      console.log({ "promises":promises.length, "players":players.length});
      next();
    }
});

router.post('/', function(req, res, next) {
  // note that temp is filled even in error.
  // this incidently updates players even if its just 1-2 players...
  console.log('Sending invites...')
  req.body.temp.map(player =>
    client.messages.create({
        to: player.value,
        from: process.env.TWILIO_NUMBER,
        body: "Hello there! Text 'JOIN' to join or 'NOPE' to reject",
    })
  )
  next();
});

module.exports = router;
