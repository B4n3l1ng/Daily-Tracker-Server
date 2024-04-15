const router = require('express').Router();

router.get('/', (req, res) => {
  res.json('All good in here');
});

router.get('/reset', async (req, res) => {
  try {
    await Character.updateMany({}, { $set: { 'availableQuests.$[].isComplete': false } });
    res.status(200).json({ message: 'Quests reset successfully!' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});

module.exports = router;
