const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

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
  router.post("/", (async (req, res, next) => {
    await Profile.create({...req.body})
    .then((bb) => res.json(bb)) //await should be called 'waitfor'
    .catch((err) => console.log("ahhhhhhhh", err));
    }))
  

module.exports = router;
