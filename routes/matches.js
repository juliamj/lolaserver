const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");
const Profile = require("../models/Profile");

// TO DO - how to serialize user to get the user.id

router.get("/", ensureAuthenticated, (req, res) =>
  res.render("matches", {
    name: req.user.name,
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
router.get("/:id", async function (req, res, next) {
  const { id } = req.params;
  console.log(id);
  //:id is logged in user
  //we use async/await to wait for this to happen randomly
  const users = await Profile.find();
  console.log(users.map((u) => u.userId));
  const mainUser = users.filter(
    (u) => u.userId && u.userId.toString() === id
  )[0]; //undefined
  const restOfUsers = users.filter(
    (u) => u.userId && u.userId.toString() !== id
  );

  const scoredUsers = restOfUsers.map((u) => {
    console.log(mainUser);
    return {
      score: score(mainUser.interests, u.interests),
      user: u,
    };
  });

  res.send(scoredUsers);
});

module.exports = router;
