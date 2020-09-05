const express = require('express');
const router = express.Router();

const multer = require('multer');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); //how to import this correctly?


// User model
const Profile = require('../models/Profile');
const ProfileImage = require('../models/Profile');

// IMAGE UPLOAD STUFF
//make public directory where image go
const DIR = './public/';

//create local storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(' ').join('-');
    cb(null, uuidv4() + '-' + fileName); //uuid is not defined?
  }
});

//upload formatting logic for multer
var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == 'image/png' ||
      file.mimetype == 'image/jpg' ||
      file.mimetype == 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }
});

//TRYING TO NOT CREATE NEW USER WITH PROFILE PIC UPLOAD
//put request, if request if there's a file then transform it first into a link, store it, get the link and put that link into the database instead of the old
//post request uploads the image and comes back to the front end
//put request is editing the profile (just another field in the form)
//create an avatar image in an image database which connects to the user with the userId???
// router.post("/edit/:id", upload.single("profileImg"), async (req, res, next) => {
//   const { id } = req.params;
//     const { body } = req;

//   const url = req.protocol + "://" + req.get("host");
//   const user = await Profile.findByIdAndUpdate(id, body, {
//     new: true,
//     useFindAndModify: false,
//     profileImg: url + "/public/" + req.file.filename,
//   })
//       .then((results) => res.json(results))
//       .catch((err) => next(new Error(err)));
//   user
//     .save()
//     .then((result) => {
//       res.status(201).json({
//         message: "Profile Image uploaded successfully!",
//         userUpdated: {
//           profileImg: result.profileImg,
//         },
//       });
//     })
//     .catch((err) => {
//       console.log(err),
//         res.status(500).json({
//           error: err,
//         });
//     });
// });

// //REFERENCE FROM TUT
//make image URLs relative to where they are
router.put("/:id", upload.single("profileImg"), async (req, res, next) => {
  const { id } = req.params;
  let token = req.headers["x-auth-token"] || req.headers["authorization"];
  console.log(req.params, req.body, token)
  const changes = {
    profileImg: req.file.path
  }
  const user = await Profile.findOneAndUpdate({userId: id}, changes, {
    new: true,
    useFindAndModify: false,
  })
  if(!user) {
    console.log({user})
    res.status(400).send({success:false})
  } else {
    res.status(200).json({
      message: "Image uploaded successfully!",
      profileImgCreated: {
        _id: user._id,
        profileImg: user.profileImg,
      }
    });
  }
});

// CRUD METHODS
router
  .get('/', async function (req, res, next) {
    //we use async/await to wait for this to happen randomly
    await Profile.find()
      .then(allDocuments => res.json(allDocuments)) //await should be called 'waitfor'
      .catch(err => next(new Error(err)));
  })
  .get('/:id', async function (req, res, next) {
    const { id } = req.params;
    await Profile.findOne({userId : id})
      .then(results => res.json(results))
      .catch(err => next(new Error(err)));
  })

  // .get('/:id', async function (req, res, next) {
  //   const { id } = req.params;
  //   await Profile.findById({userId : id})
  //     .then(results => res.json(results))
  //     .catch(err => next(new Error(err)));
  // })

  .put('/:id', async function (req, res, next) {
    const { id } = req.params;
    const { body } = req;
    await Profile.findOneAndUpdate({ userId: id }, body, {
      upsert: true,
      new: true,
      useFindAndModify: false
    })
      .then(updatedDocument => res.json(updatedDocument))
      .catch(err => next(new Error(err)));
  })

  .post('/', async (req, res, next) => {
    await Profile.create({ ...req.body })
      .then(bb => res.json(bb)) //await should be called 'waitfor'
      .catch(err => console.log('ahhhhhhhh', err));
  });

module.exports = router;
