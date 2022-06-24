const express= require('express');
const permission = require('../controller/permission');
const { authorize,protect }= require('../middleware/user')
const permissionRouter= express.Router();

permissionRouter.get("/listPermission",protect,authorize({permissionType:"READ",moduleName:"Permissions"}),permission.ListPermissions)
permissionRouter.post("/createPermission",permission.createPermission)
permissionRouter.put("/addModuleToPermission",protect,authorize({permissionType:"WRITE",moduleName:"Permissions"}),permission.addModulesToPermission)
permissionRouter.put("/removeModuleFromPermission",protect,authorize({permissionType:"WRITE",moduleName:"Permissions"}),permission.removeModulesFromPermission)
permissionRouter.delete("/deletePermission",protect,authorize({permissionType:"DELETE",moduleName:"Permissions"}),permission.deletePermission)

module.exports= permissionRouter;


// protect,authorize({permissionType:"WRITE",moduleName:"Permissions"}),