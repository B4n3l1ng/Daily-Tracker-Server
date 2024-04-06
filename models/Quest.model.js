const { Schema, model } = require('mongoose');

const questSchema = new Schema({
  name: { type: String, required: true },
  minimumLevel: { type: Number, required: true },
  startingNPC: { type: String, required: true },
  requirements: { type: String, default: '' },
  isComplete: { type: Boolean, default: false },
});

const Quest = model('Quest', questSchema);

module.exports = Quest;
