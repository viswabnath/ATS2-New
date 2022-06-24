const response = require('../utils/Response');
const log = require('../utils/bunyanLogger');
const Module = require("../models/module");
const Permission = require('../models/permissions')

class ModuleController {

    async addModule(req, res, next) {
        try {
            let module = await Module.create(req.body);
            module = module.toObject()
            delete module._id
            delete module.__v

            // const permissions = ["READ", "WRITE", "DELETE"]

            // permissions.map(async (permission) => {
            //     await Permission.create({ moduleType: req.body.moduleName, permission });

            // })

            response.successReponse({ status: 200, result: { module }, res })
        } catch (error) {
            response.errorResponse({ status: 400, result: error.message, res, errors: error.stack })
        }

    }
    async viewModules(req, res, next) {
        try {
            const module = await Module.find({}, ' -__v');
            response.successReponse({ status: 200, result: module, res })
        } catch (error) {
            response.errorResponse({ status: 400, result: error.message, res, errors: error.stack })
        }

    }
}

const moduleController = new ModuleController();
module.exports = moduleController

