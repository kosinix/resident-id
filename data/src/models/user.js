//// Core modules
const crypto = require('crypto');
const util = require('util');

//// External modules
const mongoose = require('mongoose');

//// Modules
let randomBytesAsync = util.promisify(crypto.randomBytes);

let schema = mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
    },
    middleName: {
        type: String,
        trim: true,
    },
    lastName: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
    },
    passwordHash: {
        type: String,
        default: ''
    },
    salt: {
        type: String,
        default: ""
    },
    roles: {
        type: Array,
        default: []
    },
    active: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

//// Instance methods
schema.methods.isRoles = function (requiredRoles) {
    let user = this;
    let allowed = false;
    // console.log(requiredRoles, 'vs', user.roles)
    let userRoles = user.roles;

    // NOTE: Uncomment below to test different roles
    // userRoles = ["CL2"]
    allowed = requiredRoles.some((requiredRole) => {
        return userRoles.includes(requiredRole)
    });
    return allowed;
}

//// Static methods
schema.statics.randomStringAsync = async function (length = 32) {
    let salt = await randomBytesAsync(length / 2);
    return salt.toString('hex');
}
schema.statics.hashPassword = function (password, salt) {
    return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('base64');
};


//// Middlewares




module.exports = schema;
