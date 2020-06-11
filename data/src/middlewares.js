
//// Core modules

//// External modules
const jwt = require('jsonwebtoken');
const lodash = require('lodash');
const moment = require('moment');

//// Modules
const constants = include('data/src/constants');
const db = include('data/src/db');
const errorMessages = include('data/src/errorMessages');
const logger = include('data/src/logger');
const sanitizer = include('src/sanitizer');
const uploader = include('data/src/uploader');

// Do not allow other users to see other applications
// NOTE: This middleware must come after restrict and must be in a route with a named parameter ":applicationId"
// Adds res.application
let getApplication = async (req, res, next) => {
    try {
        let applicationId = lodash.get(req, 'params.applicationId');
        let error = "Sorry, application not found."

        if (!applicationId) {
            if (req.originalUrl.includes('/api/')) {
                return res.status(404).send({
                    error: {
                        name: 'Error',
                        message: 'Application not found.'
                    }
                });
            }
            return res.render('error.html', { error: error })
        }
        let application = await db.web.Application.findOne({ _id: applicationId }).populate("referrer");
        if (!application) {
            if (req.originalUrl.includes('/api/')) {
                return res.status(404).send({
                    error: {
                        name: 'Error',
                        message: 'Application not found.'
                    }
                });
            }
            return res.render('error.html', { error: error })
        }
        res.application = application;
        next();
    } catch (err) {
        next(err);
    }
}

let getUser = async (req, res, next) => {
    try {
        let applicationId = lodash.get(req, 'params.applicationId');
        let error = "Sorry, application not found."

        if (!applicationId) {
            if (req.originalUrl.includes('/api/')) {
                return res.status(404).send(error);
            }
            return res.render('error.html', { error: error })
        }
        let application = await db.web.Application.findOne({ _id: applicationId }).populate("referrer");
        if (!application) {
            if (req.originalUrl.includes('/api/')) {
                return res.status(404).send(error);
            }
            return res.render('error.html', { error: error })
        }
        res.application = application;
        next();
    } catch (err) {
        next(err);
    }
}

let getDeletedApplication = async (req, res, next) => {
    try {
        let applicationId = lodash.get(req, 'params.applicationId');
        if (!applicationId) {
            return res.render('error.html', { error: "Sorry, application not found." })
        }
        let application = await db.web.collection('deletedApplications').findOne({ _id: db.mongoose.mongo.ObjectId(applicationId) });
        if (!application) {
            return res.render('error.html', { error: "Sorry, application not found." })
        }
        res.application = application;
        next();
    } catch (err) {
        next(err);
    }
}

let getBorrower = async (req, res, next) => {
    try {
        let borrowerId = req.params.borrowerId || "";
        let borrower = await db.web.Borrower.findById(borrowerId);
        if (!borrower) {
            return res.render('error.html', { error: "Sorry, borrower not found." })
        }
        res.borrower = borrower;
        next();
    } catch (err) {
        next(err);
    }
}
// Requires getApplication middleware
let getApplicationCoBorrower = async (req, res, next) => {
    try {
        let application = res.application; // Required
        let params = sanitizer.sanitizeFields(req.params, [
            "coBorrowerId",
        ], true);
        let coBorrowerId = params.coBorrowerId;

        if (!coBorrowerId) {
            return res.status(400).send('Missing Co-borrower ID.');
        }

        let coBorrowerIndex = lodash.findIndex(application.coBorrowers, (coBorrower) => {
            return coBorrower._id.toString() === coBorrowerId;
        });
        if (coBorrowerIndex === -1) {
            return res.status(404).send('Co-borrower not found.')
        }

        if (![constants.APP_STATUS_KEYS.REQUIREMENT_COMPLIANCE, constants.APP_STATUS_KEYS.MANUAL_UNDERWRITING].includes(application.status)) {
            return res.status(400).send("Modifying of co-borrower not allowed.")
        }

        res.coBorrower = application.coBorrowers[coBorrowerIndex];
        res.coBorrowerIndex = coBorrowerIndex;
        next();
    } catch (err) {
        next(err);
    }
}

let getAdmin = async (req, res, next) => {
    try {
        let adminId = req.params.adminId || "";
        let admin = await db.dash.Admin.findById(adminId);
        if (!admin) {
            return res.render('error.html', { error: "Sorry, admin not found." })
        }
        res.admin = admin;
        next();
    } catch (err) {
        next(err);
    }
}

