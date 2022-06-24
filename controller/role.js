const response = require('../utils/Response');
const log = require('../utils/bunyanLogger');
const Roles = require('../models/role');
const Permission = require('../models/permissions')
const { convertToObjectID } = require('../utils/misc')

class Role {
    constructor() { }

    async createRole(req, res, next) {
        try {
            const rolePresent = await Roles.findOne({ roleName: req.body.roleName });
            if (rolePresent) {
                throw new Error("Role with this title already exists")
            }
            const PermissionExists = []
            //remove duplicates
            const permissions = [...new Set(req.body.permissions)];
            await Promise.race(permissions.map(async permission => {
                const permissionExists = await Permission.findById(permission);
                if (!permissionExists) {
                    PermissionExists.push(false);
                }
            }));
            if (PermissionExists.includes(false)) {
                throw new Error("One or more Permissions do not exist or have been deleted ");
            }
            let createdRole;
            if(req.body.role){

                createdRole = await Roles.create({ roleName: req.body.roleName, permissions,reportsTo:convertToObjectID(req.body.role) })
            }else{
                createdRole = await Roles.create({ roleName: req.body.roleName, permissions })
            }

            response.successReponse({ status: 201, result: createdRole, res })
        } catch (error) {
            response.errorResponse({
                status: 400,
                result: error.message,
                res, errors: error.stack
            })
        }

    }
    async ListRole(req, res, next) {
        try {
            let roles;
            if (req.query.role) {
                roles = await Roles.find({ roleName: req.query.role })
               
                .populate({
                    path: 'permissions',
                    populate: {
                        path: 'moduleTypes',
                        model: 'Module',
                        select: ' -__v'
                    },
                    select:' -__v'
                   
                }) 
                .select('-__v')                  
            } else {
                roles = await Roles.find()
               
                .populate({
                    path: 'permissions',
                    populate: {
                        path: 'moduleTypes',
                        model: 'Module',
                        select: '-_id -__v'
                    },
                    select:' -__v'
                })  
                .select('-__v')     


                   
            }


            response.successReponse({ status: 201, result: roles, res })

        } catch (error) {
            response.errorResponse({
                status: 400,
                result: error.message,
                res, errors: error.stack
            })
        }
    }
    async ListOnlyRoles(req,res,next){
        try {
            const roles= await Roles.find().select("-__v -permissions").populate('reportsTo','roleName -_id')
            response.successReponse({ status: 201, result: roles, res })
        } catch (error) {
            error.statusCode=400;
            next(error)
        }
    }
    async editRolePermissions(req, res, next) {
        try {
            let message = "Role Permission edited"
            const permissionId = req.body.permission!==undefined?convertToObjectID(req.body.permission):undefined;
            const flag = req.body.flag;
            const roleID = convertToObjectID(req.body.role);
            const reportsTo= req.body.reportsTo!==undefined?convertToObjectID(req.body.reportsTo):undefined;
              
            //flag ==false  remove permissions
            if (!flag) {
                
                if(!reportsTo&&permissionId){

                    await Roles.findByIdAndUpdate(roleID, {
                        $pull: {
                            permissions: permissionId
                        }
                    });
                }else if(reportsTo && permissionId){
                    await Roles.findByIdAndUpdate(roleID, {
                        $pull: {
                            permissions: permissionId
                        },
                        reportsTo
                    });
                }else if(reportsTo && !permissionId){
                    await Roles.findByIdAndUpdate(roleID, {
                  
                        reportsTo
                    });
                }else{
                    throw new Error("Role or Permission not found")
                }
                
               


            }  // flag == true add permission
            else {
                    if(!reportsTo && permissionId){

                        await Roles.findByIdAndUpdate(roleID, {
                            $addToSet: {
                                permissions: permissionId
                            }
                        })
                    }else if (reportsTo && permissionId){
                        
                        await Roles.findByIdAndUpdate(roleID, {
                            $addToSet: {
                                permissions: permissionId
                            },
                            reportsTo
                        })
                    }else if(reportsTo && !permissionId){
                        await Roles.findByIdAndUpdate(roleID, {
                      
                            reportsTo
                        });
                    }else{
                        throw new Error("Role or Permission not found")
                    }
               
            }
            response.successReponse({ status: 200, result: message, res })
        } catch (error) {
            response.errorResponse({
                status: 400,
                result: error.message,
                res, errors: error.stack
            })
        }
    }
    async deleteRole(req, res, next) {

    }
}


const roleInstance = new Role();
module.exports = roleInstance;