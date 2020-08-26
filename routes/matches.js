const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");

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
  //:id is logged in user
  //we use async/await to wait for this to happen randomly
  const users = await Profile.find();
  const user = users.find((u) => u.userId === id);
  const restOfUsers = users.filter((u) => u.userId !== id);

  const scoredUsers = restOfUsers.map((u) => {
    return {
      score: score(user.interests, u.interests),
      user: u,
    };
  });
  res.send(scoredUsers);
});

// .get("/user/:id", async function (req, res, next) {
//   const { id } = req.params;
//   await Match.findById(id)
//     .then((results) => res.json(results))
//     .catch((err) => next(new Error(err)));
// });

//   .put("/:id", async function (req, res, next) {
//     const { id } = req.params
//     const { body } = req
//     await Match.findByIdAndUpdate(id, body, {
//       new: true,
//       useFindAndModify: false,
//     })
//       .then((updatedDocument) => res.json(updatedDocument))
//       .catch((err) => next(new Error(err)));
//   })
//   .delete("/:id", async function (req, res) {
//     const { id } = req.params;
//     await Match.findByIdAndDelete(id, {useFindAndModify: false})
//       .then((response) => res.json(response))
//       .catch((err) => next(new Error(err)));
//     res.send(`Deleted Match ${id}`);
//   });
