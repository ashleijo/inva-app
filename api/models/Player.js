const mongoose = require("mongoose");

mongoose.models = {};
mongoose.modelSchemas = {};
mongoose.Promise = Promise;

mongoose
  .connect("mongodb://localhost/PlayerBooker")
  .then(conn => {
    console.log("Successfully connected to MongoDB!");
  })
  .catch(err => {
    console.log("Database connection failed....");
});

const PlayerSchema = new mongoose.Schema({
  value: {
    type: String,
    unique: true
  },
  acceptedInvite: {
    type: Boolean,
    default: false
  },
  card: {
    type: String,
    default: null
  },
  ready: {
    type: Boolean,
    default: false
  }
});

const PlayerModel = mongoose.model("Player", PlayerSchema);

PlayerModel.updateMany(
  { acceptedInvite: true },
  { $set: { acceptedInvite : false } }
)
.then(players => {
  console.log("Default values were set to false.");
})

module.exports = PlayerModel;
