const Permission= require('../models/permissions');
const response = require('../utils/Response');
const log = require('../utils/bunyanLogger');
const Modules= require('../models/module')
const Roles= require('../models/role')
const {convertToObjectID}= require('../utils/misc')

async function checkModuleExistance(val){
  
    const result=[]
    await Promise.all(val.map( async item=>{
           const tempId=convertToObjectID(item)
         const module=await Modules.findById(item);
         if(!module){
             result.push(false);
         }else{
             result.push(true)
         }
    }));
    if(result.includes(false)){
        return false
    }
      return true

}

class PermissionController{

    async ListPermissions(req,res,next){
        try {
           let permissions;

           if(req.query.permission){
            permissions=await Permission.find({permissionName:req.query.permission}).populate('moduleTypes',' -__v').select('-id -__v');
           }else{

               permissions=await Permission.find().populate('moduleTypes',' -__v').select('-id -__v');
           }
            response.successReponse({ status: 200, result: { permissions }, res })
        } catch (error) {
            response.errorResponse({ status: 400, result: error.message, res, errors: error.stack })
        }
    }
    async createPermission(req,res,next){
        try {
            const permissionExists= await Permission.findOne({permissionName:req.body.permissionName});
            const role= await Roles.findOne({roleName:'Admin'});
            if(permissionExists){
                throw new Error('Permission already exists')
            }
            let moduleNames=req.body.modules;
            let finalModules=[]
            moduleNames= [...new Set(moduleNames)];
            const modulesExist=await checkModuleExistance(moduleNames);
              if(!modulesExist){
                  throw new Error("All the modules specfied do not exist. Please review")
              }
            const newPermission= await Permission.create({
                permissionName:req.body.permissionName,
                permissionType:req.body.permissionType,
                 moduleTypes:moduleNames});
   await Roles.findOneAndUpdate({"_id":role._id},{$addToSet:{permissions:newPermission._id}});
           
             response.successReponse({ status: 200, result: newPermission, res })
        } catch (error) {
            response.errorResponse({ status: 400, result: error.message, res, errors: error.stack })
        }
    }
    async addModulesToPermission(req,res,next){
       try {
        const permission= convertToObjectID(req.body.permission)
        const permissionExists= await Permission.findById(permission);
        if(!permissionExists){
            throw new Error('Permission does not exist')
        }
          const moduleexists= await checkModuleExistance([req.body.module]);
            if(!moduleexists){
                throw  new Error('Specified Module does not exist')
            }
           const updatedPermission= await Permission.findByIdAndUpdate(permission,{
               $addToSet:{
                   moduleTypes:req.body.module                
                   
               }
           },{new:true,runValidators:true});
           response.successReponse({ status: 200, result: updatedPermission, res })
       } catch (error) {
        response.errorResponse({ status: 400, result: error.message, res, errors: error.stack })
       }
    }
    async removeModulesFromPermission(req,res,next){
        try {
            const permission= convertToObjectID(req.body.permission)
            const permissionExists= await Permission.findById(permission);
            if(!permissionExists){
                throw new Error('Permission does not exist')
            }
              const moduleexists= await checkModuleExistance([req.body.module]);
                if(!moduleexists){
                    throw  new Error('Specified Module does not exist')
                }
               const updatedPermission= await Permission.findByIdAndUpdate(permission,{
                   $pull:{
                       moduleTypes:req.body.module               
                       
                   }
               },{new:true,runValidators:true});
               response.successReponse({ status: 200, result: updatedPermission, res })
           } catch (error) {
            response.errorResponse({ status: 400, result: error.message, res, errors: error.stack })
           }
    }
    async deletePermission(req,res,next){
        try {
            const permission= convertToObjectID(req.body.permission)
            const permissionExists= await Permission.findById(permission);
            if(!permissionExists){
                throw new Error("Permission Not Found")
            }

            const roles= await Roles.find({permissions:{
                $in:[permission]
            }});
           if(roles.length>0){
               throw new Error("Cannot delete Permission as it is used in one or more roles")
           }
           await Permission.deleteOne({_id:permissionExists._id});

            response.successReponse({ status: 200, result: 'deleted Permission', res })
        } catch (error) {
            response.errorResponse({ status: 400, result: error.message, res, errors: error.stack })
        }
    }
}

const permission= new PermissionController();
module.exports= permission;