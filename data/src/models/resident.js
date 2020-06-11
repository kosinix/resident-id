//// Core modules
const crypto = require('crypto');
const util = require('util');

//// External modules
const mongoose = require('mongoose');
const moment = require('moment');
const lodash = require('lodash');

//// Modules


const randomBytesAsync = util.promisify(crypto.randomBytes);


const Schema = mongoose.Schema;

const schema = new Schema({
    firstName: {
        type: String,
        trim: true,
        default: ""
    },
    middleName: {
        type: String,
        trim: true,
        default: ""
    },
    lastName: {
        type: String,
        trim: true,
        default: ""
    },
    suffix: {
        type: String,
        trim: true,
        default: ""
    },
    email: {
        type: String,
        trim: true,
    },
    mobileNo: {
        type: String,
        trim: true,
        default: ""
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    mobileNoVerified: {
        type: Boolean,
        default: false
    },
    passwordHash: {
        type: String,
        trim: true,
        default: ""
    },
    salt: {
        type: String,
        trim: true,
        default: ""
    },
    birthDate: {
        type: Date
    },
    gender: {
        type: Number
    },
    civilStatus: {
        type: String
    },
    profilePic: {
        type: String
    },
    addressPermanent: {
        unit: {
            type: String,
            trim: true,
            default: ""
        },
        brgyDistrict: {
            type: String,
            trim: true,
            default: ""
        },
        cityMun: {
            type: String,
            trim: true,
            default: ""
        },
        province: {
            type: String,
            trim: true,
            default: ""
        },
        region: {
            type: String,
            trim: true,
            default: ""
        },
        address: {
            type: String,
            trim: true,
            default: ""
        },
        zipCode: {
            type: Number,
        },
        years: {
            type: Number,
        },
        status: {
            type: Number,
            min: 0,
            max: 5,
            default: 0
        }
    },
    addressPresent: {
        unit: {
            type: String,
            trim: true,
            default: ""
        },
        brgyDistrict: {
            type: String,
            trim: true,
            default: ""
        },
        cityMun: {
            type: String,
            trim: true,
            default: ""
        },
        province: {
            type: String,
            trim: true,
            default: ""
        },
        region: {
            type: String,
            trim: true,
            default: ""
        },
        address: {
            type: String,
            trim: true,
            default: ""
        },
        zipCode: {
            type: Number,
        },
        years: {
            type: Number,
        },
        status: {
            type: Number,
            min: 0,
            max: 5,
            default: 0
        }
    },
    qrCodeId: {
        type: mongoose.Schema.Types.ObjectId
    },
}, { timestamps: true })

//// Schema methods

//// Middlewares

module.exports = schema
