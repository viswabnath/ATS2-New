const express= require('express');
const skillRouter= express.Router();
const skillController= require('../controller/skill');

skillRouter.post('/createskill',skillController.addSkill);
skillRouter.get('/getskills',skillController.viewSkills)


module.exports= skillRouter;