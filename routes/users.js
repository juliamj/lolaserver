const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const passport = require('passport');

// User model
const User = require('../models/User')

// CRUD METHODS
router
    .get("/", async function (req, res, next) {
        //we use async/await to wait for this to happen randomly
        await User.find()
            .then((allDocuments) => res.json(allDocuments)) //await should be called 'waitfor'
            .catch((err) => next(new Error(err)));
    })

    .get("/user/:id", async function (req, res, next) {
        const { id } = req.params;
        await User.findById(id)
            .then((results) => res.json(results))
            .catch((err) => next(new Error(err)));
    })
    // .post("/", (async (req, res, next) => {
    //     const doc = { ...req.body, createdAt: Date.now() }
    //     await User.create(doc)
    //         .then(newDocument => res.json(newDocument))
    //         .catch(err => next(new Error(err)))
    // }))

    .put("/users/:id", async (req, res, next) => {
        const { id } = req.params
        const { body } = req
        await User.findByIdAndUpdate(id, body, {
            new: true,
            useFindAndModify: false,
        })
            .then((updatedDocument) => res.json(updatedDocument))
            .catch((err) => next(new Error(err)));
    })

//   .delete("/:id", async function (req, res) {
//     const { id } = req.params;
//     await User.findByIdAndDelete(id, {useFindAndModify: false})
//       .then((response) => res.json(response))
//       .catch((err) => next(new Error(err)));
//     res.send(`Deleted User ${id}`);
//   });

// Login page
router.get('/login', (req, res) => res.render('login'))

// Register page
router.get('/register', (req, res) => res.render('register'))

// Register Handle
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    // Check required fields
    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please fill in all fields' })
    }

    // Check if passwords match
    if (password !== password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    // Check password length
    if (password.length < 6) {
        errors.push({ msg: 'Password should be at least 6 characters' });
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        // Validation passed
        User.findOne({ email: email })
            .then(user => {
                if (user) {
                    //User exists
                    errors.push({ msg: 'Email is already registered' });
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    });
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    });

                    // Hash password
                    bcrypt.genSalt(10, (err, salt) =>
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            // Set password to hasehd
                            newUser.password = hash;
                            // Save user
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'You are now registered and can log in');
                                    res.redirect('/users/login');
                                })
                                .catch(err => console.log(err));
                        }))
                }
            });
    }
});

// Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

// Logout Handle
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
})

module.exports = router;