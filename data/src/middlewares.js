
//// Core modules

//// External modules
const lodash = require('lodash');

//// Modules
const db = require('./db');
const uploader = require('./uploader');

let allowIp = async (req, res, next) => {
    try {
        if (CONFIG.ipCheck === false) {
            return next();
        }

        let ips = await db.main.AllowedIP.find(); // Get from db
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
        let acsrf = lodash.get(req, 'body.acsrf')

        if (lodash.get(req, 'session.acsrf') === acsrf) {
            return next();
        }
        res.status(400).send('Cross-site request forgery error')
    } catch (err) {
        next(err);
    }
}

let getUser = async (req, res, next) => {
    try {
        let userId = req.params.userId || "";
        let user = await db.main.User.findById(userId);
        if (!user) {
            return res.render('error.html', { error: "Sorry, user not found." })
        }
        next();
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

let requireAuthUser = async (req, res, next) => {
    try {
        let authUserId = lodash.get(req, 'session.authUserId');
        if (!authUserId) {
            return res.redirect('/login')
        }
        let user = await db.main.User.findById(authUserId);
        if (!user) {
            return res.redirect('/login')
        }
        res.user = user;
        next();
    } catch (err) {
        next(err)
    }
}


module.exports = {
    allowIp: allowIp,
    antiCsrfCheck: antiCsrfCheck,
    getPerson: async (req, res, next) => {
        try {
            let personId = req.params.personId || "";
            let person = await db.main.Person.findById(personId);
            if (!person) {
                return res.render('error.html', { error: "Sorry, person not found." })
            }
            res.person = person
            next();
        } catch (err) {
            next(err);
        }
    },
    getUser: getUser,
    handleExpressUploadMagic: handleExpressUploadMagic,
    requireAuthUser: requireAuthUser,
}