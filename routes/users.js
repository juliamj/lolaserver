const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
// const passport = require("passport");
const jwt = require('jsonwebtoken');
const auth = require('../config/auth2');
const validateUser = require('../models/ValidateUser');

// User model
const User = require('../models/User');

// CRUD METHODS
//for testing only
router
  .get('/', async function (req, res, next) {
    await User.find()
      .then(results => res.json(results))
      .catch(err => next(new Error(err)));
  })
  .get('/:id', async function (req, res, next) {
    const { id } = req.params;
    await User.findById(id)
      .then(results => res.json(results))
      .catch(err => next(new Error(err)));
  })

  .put('/:id', async function (req, res, next) {
    const { id } = req.params;
    const { body } = req;
    await User.findByIdAndUpdate(id, body, {
      new: true,
      useFindAndModify: false
    })
      .then(updatedDocument => res.json(updatedDocument))
      .catch(err => next(new Error(err)));
  })
  .delete('/:id', async function (req, res) {
    const { id } = req.params;
    await User.findByIdAndDelete(id, { useFindAndModify: false })
      .then(response => res.json(response))
      .catch(err => next(new Error(err)));
    res.send(`Deleted User ${id}`);
  });

// Register page
router.post('/register', async (req, res) => {
  // validate the request body first
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //find an existing user
  const userWithEmail = await User.findOne({ email: req.body.email });
  if (userWithEmail) return res.status(400).send('User already registered.');

  const user = new User({
    name: req.body.name,
    password: req.body.password,
    email: req.body.email,
    isAdmin: false
  });
  user.password = await bcrypt.hash(user.password, 10);
  await user.save();

  const token = createToken(user._id);
  res.header('x-auth-token', token).send({
    _id: user._id,
    name: user.name,
    email: user.email
  });
});

// Login Handle
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  // Here we check the password
  const user = await User.findOne({ email: email });
  const isValid = await checkPassword(user, password);
  if (!isValid) {
    res.send('Login Unsuccessful');
  }
  const token = createToken(user._id);

  res.header('x-auth-token', token);
  // console.log(res.header());
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email
  });
});

router.get('/getuser', async (req, res) => {
  // Validate token
  // Find user by id
  // Return user
});

const createToken = id => {
  return jwt.sign({ id: id }, process.env.SECRET);
};

const checkPassword = async (user, password) => {
  try {
    const result = await bcrypt.compare(password, user.password);
    return result;
  } catch (error) {
    return false;
  }
};

module.exports = router;
