const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const Profile = require('../models/Profile');
const fs = require('fs');

router.get('/', ensureAuthenticated, (req, res) =>
  res.render('matches', {
    name: req.user.name
  })
);

//calculate matches
const score = (interests, otherInterests) => {
  let score = 0;
  for (let i = 0; i < interests.length; i++) {
    if (otherInterests.includes(interests[i])) {
      score++;
    }
  }
  return score;
};

// CRUD METHODS
//show all matches
router.get('/:id', async function (req, res) {
  const { id } = req.params;
  const users = await Profile.find();

  const mainUser = users.filter(u => u.userId && u.userId.toString() === id)[0]; //undefined
  const restOfUsers = users.filter(u => u.userId && u.userId.toString() !== id);

  // console.log(mainUser, restOfUsers)
  // console.log(otherUser.learnlangs.some(lang => mainUser.nativelang.includes(lang)))

  const scoredUsers = restOfUsers
    .filter(otherUser => otherUser.location === mainUser.location)
    // .then(otherUser => console.log(otherUser)) //compares the learning languages of other users with the native languages of the main user
    // .filter(otherUser =>
    //   otherUser.learnlangs.some(lang => mainUser.nativelang.includes(lang))
    // )
    .map(u => {
      return {
        score: score(mainUser.interests, u.interests),
        user: u
      };
    });

  res.send(scoredUsers);
});

module.exports = router;
