//// Core modules

//// External modules
const mongoose = require('mongoose');
const moment = require('moment');
const lodash = require('lodash');
const phAddress = require('ph-address')

//// Modules
const passwordMan = require('../password-man')


const Schema = mongoose.Schema;

const schema = new Schema({
    uid: {
        $type: String,
    },
    firstName: {
        $type: String,
        trim: true,
        default: ""
    },
    middleName: {
        $type: String,
        trim: true,
        default: ""
    },
    lastName: {
        $type: String,
        trim: true,
        default: ""
    },
    suffix: {
        $type: String,
        trim: true,
        default: ""
    },
    birthDate: {
        $type: Date
    },
    gender: {
        $type: String
    },
    civilStatus: {
        $type: String
    },
    profilePhoto: {
        $type: String,
        trim: true,
    },
    email: {
        $type: String,
        trim: true,
    },
    mobileNo: {
        $type: String,
        trim: true,
        default: ""
    },
    emailVerified: {
        $type: Boolean,
        default: false
    },
    mobileNoVerified: {
        $type: Boolean,
        default: false
    },
    addressPresent: {
        $type: mongoose.Schema.Types.ObjectId,
    },
    addressPermanent: {
        $type: mongoose.Schema.Types.ObjectId,
    },
    addresses: [
        {
            unit: {
                $type: String,
                trim: true,
                default: ""
            },
            brgyDistrict: {
                $type: String,
                trim: true,
                default: ""
            },
            cityMun: {
                $type: String,
                trim: true,
                default: ""
            },
            province: {
                $type: String,
                trim: true,
                default: ""
            },
            region: {
                $type: String,
                trim: true,
                default: ""
            },
            zipCode: {
                $type: Number,
            },
            dateStarted: {
                $type: Date,
            },
            status: {
                $type: Number,
            }
        }
    ],
    documents: [
        {
            type: {
                $type: String,
                trim: true,
                default: ""
            },
        }
    ]
}, {timestamps: true, typeKey: '$type'})

//// Virtuals
schema.virtual('address').get(function() {
    let me = this
    let address = []
    let permanentAddress = lodash.find(this.addresses, (o) => {
        return o._id.toString() === me.addressPermanent.toString()
    })
    if(!permanentAddress) {
        return ''
    }

    // Barangay
    if(permanentAddress.brgyDistrict) {
        address.push(permanentAddress.brgyDistrict)
    }

    // City/Mun
    let cityMun = lodash.find(phAddress.citiesMuns, (o)=>{
        return o.citymunCode === permanentAddress.cityMun
    })
    if(cityMun) {
        address.push(cityMun.citymunDesc)
    }

    // Province
    let province = lodash.find(phAddress.provinces, (o)=>{
        return o.provCode === cityMun.provCode
    })
    if(province) {
        address.push(province.provDesc)
    }

    return address.join(', ')
});

//// Schema methods
schema.pre('save', function (next) {
    if(!this.uid){
        this.uid = passwordMan.randomString(8)
    }
    next();
});

//// Middlewares

module.exports = schema
