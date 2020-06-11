//// Core modules
const fs = require('fs')

//// External modules
const express = require('express')
const fileUpload = require('express-fileupload')
const flash = require('kisapmata')
const FormData = require('form-data')
const lodash = require('lodash')
const moment = require('moment')

//// Modules
const s3 = require('../aws-s3');

// Router
let router = express.Router()

router.get('/login', async (req, res, next) => {
    try {
        res.render('login.html');
    } catch (err) {
        next(err);
    }
});
router.post('/login', async (req, res, next) => {
    try {
        res.render('login.html');
    } catch (err) {
        next(err);
    }
});

router.get('/logout', async (req, res, next) => {
    try {

        res.render('faq.html');
    } catch (err) {
        next(err);
    }
});

module.exports = router;