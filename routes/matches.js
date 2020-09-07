const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const Profile = require('../models/Profile');
const fs = require('fs');
const cities = require('../data/cities.json');

router.get('/', ensureAuthenticated, (req, res) =>
  res.render('matches', {
    name: req.user.name
  })
);

//return users within location filter parameters

// const locationFilter = (mainUser, restOfUsers) => {
//   const usersInArea = restOfUsers.filter((otherUser) => {
//     return otherUser.location === mainUser.location;
//   });
//   return usersInArea;
// };
//return users with

// const languageFilter = (mainUser, restOfUsers) => {
//   const mainUserNativeLangs = mainUser.nativelang;
//   const othersLearnLangs = restOfUsers.learnlangs;

//   const matchingUsers = othersLearnLangs.includes(mainUserNativeLangs);
//   console.log(matchingUsers)
// };

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
router.get('/:id', async function (req, res, next) {
  const { id } = req.params;
  //:id is logged in user
  //we use async/await to wait for this to happen randomly
  const users = await Profile.find();
  // console.log(users.map((u) => u.userId));
  const mainUser = users.filter(u => u.userId && u.userId.toString() === id)[0]; //undefined
  const restOfUsers = users.filter(u => u.userId && u.userId.toString() !== id);

  // console.log(id, mainUser, restOfUsers);
  // console.log(restOfUsers.map(info => info.nativelang));

  //rou means 'Rest of Users'
  const roulearnlangs = restOfUsers.map(data => data.learnlangs);
  // const rounativelangs = restOfUsers.map(data => data.nativelang);
  //mu means 'Main User'
  // const mulearnlangs = mainUser.map(data => data.learnlangs)
  // const munativelangs = mainUser.map(data => data.nativelang)
  // console.log(mainUser);

  const compare = (arr1, arr2) => {
    return arr1.some(item => arr2.includes(item));
  };

  console.log(compare(roulearnlangs, mainUser.nativelang));

  const scoredUsers =
    restOfUsers
      .filter(otherUser => otherUser.location === mainUser.location)
      .filter((otherUser) => otherUser.learnlangs.some(lang => mainUser.nativelang.includes(lang)))
    .map(u => {
      return {
        score: score(mainUser.interests, u.interests),
        user: u
      };
    });

  res.send(scoredUsers);
});

module.exports = router;
