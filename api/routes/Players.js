const express = require("express");
const PreGameResponses = require('../middlewares/pregame.js')
const MResponses = require('./MResponses.js')
const PlayersRouter = express.Router();
// POSTMAN BODY EXAMPLE: { "temp": [{"value": 2224445555}] }

PlayersRouter.use("/", PreGameResponses);
PlayersRouter.use("/", MResponses);

PlayersRouter.post("/", function(req, res) {
  res.status(200);
});

module.exports = PlayersRouter;
