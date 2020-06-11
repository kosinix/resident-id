//// Core modules

//// External modules
const mongoose = require('mongoose');

//// Code
let opts2 = CONFIG.mongodb.connections.main.options
opts2.promiseLibrary = Promise // Do this here since we cant assign a Promise object in config.json

let cred2 = CRED.mongodb.connections.main
let conf2 = CONFIG.mongodb.connections.main
let main = mongoose.createConnection(`mongodb://${cred2.username}:${cred2.password}@${conf2.host}/${conf2.db}`, opts2);

main.on('connected', () => {
    console.log('Database connected to', conf2.host + '/' + conf2.db);
});
main.catch((err) => {
    console.log('Connection error:', err.message);
});
main.on('disconnected', () => {
    console.log('Database disconnected from', conf2.host + '/' + conf2.db);
});

main.Resident = main.model('Resident', require('./models/resident'));
main.User = main.model('User', require('./models/user'));


module.exports = {
    mongoose: mongoose,
    main: main,
}