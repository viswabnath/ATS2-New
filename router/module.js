const express= require('express');
const moduleRouter= express.Router();
const {protect,authorize}= require("../middleware/user");
const  moduleController= require("../controller/module")

moduleRouter.post("/addModule",protect,authorize({permissionType:"WRITE",moduleName:"Module"}),moduleController.addModule);
moduleRouter.get("/viewModules",protect,authorize({permissionType:"READ",moduleName:"Module"}),moduleController.viewModules);


module.exports= moduleRouter;