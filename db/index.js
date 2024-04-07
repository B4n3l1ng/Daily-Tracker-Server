// ℹ️ package responsible to make the connection with mongodb
// https://www.npmjs.com/package/mongoose
const mongoose = require('mongoose');
const cron = require('node-cron');
// Set the desired timezone for your application

const Character = require('../models/Character.model');

// ℹ️ Sets the MongoDB URI for our app to have access to it.
// If no env has been set, we dynamically set it to whatever the folder name was upon the creation of the app

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dailyTracker';

const withDB = async (serverListener) => {
  try {
    const x = await mongoose.connect(MONGO_URI);
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
    if (typeof serverListener === 'function') {
      serverListener();
    }
    cron.schedule('0 0 * * *', async () => {
      try {
        await Character.updateMany({}, { $set: { 'availableQuests.$[].isComplete': false } });
        console.log('Quests reset successfully');
      } catch (error) {
        console.log('Error reseting quests:', error);
      }
    });
  } catch (error) {
    console.error('Error connecting to mongo: ', error);
  }
};

module.exports = withDB;
