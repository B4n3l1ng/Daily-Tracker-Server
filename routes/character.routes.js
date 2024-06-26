const { isAuthenticated } = require('../middlewares/route-guard.middleware');
const Character = require('../models/Character.model');
const Quest = require('../models/Quest.model');

const router = require('express').Router();

router.get('/', isAuthenticated, async (req, res) => {
  try {
    const allCharacters = await Character.find({ player: req.tokenPayload.userId });
    if (allCharacters.length > 0) {
      res.status(200).json(allCharacters);
    } else {
      res.status(404).json('No characters found');
    }
  } catch (error) {
    console.log(error);
    res.status(500).json('Internal Server Error');
  }
});

router.get('/:characterId', isAuthenticated, async (req, res) => {
  const { characterId } = req.params;
  try {
    const character = await Character.findById(characterId);
    const level = character.level;
    const questsToAdd = await Quest.find({ minimumLevel: { $lte: Number(level) } });
    const availableQuests = [];
    questsToAdd.forEach((quest) => {
      const previousState = character.availableQuests.find((state) => state.uid === quest.name.split(' ').join(''));
      const copy = quest._doc;
      delete copy._id;
      copy.uid = copy.name.split(' ').join('');
      if (previousState && previousState.isComplete) {
        copy.isComplete = true;
      }
      availableQuests.push(copy);
    });
    character.availableQuests = availableQuests;
    const updatedCharacter = await character.save();
    res.status(200).json(updatedCharacter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', isAuthenticated, async (req, res) => {
  const { name, isAscended } = req.body;
  const level = Number(req.body.level);
  const availableQuests = [];
  if (!name || !level) {
    res.status(400).json('Missing information');
    return;
  }
  try {
    const questsToAdd = await Quest.find({ minimumLevel: { $lte: Number(level) } });

    if (questsToAdd.length > 0) {
      questsToAdd.forEach((quest) => {
        const copy = quest._doc;
        delete copy._id;
        copy.uid = copy.name.split(' ').join('');
        availableQuests.push(copy);
      });
    }
    const createdCharacter = await Character.create({ name, level, availableQuests, player: req.tokenPayload.userId, isAscended });
    res.status(201).json(createdCharacter);
  } catch (error) {
    console.log(error);
    res.status(500).json('Internal Server Error');
  }
});

router.put('/:characterId/quest/:questuid', isAuthenticated, async (req, res) => {
  const { characterId, questuid } = req.params;
  try {
    const character = await Character.findById(characterId);
    if (character.player.toString() !== req.tokenPayload.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    if (!character) {
      res.status(404).json('Character not found');
      return;
    }

    const questToUpdate = character.availableQuests.find((quest) => quest.uid === questuid);
    if (!questToUpdate) {
      res.status(404).json('Quest not found for this character');
      return;
    }
    questToUpdate.isComplete = req.body.isComplete;

    await character.save();
    res.status(202).json(character);
  } catch (error) {
    console.log(error);
    res.status(500).json('Internal Server Error');
  }
});

router.put('/:characterId/levelUp', isAuthenticated, async (req, res) => {
  const { characterId } = req.params;
  const { userId } = req.tokenPayload;

  try {
    const character = await Character.findById(characterId);
    if (!character) {
      return res.status(404).json({ message: 'Character not found' });
    }
    if (character.player.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    const newLevel = character.level + 1;
    character.level = newLevel;
    const questsToAdd = await Quest.find({ minimumLevel: { $lte: Number(newLevel) } });
    const availableQuests = [];
    questsToAdd.forEach((quest) => {
      const previousState = character.availableQuests.find((state) => state.uid === quest.name.split(' ').join(''));
      const copy = quest._doc;
      delete copy._id;
      copy.uid = copy.name.split(' ').join('');
      if (previousState && previousState.isComplete) {
        copy.isComplete = true;
      }
      availableQuests.push(copy);
    });
    character.availableQuests = availableQuests;
    await character.save();
    res.status(202).json(character);
  } catch (error) {
    console.log(error);
    res.status(500).json('Internal Server Error');
  }
});

router.put('/:characterId/ascend', isAuthenticated, async (req, res) => {
  try {
    const { characterId } = req.params;
    const { userId } = req.tokenPayload;
    const character = await Character.findById(characterId);
    if (!character) {
      return res.status(404).json({ message: 'Character not found' });
    }
    if (character.player.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    character.level = 15;
    const questsToAdd = await Quest.find({ minimumLevel: { $lte: Number(15) } });
    const availableQuests = [];
    questsToAdd.forEach((quest) => {
      const previousState = character.availableQuests.find((state) => state.uid === quest.name.split(' ').join(''));
      const copy = quest._doc;
      delete copy._id;
      copy.uid = copy.name.split(' ').join('');
      if (previousState && previousState.isComplete) {
        copy.isComplete = true;
      }
      availableQuests.push(copy);
    });
    character.availableQuests = availableQuests;
    character.isAscended = true;
    await character.save();
    res.status(202).json(character);
  } catch (error) {
    console.log(error);
    res.status(500).json('Internal Server Error');
  }
});

router.delete('/:characterId', isAuthenticated, async (req, res) => {
  try {
    const { characterId } = req.params;
    await Character.findByIdAndDelete(characterId);
    res.status(202).json({ message: 'Character deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

router.put('/:characterId/questReset', isAuthenticated, async (req, res) => {
  try {
    const { characterId } = req.params;
    const character = await Character.findByIdAndUpdate(characterId, { $set: { 'availableQuests.$[].isComplete': false } }, { new: true });
    res.status(202).json({ message: 'Character updated!' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
