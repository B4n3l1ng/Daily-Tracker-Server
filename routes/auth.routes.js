const User = require('../models/User.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { isAuthenticated } = require('../middlewares/route-guard.middleware');

const router = require('express').Router();

router.post('/signup', async (req, res) => {
  try {
    const userExists = await User.findOne({ username: req.body.username });
    if (userExists) {
      res.status(406).json({ message: 'That username already exists' });
      return;
    }
    const salt = bcrypt.genSaltSync(13);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);
    const createdUser = await User.create({ username: req.body.username, hashedPassword });
    const options = { algorithm: 'HS256' };
    if (!req.body.stayLoggedIn) {
      options.expiresIn = '6h';
    }
    const authToken = jwt.sign(
      { userId: createdUser._id, isAdmin: potentialUser.isAdmin ? potentialUser.isAdmin : false },
      process.env.TOKEN_SECRET,
      options
    );
    res.status(201).json({ token: authToken });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password, stayLoggedIn } = req.body;
  try {
    const potentialUser = await User.findOne({ username });
    if (potentialUser) {
      // User does exist
      // Compare passwords
      const passwordCorrect = bcrypt.compareSync(password, potentialUser.hashedPassword);

      if (passwordCorrect) {
        const options = { algorithm: 'HS256' };
        if (!stayLoggedIn) {
          options.expiresIn = '6h';
        }
        const authToken = jwt.sign(
          { userId: potentialUser._id, isAdmin: potentialUser.isAdmin ? potentialUser.isAdmin : false },
          process.env.TOKEN_SECRET,
          options
        );
        res.status(200).json({ token: authToken });
      } else {
        // Incorrect password
        res.status(403).json({ message: 'Incorrect Password' });
      }
    } else {
      // No user with this username
      console.log('Problem while checking for the email');
      res.status(403).json({ message: 'No user with this username' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/verify', isAuthenticated, async (req, res) => {
  const currentUser = await User.findById(req.tokenPayload.userId);
  const copy = currentUser._doc;
  delete copy.hashedPassword;
  console.log(copy);
  res.status(200).json(copy);
});

module.exports = router;
