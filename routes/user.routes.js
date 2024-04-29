const { isAuthenticated } = require('../middlewares/route-guard.middleware');
const Character = require('../models/Character.model');
const User = require('../models/User.model');

const router = require('express').Router();

router.get('/', isAuthenticated, async (req, res) => {
  const { isAdmin } = req.tokenPayload;
  if (!isAdmin) {
    res.status(401).json('Unauthorized, only admin can access.');
    return;
  }
  try {
    const allUsers = await User.find();
    const mapped = allUsers.map((user) => user._doc);
    mapped.forEach((user) => delete user.hashedPassword);
    res.status(200).json(mapped);
  } catch (error) {
    console.log(error);
    res.status(500).json(error.message);
  }
});

router.put('/admin/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params;
  try {
    const possibleUser = await User.findById(id);
    if (!possibleUser) {
      res.status(404).json('User does not exist!');
      return;
    }
    possibleUser.isAdmin = !possibleUser.isAdmin;
    let message;
    await possibleUser.save();
    if (possibleUser.isAdmin) {
      message = 'User made admin';
    } else if (!possibleUser.isAdmin) {
      message = 'Admin privileges removed';
    }
    res.status(200).json(message);
  } catch (error) {
    console.log(error);
    res.status(500).json('Internal Server Error');
  }
});

router.delete('/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params;
  try {
    const userToDelete = await User.findById(id);
    if (!userToDelete) {
      res.status(404).json("User doesn't exist");
      return;
    }
    await Character.deleteMany({ player: id });
    console.log('Characters deleted');
    await User.findByIdAndDelete(id);
    res.status(200).json('User and characters deleted successfully');
  } catch (error) {
    console.log(error);
    res.status(500).json('Internal Server Error');
  }
});

module.exports = router;
