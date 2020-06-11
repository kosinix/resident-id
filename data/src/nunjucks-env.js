//// Core modules
const querystring = require('querystring');

//// External modules
const nunjucks = require('nunjucks');
const lodash = require('lodash');
const moment = require('moment');
const htmlEnDec = require('he');

//// Modules


let dirView = CONFIG.app.dirs.view; // Path to view directory

//// Setup view
// Setup nunjucks loader. See https://mozilla.github.io/nunjucks/api.html#loader
let loaderFsNunjucks = new nunjucks.FileSystemLoader(dirView, CONFIG.nunjucks.loader);

// Setup nunjucks environment. See https://mozilla.github.io/nunjucks/api.html#environment
let env = new nunjucks.Environment(loaderFsNunjucks, CONFIG.nunjucks.environment);

// Get type
env.addFilter('typeOf', (value) => {
    return typeof value;
});

// From now
env.addFilter('fromNow', (date) => {
    return moment(date).fromNow();
});

env.addFilter('htmlDecode', (value) => {
    return htmlEnDec.decode(value)
});


// Custom filters
// Usage {{ value | currency }}
// Custom sep {{ value | currency(' ') }}
env.addFilter('currency', (value, sep = ',', decPlace = 2) => {
    value = lodash.toNumber(value).toFixed(decPlace);
    let split = lodash.split(value, '.');
    let whole = lodash.toArray(lodash.get(split, '[0]', []));
    let cent = lodash.toString(lodash.get(split, '[1]', ''));

    let out = [];
    let length = whole.length;
    for (c = 0; c < length; c++) {
        let rev = length - c;
        if (rev % 3 === 0) {
            out.push(sep);
            out.push(whole[c]);
        } else {
            out.push(whole[c]);
        }
    }
    let merged = lodash.join(out, ''); // Join arrays
    merged = lodash.trimStart(merged, sep); // Remove left-most sep
    if (cent) { // If there is a cent, append
        merged += '.' + cent;
    }
    return merged;
});
env.addFilter('stringify', function (value) {
    return JSON.stringify(value);
});
env.addFilter('formatDate', function (value, format, timeZone = '+0800') {
    let formatted = moment(value).utcOffset(timeZone).format(format);
    if (formatted === "Invalid date") {
        return null;
    }
    return formatted;
});
env.addFilter('fromNow', function (value) {
    return moment(value).fromNow(true);
})
env.addFilter('age', function (value) {
    return moment().diff(value, 'years')
})
env.addFilter('slug', function (value) {
    return lodash.toLower(value).replace(' ', '-');
})
env.addFilter('s3Url', function (value, sizePrefix = "") {
    if (sizePrefix) {
        sizePrefix += "-";
    }
    return CONFIG.aws.s3Url + sizePrefix + value;
})
env.addFilter('phone', (mobileNo, countryCode = "63") => {
    mobileNo = lodash.toString(mobileNo);
    mobileNo = mobileNo.replace(/[^0-9.]/g, ''); // Remove non-numeric chars
    if (mobileNo.length > 10) {
        mobileNo = countryCode + mobileNo.substr(-10); // Trim to 10 chars and prepend countryCode: (eg. "63")
    } else if (mobileNo.length === 10) {
        mobileNo = countryCode + mobileNo;
    }
    return mobileNo;
});
env.addFilter('phoneReadable', (mobileNo, countryCode = "63") => {
    mobileNo = lodash.toString(mobileNo);
    mobileNo = mobileNo.replace(/[^0-9.]/g, ''); // Remove non-numeric chars
    if (mobileNo.length > 10) {
        mobileNo = countryCode + mobileNo.substr(-10); // Trim to 10 chars and prepend countryCode: (eg. "63")
    } else if (mobileNo.length === 10) {
        mobileNo = countryCode + mobileNo;
    }
    mobileNo = lodash.toArray(mobileNo);
    mobileNo.splice(2, 0, ' ');
    mobileNo.splice(6, 0, ' ');
    mobileNo.splice(10, 0, ' ');
    return lodash.join(mobileNo, '');
});

env.addFilter('landline', (mobileNo) => {
    mobileNo = lodash.toString(mobileNo);
    mobileNo = mobileNo.replace(/[^0-9.]/g, ''); // Remove non-numeric chars

    return mobileNo.substr(0, 3) + ' ' + mobileNo.substr(-7);
});


env.addFilter('replace', (str, replacee, replacer) => {
    if (str) {
        str = str.toString(str);
        return str.replace(replacee, replacer)
    }
    return str;
});

/**
 * Safer capitalize
 */
env.addFilter('capitalize', (str) => {
    return lodash.capitalize(str);
});

/**
 * Safer first
 */
env.addFilter('first', (str) => {
    return lodash.toString(str)[0];
});

env.addFilter('queryString', (defs, params) => {
    let merged = { ...defs, ...params }
    return querystring.stringify(merged);
});

//// Export
module.exports = env;