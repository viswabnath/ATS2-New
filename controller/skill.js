const response = require('../utils/Response');
const log = require('../utils/bunyanLogger');
const Skill = require("../models/skill");
const Permission = require('../models/permissions')

class SkillController {

    async addSkill(req, res, next) {
        try {
            let skill = await Skill.create(req.body);
            // module = module.toObject()
            // delete module._id
            // delete module.__v

            // const permissions = ["READ", "WRITE", "DELETE"]

            // permissions.map(async (permission) => {
            //     await Permission.create({ moduleType: req.body.moduleName, permission });

            // })

            response.successReponse({ status: 200, result: { skill }, res })
        } catch (error) {
            response.errorResponse({ status: 400, result: error.message, res, errors: error.stack })
        }

    }
    async viewSkills(req, res, next) {
        try {
            const skill = await Skill.find();
            response.successReponse({ status: 200, result: skill, res })
        } catch (error) {
            response.errorResponse({ status: 400, result: error.message, res, errors: error.stack })
        }

    }
}

const skillController = new SkillController();
module.exports = skillController