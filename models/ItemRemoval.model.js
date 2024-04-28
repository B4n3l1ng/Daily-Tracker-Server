const { Schema, model } = require('mongoose');

const removalSchema = new Schema({
  itemType: {
    type: String,
    enum: ['Charm Part', 'Cosmetic', 'Equipment', 'Pet', 'Consumables/Miscleaneous'],
    required: true,
    default: 'Consumables/Miscleaneous',
  },
  itemFaction: {
    type: String,
    enum: ['Jadeon', 'Skysong', 'Mage', 'Vim', 'Lupin', 'Modo', 'Arden', 'Balo', 'Rayan', 'Celan', 'Forta', 'Voida'],
  },
  itemCharmPartType: {
    type: String,
    enum: ['Water', 'Fire', 'Wood', 'Metal', 'Earth'],
  },
  itemName: { type: String, required: true, trim: true },
  quantityRemoved: { type: Number, min: 1, required: true },
  givenTo: { type: String, required: true },
  removedBy: { type: Schema.Types.ObjectId, ref: 'User' },
});

const RemoveItem = model('RemoveItem', removalSchema);

module.exports = RemoveItem;
