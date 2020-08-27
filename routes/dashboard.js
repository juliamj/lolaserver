const express = require('express');
const router = express.Router();
const auth = require('../config/auth2');

router.get('/', auth, (req, res) => 
    res.render('dashboard', {
        name: req.user.name
    })
    );


    module.exports = router;