let apiAuthSecretKey = async (req, res, next) => {
    try {
        let apiKey = lodash.get(req, 'query.apiKey', '');
        if (req.method === 'POST') {
            apiKey = lodash.get(req, 'body.apiKey', '');
        }

        if (apiKey !== CRED.api.apiKey) {
            return res.status(400).send('Invalid credentials')
        }
        next();
    } catch (err) {
        next(err);
    }
}
let apiAuthBasic = async (req, res, next) => {
    try {
        let authorization = lodash.get(req, 'headers.authorization', '').replace('Basic', '').replace(' ', '')
        let hash = Buffer.from(CRED.api.auth.basic.username + ':' + CRED.api.auth.basic.password).toString('base64');

        if (authorization !== hash) {
            logger.error(req.originalUrl);
            logger.error('Invalid credentials');
            return res.status(400).send('Invalid credentials')
        }
        next();
    } catch (err) {
        next(err);
    }
}
let getUserBot = async (req, res, next) => {
    try {
        // Uses Basic Auth for mambu compat
        let authorization = lodash.get(req, 'headers.authorization', '').replace('Basic', '').replace(' ', '')
        let decoded = Buffer.from(authorization, 'base64').toString();
        let split = decoded.split(':')
        let publicId = lodash.get(split, '0', '')
        let password = lodash.get(split, '1', '')

        if (!publicId || !password) {
            return res.status(400).send('Bad request.')
        }

        let user = await db.dash.Admin.findOne({
            _id: publicId,
            roles: {
                $in: ['bot'],
            },
            active: true
        });
        if (!user) {
            return res.status(404).send('App not found.')
        }

        // Check password
        let passwordHash = db.dash.Admin.hashPassword(password, user.salt);
        if (passwordHash !== user.password) {
            return res.status(401).send('Unauthorized.')
        }

        res.user = user;

        next();
    } catch (err) {
        next(err);
    }
}
let allowIp = async (req, res, next) => {
    try {
        if (CONFIG.ipCheck === false) {
            return next();
        }

        let ips = await db.dash.AllowedIP.find(); // Get from db
        let allowed = lodash.map(ips, (ip) => { // Simplify
            return ip.address;
        })

        if (allowed.length <= 0) { // If none from db, get from config
            allowed = CONFIG.ip.allowed;
        }
        let ip = req.headers['x-real-ip'] || req.connection.remoteAddress;

        if (allowed.includes(ip) || allowed.length <= 0) {
            return next();
        }
        res.setHeader('X-IP', ip);
        res.status(400).send('Access denied from ' + ip)
    } catch (err) {
        next(err);
    }
}

let antiCsrfCheck = async (req, res, next) => {
    try {
        let post = sanitizer.sanitizeFields(req.body, [
            "acsrf"
        ], true);

        if (lodash.get(req, 'session.acsrf') === post.acsrf) {
            return next();
        }
        res.status(400).send('Cross-site request forgery error')
    } catch (err) {
        next(err);
    }
}

let handleExpressUploadMagic = async (req, res, next) => {
    try {
        let files = lodash.get(req, 'files', [])
        let localFiles = await uploader.handleExpressUploadLocalAsync(files, CONFIG.app.dirs.upload)
        let imageVariants = await uploader.resizeImagesAsync(localFiles, null, CONFIG.app.dirs.upload); // Resize uploaded images

        let uploadList = uploader.generateUploadList(imageVariants, localFiles)
        let saveList = uploader.generateSaveList(imageVariants, localFiles)
        await uploader.uploadToS3Async(uploadList)
        await uploader.deleteUploadsAsync(localFiles, imageVariants)
        req.localFiles = localFiles
        req.imageVariants = imageVariants
        req.saveList = saveList
        next()
    } catch (err) {
        next(err)
    }
}

