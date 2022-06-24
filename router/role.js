const express= require('express');
const roleController= require('../controller/role')
const { authorize,protect }= require('../middleware/user')
const adminRouter=require('./admin')
const roleRouter= express.Router();
roleRouter.use('/assignRole/:roleid/user/:userid',protect,authorize({permissionType:"WRITE",moduleName:"Roles"}),adminRouter)
roleRouter.post('/createRole',protect,authorize({permissionType:"WRITE",moduleName:"Roles"}),roleController.createRole)
roleRouter.get("/listRoles",protect,authorize({permissionType:"READ",moduleName:"Roles"}),roleController.ListRole)
roleRouter.get("/listRolesOnly",protect,authorize({permissionType:"READ",moduleName:"Roles"}),roleController.ListOnlyRoles)
roleRouter.put("/editRolePermission",protect,authorize({permissionType:"WRITE",moduleName:"Roles"}),roleController.editRolePermissions)


module.exports= roleRouter;