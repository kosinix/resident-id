//// Core modules
const fs = require('fs')

//// External modules
const express = require('express')
const fileUpload = require('express-fileupload')
const flash = require('kisapmata')
const phAddress = require('ph-address')
const lodash = require('lodash')
const moment = require('moment')

//// Modules
const db = require('../db');
const middlewares = require('../middlewares');
const s3 = require('../aws-s3');

// Router
let router = express.Router()

router.use(['/residents', '/resident'], middlewares.requireAuthUser )
router.get('/residents', async (req, res, next) => {
    try {
        let residents = await db.main.Person.find()
        res.render('residents/all.html', {
            flash: flash.get(req, 'residents'),
            residents: residents
        });
    } catch (err) {
        next(err);
    }
});

router.get('/resident/create', async (req, res, next) => {
    try {

        let regions = lodash.map(phAddress.regions, (o) => {
            return {
                value: o.regCode,
                text: o.regDesc,
            }
        })
        res.render('residents/create.html', {

            regions: regions
        });
    } catch (err) {
        next(err);
    }
});
router.post('/resident/create', async (req, res, next) => {
    try {
        let body = req.body
        console.log(req.body)
        let patch = {}
        lodash.set(patch, 'firstName', lodash.get(body, 'firstName'))
        lodash.set(patch, 'middleName', lodash.get(body, 'middleName'))
        lodash.set(patch, 'lastName', lodash.get(body, 'lastName'))
        lodash.set(patch, 'suffix', lodash.get(body, 'suffix'))
        lodash.set(patch, 'birthDate', lodash.get(body, 'birthDate'))
        lodash.set(patch, 'gender', lodash.get(body, 'gender'))
        lodash.set(patch, 'addresses.0._id', db.mongoose.Types.ObjectId())
        lodash.set(patch, 'addresses.0.unit', lodash.get(body, 'unit1'))
        lodash.set(patch, 'addresses.0.brgyDistrict', lodash.get(body, 'brgyDistrict1'))
        lodash.set(patch, 'addresses.0.cityMun', lodash.get(body, 'cityMun1'))
        lodash.set(patch, 'addresses.0.province', lodash.get(body, 'province1'))
        lodash.set(patch, 'addresses.0.region', lodash.get(body, 'region1'))
        lodash.set(patch, 'addresses.1._id', db.mongoose.Types.ObjectId())
        lodash.set(patch, 'addresses.1.unit', lodash.get(body, 'unit2'))
        lodash.set(patch, 'addresses.1.brgyDistrict', lodash.get(body, 'brgyDistrict2'))
        lodash.set(patch, 'addresses.1.cityMun', lodash.get(body, 'cityMun2'))
        lodash.set(patch, 'addresses.1.province', lodash.get(body, 'province2'))
        lodash.set(patch, 'addresses.1.region', lodash.get(body, 'region2'))
        lodash.set(patch, 'addressPermanent', lodash.get(patch, 'addresses.0._id'))
        lodash.set(patch, 'addressPresent', lodash.get(patch, 'addresses.1._id'))
        if(body.addressSame === 'true'){
            patch.addresses.splice(1,1) // Remove second array
            lodash.set(patch, 'addressPresent', lodash.get(patch, 'addresses.0._id'))
        }

        let person = new db.main.Person(patch)
        await person.save()
        flash.ok(req, 'residents', `Added ${person.firstName} ${person.lastName}.`)
        res.redirect(`/resident/photo/${person._id}`)
    } catch (err) {
        next(err);
    }
});

router.get('/resident/photo/:personId', middlewares.getPerson, async (req, res, next) => {
    try {
        let person = res.person

        res.render('residents/photo.html', {
            person: person
        });
    } catch (err) {
        next(err);
    }
});

router.post('/resident/photo/:personId', middlewares.getPerson, async (req, res, next) => {
    try {
        let person = res.person

        console.log(req.files)
        res.render('residents/photo.html', {
            person: person
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;