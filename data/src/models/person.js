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
    incomes: [
        {
            type: { // employed, remittance, pension, business, others
                $type: String,
                trim: true,
            },
            employmentSector:{ // public, private
                $type: String,
                trim: true,
            },
            occupation: {
                $type: String,
                trim: true,
            },
            employmentStatus: { // Regular, Casual
                $type: String,
                trim: true,
            },
            estimatedMonthlyIncome: {
                $type: Number,
            },
            estimatedMonthlyHouseholdIncome: {
                $type: Number,
            },
        }
    ],
    properties: [
        {
            type: { // real, personal
                $type: String,
                trim: true,
            },
            name: { // residential house and lot, commercial land/bldg., agri-land
                $type: String, // motorcycle, car, trucks/heavy equip., investments, farm animals/large cattle, others
                trim: true,
            },
        }
    ],
    families: [
        {
            personId: {
                $type: mongoose.Schema.Types.ObjectId,
            },
            relation: {
                $type: String
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
    ],
    custom: {
        fourPsBeneficiary: {
            $type: Boolean
        },
        sssPensioner: {
            $type: Boolean
        },
        healthIssue: {
            $type: Boolean
        },
        pwd: {
            $type: Boolean
        },
        ipGroup: {
            $type: Boolean
        },
        emergencyContact: {
            $type: String
        },
        emergencyContactNo: {
            $type: String
        }
    }
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

    // Unit
    if(permanentAddress.unit) {
        address.push(permanentAddress.unit)
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

schema.virtual('addressRegion').get(function() {
    let me = this
    let address = []
    let permanentAddress = lodash.find(this.addresses, (o) => {
        return o._id.toString() === me.addressPermanent.toString()
    })
    if(!permanentAddress) {
        return ''
    }

    return permanentAddress.region
});

schema.virtual('addressProvince').get(function() {
    let me = this
    let address = []
    let permanentAddress = lodash.find(this.addresses, (o) => {
        return o._id.toString() === me.addressPermanent.toString()
    })
    if(!permanentAddress) {
        return ''
    }

    return permanentAddress.province
});

schema.virtual('addressCityMun').get(function() {
    let me = this
    let address = []
    let permanentAddress = lodash.find(this.addresses, (o) => {
        return o._id.toString() === me.addressPermanent.toString()
    })
    if(!permanentAddress) {
        return ''
    }

    // City/Mun
    return permanentAddress.cityMun
});

schema.virtual('addressBrgyDistrict').get(function() {
    let me = this
    let address = []
    let permanentAddress = lodash.find(this.addresses, (o) => {
        return o._id.toString() === me.addressPermanent.toString()
    })
    if(!permanentAddress) {
        return ''
    }

    // Barangay
    return permanentAddress.brgyDistrict
});

schema.virtual('addressUnit').get(function() {
    let me = this
    let address = []
    let permanentAddress = lodash.find(this.addresses, (o) => {
        return o._id.toString() === me.addressPermanent.toString()
    })
    if(!permanentAddress) {
        return ''
    }

    // Unit
    return permanentAddress.unit
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
