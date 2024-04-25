const Item = require('../models/Item.model');
const RemoveItem = require('../models/ItemRemoval.model');

const router = require('express').Router();

router.get('/', async (req, res) => {
  try {
    const allItems = await Item.find();
    res.status(200).json(allItems);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/removals', async (req, res) => {
  try {
    const allRemovals = await RemoveItem.find();
    res.status(200).json(allRemovals);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/query', async (req, res) => {
  try {
    const { t } = req.query;
    const term = t.split('-').join(' ');
    const items = await Item.find({ type: term });
    console.log(items);
    res.status(200).json(items);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findById(id);
    if (item) {
      res.status(200).json(item);
    } else {
      res.status(404).json('Item not found');
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/misc', async (req, res) => {
  try {
    const allMisc = await Item.find({ type: 'Consumables/Miscleaneous' });
    res.status(200).json(allMisc);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  const { type, faction, charmPartType, itemName, donatedBy, quantity, stashToon } = req.body;
  if (type === 'Charm Part') {
    if (!faction || !charmPartType) {
      res.status(400).json('Please provide a faction and a type of part');
      return;
    }
  }
  try {
    const newItem = await Item.create({ type, faction, charmPartType, itemName, donatedBy, quantity, stashToon });
    console.log(newItem);
    res.status(201).json(newItem);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const foundItem = await Item.findById(id);
    if (!foundItem) {
      res.status(404).json('Item not found');
      return;
    }
    const { newQuantity, newDonatedBy, newStashToon } = req.body;
    const updated = await Item.findByIdAndUpdate(id, { quantity: newQuantity, donatedBy: newDonatedBy, stashToon: newStashToon }, { new: true });
    res.status(202).json(updated);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.tokenPayload || !req.tokenPayload.isAdmin) {
      res.status(401).json('Unauthorized operation');
      return;
    }
    const deleted = await Item.findByIdAndDelete(id);
    res.status(202).json('Deleted');
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/giveTo', async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findById(id);
    if (!item) {
      res.status(404).json('Item not found');
      return;
    }
    const { quantity, player } = req.body;
    item.quantity -= quantity;
    const removal = await RemoveItem.create({
      itemType: item.type,
      itemFaction: item.faction,
      itemCharmPartType: item.charmPartType,
      itemName: item.itemName,
      quantityRemoved: quantity,
      removedBy: player,
    });
    await item.save();
    res.status(200).json('Success');
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
