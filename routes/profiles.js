const express = require("express");
const router = express.Router();
const multer = require("multer");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid"); //how to import this correctly?

// User model
const Profile = require("../models/Profile");

// IMAGE UPLOAD STUFF
//make public directory where image go
const DIR = "./public/";

//create local storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, uuidv4() + "-" + fileName); //uuid is not defined?
  },
});

//upload formatting logic for multer
var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
});

//TRYING TO NOT CREATE NEW USER WITH PROFILE PIC UPLOAD
router.post("/edit/:id", upload.single("profileImg"), async (req, res, next) => {
  const { id } = req.params;
    const { body } = req;
    
  const url = req.protocol + "://" + req.get("host");
  const user = await Profile.findByIdAndUpdate(id, body, {
    new: true,
    useFindAndModify: false,
    profileImg: url + "/public/" + req.file.filename,
  })
      .then((results) => res.json(results))
      .catch((err) => next(new Error(err)));
  // const user = new Profile({
  //   _id: new mongoose.Types.ObjectId(),
  //   name: req.body.name,
  //   profileImg: url + "/public/" + req.file.filename,
  // });
  user
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Profile Image uploaded successfully!",
        userUpdated: {
          profileImg: result.profileImg,
        },
      });
    })
    .catch((err) => {
      console.log(err),
        res.status(500).json({
          error: err,
        });
    });
});


//REFERENCE FROM TUT
router.post("/user-profile", upload.single("profileImg"), (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const user = new Profile({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    profileImg: url + "/public/" + req.file.filename,
  });
  user
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Profile Image uploaded successfully!",
        userCreated: {
          _id: result._id,
          profileImg: result.profileImg,
        },
      });
    })
    .catch((err) => {
      console.log(err),
        res.status(500).json({
          error: err,
        });
    });
});

// router.get("/", (req, res, next) => {
//   User.find().then((data) => {
//     res.status(200).json({
//       message: "User list retrieved successfully!",
//       users: data,
//     });
//   });
// });

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
