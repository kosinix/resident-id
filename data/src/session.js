//// Core modules

//// External modules
const session = require('express-session'); // Session engine
const SQLiteStore = require('connect-sqlite3')(session); // Save session to sqlite db

let config = CONFIG;
let cred = CRED;

// Use the session middleware
// See options in https://github.com/expressjs/session
module.exports = session({
    name: config.session.name,
    store: new SQLiteStore({
        db: config.session.store.db,
        dir: config.session.store.dir
    }),
    secret: cred.session.secret,
    cookie: config.session.cookie,
    resave: false,
    saveUninitialized: false
});