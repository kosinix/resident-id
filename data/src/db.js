//// Core modules

//// External modules
const mongoose = require('mongoose');

//// Code
let cred = CRED.mongodb.connections.main
let conf = CONFIG.mongodb.connections.main
let opts = conf.options
opts.promiseLibrary = Promise // Use ES6 Promise

let main = mongoose.createConnection(`mongodb://${cred.username}:${cred.password}@${conf.host}/${conf.db}`, opts);

main.on('connected', () => {
    console.log('Database connected to', conf.host + '/' + conf.db);
});
main.catch((err) => {
    console.log('Connection error:', err.message);
});
main.on('disconnected', () => {
    console.log('Database disconnected from', conf.host + '/' + conf.db);
});

main.Person = main.model('Person', require('./models/person'), 'people');
main.Resident = main.model('Resident', require('./models/resident'));
main.User = main.model('User', require('./models/user'));


module.exports = {
    mongoose: mongoose,
    main: main,
}