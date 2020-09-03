const express = require("express");
const router = express.Router();
// const bcrypt = require("bcryptjs");
// const passport = require("passport");

// User model
const Profile = require("../models/Profile");

// CRUD METHODS
router
  .get("/", async function (req, res, next) {
    //we use async/await to wait for this to happen randomly
    await Profile.find()
      .then((allDocuments) => res.json(allDocuments)) //await should be called 'waitfor'
      .catch((err) => next(new Error(err)));
  })
  .get("/:id", async function (req, res, next) {
    const { id } = req.params;
    await Profile.findById(id)
      .then((results) => res.json(results))
      .catch((err) => next(new Error(err)));
  })
  .put("/:id", async function (req, res, next) {
    const { id } = req.params;
    const { body } = req;
    await Profile.findByIdAndUpdate(id, body, {
      new: true,
      useFindAndModify: false,
    })
      .then((updatedDocument) => res.json(updatedDocument))
      .catch((err) => next(new Error(err)));
  })
  .post("/", async (req, res, next) => {
    await Profile.create({ ...req.body })
      .then((bb) => res.json(bb)) //await should be called 'waitfor'
      .catch((err) => console.log("ahhhhhhhh", err));
  });

//   .delete("/:id", async function (req, res) {
//     const { id } = req.params;
//     await Profile.findByIdAndDelete(id, { useFindAndModify: false })
//       .then((response) => res.json(response))
//       .catch((err) => next(new Error(err)));
//     res.send(`Deleted Profile ${id}`);
//   });

module.exports = router;
