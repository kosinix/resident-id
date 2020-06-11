//// Core modules

//// External modules
const lodash = require('lodash');
const moment = require('moment');

//// Modules
const regions = include('data/src/listRegions');
const provinces = include('data/src/listProvinces');
const cityMuns = include('data/src/listCities');
const db = include('data/src/db');

/**
 * Get city municipal code from city municipal name and region code
 * 
 * If there are more than 1 match, returns blank. Ideally, do nothing and let the user handle the address change.
 * 
 * @param {String} citymunDesc 
 * @param {String} regDesc 
 * 
 * @returns {String} 6 characters municipal code
 */
let getCityMunCode = async (citymunDesc, regDesc) => {
    let cityMunCode = "";
    let founds = lodash.filter(cityMuns, (cityMun) => {
        return (lodash.trim(citymunDesc) === cityMun.citymunDesc) && (lodash.trim(regDesc) === cityMun.regDesc)
    });
    if(founds.length===1){ // Do only if there is one result, otherwise, dont do anything as it might be a different address
        cityMunCode = lodash.get(founds, '0.citymunCode', '')
    }
    return cityMunCode;
}

let migrateAddress = async (applicationId) => {
    let logs = [];
    // Find all applications
    let application = await db.web.Application.findOne({
        _id: applicationId
    }); 
    if(application){
        let cityMun = await getCityMunCode(application.borrower.residence.addressLine3, application.borrower.residence.addressLine5);

        // if (cityMun && !application.borrower.addressPermanent.cityMun) {
        //     // Use raw access to avoid updating updatedAt
        //     await application.db.collection('applicationalls').updateOne({ _id: application._id }, {
        //         $set: {
        //             "borrower.addressPermanent": {
        //                 address: application.borrower.residence.address,
        //                 region: cityMun.slice(0, 2),
        //                 province: cityMun.slice(0, 4),
        //                 cityMun: cityMun,
        //                 brgyDistrict: application.borrower.residence.addressLine2,
        //                 unit: application.borrower.residence.addressLine1,
        //                 status: application.borrower.residence.status,
        //                 years: application.borrower.residence.years,
        //             }
        //         }
        //     })
        //     logs.push('Migrated application residence address to permanent address.')
        // }
        if (cityMun && !application.borrower.addressPresent.cityMun) {
            // Use raw access to avoid updating updatedAt
            await application.db.collection('applicationalls').updateOne({ _id: application._id }, {
                $set: {
                    "borrower.addressPresent": {
                        address: application.borrower.residence.address,
                        region: cityMun.slice(0, 2),
                        province: cityMun.slice(0, 4),
                        cityMun: cityMun,
                        brgyDistrict: application.borrower.residence.addressLine2,
                        unit: application.borrower.residence.addressLine1,
                        status: application.borrower.residence.status,
                        years: application.borrower.residence.years,
                    }
                }
            })
            logs.push('Migrated application residence address to present address.')

        }

        let borrower = await db.web.Borrower.findOne({
            _id: application.user
        }); 
        // if (borrower && cityMun && !borrower.addressPermanent.cityMun) {
        //     // Use raw access to avoid updating updatedAt
        //     await borrower.db.collection('users').updateOne({ _id: borrower._id }, {
        //         $set: {
        //             addressPermanent: {
        //                 address: borrower.residence.address,
        //                 region: cityMun.slice(0, 2),
        //                 province: cityMun.slice(0, 4),
        //                 cityMun: cityMun,
        //                 brgyDistrict: borrower.residence.addressLine2,
        //                 unit: borrower.residence.addressLine1,
        //                 status: borrower.residence.status,
        //                 years: borrower.residence.years,
        //             }
        //         }
        //     })
        //     logs.push('Migrated borrower residence address to permanent address.')
        // }

        if (borrower && cityMun && !borrower.addressPresent.cityMun) {
            // Use raw access to avoid updating updatedAt
            await borrower.db.collection('users').updateOne({ _id: borrower._id }, {
                $set: {
                    addressPresent: {
                        address: borrower.residence.address,
                        region: cityMun.slice(0, 2),
                        province: cityMun.slice(0, 4),
                        cityMun: cityMun,
                        brgyDistrict: borrower.residence.addressLine2,
                        unit: borrower.residence.addressLine1,
                        status: borrower.residence.status,
                        years: borrower.residence.years,
                    }
                }
            })
            logs.push('Migrated borrower residence address to present address.')

        }

        // Ignore present
        /*
        if (cityMun && !application.borrower.addressPresent.cityMun) {
            // Use raw access to avoid updating updatedAt
            await application.db.collection('applicationalls').updateOne({ _id: application._id }, {
                $set: {
                    "borrower.addressPresent": {
                        address: application.borrower.residence.address,
                        region: cityMun.slice(0, 2),
                        province: cityMun.slice(0, 4),
                        cityMun: cityMun,
                        brgyDistrict: application.borrower.residence.addressLine2,
                        unit: application.borrower.residence.addressLine1,
                        status: application.borrower.residence.status,
                        years: application.borrower.residence.years,
                    }
                }
            })
        }
        */


        if (!application.employment.addressCityMun) {
            
            let cityMun = await getCityMunCode(application.employment.addressLine3, application.employment.addressLine5);

            if(cityMun){
                // Use raw access to avoid updating updatedAt
                await application.db.collection('applicationalls').updateOne({ _id: application._id }, {
                    $set: {
                        "employment.addressRegion": cityMun.slice(0, 2),
                        "employment.addressProvince": cityMun.slice(0, 4),
                        "employment.addressCityMun": cityMun,
                        "employment.addressBrgyDistrict": application.employment.addressLine2,
                        "employment.addressUnit": application.employment.addressLine1,
                    }
                })
                logs.push('Migrated employment address.')

            }
        }

        if (!application.business.addressCityMun) {
            
            let cityMun = await getCityMunCode(application.business.addressLine3, application.business.addressLine5);

            if(cityMun){
                // Use raw access to avoid updating updatedAt
                await application.db.collection('applicationalls').updateOne({ _id: application._id }, {
                    $set: {
                        "business.addressRegion": cityMun.slice(0, 2),
                        "business.addressProvince": cityMun.slice(0, 4),
                        "business.addressCityMun": cityMun,
                        "business.addressBrgyDistrict": application.business.addressLine2,
                        "business.addressUnit": application.business.addressLine1,
                    }
                })
                logs.push('Migrated business address.')

            }
        }
    }
    return logs
    //////
}
module.exports = {
    migrateAddress: migrateAddress
}