let api = {
    getAuthApp: async (req, res, next) => {
        try {
            // Uses Basic Auth for mambu compat
            let authorization = lodash.get(req, 'headers.authorization', '').replace('Basic', '').replace(' ', '')
            let decoded = Buffer.from(authorization, 'base64').toString();
            let split = decoded.split(':')
            let publicId = lodash.get(split, '0', '')
            let password = lodash.get(split, '1', '')

            if (!publicId || !password) {
                throw new Error('Invalid credentials.')
            }

            if (!db.mongoose.Types.ObjectId.isValid(publicId)) {
                throw new Error('Invalid credentials.')
            }

            let user = await db.dash.Admin.findOne({
                _id: publicId,
                roles: {
                    $in: ['bot'],
                },
                active: true
            });
            if (!user) {
                throw new Error('App not found.')
            }

            // Check password
            let passwordHash = db.dash.Admin.hashPassword(password, user.salt);
            if (passwordHash !== user.password) {
                throw new Error('Incorrect password.')
            }

            res.authApp = user;

            next();
        } catch (err) {
            next(err);
        }
    },
    getAuthUser: async (req, res, next) => {
        try {
            let authorization = lodash.get(req, 'headers.authorization', '').replace('Bearer', '').replace(' ', '')

            var decoded = jwt.verify(authorization, CRED.jwt.secret);

            let timeLimit = 8
            let timeUnit = 'hours'
            let momentCreated = moment.unix(decoded.iat);
            let momentNow = moment.unix(decoded.exp);
            let diff = momentNow.diff(momentCreated, timeUnit);
            if (diff >= timeLimit) {
                return res.status(400).send({
                    error: {
                        name: 'Error',
                        message: 'Token expired',
                    }
                })
            }



            res.jwt = decoded;

            next()
        } catch (err) {
            if (lodash.get(err, 'name') === 'JsonWebTokenError') {
                return res.status(400).send({
                    error: {
                        name: err.name,
                        message: err.message,
                    }
                })
            }
            next(err)
        }
    },
    requireJwt: async (req, res, next) => {
        let authorization = ''
        try {
            authorization = lodash.get(req, 'headers.authorization', '').replace('Bearer', '').replace(' ', '')

            res.jwt = jwt.verify(authorization, CRED.jwt.secret);

            next()
        } catch (err) {
            if (authorization) {
                logger.error(`JWT: ${authorization}`)
            }

            next(err)
        }
    },
    getParamUser: async (req, res, next) => {
        try {
            let userId = lodash.get(req, 'params.userId');
            let user = await db.web.Borrower.findById(userId);
            if (!user) {
                return res.status(404).send({
                    error: {
                        name: 'Error',
                        message: 'User not found.'
                    }
                })
            }
            res.user = user;

            next();
        } catch (err) {
            next(err);
        }
    },
    // Application belonging to user only. Requires JWT
    getUserApplicationJwt: async (req, res, next) => {
        try {
            let token = res.jwt;
            let applicationId = lodash.get(req, 'params.applicationId');

            let authAppId = lodash.get(token, 'app.id');
            let userId = lodash.get(token, 'user.id');


            if (!applicationId || !db.mongoose.Types.ObjectId.isValid(applicationId)) {
                return res.status(404).send(errorMessages.findByMessage('Application not found.'));
            }
            let application = await db.web.Application.findOne({
                _id: applicationId,
                user: userId
            }).populate("referrer");

            if (!application) {
                return res.status(404).send(errorMessages.findByMessage('Application not found.'));
            }

            res.application = application;
            next();
        } catch (err) {
            next(err);
        }
    },
    // Requires getUserApplicationJwt
    getApplicationCoBorrower: async (req, res, next) => {
        try {
            let application = res.application; // Required
            let coBorrowerId = lodash.get(req, 'params.coBorrowerId');

            if (!coBorrowerId) {
                return res.status(400).send(errorMessages.findByMessage('Missing co-borrower ID.'))
            }

            let coBorrowerIndex = lodash.findIndex(application.coBorrowers, (coBorrower) => {
                return coBorrower._id.toString() === coBorrowerId;
            });
            if (coBorrowerIndex === -1) {
                return res.status(404).send(errorMessages.findByMessage('Co-borrower not found.'))
            }

            res.coBorrower = application.coBorrowers[coBorrowerIndex];
            res.coBorrowerIndex = coBorrowerIndex;
            next();
        } catch (err) {
            next(err);
        }
    },
    // Requires getUserApplicationJwt
    getApplicationReference: async (req, res, next) => {
        try {
            let application = res.application; // Required
            let referenceId = lodash.get(req, 'params.referenceId');

            if (!referenceId) {
                return res.status(400).send(errorMessages.findByMessage('Missing reference ID.'))
            }

            let referenceIndex = lodash.findIndex(application.references, (reference) => {
                return reference._id.toString() === referenceId;
            });
            if (referenceIndex === -1) {
                return res.status(404).send(errorMessages.findByMessage('Reference not found.'))
            }

            res.reference = application.references[referenceIndex];
            res.referenceIndex = referenceIndex;
            next();
        } catch (err) {
            next(err);
        }
    }
}

module.exports = {
    antiCsrfCheck: antiCsrfCheck,
    getApplication: getApplication,
    getUser: getUser,
    getBorrower: getBorrower,
    getApplicationCoBorrower: getApplicationCoBorrower,
    getDeletedApplication: getDeletedApplication,
    getAdmin: getAdmin,
    apiAuthSecretKey: apiAuthSecretKey,
    apiAuthBasic: apiAuthBasic,
    allowIp: allowIp,
    getUserBot: getUserBot,
    handleExpressUploadMagic: handleExpressUploadMagic,
    api: api
}