const express = require("express");
const router = express.Router();
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const Player = require('../models/Player.js');

let allInvited;

const checkPlayerIsInvited = (req, res, next) => {
  const wereYouInvited = (phoneNum, invitedArr) => {
    let isInvited = false;
    if (invitedArr.length > 0) {
      for (let i in invitedArr) {
        if (invitedArr[i] === phoneNum) {
          isInvited = true;
        }
      }
    }
    return isInvited;
  }
  // can change the req here.
  if (!req.body.temp) {
    console.log("Message incoming...");
      if (!allInvited) {
        console.log('No one was invited yet!');
        console.log(req.body.From + " : " + req.body.Body);
      } else {
        console.log('Checking if player was invited...');
        req.body.inviteRes = wereYouInvited(req.body.From.substring(2), allInvited);
        next();
      }
  } else {
    allInvited = req.body.temp.map(player => player.value);
    console.log("The invited players are: ");
    console.log(allInvited);
  }
};

function updateInvite(phoneNum, acceptBoolean) {
  Player.findOneAndUpdate(
    { value: phoneNum },
    { $set: { acceptedInvite: acceptBoolean } },
   )
    .then(players => {

      console.log('Updated ' + players['value'] + '\'s acceptedInvite status to ' + acceptBoolean + '.');

    })
}

router.post('/', checkPlayerIsInvited, (req, res) => {
  var twiml = new MessagingResponse();
  if (!req.body.inviteRes) {
    console.log("This player was not invited: ");
    console.log(req.body.From + " : " + req.body.Body);
    twiml.message('You were not invited to this game. Please see host.');
  } else {
    console.log("This player was invited: ");
    console.log(req.body.From + " : " + req.body.Body);
    requestedIncomingTxtMsg = req.body.Body.toUpperCase().replace(/\s+|\./g, '');
  if (requestedIncomingTxtMsg == 'JOIN') {
      twiml.message('You have accepted the game invitation and will be dealt a card this round.');
      updateInvite(req.body.From.substring(2), true);
    } else if (requestedIncomingTxtMsg == 'NOPE') {
      twiml.message('You have rejected the game invitation and will not be dealt a card this round. Text \'JOIN\' if you change your mind!');
      updateInvite(req.body.From.substring(2), false);
  } else if (requestedIncomingTxtMsg == 'SLEEP') {
      twiml.message('You went to sleep...')
    } else {
      twiml.message('Your response was invalid. Re-read and try again.');
    }
  }
  res.writeHead(200, {'Content-Type': 'text/xml'});
    res.status(200);
    res.end(twiml.toString());
});

module.exports = router;
