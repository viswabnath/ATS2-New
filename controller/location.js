const response = require('../utils/Response');
const log = require('../utils/bunyanLogger');
const Location = require("../models/location");
const Permission = require('../models/permissions')

class LocationController {

    async addLocation(req, res, next) {
        try {
            let location = await Location.create(req.body);
            // module = module.toObject()
            // delete module._id
            // delete module.__v

            // const permissions = ["READ", "WRITE", "DELETE"]

            // permissions.map(async (permission) => {
            //     await Permission.create({ moduleType: req.body.moduleName, permission });

            // })

            response.successReponse({ status: 200, result: { location }, res })
        } catch (error) {
            response.errorResponse({ status: 400, result: error.message, res, errors: error.stack })
        }

    }
    async viewLocations(req, res, next) {
        try {
            const location = await Location.find();
            response.successReponse({ status: 200, result: location, res })
        } catch (error) {
            response.errorResponse({ status: 400, result: error.message, res, errors: error.stack })
        }

    }
}

const locationController = new LocationController();
module.exports = locationController