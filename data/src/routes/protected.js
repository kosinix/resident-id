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
const middlewares = require('../middlewares');
const s3 = require('../aws-s3');

// Router
let router = express.Router()

router.get('/', middlewares.requireAuthUser, async (req, res, next) => {
    try {
        console.log(req.session)

        res.render('home.html');
    } catch (err) {
        next(err);
    }
});

// View s3 object using html page
router.get('/file-viewer/:bucket/:prefix/:key', async (req, res, next) => {
    try {
        let bucket = lodash.get(req, "params.bucket", "");
        let prefix = lodash.get(req, "params.prefix", "");
        let key = lodash.get(req, "params.key", "");

        let url = s3.getSignedUrl('getObject', {
            Bucket: bucket,
            Key: prefix + '/' + key
        })

        res.render('file-viewer.html', {
            url: url,
        });
    } catch (err) {
        next(err);
    }
});

// Get s3 object content
router.get('/file-getter/:bucket/:prefix/:key', async (req, res, next) => {
    try {
        let bucket = lodash.get(req, "params.bucket", "");
        let prefix = lodash.get(req, "params.prefix", "");
        let key = lodash.get(req, "params.key", "");

        let url = s3.getSignedUrl('getObject', {
            Bucket: bucket,
            Key: prefix + '/' + key
        })

        res.redirect(url);
    } catch (err) {
        next(err);
    }
});

module.exports = router;