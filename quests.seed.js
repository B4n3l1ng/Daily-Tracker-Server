const questsData = require('./quests.json');
/* questsData.forEach((quest) => {
  if (!quest.requirements) {
    console.log(quest);
  }
}); */

const withDB = require('./db');

const Quest = require('./models/Quest.model');
const app = require('./app');

withDB();

Quest.insertMany(questsData)
  .then((data) => console.log(data))
  .catch((error) => console.log(error));
