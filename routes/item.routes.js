const Item = require('../models/Item.model');

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

router.get('/charms', async (req, res) => {
  try {
    const allCharms = await Item.find({ type: 'Charm Part' });
    res.status(200).json(allCharms);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/cosmetic', async (req, res) => {
  try {
    const allCosmetics = await Item.find({ type: 'Cosmetic' });
    res.status(200).json(allCosmetics);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/equipment', async (req, res) => {
  try {
    const allEquipment = await Item.find({ type: 'Equipment' });
    res.status(200).json(allEquipment);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/pet', async (req, res) => {
  try {
    const allPets = await Item.find({ type: 'Pet' });
    res.status(200).json(allPets);
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
  const { type, faction, charmPartType, itemName, donatedBy, quantity } = req.body;
  if (type === 'Charm Part') {
    if (!faction || !charmPartType) {
      res.status(400).json('Please provide a faction and a type of part');
      return;
    }
  }
  try {
    const newItem = await Item.create({ type, faction, charmPartType, itemName, donatedBy, quantity });
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
    const { newQuantity } = req.body;
    const updated = await Item.findByIdAndUpdate(id, { quantity: newQuantity }, { new: true });
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

module.exports = router;
