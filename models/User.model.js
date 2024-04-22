const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  username: { type: String, required: true, unique: true, trim: true },
  hashedPassword: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
});

const User = model('User', userSchema);

module.exports = User;
