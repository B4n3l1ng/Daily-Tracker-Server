const { Schema, model } = require('mongoose');

const itemSchema = new Schema({
  type: {
    type: String,
    enum: ['Charm Part', 'Cosmetic', 'Equipment', 'Pet', 'Consumables/Miscleaneous'],
    required: true,
    default: 'Consumables/Miscleaneous',
  },
  faction: { type: String, enum: ['Jadeon', 'Skysong', 'Mage', 'Vim', 'Lupin', 'Modo', 'Arden', 'Balo', 'Rayan', 'Celan', 'Forta', 'Voida'] },
  charmPartType: {
    type: String,
    enum: ['Water', 'Fire', 'Wood', 'Metal', 'Earth'],
  },
  itemName: { type: String, required: true, trim: true },
  donatedBy: [{ type: String, trim: true }],
  quantity: { type: Number, required: true, min: 0 },
  stashToon: { type: String, required: true },
});

const Item = model('Item', itemSchema);

module.exports = Item;
