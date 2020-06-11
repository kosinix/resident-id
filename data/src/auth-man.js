/**
 * User authentication module
 */

//// Core modules

//// External modules
const lodash = require('lodash');

//// Modules
const db = require('./db');

// Allowed routes for authMan.redirect
let allowed = [
    '/profile'
];

/**
 * Use the data that was saved in session to reconstruct the actual user
 * @param {*} userSessionData
 */
const deserializeUserAsync = async (req) => {
    try {
        let userSessionData = lodash.get(req, 'session.authMan.userSessionData');
        if (!userSessionData) {
            return null
        }
        let user = await db.main.User.findById(userSessionData.id);
        if (!user) {
            return null;
        }

        return user;

    } catch (error) {
        return null;
    }
};

/**
 *  Get redirect path/url of an allowed path/url if there is any. If none return default
 */
const getRedirect = (req) => {
    let redirect = lodash.get(req, 'session.authMan.redirect', '');
    if (allowed.includes(redirect)) {
        lodash.set(req.session, 'authMan.redirect', '');
        return redirect;
    }
    return '/account';
}

// Logout
const logout = (req, res) => {
    lodash.set(req.session, 'authMan', null);
    res.clearCookie(CONFIG.session.name, CONFIG.session.cookie);
}

/**
 * Serialize user into an object and save on session
 * Requires: session middleware
 *
 * @param {Object} data These are the data that gets saved in session
 *
 * @returns {Object}
 */
const serializeUser = (req, data) => {
    lodash.set(req.session, `authMan.userSessionData`, data);
    return data;
};


module.exports = {
    // Do not allow unauthorized users to access the page
    // Adds res.user
    getUser: async (req, res, next) => {
        try {
            let user = await deserializeUserAsync(req);

            if (!user) {
                return res.redirect('/login')
            }
            res.user = user;

            next();
        } catch (err) {
            next(err);
        }
    },
    deserializeUserAsync: deserializeUserAsync,
    getRedirect: getRedirect,
    logout: logout,
    serializeUser: serializeUser,
}