//// Core modules

//// External modules
const AWS = require('aws-sdk');

//// Modules


let s3 = new AWS.S3({
    region: CONFIG.aws.region,
    accessKeyId: CRED.aws.accessKeyId,
    secretAccessKey: CRED.aws.secretAccessKey,
});

module.exports = s3