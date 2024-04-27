const { Schema, model } = require('mongoose');

const characterSchema = new Schema({
  name: { type: String, required: true, trim: true },
  level: { type: Number, required: true },
  availableQuests: [
    {
      name: { type: String, required: true },
      minimumLevel: { type: Number, required: true },
      startingNPC: { type: String, required: true },
      requirements: { type: String, default: '' },
      isComplete: { type: Boolean, default: false },
      uid: { type: String, required: true },
    },
  ],
  player: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  isAscended: { type: Boolean, default: false },
});

const Character = model('Character', characterSchema);

module.exports = Character;
