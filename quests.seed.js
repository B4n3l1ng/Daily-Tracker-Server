require('dotenv').config();
const questsData = require('./quests.json');
/* questsData.forEach((quest) => {
  if (!quest.requirements) {
    console.log(quest);
  }
}); */

console.log(process.env.MONGODB_URI);

const withDB = require('./db');

const Quest = require('./models/Quest.model');
const app = require('./app');

withDB();

/* Quest.insertMany(questsData)
  .then((data) => console.log(data))
  .catch((error) => console.log(error)); */

const itemData = require('./items.json');

const Item = require('./models/Item.model');

Item.insertMany(itemData)
  .then((data) => console.log(data))
  .catch((error) => console.log(error));
